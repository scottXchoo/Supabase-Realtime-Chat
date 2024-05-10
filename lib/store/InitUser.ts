"use client";

import { User } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import { useUser } from "./user";

export default function InitUser({ user }: { user: User | null }) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useUser.setState({ user });
    }

    initState.current = true;
  }, [user]);

  return null;
}
