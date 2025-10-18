import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Next.js Starter</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-muted/50 to-background">
        {children}
      </main>
    </div>
  );
}