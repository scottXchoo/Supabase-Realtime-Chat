"use client";

import React from "react";
import { Button } from "./ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import ChatPresence from "./ChatPresence";
import { Github } from "lucide-react";

export default function ChatHeader({ user }: { user: User | null }) {
  const router = useRouter();

  const handleLoginWithGithub = () => {
    const supabase = supabaseBrowser();
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();

    router.refresh();
  };

  return (
    <div className="h-20">
      <div className="flex items-center justify-between p-5 border-b h-full">
        <div>
          <h1 className="text-xl font-bold">Daily Chat</h1>
          {user && <ChatPresence />}
        </div>
        {user ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button onClick={handleLoginWithGithub} className="flex gap-2">
            <div>Login</div>
            <Github />
          </Button>
        )}
      </div>
    </div>
  );
}
