"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="fixed top-4 right-4 flex gap-2">
      <ThemeToggle />
      {user && (
        <button
          onClick={handleSignOut}
          className="p-3 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-all"
          aria-label="Sign out"
        >
          <HiArrowRightOnRectangle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Header;
