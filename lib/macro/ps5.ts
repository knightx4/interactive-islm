/**
 * The linear IS-LM system used in the problem-set exercise, as a closed-form solver.
 *   IS: r = -0.1 Y + 0.2 G + 44
 *   LM: r = Y/15 + (500 - Ms)/15
 */
export const ps5 = {
  is: (Y: number, G: number) => -0.1 * Y + 0.2 * G + 44,
  lm: (Y: number, Ms: number) => Y / 15 + (500 - Ms) / 15,
  equilibrium(G: number, Ms: number) {
    // -0.1Y + 0.2G + 44 = Y/15 + (500 - Ms)/15  =>  Y (1/15 + 1/10) = 0.2G + 44 - (500 - Ms)/15
    const Y = (0.2 * G + 44 - (500 - Ms) / 15) / (1 / 15 + 1 / 10);
    return { Y, r: -0.1 * Y + 0.2 * G + 44 };
  },
};
