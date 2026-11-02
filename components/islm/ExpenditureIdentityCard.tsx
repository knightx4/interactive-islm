"use client";

import type { Frame, Params } from "@/lib/macro/model";

function row(label: string, value: number, strong?: boolean) {
  return (
    <tr className={strong ? "border-t border-ink font-semibold" : "border-t border-rule"}>
      <td className="py-1.5 pr-4">{label}</td>
      <td className="num py-1.5 text-right">{value.toFixed(1)}</td>
    </tr>
  );
}

/** Y = C + I + G + NX at the point on show, read from the same solution as the figures. */
export default function ExpenditureIdentityCard({ params, frame }: { params: Params; frame: Frame }) {
  const S = frame.Y - frame.C - params.G;
  return (
    <section className="mt-10 max-w-lg border-t border-ink pt-4">
      <h2 className="text-2xl">Expenditure accounting</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        At the point on show, in the index units of the figures. Consumption is what is left of income after saving, taxes and the other components.
      </p>
      <table className="mt-3 w-full text-sm">
        <tbody>
          {row("Consumption C", frame.C)}
          {row("Investment I", frame.I)}
          {row("Government G", params.G)}
          {row("Net exports NX", frame.NX)}
          {row("Saving S (Y − C − G)", S)}
          {row("Interest rate r (%)", frame.r)}
          {row("Output Y", frame.Y, true)}
        </tbody>
      </table>
    </section>
  );
}
