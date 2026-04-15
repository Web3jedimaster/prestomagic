import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-purple-light flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Branding & Value Prop */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl text-amber-brand animate-pulse">✦</span>
                <h1 className="text-5xl font-bold text-purple-brand">PrestoMagic</h1>
              </div>
              <p className="text-2xl text-ink font-semibold mb-4">No code. Just a little magic.</p>
              <p className="text-lg text-ink mb-8 leading-relaxed">
                Create fully functional React apps in seconds. Just describe what you want, and watch it come to life.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-semibold text-ink">Instant Generation</h3>
                  <p className="text-sm text-gray-600">Describe your app in plain English</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">👁️</span>
                <div>
                  <h3 className="font-semibold text-ink">Live Preview</h3>
                  <p className="text-sm text-gray-600">See your app rendered in real-time</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">📥</span>
                <div>
                  <h3 className="font-semibold text-ink">Export & Share</h3>
                  <p className="text-sm text-gray-600">Download code or share with others</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="font-semibold text-ink">Beautiful by Default</h3>
                  <p className="text-sm text-gray-600">Styled with Tailwind CSS</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🔊</span>
                <div>
                  <h3 className="font-semibold text-ink">Voice Input</h3>
                  <p className="text-sm text-gray-600">Build apps hands-free</p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-8 p-4 bg-purple-light rounded-xl border-l-4 border-amber-brand">
              <p className="text-ink italic">
                &quot;Build the web apps you&apos;ve always wanted to create, without writing a single line of code.&quot;
              </p>
            </div>
          </div>

          {/* Right side - Sign Up Form */}
          <div className="flex items-center justify-center">
            <div className="w-full bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-purple-brand mb-2">Create Your Account</h2>
              <p className="text-gray-600 mb-6">Start creating magical apps in seconds</p>
              <SignUp />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 sm:px-8 text-center text-ink text-sm">
        Powered by Llama 3.3 70B + Together AI · Workflows by AINL
      </footer>
    </div>
  );
}
