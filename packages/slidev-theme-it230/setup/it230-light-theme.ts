const colors = {
    blue: "#1A5FB4",
    green: "#00753A",
    purple: "#613583",
    red: "#A51D2D",
    slate: "#5E5C64",
    teal: "#007184",
    text: "#25252B",
    violet: "#4E57BA",
};

export async function loadIt230LightTheme() {
    return {
        colors: {
            "editor.background": "#FFFFFF",
            "editor.foreground": colors.text,
            "editor.lineHighlightBackground": "#F6F5F4",
            "editor.selectionBackground": "#CDE7FF",
            focusBorder: "#3584E4",
        },
        displayName: "IT 230 Adwaita Light",
        name: "it230-light",
        tokenColors: [
            {
                scope: [
                    "comment",
                    "punctuation.definition.comment",
                    "string.comment",
                ],
                settings: { foreground: colors.slate },
            },
            {
                scope: [
                    "entity.name",
                    "meta.definition.variable",
                    "meta.export.default",
                    "variable",
                    "variable.other",
                ],
                settings: { foreground: colors.text },
            },
            {
                scope: [
                    "constant",
                    "constant.numeric",
                    "entity.name.constant",
                    "variable.language",
                    "variable.other.constant",
                    "variable.other.enummember",
                ],
                settings: { foreground: colors.violet },
            },
            {
                scope: ["entity.name.function", "support.function"],
                settings: { foreground: colors.blue },
            },
            {
                scope: [
                    "entity.name.tag",
                    "entity.name.type",
                    "support.class",
                    "support.class.component",
                    "support.type",
                ],
                settings: { foreground: colors.teal },
            },
            {
                scope: ["keyword", "storage", "storage.type"],
                settings: {
                    fontStyle: "bold",
                    foreground: colors.purple,
                },
            },
            {
                scope: ["string", "string punctuation.section.embedded source"],
                settings: { foreground: colors.teal },
            },
            {
                scope: "string variable",
                settings: { foreground: colors.blue },
            },
            {
                scope: [
                    "meta.module-reference",
                    "meta.property-name",
                    "support",
                    "support.constant",
                    "support.variable",
                ],
                settings: { foreground: colors.blue },
            },
            {
                scope: [
                    "invalid",
                    "message.error",
                    "punctuation.section.embedded",
                ],
                settings: { foreground: colors.red },
            },
            {
                scope: [
                    "constant.character.escape",
                    "string.regexp constant.character.escape",
                ],
                settings: { foreground: colors.red },
            },
            {
                scope: ["source.regexp", "string.regexp"],
                settings: { foreground: colors.teal },
            },
            {
                scope: ["markup.heading", "markup.heading entity.name"],
                settings: {
                    fontStyle: "bold",
                    foreground: colors.blue,
                },
            },
            {
                scope: "markup.quote",
                settings: { foreground: colors.teal },
            },
            {
                scope: "markup.inline.raw",
                settings: { foreground: colors.violet },
            },
            {
                scope: "markup.italic",
                settings: { fontStyle: "italic", foreground: colors.text },
            },
            {
                scope: "markup.bold",
                settings: { fontStyle: "bold", foreground: colors.text },
            },
            {
                scope: [
                    "markup.inserted",
                    "meta.diff.header.to-file",
                    "punctuation.definition.inserted",
                ],
                settings: { foreground: colors.green },
            },
            {
                scope: [
                    "markup.deleted",
                    "meta.diff.header.from-file",
                    "punctuation.definition.deleted",
                ],
                settings: { foreground: colors.red },
            },
            {
                scope: [
                    "meta.prompt.user.bash-session",
                    "meta.prompt.host.bash-session",
                    "meta.prompt.directory.bash-session",
                    "punctuation.separator.identity.bash-session",
                ],
                settings: { foreground: "#1C754B" },
            },
            {
                scope: [
                    "meta.prompt.user.privileged.bash-session",
                    "meta.prompt.host.privileged.bash-session",
                    "meta.prompt.directory.privileged.bash-session",
                    "punctuation.separator.identity.privileged.bash-session",
                ],
                settings: { foreground: "#C30000" },
            },
        ],
        type: "light" as const,
    };
}
