const accentVariableNames = [
    "--it230-color-accent-fill",
    "--it230-color-accent-text",
    "--it230-color-accent-wash",
];

export function renderExerciseResource(source, accentCssVariables) {
    validateExerciseResourceSource(source);

    const declarations = accentVariableNames.map((name) => {
        const value = accentCssVariables?.[name];
        if (typeof value !== "string" || value.length === 0)
            throw new TypeError(`Exercise accent is missing ${name}.`);
        return `                ${name}: ${value};`;
    });
    const closingHead = source.match(/<\/head\s*>/i);

    const accentStyle = `        <style data-it230-week-accent>
            :root {
${declarations.join("\n")}
            }
        </style>
`;
    return `${source.slice(0, closingHead.index)}${accentStyle}${source.slice(closingHead.index)}`;
}

export function validateExerciseResourceSource(
    source,
    label = "Exercise HTML source",
) {
    if (typeof source !== "string")
        throw new TypeError(`${label} must be text.`);
    if (!/<\/head\s*>/i.test(source))
        throw new Error(`${label} must contain a closing head element.`);
    return source;
}
