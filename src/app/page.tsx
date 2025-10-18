import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Code } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
          Next.js Starter Kit
        </h1>
        <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
          Modern, secure, and scalable starter template with best practices
        </p>

        <div className="mb-12 flex justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Shield className="mx-auto mb-4 h-12 w-12 text-blue-600" />
            <h3 className="mb-2 text-lg font-semibold">Secure by Default</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built-in authentication, rate limiting, and security headers
            </p>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Zap className="mx-auto mb-4 h-12 w-12 text-yellow-600" />
            <h3 className="mb-2 text-lg font-semibold">Fast & Scalable</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Optimized performance with Server Actions and edge functions
            </p>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Code className="mx-auto mb-4 h-12 w-12 text-green-600" />
            <h3 className="mb-2 text-lg font-semibold">Developer Friendly</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              TypeScript, Tailwind CSS, and modular architecture
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}