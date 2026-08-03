export const IT230_ACCENT_NAMES = [
    "blue",
    "teal",
    "green",
    "yellow",
    "orange",
    "red",
    "pink",
    "purple",
    "slate",
] as const;

export type It230AccentName = (typeof IT230_ACCENT_NAMES)[number];

export type It230Accent = Readonly<{
    fill: string;
    name: It230AccentName;
    text: string;
    wash: string;
}>;

const accentNames = new Set<string>(IT230_ACCENT_NAMES);

/**
 * Adwaita 1.6 accent backgrounds and light standalone colors.
 *
 * The yellow fill is darkened enough to clear 3:1 across the canvas gradient.
 * Teal and green text use the smallest practical sRGB darkening needed to
 * retain the theme's 5.68:1 normal-text floor on its near-white canvas.
 */
export const IT230_ACCENTS: Readonly<Record<It230AccentName, It230Accent>> =
    Object.freeze({
        blue: createAccent("blue", "#3584E4", "#0461BE"),
        teal: createAccent("teal", "#2190A4", "#006E80"),
        green: createAccent("green", "#3A944A", "#15732D"),
        yellow: createAccent("yellow", "#BD8000", "#905300"),
        orange: createAccent("orange", "#ED5B00", "#B62200"),
        red: createAccent("red", "#E62D42", "#C00023"),
        pink: createAccent("pink", "#D56199", "#A2326C"),
        purple: createAccent("purple", "#9141AC", "#8939A4"),
        slate: createAccent("slate", "#6F8396", "#526678"),
    });

function createAccent(
    name: It230AccentName,
    fill: string,
    text: string,
): It230Accent {
    const [red, green, blue] = [1, 3, 5].map((index) =>
        Number.parseInt(fill.slice(index, index + 2), 16),
    );

    return Object.freeze({
        fill,
        name,
        text,
        wash: `rgb(${red} ${green} ${blue} / 14%)`,
    });
}

export function resolveIt230Accent(value?: unknown): It230Accent {
    if (value === undefined) return IT230_ACCENTS.blue;

    if (typeof value !== "string" || !accentNames.has(value)) {
        throw new TypeError(
            `Invalid themeConfig.it230Accent ${JSON.stringify(value)}. ` +
                `Choose one of: ${IT230_ACCENT_NAMES.join(", ")}.`,
        );
    }

    return IT230_ACCENTS[value as It230AccentName];
}

export function accentCssVariables(
    accent: It230Accent,
): Readonly<Record<string, string>> {
    return Object.freeze({
        "--it230-color-accent-fill": accent.fill,
        "--it230-color-accent-text": accent.text,
        "--it230-color-accent-wash": accent.wash,
    });
}
