"use client";

import GoogleSignIn from "@/components/GoogleSignIn";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  // Don't render the landing page content if user is authenticated
  if (user) return null;

  return (
    <main className="min-h-screen bg-secondary-50 dark:bg-secondary-800 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-secondary-50">
            Notes
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300 text-lg">
            Your thoughts, organized and accessible anywhere. The simple way to
            capture and manage your notes.
          </p>
          <div className="flex justify-center">
            <GoogleSignIn />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
