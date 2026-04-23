"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { learnTopics } from "@/lib/learnTopics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

function TopicsList({ onTopicClick }: { onTopicClick?: () => void }) {
  return (
    <ul className="space-y-1">
      {learnTopics.map((topic) => (
        <li key={topic.slug}>
          <Link
            href={`/learn#${topic.slug}`}
            onClick={onTopicClick}
            className="block rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {topic.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function LearnPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="rounded-xl border bg-card p-5 shadow-sm md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Learn IS-LM</h1>
              <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
                Use this learning area to explore macro topics one-by-one. The structure is set up
                now so content can be added incrementally.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSidebarOpen(true)}
              className="shrink-0"
            >
              <Menu />
              Topics
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {learnTopics.map((topic) => (
            <Card key={topic.slug} id={topic.slug} className="scroll-mt-24">
              <CardHeader className="py-4">
                <CardTitle className="text-base md:text-lg">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-5">
                <p className="text-sm text-muted-foreground md:text-base">{topic.blurb}</p>
                <p className="text-sm text-gray-700">
                  Placeholder content section. Detailed learning material will be added here later.
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="left"
          className="bg-sidebar px-0 text-sidebar-foreground border-sidebar-border"
        >
          <SheetHeader className="border-b px-6 pb-4">
            <SheetTitle>Learning Topics</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-4rem)] px-4 py-4">
            <TopicsList onTopicClick={() => setIsSidebarOpen(false)} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
