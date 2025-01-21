"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

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
          setError("Error CORS: No se puede acceder al servidor de chat. Por favor, contacte con soporte.")
        } else {
          setError("No se pudieron cargar los chats. Por favor, inténtelo de nuevo más tarde.")
        }
        setChats([])
      }
    }

    if (companyId) {
      fetchChats().catch((err) => {
        console.error("Failed to fetch chats:", err)
        setError("No se pudieron cargar los chats. Por favor, inténtelo de nuevo más tarde.")
      })
    }
  }, [companyId])

  return (
      <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Chats</h2>
        </div>
        {error && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
        )}
        {chats.length === 0 && !error ? (
            <div className="p-4 text-gray-500">No hay chats disponibles</div>
        ) : (
            <ul className="divide-y divide-gray-200">
              {chats.map((chat) => (
                  <li
                      key={chat.chatId}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                      onClick={() => onSelectChat(chat.chatId)}
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{chat.displayName || chat.contactPhone}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(new Date(chat.updatedAt), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                      </p>
                    </div>
                  </li>
              ))}
            </ul>
        )}
      </aside>
  )
}

