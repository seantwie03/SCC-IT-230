import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createHighlighter } from "shiki";
import { bundledLanguages } from "shiki/langs";

import { loadBashSessionLanguage } from "../setup/bash-session.ts";
import { loadIt230LightTheme } from "../setup/it230-light-theme.ts";

const normalColor = "#25252B";
const promptColor = "#1C754B";
const privilegedPromptColor = "#C30000";
const promptColorScopes = new Set([
    "meta.prompt.user.bash-session",
    "meta.prompt.host.bash-session",
    "meta.prompt.directory.bash-session",
    "punctuation.separator.identity.bash-session",
]);
const privilegedPromptColorScopes = new Set([
    "meta.prompt.user.privileged.bash-session",
    "meta.prompt.host.privileged.bash-session",
    "meta.prompt.directory.privileged.bash-session",
    "punctuation.separator.identity.privileged.bash-session",
]);

let highlighter;

test.before(async () => {
    highlighter = await createHighlighter({
        langs: [loadBashSessionLanguage, bundledLanguages.bash],
        themes: [loadIt230LightTheme],
    });
});

test.after(() => {
    highlighter.dispose();
});

function explainLine(line) {
    return line.flatMap((token) =>
        (
            token.explanation ?? [
                {
                    content: token.content,
                    scopes: [],
                },
            ]
        ).map((segment) => ({ ...segment, color: token.color })),
    );
}

function scopeNames(segment) {
    return segment.scopes.map((scope) => scope.scopeName);
}

function contentWithScope(segments, scopeName) {
    return segments
        .filter((segment) => scopeNames(segment).includes(scopeName))
        .map((segment) => segment.content)
        .join("");
}

async function tokenizeAs(source, lang) {
    const result = highlighter.codeToTokens(source, {
        includeExplanation: true,
        lang,
        theme: "it230-light",
    });

    return result.tokens.map(explainLine);
}

async function tokenize(source) {
    return tokenizeAs(source, "bash-session");
}

function colorsByCharacter(line) {
    return line.flatMap((segment) =>
        [...segment.content].map(() => segment.color),
    );
}

function relativeLuminance(hex) {
    const channels = [1, 3, 5]
        .map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
        .map((value) =>
            value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
        );

    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first, second) {
    const luminances = [relativeLuminance(first), relativeLuminance(second)];
    return (Math.max(...luminances) + 0.05) / (Math.min(...luminances) + 0.05);
}

test("recognizes user, host, directory, and privilege prompt changes", async () => {
    const source = [
        "student@lab:~$ sudo -i",
        "root@lab:~# systemctl stop httpd.service",
        "student@lab:/etc/sshd$ ls -l sshd.conf",
    ];
    const lines = await tokenize(source.join("\n"));
    const expectedPrompts = [
        {
            color: promptColor,
            directory: "~",
            host: "lab",
            privileged: false,
            symbol: "$",
            user: "student",
        },
        {
            color: privilegedPromptColor,
            directory: "~",
            host: "lab",
            privileged: true,
            symbol: "#",
            user: "root",
        },
        {
            color: promptColor,
            directory: "/etc/sshd",
            host: "lab",
            privileged: false,
            symbol: "$",
            user: "student",
        },
    ];

    for (const [index, expected] of expectedPrompts.entries()) {
        const scopeVariant = expected.privileged ? ".privileged" : "";
        assert.equal(
            contentWithScope(
                lines[index],
                `meta.prompt.user${scopeVariant}.bash-session`,
            ),
            expected.user,
        );
        assert.equal(
            contentWithScope(
                lines[index],
                `meta.prompt.host${scopeVariant}.bash-session`,
            ),
            expected.host,
        );
        assert.equal(
            contentWithScope(
                lines[index],
                `meta.prompt.directory${scopeVariant}.bash-session`,
            ),
            expected.directory,
        );
        assert.equal(
            contentWithScope(lines[index], "meta.prompt.symbol.bash-session"),
            expected.symbol,
        );
        assert.equal(
            contentWithScope(
                lines[index],
                "punctuation.separator.location.bash-session",
            ),
            ":",
        );
        for (const segment of lines[index]) {
            const scopes = scopeNames(segment);

            if (scopes.some((scope) => promptColorScopes.has(scope)))
                assert.equal(segment.color, promptColor);
            if (scopes.some((scope) => privilegedPromptColorScopes.has(scope)))
                assert.equal(segment.color, privilegedPromptColor);
            if (
                scopes.includes("meta.prompt.symbol.bash-session") ||
                scopes.includes("punctuation.separator.location.bash-session")
            )
                assert.equal(segment.color, normalColor);
        }
    }
});

