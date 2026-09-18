import { computed, watch, type ComputedRef } from "vue";

export interface GuardedValue<T> {
    /** The validation message, or `null` while the props are valid. */
    error: ComputedRef<string | null>;
    /** The built value, or `null` while `error` is set. */
    value: ComputedRef<T | null>;
}

/**
 * Build a component's state without throwing during render.
 *
 * A validation error thrown from a render function aborts the mount partway,
 * leaving the component in the tree with no element. The slide goes blank, and
 * the next hot update dies on that half-mounted subtree rather than rendering
 * the corrected component, so the author has to reload the page by hand. Both
 * failures look like the component silently doing nothing.
 *
 * Catching here keeps the tree intact: the component renders `AuthoringError`
 * instead, and a later edit recovers on its own. The message is also written to
 * the console, because `check-slides.mjs` fails a deck on console errors and an
 * authoring mistake must not pass review merely because the slide explains it.
 */
export function guardAuthoring<T>(
    component: string,
    build: () => T,
): GuardedValue<T> {
    const result = computed<{ message: string } | { value: T }>(() => {
        try {
            return { value: build() };
        } catch (cause) {
            return {
                message: cause instanceof Error ? cause.message : String(cause),
            };
        }
    });
    const error = computed(() =>
        "message" in result.value ? result.value.message : null,
    );
    const value = computed(() =>
        "value" in result.value ? result.value.value : null,
    );

    watch(
        error,
        (message) => {
            if (message) console.error(`[${component}] ${message}`);
        },
        { immediate: true },
    );

    return { error, value };
}
