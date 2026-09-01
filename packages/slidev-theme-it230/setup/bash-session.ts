function createPromptPattern(symbol: "\\#" | "\\$", privileged = false) {
    const variant = privileged ? ".privileged" : "";

    return {
        begin: `^([^@:\\s]+)(@)([^:\\s]+)(:)([^#$\\r\\n]+)(${symbol})([ \\t]*)`,
        beginCaptures: {
            1: { name: `meta.prompt.user${variant}.bash-session` },
            2: {
                name: `punctuation.separator.identity${variant}.bash-session`,
            },
            3: { name: `meta.prompt.host${variant}.bash-session` },
            4: { name: "punctuation.separator.location.bash-session" },
            5: { name: `meta.prompt.directory${variant}.bash-session` },
            6: { name: "meta.prompt.symbol.bash-session" },
            7: { name: "meta.prompt.separator.bash-session" },
        },
        end: "$",
        name: "meta.command.bash-session",
        patterns: [{ include: "source.shell#typical_statements" }],
    };
}

/**
 * A step banner marks a boundary inside one transcript, so that a single
 * terminal can carry two or three related ideas without prose beside it.
 *
 * The `#^` marker is the one `kitty-demo.sh` already uses for a visible step
 * header, so an exercise command file and a slide transcript are marked the
 * same way. It stays a shell comment, so a copied transcript still runs.
 */
const stepBannerPattern = {
    begin: "^(#\\^)([ \\t]*)",
    beginCaptures: {
        1: { name: "punctuation.definition.banner.bash-session" },
        2: { name: "punctuation.definition.banner.bash-session" },
    },
    end: "$",
    name: "meta.banner.bash-session",
};

const bashSessionLanguage = {
    displayName: "Bash Session",
    name: "bash-session",
    patterns: [
        stepBannerPattern,
        createPromptPattern("\\#", true),
        createPromptPattern("\\$"),
    ],
    scopeName: "source.bash-session",
};

export function loadBashSessionLanguage() {
    return bashSessionLanguage;
}

export default bashSessionLanguage;
