import {
  Send,
  Sparkles,
  User,
  Trash2,
  BrainCircuit,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import Layout from "../components/Layout";
import api from "../services/api";

export default function ProjectChat() {
  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "projectChatHistory"
          ) || "[]"
        );
      } catch {
        return [];
      }
    });

  const bottomRef = useRef(null);

  const projectData =
    localStorage.getItem(
      "projectData"
    ) || "";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    const updated =
      [...messages, userMessage];

    setMessages(updated);
    setMessage("");
    setLoading(true);

    try {
      const response =
        await api.post(
          "/viva/chat",
          {
            projectData,
            message: text,
            history: updated,
          }
        );

      const aiMessage = {
        role: "assistant",
        content:
          response.data.message ||
          "I couldn't generate a response.",
      };

      const finalMessages = [
        ...updated,
        aiMessage,
      ];

      setMessages(finalMessages);

      localStorage.setItem(
        "projectChatHistory",
        JSON.stringify(
          finalMessages
        )
      );
    } catch (error) {
      console.error(error);

      const errorMessage = {
        role: "assistant",
        content:
          "I couldn't connect to the project AI right now. Please try again.",
      };

      setMessages([
        ...updated,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);

    localStorage.removeItem(
      "projectChatHistory"
    );
  };

  return (
    <Layout>
      <div className="
      ProjectChat content
      w-full
      space-y-6
      relative
      -top-[450px]
      max-lg:top-0">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/25 font-bold">
              Project Intelligence
            </p>

            <h1 className="text-4xl sm:text-5xl font-black mt-2">
              Project AI
            </h1>

            <p className="mt-3 text-white/40">
              Discuss your project with an
              education-focused AI assistant.
            </p>
          </div>

          <button
            onClick={clearChat}
            className="glass-button !text-red-300"
          >
            <Trash2 size={16} />
            <span className="hidden sm:block">
              Clear
            </span>
          </button>
        </div>

        <div
          className="
            glass-floating
            rounded-[32px]
            overflow-hidden
          "
        >
          <div className="p-5 border-b border-white/[0.06] flex items-center gap-3">
            <div className="ai-orb !w-11 !h-11 !rounded-[15px]">
              <BrainCircuit size={19} />
            </div>

            <div>
              <p className="font-bold">
                VivaAI Project Assistant
              </p>

            <div className="mx-4 mt-3 rounded-3xl border border-amber-400/15 bg-amber-400/[0.04] px-4 py-3">
    <div className="flex items-start gap-2">
    <span className="text-amber-300 text-sm mt-0.3">
      ⚠️
    </span>

    <div>
      <p className="text-xs font-bold text-amber-200/90">
        AI Accuracy Notice
      </p>

      <p className="mt-1 text-xs leading-5 text-white/45">
        AI-generated answers may contain mistakes or inaccuracies.
        Use VivaAI as a preparation assistant, not as the final
        source of truth. Always verify important information.
      </p>
    </div>
  </div>
</div>

              <p className="text-xs text-white/40 mt-5">
                Academic project discussion
              </p>
            </div>
          </div>

          <div className="min-h-[520px] max-h-[600px] overflow-y-auto p-5 sm:p-7 space-y-5">
            {messages.length === 0 && (
              <div className="min-h-[430px] flex items-center justify-center text-center">
                <div className="max-w-md">
                  <div className="ai-orb ai-pulse mx-auto">
                    <Sparkles size={25} />
                  </div>

                  <h2 className="text-2xl font-black mt-6">
                    Ask about your project.
                  </h2>

                  <p className="mt-3 text-sm text-white/35 leading-6">
                    Ask about architecture,
                    database design, APIs,
                    implementation, debugging,
                    security or concepts from
                    your project.
                  </p>
                </div>
              </div>
            )}

            {messages.map(
              (item, index) => {
                const user =
                  item.role ===
                  "user";

                return (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className={`flex ${
                      user
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`
                        flex
                        gap-3
                        max-w-[88%]
                        ${
                          user
                            ? "flex-row-reverse"
                            : ""
                        }
                      `}
                    >
                      <div
                        className={`
                          shrink-0
                          w-9
                          h-9
                          rounded-[13px]
                          flex
                          items-center
                          justify-center
                          ${
                            user
                              ? "bg-white/[0.08]"
                              : "ai-gradient"
                          }
                        `}
                      >
                        {user ? (
                          <User size={16} />
                        ) : (
                          <Sparkles
                            size={16}
                          />
                        )}
                      </div>

                      <div
                        className={`
                          rounded-[20px]
                          px-4
                          py-3
                          text-sm
                          leading-6
                          ${
                            user
                              ? "bg-blue-500/15 border border-blue-400/10"
                              : "glass-card"
                          }
                        `}
                      >
                        {item.content}
                      </div>
                    </div>
                  </motion.div>
                );
              }
            )}

            {loading && (
              <div className="flex gap-3">
                <div className="ai-orb !w-9 !h-9 !rounded-[13px]">
                  <Sparkles size={15} />
                </div>

                <div className="glass-card px-5 py-4 rounded-[20px]">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-white/[0.06]">
            <div className="glass-card rounded-[22px] p-2 flex items-end gap-2">
              <textarea
                rows={1}
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                      "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Discuss your project..."
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  resize-none
                  px-3
                  py-3
                  text-sm
                  text-white
                  placeholder:text-white/20
                "
              />

              <button
                onClick={sendMessage}
                disabled={
                  loading ||
                  !message.trim()
                }
                className="
                  ai-button
                  !w-11
                  !h-11
                  !min-h-11
                  !p-0
                  !rounded-[15px]
                "
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}