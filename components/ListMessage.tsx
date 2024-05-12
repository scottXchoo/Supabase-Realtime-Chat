"use client";
import { useMessage } from "@/lib/store/messages";
import React from "react";
import Message from "./Message";
import { DeleteAlert } from "./MessageActions";

export default function ListMessage() {
  const messages = useMessage((state) => state.messages);

  return (
    <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto">
      <div className="flex-1"></div> {/* chat을 아래에 위치시킴 */}
      <div className="space-y-7">
        {messages.map((data) => {
          return <Message key={data.id} message={data} />;
        })}
      </div>
      <DeleteAlert />
    </div>
  );
}
