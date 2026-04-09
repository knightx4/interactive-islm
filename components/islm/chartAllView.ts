/** Shared layout + typography for IS / LM / Labor thumbnails in the “All” tab */

/**
 * Tight margins: legend is rendered in the card header (not in Recharts), so `bottom`
 * only needs space for x-axis tick labels.
 */
export const ALL_VIEW_MARGIN = { top: 0, right: 2, left: 10, bottom: 7 } as const;

export const ALL_VIEW_TICK = { fontSize: 7, fill: "#374151" };

/** Fewer ticks → shorter axes → larger plot area in tiny cards */
export const ALL_VIEW_X_TICKS = [0, 50, 100] as const;
export const ALL_VIEW_Y_TICKS = [0, 10, 20] as const;
