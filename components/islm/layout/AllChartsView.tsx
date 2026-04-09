"use client";

import { useEffect, useState } from "react";
import ISChart from "@/components/islm/ISChart";
import LMChart from "@/components/islm/LMChart";
import ISLMChart from "@/components/islm/ISLMChart";
import LaborChart from "@/components/islm/LaborChart";
import { type ModelParams } from "@/lib/islmModel";

interface AllChartsViewProps {
  params: ModelParams;
  onEquilibriumChange: (output: number | null) => void;
}

export default function AllChartsView({
  params,
  onEquilibriumChange,
}: AllChartsViewProps) {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 520px)");
    const apply = () => setWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
      <div
        className="grid h-full min-h-0 w-full min-w-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(180px,34%)] grid-rows-1 gap-1 overflow-hidden
          md:grid-cols-[minmax(0,1fr)_minmax(200px,32%)]
          xl:grid-cols-[minmax(0,1fr)_minmax(230px,30%)]"
      >
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <ISLMChart
            params={params}
            allViewLayout
            onEquilibriumChange={onEquilibriumChange}
            compact={!wide}
          />
        </div>
        <div
          className="grid h-full min-h-0 w-full min-w-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-1 overflow-hidden"
        >
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            <ISChart params={params} allView />
          </div>
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            <LMChart params={params} allView />
          </div>
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            <LaborChart params={params} allView />
          </div>
        </div>
      </div>
    </div>
  );
}
