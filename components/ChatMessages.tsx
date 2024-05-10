import React, { Suspense } from "react";
import ListMessage from "./ListMessage";
import { supabaseServer } from "@/lib/supabase/server";

export default async function ChatMessages() {
  const supabase = supabaseServer();

  const { data } = await supabase.from("messages").select("*, users(*)");
  console.log(data);

  return (
    <Suspense fallback={"loading..."}>
      <ListMessage />
    </Suspense>
  );
}
