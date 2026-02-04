import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-zinc-50">
      <h1 className="text-4xl font-bold">Helloooow</h1>

      <Link
        href="/signup"
        className="rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        Sign Up
      </Link>
    </div>
  );
}