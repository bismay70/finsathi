import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useTypedSelector } from "@/app/hook";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

export const ChatbotWidget = () => {
  const { accessToken } = useTypedSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hello! I am your AI Financial Assistant. How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken || ""}`
        },
        body: JSON.stringify({ query: userMessage.text })
      });
      const data = await response.json();
      const botMessage: Message = { id: (Date.now() + 1).toString(), text: data.answer || "No response.", sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { id: (Date.now() + 1).toString(), text: "Sorry, I am having trouble connecting to the server.", sender: "bot" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-green-600 hover:bg-green-700 text-white z-50 flex items-center justify-center transition-all duration-300"
        >
          <MessageCircle size={28} />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-semibold text-lg">FinSathi AI</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-green-700 h-8 w-8 rounded-full">
              <X size={18} />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "max-w-[80%] rounded-2xl p-3 text-sm",
                  msg.sender === "user"
                    ? "bg-green-600 text-white self-end rounded-tr-sm"
                    : "bg-white border border-gray-200 text-gray-800 self-start rounded-tl-sm shadow-sm"
                )}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border border-gray-200 text-gray-500 self-start rounded-2xl rounded-tl-sm p-3 text-sm shadow-sm flex gap-1">
                <span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 border-gray-200 focus-visible:ring-green-600 rounded-full bg-gray-50"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="rounded-full bg-green-600 hover:bg-green-700 shrink-0 h-10 w-10"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
