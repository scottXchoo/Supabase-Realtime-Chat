"use client";
import { Imessage, useMessage } from "@/lib/store/messages";
import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { DeleteAlert, EditAlert } from "./MessageActions";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";

export default function ListMessage() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const {
    messages,
    optimisticIds,
    setOptimisticAddMessage,
    setOptimisticDeleteMessage,
    setOptimisticUpdateMessage,
  } = useMessage((state) => state);
  const supabase = supabaseBrowser();

  useEffect(() => {
    const channel = supabase
      .channel("chat-room") // 여러 채팅방이면, 수정 필요
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          if (!optimisticIds.includes(payload.new.id)) {
            const { data, error } = await supabase
              .from("users")
              .select("*")
              .eq("id", payload.new.send_by)
              .single(); // SQL : limit(1)과 같은 기능

            if (error) {
              toast.error(error.message);
            } else {
              const newMessage: Imessage = {
                ...(payload.new as Imessage),
                users: data, // users 테이블에 있는 모든 정보
              };
              setOptimisticAddMessage(newMessage);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          setOptimisticDeleteMessage(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          setOptimisticUpdateMessage(payload.new as Imessage);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex-1 flex flex-col p-5 h-full overflow-y-auto"
      ref={scrollRef}
    >
      <div className="flex-1"></div> {/* chat을 아래에 위치시킴 */}
      <div className="space-y-7">
        {messages.map((data) => {
          return <Message key={data.id} message={data} />;
        })}
      </div>
      <DeleteAlert />
      <EditAlert />
    </div>
  );
}
