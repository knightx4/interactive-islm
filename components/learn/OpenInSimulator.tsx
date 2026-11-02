import Link from "next/link";
import { Button } from "@/components/ui/button";
import { simulatorLinkForShock } from "@/lib/macro/simUrl";

/** Opens a lesson's shock in the simulator, to move the sliders and play the prices. Hidden when the simulator has no equivalent. */
export default function OpenInSimulator({ shockId, open }: { shockId: string; open: boolean }) {
  const href = simulatorLinkForShock(shockId, open);
  if (!href) return null;
  return (
    <Button asChild size="sm" variant="outline">
      <Link href={href}>Open in simulator</Link>
    </Button>
  );
}
