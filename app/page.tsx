import ChatHeader from "@/components/ChatHeader";
import { Input } from "@/components/ui/input";
import InitUser from "@/lib/store/InitUser";
import { supabaseServer } from "@/lib/supabase/server";
import React from "react";

export default async function page() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md flex flex-col">
          <ChatHeader user={data?.user} />
          <div className="flex-1 flex flex-col p-5 h-full overflow-y-auto">
            <div className="flex-1"></div> {/* chat을 아래에 위치시킴 */}
            <div className="space-y-7">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => {
                return (
                  <div className="flex gap-2" key={value}>
                    <div className="h-10 w-10 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <h1 className="font-bold">Scott Choo</h1>
                        <h1 className="text-sm text-gray-400">
                          {new Date().toDateString()}
                        </h1>
                      </div>
                      <p className="text-gray-300">Hello Guys~</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-5">
            <Input placeholder="send message" />
          </div>
        </div>
      </div>
      <InitUser user={data?.user} />
    </>
  );
}
