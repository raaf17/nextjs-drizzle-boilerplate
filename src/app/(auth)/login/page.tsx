import { Metadata } from "next";
import { LoginForm } from "@/modules/auth/components/login-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login - Next.js Starter Kit",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto flex max-w-md flex-col justify-center space-y-6 px-4">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}