/** Shared layout + typography for IS / LM / Labor thumbnails in the “All” tab */

/**
 * Margins for thumbnail charts in “All” view — legend is in the card header, so `bottom`
 * is mostly for x-axis tick labels; a few extra px keeps plots off the card edges.
 */
export const ALL_VIEW_MARGIN = { top: 9, right: 8, left: 11, bottom: 12 } as const;

/** Larger canvases: nudge plot area slightly down + left vs older symmetric margins */
export const STANDALONE_CHART_MARGIN = {
  top: 10,
  right: 12,
  left: 36,
  bottom: 26,
} as const;

export const ALL_VIEW_TICK = { fontSize: 7, fill: "#374151" };

/** Fewer ticks → shorter axes → larger plot area in tiny cards */
export const ALL_VIEW_X_TICKS = [0, 50, 100] as const;
export const ALL_VIEW_Y_TICKS = [0, 10, 20] as const;

/** Dotted “set baseline” comparison curves (drawn behind live series). */
export const CHART_BASELINE_STROKE = "rgba(71, 85, 105, 0.88)";
export const CHART_BASELINE_STROKE_DASHARRAY = "5 5";
