import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Regime } from "@/lib/macro/model";
import { simulatorLinkForShock } from "@/lib/macro/simUrl";

/** Opens a lesson's shock in the simulator, to move the sliders and play the prices. Hidden when the simulator has no equivalent. */
export default function OpenInSimulator({ shockId, regime }: { shockId: string; regime: Regime }) {
  const href = simulatorLinkForShock(shockId, regime);
  if (!href) return null;
  return (
    <Button asChild size="sm" variant="outline">
      <Link href={href}>Open in simulator</Link>
    </Button>
  );
}
