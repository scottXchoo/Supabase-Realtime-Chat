"use client";
import { Imessage, useMessage } from "@/lib/store/messages";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { DeleteAlert, EditAlert } from "./MessageActions";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";
import LoadMoreMessages from "./LoadMoreMessages";

export default function ListMessages() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);

  const {
    messages,
    optimisticIds,
    setOptimisticAddMessage,
    setOptimisticDeleteMessage,
    setOptimisticUpdateMessage,
  } = useMessage((state) => state);
  const supabase = supabaseBrowser();
  const scrollContainer = scrollRef.current;

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

          if (
            scrollContainer.scrollTop <
            scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
          ) {
            setNotification((current) => current + 1);
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
    if (scrollContainer && !userScrolled) {
      // 새로운 메시지가 오더라도 스크롤이 바닥에 있지 않으면, 스크롤 다운 X
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleOnScoll = () => {
    if (scrollContainer) {
      const isScoll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;

      setUserScrolled(isScoll);

      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotification(0);
      }
    }
  };

  const scrollDown = () => {
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    setNotification(0);
  };

  return (
    <>
      <div
        className="flex-1 flex flex-col p-5 h-full overflow-y-auto gap-6"
        ref={scrollRef}
        onScroll={handleOnScoll}
      >
        <div className="flex-1">
          <LoadMoreMessages />
        </div>
        {/* chat을 아래에 위치시킴 */}
        <div className="space-y-7">
          {messages.map((data) => {
            return <Message key={data.id} message={data} />;
          })}
        </div>
        {userScrolled && (
          <div className=" absolute bottom-20 w-full">
            {notification ? (
              <div
                className=" w-36 bg-orange-500 p-1 rounded-md justify-center items-center  flex mx-auto cursor-pointer"
                onClick={scrollDown}
              >
                <h1>New {notification} messages</h1>
              </div>
            ) : (
              <div
                className="w-10 h-10 bg-orange-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transition-all"
                onClick={scrollDown}
              >
                <ArrowDown />
              </div>
            )}
          </div>
        )}
        <DeleteAlert />
        <EditAlert />
      </div>
    </>
  );
}
