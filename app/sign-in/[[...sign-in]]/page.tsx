import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-purple-light flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Branding */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="text-4xl text-amber-brand animate-pulse">✦</span>
              <h1 className="text-3xl font-bold text-purple-brand">PrestoMagic</h1>
            </div>

            <p className="text-center text-ink text-lg mb-2">Welcome Back</p>
            <p className="text-center text-gray-600 text-sm mb-8">
              Sign in to your account and continue creating magical apps
            </p>

            {/* Sign In Form */}
            <SignIn />

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Sign Up CTA */}
            <p className="text-center text-gray-600 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-purple-brand font-semibold hover:underline"
              >
                Create one here
              </Link>
            </p>

            {/* Features Highlight */}
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
              <p className="text-xs text-gray-500 font-semibold uppercase">What you can do:</p>
              <div className="text-xs text-gray-600 space-y-2">
                <div className="flex gap-2">
                  <span>✓</span>
                  <span>Create apps just by describing them</span>
                </div>
                <div className="flex gap-2">
                  <span>✓</span>
                  <span>See live previews instantly</span>
                </div>
                <div className="flex gap-2">
                  <span>✓</span>
                  <span>Download & share your creations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 sm:px-8 text-center text-ink text-sm">
        Powered by Llama 3.3 70B + Together AI &middot; Workflows by AINL
      </footer>
    </div>
  );
}
