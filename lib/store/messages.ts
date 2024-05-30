import { create } from "zustand";
import { LIMIT_MESSAGE } from "../constant";

export type Imessage = {
  created_at: string;
  id: string;
  is_edit: boolean;
  send_by: string;
  text: string;
  users: {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
  } | null;
};

interface MessageState {
  hasMore: boolean;
  page: number;
  messages: Imessage[];
  actionMessage: Imessage | undefined;
  optimisticIds: string[];
  setActionMessage: (message: Imessage | undefined) => void;
  setOptimisticAddMessage: (message: Imessage) => void;
  setOptimisticDeleteMessage: (messageId: string) => void;
  setOptimisticUpdateMessage: (message: Imessage) => void;
  setOptimisticIds: (id: string) => void;
  setMessages: (message: Imessage[]) => void;
}

export const useMessage = create<MessageState>()((set) => ({
  hasMore: true,
  page: 1,
  messages: [],
  actionMessage: undefined,
  optimisticIds: [],
  setActionMessage: (message) =>
    set(() => ({
      actionMessage: message,
    })),
  setOptimisticAddMessage: (newMessage) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
    })),
  setOptimisticDeleteMessage: (messageId) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => message.id !== messageId),
      };
    }),
  setOptimisticUpdateMessage: (updateMessage) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => {
          if (message.id === updateMessage.id) {
            (message.text = updateMessage.text),
              (message.is_edit = updateMessage.is_edit);
          }
          return message;
        }),
      };
    }),
  setOptimisticIds: (id: string) =>
    set((state) => ({
      optimisticIds: [...state.optimisticIds, id],
    })),
  setMessages: (messages: Imessage[]) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= LIMIT_MESSAGE,
    })),
}));
