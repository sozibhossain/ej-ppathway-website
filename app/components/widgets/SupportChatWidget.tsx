"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "../../lib/api";
import { getSocket } from "../../lib/socket";
import { useAuthUser } from "../layout/UserMenu";

type ChatMessage = {
  _id: string;
  sender: string | { _id?: string; name?: string };
  text?: string;
  attachments?: string[];
  createdAt?: string;
};

const AUTO_REPLY_ID = "local-autoreply";
const AUTO_REPLY_TEXT =
  "Thanks for reaching out! 🙏 Our support team has received your message and will get back to you as soon as possible.";

function senderId(m: ChatMessage): string | undefined {
  return typeof m.sender === "string" ? m.sender : m.sender?._id;
}

export function SupportChatWidget() {
  const { user, ready } = useAuthUser();

  const [open, setOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState("");
  const [unavailable, setUnavailable] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const autoReplied = useRef(false);

  const appendMessage = useCallback((m: ChatMessage) => {
    setMessages((prev) => (prev.some((x) => x._id === m._id) ? prev : [...prev, m]));
  }, []);

  // Bootstrap the support conversation the first time the panel is opened.
  useEffect(() => {
    if (!open || initialized.current || !user) return;
    initialized.current = true;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const created = await api.post<{ _id: string }>("/chats/admin", {});
        const id = created.data?._id;
        if (!id) throw new Error("No chat");
        if (cancelled) return;
        setChatId(id);

        const hist = await api.get<ChatMessage[]>(`/chats/${id}/messages`, { limit: 50 });
        if (cancelled) return;
        setMessages(hist.data || []);

        api.post(`/chats/${id}/read`, {}).catch(() => {});
      } catch (err) {
        if (cancelled) return;
        const status = err instanceof ApiError ? err.status : 0;
        if (status === 404) setUnavailable(true);
        else setError("Couldn't start the chat. Please try again.");
        initialized.current = false; // allow retry on reopen
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, user]);

  // Realtime: join the chat room and listen for new messages (also while closed,
  // so the launcher can show an unread badge when support replies).
  useEffect(() => {
    if (!chatId || !user) return;
    const socket = getSocket();
    if (!socket) return;

    const join = () => socket.emit("chat:join", { chatId });
    const onMessage = (payload: { chatId: string; message: ChatMessage }) => {
      if (payload?.chatId !== chatId) return;
      appendMessage(payload.message);
      const fromOther = senderId(payload.message) !== user._id;
      if (open) {
        api.post(`/chats/${chatId}/read`, {}).catch(() => {});
      } else if (fromOther) {
        setUnread((u) => u + 1);
      }
    };

    join();
    socket.on("connect", join);
    socket.on("chat:new_message", onMessage);

    return () => {
      socket.off("connect", join);
      socket.off("chat:new_message", onMessage);
    };
  }, [chatId, open, user, appendMessage]);

  // Opening the panel clears the unread badge and marks the conversation read.
  useEffect(() => {
    if (open) {
      setUnread(0);
      if (chatId) api.post(`/chats/${chatId}/read`, {}).catch(() => {});
    }
  }, [open, chatId]);

  // Auto-scroll to the latest message.
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading, typing]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !chatId || sending) return;
    setSending(true);
    setError("");
    try {
      const r = await api.post<ChatMessage>(`/chats/${chatId}/messages`, { text });
      if (r.data) appendMessage(r.data);
      setInput("");

      // First time a customer writes in, acknowledge automatically so they know
      // the message was received (the real reply comes from an admin).
      if (!autoReplied.current) {
        autoReplied.current = true;
        setTyping(true);
        window.setTimeout(() => {
          setTyping(false);
          appendMessage({
            _id: AUTO_REPLY_ID,
            sender: { _id: "support-system", name: "Support" },
            text: AUTO_REPLY_TEXT,
            createdAt: new Date().toISOString(),
          });
        }, 1100);
      }
    } catch {
      setError("Message failed to send.");
    } finally {
      setSending(false);
    }
  };

  // Only logged-in customers get the support widget.
  if (!ready || !user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div className="w-[90vw] max-w-sm h-[70vh] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-br from-[#0e7490] to-[#064e63] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative h-9 w-9 rounded-full bg-white/20 inline-flex items-center justify-center shrink-0">
                <HeadsetIcon size={18} />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0e7490]" />
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-sm leading-tight">Customer Support</div>
                <div className="text-[11px] text-teal-100 leading-tight inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online · replies in a few minutes
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Minimize chat"
              className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-2.5 bg-[#f7fbfd]">
            {loading ? (
              <div className="text-center text-sm text-slate-400 mt-6">Starting chat…</div>
            ) : unavailable ? (
              <div className="text-center text-sm text-slate-500 mt-6 px-4">
                Support is currently unavailable. Please email us and we&apos;ll get back to you.
              </div>
            ) : (
              <>
                {messages.length === 0 && (
                  <div className="text-center text-sm text-slate-400 mt-6 px-4">
                    Hi {user.name?.split(" ")[0] || "there"}! 👋 How can our support team help you today?
                  </div>
                )}
                {messages.map((m) => {
                  const mine = senderId(m) === user._id;
                  const isAuto = m._id === AUTO_REPLY_ID;
                  return (
                    <div key={m._id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words ${
                          mine
                            ? "bg-[#0e7490] text-white rounded-br-sm"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                        }`}
                      >
                        {m.text}
                        {(m.attachments || []).map((a, i) => (
                          <a
                            key={i}
                            href={a}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block underline text-xs mt-1 ${mine ? "text-teal-50" : "text-[#0e7490]"}`}
                          >
                            Attachment {i + 1}
                          </a>
                        ))}
                      </div>
                      {isAuto && (
                        <span className="text-[10px] text-slate-400 mt-0.5 px-1">Automated reply</span>
                      )}
                    </div>
                  );
                })}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-3.5 py-3 inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.2s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Composer */}
          {!unavailable && (
            <form onSubmit={send} className="border-t border-slate-100 p-2.5 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message…"
                className="flex-1 h-10 px-3 rounded-full bg-slate-100 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#0e7490]/20"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={sending || loading || !input.trim()}
                aria-label="Send message"
                className="h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-full bg-[#0e7490] text-white hover:bg-[#085a72] disabled:opacity-50 transition-colors"
              >
                <SendIcon size={18} />
              </button>
            </form>
          )}
          {error && <div className="px-3 pb-2 text-xs text-red-600">{error}</div>}
        </div>
      )}

      {/* Launcher — clearly a SUPPORT chat (headset + label + online dot) */}
      {open ? (
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Minimize support chat"
          className="h-14 w-14 rounded-full bg-[#0e7490] text-white shadow-xl hover:bg-[#085a72] transition-colors inline-flex items-center justify-center"
        >
          <ChevronDownIcon size={26} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open support chat"
          className="relative inline-flex items-center gap-2.5 h-14 pl-4 pr-5 rounded-full bg-[#0e7490] text-white shadow-xl hover:bg-[#085a72] transition-colors"
        >
          <span className="relative inline-flex">
            <HeadsetIcon size={24} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0e7490]" />
          </span>
          <span className="font-semibold text-sm">Support</span>
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold inline-flex items-center justify-center border-2 border-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

function HeadsetIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M18 19a2 2 0 0 1-2 2h-3" />
      <rect x="2" y="13" width="4" height="7" rx="1.2" />
      <rect x="18" y="13" width="4" height="7" rx="1.2" />
    </svg>
  );
}

function CloseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SendIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
