import { defineShikiSetup } from "@slidev/types";
import { bundledLanguages } from "shiki/langs";

import { loadBashSessionLanguage } from "./bash-session";
import { loadIt230LightTheme } from "./it230-light-theme";

export default defineShikiSetup(async () => {
    const lightTheme = await loadIt230LightTheme();

    return {
        langs: {
            "bash-session": async () => {
                const { default: shellLanguages } =
                    await bundledLanguages.bash();

                return [...shellLanguages, loadBashSessionLanguage()];
            },
        },
        themes: {
            dark: "github-dark-high-contrast",
            light: lightTheme,
        },
    };
});
