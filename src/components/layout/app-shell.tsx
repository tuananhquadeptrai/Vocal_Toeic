import Link from "next/link";
import { BookOpenText, ChartColumnBig, FileUp, House, Sparkles, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { navigationItems } from "@/lib/constants/navigation";

const navIcons = {
  "/": House,
  "/vocabulary": BookOpenText,
  "/quiz/setup": Sparkles,
  "/progress": ChartColumnBig,
  "/import": FileUp,
  "/settings": Settings,
};

export function AppShell({
  children,
  currentPath,
}: {
  children: React.ReactNode;
  currentPath: string;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Card className="overflow-hidden rounded-[2rem] border-white/50">
        <header className="grid-dots border-b border-border px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link className="inline-flex items-center gap-3" href="/">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background">
                  Q
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Quizzz</p>
                  <h1 className="text-xl font-semibold">English Vocabulary Quiz</h1>
                </div>
              </Link>
            </div>
            <nav className="flex flex-wrap gap-2">
              {navigationItems.map((item) => {
                const Icon = navIcons[item.href as keyof typeof navIcons];
                const isActive =
                  currentPath === item.href ||
                  (item.href !== "/" && currentPath.startsWith(item.href));

                return (
                  <Button asChild key={item.href} size="sm" variant={isActive ? "default" : "secondary"}>
                    <Link className={!isActive ? "bg-white/60 hover:bg-white" : undefined} href={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </header>
        <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </Card>
    </div>
  );
}
