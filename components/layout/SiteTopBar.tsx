"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Simulator" },
  { href: "/learn", label: "Learn" },
];

export default function SiteTopBar() {
  const pathname = usePathname();
  const currentPath = pathname ?? "/";

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <div className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-foreground">
          Interactive IS-LM
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
      </div>
    </header>
  );
}
