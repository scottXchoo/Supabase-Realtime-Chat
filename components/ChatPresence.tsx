import { useUser } from "@/lib/store/user";
import { supabaseBrowser } from "@/lib/supabase/browser";
import React, { useEffect, useState } from "react";

export default function ChatPresence() {
  const user = useUser((state) => state.user);
  const [onlineUser, setOnlineUser] = useState(0);

  useEffect(() => {
    const supabase = supabaseBrowser();
    const channel = supabase.channel("room1");
    channel
      .on("presence", { event: "sync" }, () => {
        let channel_presenceState = channel.presenceState();
        let userIds = new Map();
        for (const id in channel_presenceState) {
          let presenceState: any = channel_presenceState[id][0];
          let user_id = presenceState.user_id;
          if (user_id) {
            userIds.set(user_id, user_id);
          }
        }
        setOnlineUser(userIds.size);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          });
        }
      });
  }, [user]);

  if (!user) {
    return <div className="h-3 w-1"></div>;
  }

  return (
    <div className="flex items-center gap-1">
      <div className="h-4 w-4 bg-green-400 rounded-full animate-pulse"></div>
      <h1 className="text-sm text-gray-400">{onlineUser} onlines</h1>
    </div>
  );
}
