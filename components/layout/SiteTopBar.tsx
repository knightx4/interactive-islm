"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScenarioChip } from "@/components/ui/scenario-chip";

const navItems = [
  { href: "/", label: "Simulator" },
  { href: "/learn", label: "Learn" },
];

export default function SiteTopBar() {
  const pathname = usePathname();
  const currentPath = pathname ?? "/";
  const [copied, setCopied] = useState<"" | "copied" | "failed">("");
  // the simulator keeps its address in step with its settings, so the address is the link
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied("copied");
    } catch {
      setCopied("failed");
    }
    setTimeout(() => setCopied(""), 2500);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div className="mx-auto flex h-14 w-full max-w-[1360px] items-center gap-4 px-4 md:gap-6 md:px-6">
        <Link href="/" className="whitespace-nowrap font-serif text-lg font-semibold tracking-tight text-foreground">
          <span className="sm:hidden">IS-LM</span>
          <span className="hidden sm:inline">Interactive IS-LM</span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b-2 py-1 text-sm transition-colors",
                  isActive
                    ? "border-ink font-semibold text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        {currentPath === "/" && (
          <ScenarioChip onClick={copyLink} className="ml-auto inline-flex items-center gap-1.5" title="Copies a link that reopens exactly these settings">
            <Link2 className="size-3.5" aria-hidden />Copy link
          </ScenarioChip>
        )}
        <span className="sr-only" aria-live="polite">
          {copied === "copied" ? "Link copied: it reopens these settings." : copied === "failed" ? "Copy failed: copy the address from the address bar." : ""}
        </span>
      </div>
    </header>
  );
}
