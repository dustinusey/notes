"use client";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const GoogleSignIn = () => {
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/home");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="bg-secondary-900 hover:bg-secondary-800 text-white px-8 py-3 rounded-2xl transition-all w-full max-w-sm flex items-center justify-center gap-3"
    >
      <FcGoogle className="w-6 h-6" />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleSignIn;
