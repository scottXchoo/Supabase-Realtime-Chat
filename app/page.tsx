import ChatHeader from "@/components/ChatHeader";
import { supabaseServer } from "@/lib/supabase/server";
import React from "react";

export default async function page() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="max-w-3xl mx-auto md:py-10 h-screen">
      <div className="h-full border rounded-md">
        <ChatHeader user={data?.user} />
      </div>
    </div>
  );
}
