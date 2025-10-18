import { Metadata } from "next";
import { RegisterForm } from "@/modules/auth/components/register-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register - Next.js Starter Kit",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex max-w-md flex-col justify-center space-y-6 px-4">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your information to get started
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}