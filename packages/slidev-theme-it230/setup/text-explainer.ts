/**
 * Resolution logic for the TextExplainer component.
 *
 * Kept free of Vue so the matching, overlap, and sizing rules can be tested
 * directly. The component renders whatever these functions return.
 */

export interface TextExplainerStep {
    /** Literal substring to mark. Omit to mark a whole line. */
    text?: string;
    /**
     * Restrict the search to one line, counting from 1, and required for a
     * whole-line step.
     */
    line?: number;
    /** One-based selector when the literal appears more than once in scope. */
    occurrence?: number;
    explanation: string;
}

export interface TextExplainerSegment {
    text: string;
    /** True for the range this step explains. */
    active?: boolean;
    /** True for every range any step explains, so candidates stay visible. */
    highlightable?: boolean;
}

export interface TextExplainerLine {
    segments: TextExplainerSegment[];
}

export interface TextExplainerState {
    explanation: string;
    lines: TextExplainerLine[];
}

export type TextExplainerSize = "lg" | "md" | "sm";

interface Range {
    line: number;
    start: number;
    end: number;
}

const TAB_SIZE = 8;

/** Width of one line as rendered, counting a tab as its advance to the next stop. */
export function renderedWidth(line: string, tabSize = TAB_SIZE): number {
    let width = 0;
    for (const character of line) {
        if (character === "\t") width += tabSize - (width % tabSize);
        else width += 1;
    }
    return width;
}

/**
 * Choose a size from the content alone, so the same input always renders at the
 * same scale in the browser, in CI, and in the exported PDF. Content that will
 * not fit at `sm` overflows and is reported by `pnpm run check:slides`, rather
 * than shrinking below classroom legibility.
 */
export function selectSize(lines: string[]): TextExplainerSize {
    const longest = lines.reduce(
        (widest, line) => Math.max(widest, renderedWidth(line)),
        0,
    );

    if (lines.length === 1 && longest <= 44) return "lg";
    if (lines.length <= 4 && longest <= 64) return "md";
    return "sm";
}

function assertExplanation(step: TextExplainerStep, index: number): string {
    if (step.explanation?.length) return step.explanation;
    throw new Error(`TextExplainer step ${index + 1} needs an explanation.`);
}

/** Steps count lines from 1, matching `occurrence` and every line number a
 * reader sees in an editor or a terminal. */
function assertLineNumber(line: number, lines: string[], index: number): void {
    if (!Number.isInteger(line) || line < 1 || line > lines.length)
        throw new Error(
            `TextExplainer step ${index + 1} line must be between 1 and ${lines.length}.`,
        );
}

function resolveStep(
    step: TextExplainerStep,
    index: number,
    lines: string[],
): Range {
    if (step.line !== undefined) assertLineNumber(step.line, lines, index);
    const scoped = step.line === undefined ? undefined : step.line - 1;

    if (step.text === undefined) {
        if (scoped === undefined)
            throw new Error(
                `TextExplainer step ${index + 1} needs text, or a line to mark whole.`,
            );
        if (step.occurrence !== undefined)
            throw new Error(
                `TextExplainer step ${index + 1} cannot use occurrence without text.`,
            );
        return { end: lines[scoped].length, line: scoped, start: 0 };
    }

    if (step.text.length === 0)
        throw new Error(`TextExplainer step ${index + 1} needs text.`);

    const searchable =
        scoped === undefined ? lines.map((_, line) => line) : [scoped];

    const matches: Range[] = [];
    for (const line of searchable) {
        let searchFrom = 0;
        while (searchFrom <= lines[line].length - step.text.length) {
            const start = lines[line].indexOf(step.text, searchFrom);
            if (start === -1) break;
            matches.push({ end: start + step.text.length, line, start });
            searchFrom = start + step.text.length;
        }
    }

    const where = step.line === undefined ? "the text" : `line ${step.line}`;

    if (matches.length === 0)
        throw new Error(
            `TextExplainer step ${index + 1} cannot find ${JSON.stringify(step.text)} in ${where}.`,
        );

    if (step.occurrence === undefined) {
        if (matches.length !== 1)
            throw new Error(
                `TextExplainer step ${index + 1} finds ${JSON.stringify(step.text)} ${matches.length} times in ${where}; set occurrence to select one.`,
            );
        return matches[0];
    }

    if (
        !Number.isInteger(step.occurrence) ||
        step.occurrence < 1 ||
        step.occurrence > matches.length
    )
        throw new Error(
            `TextExplainer step ${index + 1} occurrence must be between 1 and ${matches.length}.`,
        );

    return matches[step.occurrence - 1];
}

function collectRanges(resolved: Range[]): Map<number, Range[]> {
    const byLine = new Map<number, Range[]>();

    for (const range of resolved) {
        const ranges = byLine.get(range.line) ?? [];
        if (
            !ranges.some(
                (existing) =>
                    existing.start === range.start &&
                    existing.end === range.end,
            )
        )
            ranges.push(range);
        byLine.set(range.line, ranges);
    }

    for (const [line, ranges] of byLine) {
        ranges.sort((a, b) => a.start - b.start);
        const overlap = ranges.some(
            (range, index) => index > 0 && range.start < ranges[index - 1].end,
        );
        if (overlap)
            throw new Error(
                `TextExplainer ranges on line ${line} cannot overlap.`,
            );
    }

    return byLine;
}

function splitLine(
    line: string,
    ranges: Range[],
    active: Range | undefined,
): TextExplainerSegment[] {
    const segments: TextExplainerSegment[] = [];
    let cursor = 0;

    for (const range of ranges) {
        if (cursor < range.start)
            segments.push({ text: line.slice(cursor, range.start) });
        segments.push({
            active:
                active !== undefined &&
                active.line === range.line &&
                active.start === range.start &&
                active.end === range.end,
            highlightable: true,
            text: line.slice(range.start, range.end),
        });
        cursor = range.end;
    }

    if (cursor < line.length) segments.push({ text: line.slice(cursor) });
    if (segments.length === 0) segments.push({ text: "" });

    return segments;
}

/** Build one rendered state per step, in click order. */
export function buildStates(
    lines: string[],
    steps: TextExplainerStep[],
): TextExplainerState[] {
    if (!lines?.length) throw new Error("TextExplainer needs lines.");
    if (!steps?.length) throw new Error("TextExplainer needs steps.");

    const explanations = steps.map(assertExplanation);
    const resolved = steps.map((step, index) =>
        resolveStep(step, index, lines),
    );
    const rangesByLine = collectRanges(resolved);

    return resolved.map((active, index) => ({
        explanation: explanations[index],
        lines: lines.map((line, lineIndex) => ({
            segments: splitLine(
                line,
                rangesByLine.get(lineIndex) ?? [],
                active.line === lineIndex ? active : undefined,
            ),
        })),
    }));
}
