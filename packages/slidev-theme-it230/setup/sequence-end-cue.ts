import type { ClicksContext } from "@slidev/types";

type SequenceClicks = Pick<ClicksContext, "current" | "isMounted" | "total">;

export function isSequenceEndCueVisible(
    clicks: SequenceClicks,
    renderContext: string,
): boolean {
    return (
        (renderContext === "slide" || renderContext === "presenter") &&
        clicks.isMounted &&
        clicks.total > 0 &&
        clicks.current >= clicks.total
    );
}
