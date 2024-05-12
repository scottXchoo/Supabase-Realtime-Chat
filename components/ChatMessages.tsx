import React, { Suspense } from "react";
import ListMessage from "./ListMessage";
import { supabaseServer } from "@/lib/supabase/server";
import InitMessages from "@/lib/store/InitMessages";

export default async function ChatMessages() {
  const supabase = supabaseServer();
  const { data } = await supabase.from("messages").select("*, users(*)");

  return (
    <Suspense fallback={"loading..."}>
      <ListMessage />
      <InitMessages messages={data || []} />
    </Suspense>
  );
}