test("uses accessible user and privileged prompt colors", () => {
    assert.ok(contrastRatio(promptColor, "#FFFFFF") >= 5.68);
    assert.ok(contrastRatio(privilegedPromptColor, "#FFFFFF") >= 5.68);
});

test("uses an accessible Adwaita-derived syntax palette", async () => {
    const theme = await loadIt230LightTheme();
    const foregrounds = new Set(
        theme.tokenColors
            .map((rule) => rule.settings.foreground)
            .filter(Boolean),
    );

    assert.match(theme.displayName, /Adwaita/);
    for (const foreground of foregrounds)
        assert.ok(
            contrastRatio(foreground, "#FFFFFF") >= 5.68,
            `${foreground} does not meet the 5.68:1 syntax-text floor`,
        );
});

test("matches ordinary Bash highlighting inside command regions", async () => {
    const prompt = "student@lab:~$ ";
    const commands = [
        "systemctl status sshd --no-pager",
        "sudo systemctl enable --now sshd",
        "printf '%s\\n' '# [ ] $HOME'",
        'values[0]="$PATH" # [ ] $',
        "[[ $value == '# [ ] $' ]]",
    ];

    for (const command of commands) {
        const bashLine = (await tokenizeAs(command, "bash"))[0];
        const sessionLine = (await tokenize(`${prompt}${command}`))[0];

        assert.equal(
            sessionLine.map((segment) => segment.content).join(""),
            `${prompt}${command}`,
        );
        assert.deepEqual(
            colorsByCharacter(sessionLine).slice(prompt.length),
            colorsByCharacter(bashLine),
            command,
        );
    }
});

test("keeps special characters inside Bash command boundaries", async () => {
    const source = [
        "student@lab:~$ printf '%s\\n' '# [ ] $HOME'",
        'student@lab:~$ values[0]="$PATH" # [ ] $',
        "student@lab:~$ [[ $value == '# [ ] $' ]]",
        "student@lab:~$ printf '%s\\n' 'fake$ value fake# value'",
    ];
    const lines = await tokenize(source.join("\n"));

    for (const [index, line] of lines.entries()) {
        assert.equal(
            line.map((segment) => segment.content).join(""),
            source[index],
        );
        assert.equal(
            contentWithScope(line, "meta.prompt.symbol.bash-session"),
            "$",
        );
        assert.equal(
            contentWithScope(line, "meta.prompt.directory.bash-session"),
            "~",
        );
        assert.ok(
            line.some((segment) =>
                scopeNames(segment).some((scope) => scope.endsWith(".shell")),
            ),
        );
        assert.ok(
            line.some(
                (segment) =>
                    scopeNames(segment).some((scope) =>
                        scope.endsWith(".shell"),
                    ) && segment.color !== normalColor,
            ),
        );
        for (const segment of line)
            if (
                scopeNames(segment).some((scope) =>
                    promptColorScopes.has(scope),
                )
            )
                assert.equal(segment.color, promptColor);
    }
});

test("keeps output containing #, brackets, and dollar expressions plain", async () => {
    const source = [
        "# [result] $HOME",
        "array[0]=$value # output [ok]",
        "$ [ ] #",
        "[student@lab output] contains # and $",
    ];
    const lines = await tokenize(source.join("\n"));

    for (const [index, line] of lines.entries()) {
        assert.equal(
            line.map((segment) => segment.content).join(""),
            source[index],
        );
        const scopes = line.flatMap(scopeNames);
        assert.deepEqual([...new Set(scopes)], ["source.bash-session"]);
        assert.ok(line.every((segment) => segment.color === normalColor));
    }
});

test("preserves physical transcript lines including output and blanks", async () => {
    const source = [
        "student@lab:~$ id",
        "uid=1000(student) gid=1000(student)",
        "",
        "student@lab:~$ printf '$ [ ] #\\n'",
        "$ [ ] #",
    ];
    const lines = await tokenize(source.join("\n"));

    assert.equal(lines.length, source.length);
    assert.deepEqual(
        lines.map((line) => line.map((segment) => segment.content).join("")),
        source,
    );
});

test("the Slidev fixture covers static and dynamic line highlighting", async () => {
    const fixture = await readFile(
        new URL("./fixtures/bash-session.md", import.meta.url),
        "utf8",
    );

    assert.match(fixture, /```bash-session \{2\}/);
    assert.match(fixture, /```bash-session \{hide\|none\|1\|2\|3\|all\}/);
});
