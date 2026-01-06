import React, { useState, useRef, useEffect } from "react";
import { getChatbotResponse } from "../services/aiService";
import Button from "./common/Button";
import { PaperAirplaneIcon } from "./common/Icons";
import { Student } from "../types";

interface Message {
  text: string;
  sender: "user" | "ai";
}

interface MentorChatProps {
  student: Student;
}

const MentorChat: React.FC<MentorChatProps> = ({ student }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Hello ${
        student.name.split(" ")[0]
      }! I'm your AI Mentor. I can help with internship recommendations, resume feedback, mock interviews, and more. How can I assist you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (textToSend.trim() === "" || isLoading) return;

    const userMessage: Message = { text: textToSend, sender: "user" };
    const historyForAPI = [...messages]; // Capture history before new user message

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInput("");
    setIsLoading(true);

    // AI Mentor (Gemini service) se response get karte hain, student object aur chat history ke saath.
    // Getting a response from the AI Mentor (Gemini service), passing the student object and chat history.
    const aiResponseText = await getChatbotResponse(
      textToSend,
      historyForAPI,
      student
    );
    const aiMessage: Message = { text: aiResponseText, sender: "ai" };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const suggestionChips = [
    "Recommend an internship for me",
    "Help improve my resume",
    "Give me mock interview questions",
    "What new skills should I learn?",
  ];

  return (
    <div className="flex flex-col h-96">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-800/50 rounded-t-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                msg.sender === "user"
                  ? "bg-brand-700 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask your AI mentor..."
            className="flex-grow px-3 py-2 bg-transparent focus:outline-none text-gray-900 dark:text-white"
          />
          <Button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            size="sm"
            className="!px-3"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </Button>
        </div>
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
            {suggestionChips.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSend(suggestion)}
                disabled={isLoading}
                className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorChat;
