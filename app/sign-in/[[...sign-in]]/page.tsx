import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-purple-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}
