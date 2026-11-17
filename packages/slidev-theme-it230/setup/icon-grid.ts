/**
 * Validation and icon lookup for the IconGrid and IconGridItem components.
 *
 * Kept free of Vue, and of the 1.1 MB icon set itself, so the lookup, the
 * column rule, and the authoring errors can be tested directly against a small
 * stand-in set. The components call these and render what they return.
 */

/** The part of an Iconify JSON icon set that IconGridItem reads. */
export interface IconSet {
    width?: number;
    height?: number;
    icons: Record<string, { body: string; width?: number; height?: number }>;
    aliases?: Record<string, { parent: string }>;
}

export interface ResolvedIcon {
    body: string;
    viewBox: string;
}

/** One element the grid's list rendered: an IconGridItem or something else. */
export interface GridChild {
    item: boolean;
}

export const ICON_GRID_MAX_ITEMS = 8;
export const ICON_GRID_MAX_COLUMNS = 4;
export const CARBON_BROWSER_URL = "https://icon-sets.iconify.design/carbon/";

const DEFAULT_ICON_SIZE = 32;
const MAX_ALIAS_HOPS = 8;

/**
 * Up to four items share one row. Five or six become rows of three, and seven
 * or eight rows of four, so no row is left with a single straggler beside a
 * full one. IconGrid applies this rule in CSS, since it cannot count its slot
 * content in script; a test keeps the two in step.
 */
export function defaultColumns(count: number): number {
    if (count <= ICON_GRID_MAX_COLUMNS) return count;
    return count <= 6 ? 3 : 4;
}

/** Look an icon up by name, following aliases. `null` when it does not exist. */
export function resolveIcon(set: IconSet, name: string): ResolvedIcon | null {
    let current = name;
    for (let hop = 0; hop <= MAX_ALIAS_HOPS; hop += 1) {
        const icon = set.icons[current];
        if (icon) {
            const width = icon.width ?? set.width ?? DEFAULT_ICON_SIZE;
            const height = icon.height ?? set.height ?? DEFAULT_ICON_SIZE;
            return { body: icon.body, viewBox: `0 0 ${width} ${height}` };
        }
        const alias = set.aliases?.[current];
        if (!alias) return null;
        current = alias.parent;
    }
    return null;
}

function unknownIcon(name: string): Error {
    if (name.includes(":")) {
        return new Error(
            `IconGridItem names "${name}". Use the bare Carbon name, without a prefix.`,
        );
    }
    return new Error(
        `IconGridItem names "${name}", which is not a Carbon icon. Browse names at ${CARBON_BROWSER_URL}`,
    );
}

/**
 * Resolve one IconGridItem's icon. The name is checked at once; `null` while
 * the icon set is still loading, after which the name is looked up.
 */
export function resolveItemIcon(
    name: unknown,
    set: IconSet | null,
): ResolvedIcon | null {
    if (typeof name !== "string" || !name.trim().length) {
        throw new Error("IconGridItem needs an icon.");
    }
    if (!set) return null;
    const icon = resolveIcon(set, name);
    if (!icon) throw unknownIcon(name);
    return icon;
}

/** Reject a `columns` value outside 1 to 4; `undefined` means automatic. */
export function checkColumns(columns: number | undefined): void {
    if (
        columns !== undefined &&
        (!Number.isInteger(columns) ||
            columns < 1 ||
            columns > ICON_GRID_MAX_COLUMNS)
    ) {
        throw new Error(
            `IconGrid columns must be a whole number from 1 to ${ICON_GRID_MAX_COLUMNS}.`,
        );
    }
}

/**
 * Check what the grid's list rendered: one to eight children, each an
 * IconGridItem. Text written straight inside IconGrid, rather than inside an
 * item, renders as a paragraph and fails here.
 */
export function checkGridChildren(children: GridChild[]): void {
    if (children.length === 0) {
        throw new Error("IconGrid needs at least one IconGridItem.");
    }
    const stray = children.findIndex((child) => !child.item);
    if (stray !== -1) {
        throw new Error(
            `IconGrid child ${stray + 1} is not an IconGridItem. Put each caption inside its own IconGridItem.`,
        );
    }
    if (children.length > ICON_GRID_MAX_ITEMS) {
        throw new Error(
            `IconGrid shows at most ${ICON_GRID_MAX_ITEMS} items, and this one has ${children.length}. Split the slide.`,
        );
    }
}
