"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"

interface Chat {
  chatId: string
  contactPhone: string
  displayName: string | null
  updatedAt: string
}

interface ChatListProps {
  companyId: string
  onSelectChat: (contactPhone: string) => void
}

export default function ChatList({ companyId, onSelectChat }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(
            `https://companychats-production.up.railway.app/chats/list?companyId=${companyId}`,
            {
              method: "GET",
              mode: "cors",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                // Add any necessary authentication headers here
              },
            },
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setChats(data)
      } catch (error) {
        console.error("Error fetching chats:", error)
        if (error instanceof TypeError && error.message.includes("CORS")) {
          setError("CORS error: Unable to access the chat server. Please contact support.")
        } else {
          setError("Failed to load chats. Please try again later.")
        }
        setChats([])
      }
    }

    if (companyId) {
      fetchChats().catch((err) => {
        console.error("Failed to fetch chats:", err)
        setError("Failed to load chats. Please try again later.")
      })
    }
  }, [companyId])

  return (
      <aside className="w-64 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {chats.length === 0 && !error ? (
            <p>No chats available</p>
        ) : (
            <ul>
              {chats.map((chat) => (
                  <li
                      key={chat.chatId}
                      className="cursor-pointer p-2 hover:bg-gray-200 rounded"
                      onClick={() => onSelectChat(chat.chatId)}
                  >
                    <h3 className="font-semibold">{chat.displayName || chat.contactPhone}</h3>
                    <p className="text-sm text-gray-600">{format(new Date(chat.updatedAt), "dd/MM/yyyy HH:mm")}</p>
                  </li>
              ))}
            </ul>
        )}
      </aside>
  )
}

