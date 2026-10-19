/**
 * Resolution logic for the IconGrid component.
 *
 * Kept free of Vue, and of the 1.1 MB icon set itself, so the validation,
 * lookup, and column rules can be tested directly against a small stand-in
 * set. The component renders whatever `buildIconGrid` returns.
 */

export interface IconGridItem {
    /** A Carbon icon name such as `chip` or `data-base`, without a prefix. */
    icon: string;
    /** The short text shown beneath the icon, which carries the meaning. */
    caption: string;
}

/** The part of an Iconify JSON icon set that IconGrid reads. */
export interface IconSet {
    width?: number;
    height?: number;
    icons: Record<string, { body: string; width?: number; height?: number }>;
    aliases?: Record<string, { parent: string }>;
}

export interface ResolvedIcon {
    body: string;
    viewBox: string;
}

export interface IconGridCell {
    caption: string;
    /** `null` until the icon set has loaded. */
    icon: ResolvedIcon | null;
}

export interface IconGridState {
    columns: number;
    cells: IconGridCell[];
}

export const ICON_GRID_MAX_ITEMS = 8;
export const ICON_GRID_MAX_COLUMNS = 4;
export const CARBON_BROWSER_URL = "https://icon-sets.iconify.design/carbon/";

const DEFAULT_ICON_SIZE = 32;
const MAX_ALIAS_HOPS = 8;

/**
 * Up to four items share one row. Five or six become rows of three, and seven
 * or eight rows of four, so no row is left with a single straggler beside a
 * full one.
 */
export function defaultColumns(count: number): number {
    if (count <= ICON_GRID_MAX_COLUMNS) return count;
    return count <= 6 ? 3 : 4;
}

/** Look an icon up by name, following aliases. `null` when it does not exist. */
export function resolveIcon(set: IconSet, name: string): ResolvedIcon | null {
    let current = name;
    for (let hop = 0; hop <= MAX_ALIAS_HOPS; hop += 1) {
        const icon = set.icons[current];
        if (icon) {
            const width = icon.width ?? set.width ?? DEFAULT_ICON_SIZE;
            const height = icon.height ?? set.height ?? DEFAULT_ICON_SIZE;
            return { body: icon.body, viewBox: `0 0 ${width} ${height}` };
        }
        const alias = set.aliases?.[current];
        if (!alias) return null;
        current = alias.parent;
    }
    return null;
}

function requireText(value: unknown, what: string, index: number): string {
    if (typeof value === "string" && value.trim().length) return value;
    throw new Error(`IconGrid item ${index + 1} needs ${what}.`);
}

function unknownIcon(name: string, index: number): Error {
    if (name.includes(":")) {
        return new Error(
            `IconGrid item ${index + 1} names "${name}". Use the bare Carbon name, without a prefix.`,
        );
    }
    return new Error(
        `IconGrid item ${index + 1} names "${name}", which is not a Carbon icon. Browse names at ${CARBON_BROWSER_URL}`,
    );
}

/**
 * Validate the props and resolve each icon. Pass `null` for the icon set while
 * it is still loading: the structure is checked at once, and icon names are
 * checked as soon as the set arrives.
 */
export function buildIconGrid(
    items: IconGridItem[],
    columns: number | undefined,
    set: IconSet | null,
): IconGridState {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("IconGrid needs at least one item.");
    }
    if (items.length > ICON_GRID_MAX_ITEMS) {
        throw new Error(
            `IconGrid shows at most ${ICON_GRID_MAX_ITEMS} items, and this one has ${items.length}. Split the slide.`,
        );
    }
    if (
        columns !== undefined &&
        (!Number.isInteger(columns) ||
            columns < 1 ||
            columns > ICON_GRID_MAX_COLUMNS)
    ) {
        throw new Error(
            `IconGrid columns must be a whole number from 1 to ${ICON_GRID_MAX_COLUMNS}.`,
        );
    }

    const cells = items.map((item, index) => {
        const name = requireText(item?.icon, "an icon", index);
        const caption = requireText(item?.caption, "a caption", index);
        if (!set) return { caption, icon: null };

        const icon = resolveIcon(set, name);
        if (!icon) throw unknownIcon(name, index);
        return { caption, icon };
    });

    return { columns: columns ?? defaultColumns(items.length), cells };
}
