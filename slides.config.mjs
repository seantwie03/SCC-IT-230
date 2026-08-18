export const presentations = [
    {
        id: "w01",
        title: "Week 01 — Course Introduction and Command-Line Refresher",
        summary:
            "Course orientation, lab-environment access, and a refresher on Bash prompts, output redirection, pipelines, and sudo.",
        entry: "course/w01.md",
        topics: [
            "Course introduction",
            "Lab environments",
            "Bash prompt",
            "Output redirection",
            "Pipelines",
            "sudo",
        ],
        resources: [
            {
                title: "Output Redirection Exercise",
                summary:
                    "A hands-on exercise comparing the overwrite (>) and append (>>) redirection operators.",
                source: "course/chapters/rh124-ch09-redirecting-shell-output/exercises/output-redirection-exercise.html",
            },
        ],
    },
];

export default { presentations };
