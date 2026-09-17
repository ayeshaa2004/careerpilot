import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5">
      <Link href="/" className="text-2xl font-bold">
        CareerPilot
      </Link>
      <div className="flex items-center gap-8">
        <a href="#features">Features</a>

        <a href="#how-it-works">How it works</a>

        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="rounded-full border px-5 py-2">Sign in</button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </nav>
  );
}
