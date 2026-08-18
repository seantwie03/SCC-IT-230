export default {
    presentations: [
        {
            id: "it230-integration",
            title: "Integration Fixture",
            summary:
                "A synthetic presentation used only to verify the build pipeline.",
            entry: "tests/fixtures/course/example.md",
            topics: ["named fragments", "local assets"],
            resources: [
                {
                    title: "Integration resource",
                    summary:
                        "An original text fixture copied by the resource pipeline.",
                    source: "tests/fixtures/site/resource.txt",
                },
            ],
        },
    ],
};
