"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Sparkles, Settings, Trash2, Send, X, Menu, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

// Sample conversation for initial chat
const sampleConversation = [
  { id: "1", role: "user", content: "Hello, I'd like to practice mindfulness. Can you guide me?" },
  {
    id: "2",
    role: "assistant",
    content:
      "Of course. Mindfulness is about being present in the moment. Let's start with a simple breathing exercise. Find a comfortable position and focus on your breath for a few minutes. Notice the sensation of air flowing in and out.",
  },
  { id: "3", role: "user", content: "That was helpful. How can I incorporate mindfulness into my daily routine?" },
  {
    id: "4",
    role: "assistant",
    content:
      "I'm glad it helped. To incorporate mindfulness into your daily life, try these simple practices:\n\n1. Start your day with a 5-minute meditation\n2. Take mindful breaks between tasks\n3. Practice mindful eating by savoring each bite\n4. End your day with a gratitude reflection\n\nRemember, consistency is more important than duration.",
  },
]

export default function ZenChat() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeChat, setActiveChat] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [chats, setChats] = useState([
    { id: 1, title: "Morning Reflection", date: "Today", messages: sampleConversation },
    { id: 2, title: "Creative Ideas", date: "Yesterday", messages: [] },
    { id: 3, title: "Work Planning", date: "Yesterday", messages: [] },
    { id: 4, title: "Travel Inspiration", date: "Mar 2", messages: [] },
    { id: 5, title: "Book Recommendations", date: "Feb 28", messages: [] },
  ])

  const { messages, input, handleInputChange, setMessages } = useChat({
    initialMessages: chats[0].messages,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { id: String(Date.now()), role: "user", content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    saveChatHistory(activeChat, newMessages)

    handleInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const aiResponse = { id: String(Date.now() + 1), role: "assistant", content: generateFakeResponse(input) }
    const updatedMessages = [...newMessages, aiResponse]
    setMessages(updatedMessages)
    saveChatHistory(activeChat, updatedMessages)
    setIsLoading(false)
  }

  const generateFakeResponse = (userInput: string) => {
    const responses = [
      "That's an interesting perspective. Have you considered looking at it from a different angle?",
      "I see where you're coming from. Let's explore that idea further.",
      "Your thoughts on this matter are quite insightful. Here's another way to approach it...",
      "That's a great question. The answer might be more nuanced than you'd expect.",
      "I appreciate you sharing that. It reminds me of a concept in mindfulness practice...",
      "Your input is valuable. Let's break this down step by step.",
      "That's a complex topic. Perhaps we can simplify it by focusing on one aspect at a time.",
      "I'm glad you brought that up. It's important to consider various viewpoints on this subject.",
      "Your question touches on a fundamental aspect of personal growth. Let's delve deeper.",
      "That's an excellent point. It relates to several key principles we've discussed before.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const saveChatHistory = (chatId: number, newMessages: any[]) => {
    setChats((prevChats) => prevChats.map((chat) => (chat.id === chatId ? { ...chat, messages: newMessages } : chat)))
  }

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const clearChat = () => {
    setMessages([])
    saveChatHistory(activeChat, [])
  }

  const handleNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      title: `New Chat ${chats.length + 1}`,
      date: "Just now",
      messages: [],
    }
    setChats([newChat, ...chats])
    setActiveChat(newChat.id)
    setMessages([])
  }

  const handleChatSelect = (id: number) => {
    setActiveChat(id)
    const selectedChat = chats.find((chat) => chat.id === id)
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <AnimatePresence mode="wait">
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: sidebarOpen ? 280 : 0, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed md:relative z-20 h-full border-r border-border/10 bg-background/95 backdrop-blur-sm overflow-hidden"
        >
          <div className="flex flex-col h-full w-[280px]">
            <div className="flex items-center justify-between p-4 border-b border-border/10">
              {sidebarOpen && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
                    aria-label="Close sidebar"
                  >
                    <Menu className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <h1 className="text-lg font-medium">Zen Chat</h1>
                </div>
              )}
            </div>
            <div className="p-4 border-b border-border/10">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">New Chat</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <div className="px-2 space-y-1">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-200",
                      activeChat === chat.id ? "bg-primary/10 text-primary" : "hover:bg-muted/50 text-foreground/80",
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Sparkles className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
                      <span className="truncate">{chat.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{chat.date}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-border/10">
              <button
                onClick={() => setSettingsOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted/50 transition-colors duration-200"
              >
                <Settings className="h-4 w-4 opacity-70" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      <motion.div
        className="flex-1 flex flex-col h-full relative"
        animate={{ marginLeft: sidebarOpen ? 280 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-border/10 bg-background/80 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-2">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
            {!sidebarOpen && <h1 className="text-lg font-medium">Zen Chat</h1>}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => clearChat()}
              className="p-2 rounded-full hover:bg-muted transition-colors duration-200"
              aria-label="Clear chat"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="w-full max-w-3xl px-4">
            {messages.length === 0 ? (
              <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
                <Sparkles className="h-8 w-8 mb-2" />
                <h2 className="text-xl font-medium">Welcome to Zen Chat</h2>
                <p className="max-w-sm">
                  A minimalist space for thoughtful conversations. Begin your journey with a simple hello.
                </p>
              </div>
            ) : (
              <div className="py-8 space-y-6">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3",
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <div className="whitespace-pre-line">{message.content}</div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-muted">
                      <div className="flex space-x-1">
                        <span className="animate-bounce">•</span>
                        <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                          •
                        </span>
                        <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                          •
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </main>

        {/* Input Area */}
        <div className="border-t border-border/10 p-4 bg-background/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="w-full py-3 px-4 bg-muted/50 rounded-full focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200"
              />
              {isLoading && (
                <button
                  type="button"
                  onClick={() => setIsLoading(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Settings Panel */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Settings</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1 rounded-full hover:bg-muted transition-colors duration-200"
                aria-label="Close settings"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Theme</h3>
                <div className="flex space-x-2">
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm",
                        theme === t ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
                      )}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

