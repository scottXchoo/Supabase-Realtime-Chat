import React, { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Imessage, useMessage } from "@/lib/store/messages";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function DeleteAlert() {
  const { actionMessage, setOptimisticDeleteMessage } = useMessage(
    (state) => state
  );

  const handleDeleteMessage = async () => {
    const supabase = supabaseBrowser();
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", actionMessage?.id!);

    setOptimisticDeleteMessage(actionMessage?.id!);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Message deleted successfully!");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete"></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function EditAlert() {
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { actionMessage, setOptimisticUpdateMessage } = useMessage(
    (state) => state
  );

  const handleEditMessage = async () => {
    const supabase = supabaseBrowser();
    const text = inputRef.current.value.trim();

    if (text) {
      setOptimisticUpdateMessage({
        ...actionMessage,
        text,
        is_edit: true,
      } as Imessage);

      const { error } = await supabase
        .from("messages")
        .update({
          text,
          is_edit: true,
        })
        .eq("id", actionMessage?.id!);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Message updated successfully!");
      }
      document.getElementById("trigger-edit")?.click(); // close Alert 창
    } else {
      document.getElementById("trigger-edit")?.click(); // close Alert 창
      document.getElementById("trigger-delete")?.click(); // 빈 문자열이면, 삭제 창 open
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="trigger-edit"></button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <Input defaultValue={actionMessage?.text} ref={inputRef} />
        <DialogFooter>
          <Button type="submit" onClick={handleEditMessage}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
