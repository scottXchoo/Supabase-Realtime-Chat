import { create } from "zustand";

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
  messages: Imessage[];
  actionMessage: Imessage | undefined;
  optimisticIds: string[];
  setActionMessage: (message: Imessage | undefined) => void;
  setOptimisticAddMessage: (message: Imessage) => void;
  setOptimisticDeleteMessage: (messageId: string) => void;
  setOptimisticUpdateMessage: (message: Imessage) => void;
  setOptimisticIds: (id: string) => void;
}

export const useMessage = create<MessageState>()((set) => ({
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
}));
