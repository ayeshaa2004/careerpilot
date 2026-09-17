import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5">
      <Link href="/" className="text-2xl font-bold">
        CareerPilot
      </Link>
      <div className="flex items-center gap-3 sm:gap-8">
        <div className="hidden sm:flex items-center gap-8">
          <a href="#features">Features</a>

          <a href="#how-it-works">How it works</a>
        </div>

        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="rounded-full border px-3 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base">
              Sign in
            </button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </nav>
  );
}
