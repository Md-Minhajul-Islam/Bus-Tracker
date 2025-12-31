import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MESSAGE_API_END_POINT } from "../utils/constants";
import { toast } from "sonner";
import { socket } from "../socket/socket";
import { addMessage } from "../redux/messageSlice";
import photo from "/user-profile-photo.jpg";

export default function Chatbox() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const { messages } = useSelector((store) => store.message);
  const { user } = useSelector((store) => store.auth);
  const bottomRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleReceive = (newMessage) => {
      dispatch(addMessage(newMessage));
    };

    socket.on("receive_message", handleReceive);

    return () => socket.off("receive_message", handleReceive);
  }, [dispatch]);

  useEffect(() => {
    if (!open) return;

    setTimeout(() => {
      bottomRef.current?.scrollIntoView();
    }, 0);
  }, [open, messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post(
        `${MESSAGE_API_END_POINT}`,
        { text: message },
        {
          withCredentials: true,
        }
      );
      setMessage("");
    } catch (error) {
      // console.log(error.response?.data?.message);
      toast.error("Failed to sent messsage");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Floating Button */}
      <PopoverTrigger asChild>
        <Button
          className="
            absolute bottom-6 right-4 md:right-15 z-1000
            w-10 h-10 rounded-full
            bg-indigo-600 hover:bg-indigo-700
            cursor-pointer
          "
        >
          <MessageCircle size={22} />
        </Button>
      </PopoverTrigger>

      {/* Chat Panel */}
      <PopoverContent
        align="end"
        sideOffset={5}
        className="
          w-[340px] p-0
          bg-slate-900/95 backdrop-blur
          border border-slate-800
          rounded-2xl
          shadow-2xl
        "
      >
        <div className="flex flex-col h-[420px] text-white">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-xs text-slate-400">Online</h3>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 overflow-auto">
            <div className="flex flex-col gap-3 px-3 py-2">
              {messages?.length === 0 && (
                <p className="text-center text-xs text-slate-500 mt-6">
                  Start a conversation 👋
                </p>
              )}

              {messages?.map((msg, i) => {
                const isMe = msg?.sender?._id === user?._id;
                return (
                  <div
                    key={i}
                    className={`flex flex-col gap-1 ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`flex items-end gap-2 ${
                        isMe ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {!isMe && (
                        <img
                          src={msg?.sender?.profilePhoto || photo}
                          alt="avatar"
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      )}

                      <div
                        className={`max-w-50 px-3 py-2 rounded-2xl text-sm shadow
              ${
                isMe
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-slate-800 text-slate-200 rounded-bl-sm"
              }
            `}
                      >
                        <span className="whitespace-pre-line wrap-break-word text-justify">
                          {msg?.text}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[8px] text-slate-400 ${
                        isMe ? "pr-2" : "pl-9"
                      }`}
                    >
                      {new Date(msg?.createdAt).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="flex items-center gap-2 p-3 border-t border-slate-800">
            <Textarea
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="
                flex-1 resize-none
                bg-slate-800
                border-slate-700
                text-white
                rounded-xl
                overflow-hidden
                h-5
                p-3
              "
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <Button
              size="icon"
              onClick={sendMessage}
              className="
                h-10 w-10 rounded-xl
                bg-indigo-600 hover:bg-indigo-700
                shadow-md cursor-pointer
              "
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
