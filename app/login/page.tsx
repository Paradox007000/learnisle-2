"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { auth, provider } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(to bottom, #FFF6EC, #E6F7F2)",
      }}
    >
      <div className="w-full max-w-md bg-white/85 backdrop-blur-md border border-gray-200 p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-semibold text-center mb-6 text-black">
          Welcome Back
        </h1>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="email" className="text-black">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-black"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-black">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black"
            />
          </div>

          <Button
            className="w-full bg-[#FFB7D5] hover:opacity-90 text-black rounded-xl"

          >
            Login
          </Button>
        </form>

        <div className="my-4 text-center text-black">— OR —</div>

        <Button
          variant="outline"
          className="w-full text-black rounded-xl"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>

        <p className="text-sm text-center text-black mt-5">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-pink-500 font-medium"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
