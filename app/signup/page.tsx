"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// import Firebase
import { auth, provider } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

// ✅ ADD THESE
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ ADD THIS
  const { language } = useLanguage();
  const t = translations[language];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
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
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          {t.signup}
        </h1>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <Label htmlFor="email" className="text-black">
              {t.email}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-black"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-black">
              {t.password}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black"
            />
          </div>

          <Button
            className="w-full bg-[#FFB7D5] hover:opacity-90 text-black rounded-xl"
            type="submit"
          >
            {t.signup}
          </Button>
        </form>

        <div className="my-4 text-center text-sm text-black">
          {t.or}
        </div>

        <Button
          variant="outline"
          className="w-full text-black rounded-xl"
          onClick={handleGoogleSignup}
        >
          {t.continueGoogle}
        </Button>

        <p className="text-sm text-center text-black mt-4">
          {t.haveAccount}{" "}
          <Link
            href="/login"
            className="text-[#FFB7D5] font-semibold hover:opacity-80 transition"
          >
            {t.signin}
          </Link>
        </p>
      </div>
    </div>
  );
}