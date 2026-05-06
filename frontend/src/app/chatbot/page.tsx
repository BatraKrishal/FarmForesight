"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { sendChatMessage, ChatbotResponse } from "@/lib/api";
import { Send, Bot, User, Loader2, Sprout } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { RecommendationResult } from "@/components/RecommendationResult";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  data?: ChatbotResponse;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Namaste! I am your AI Farming Assistant. Tell me about your soil condition (N, P, K, pH) and your location, and I will recommend the best crop for you."
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMsg.content);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        data: response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again."
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-4 flex flex-col h-[calc(100vh-120px)] min-h-0">
      <div className="mb-4 shrink-0">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
          <Bot className="text-brand-500" size={32} />
          AI Farming Assistant
        </h2>
        <p className="text-slate-600">
          Ask for crop recommendations using natural language.
        </p>
      </div>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative min-h-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-slate-800 text-white" : "bg-brand-100 text-brand-600"
              }`}>
                {msg.role === "user" ? <User size={20} /> : <Sprout size={20} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-5 ${
                msg.role === "user" 
                  ? "bg-slate-800 text-white rounded-tr-sm" 
                  : "bg-white border border-slate-100 shadow-sm text-slate-800 rounded-tl-sm prose prose-slate"
              }`}>
                {msg.role === "user" ? (
                  <p>{msg.content}</p>
                ) : (
                  <div className="text-sm leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}

              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 flex-row"
            >
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                <Sprout size={20} />
              </div>
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm p-5 flex items-center gap-3 text-slate-500">
                <Loader2 className="animate-spin" size={20} />
                Thinking...
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white/50 backdrop-blur-md border-t border-slate-100">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., My soil has 90 N, 40 P, 40 K, 6.5 pH in Delhi..."
              className="flex-1 input-field"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn-primary flex items-center justify-center p-3 w-14 shrink-0"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
