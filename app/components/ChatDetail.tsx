"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Message {
  messageId: string
  role: "human" | "assistant"
  body: string
  timestamp: number
  date: string
  status: string
  type: string
  ack: null
}

interface ChatDetailData {
  companyId: string
  companyAlias: string
  companyPhone: string
  chatId: string
  contact: {
    displayName: string | null
    phone: string
  }
  messages: Message[]
  createdAt: string
  updatedAt: string
}

interface ChatDetailProps {
  companyId: string
  contactPhone: string
}

export default function ChatDetail({ companyId, contactPhone }: ChatDetailProps) {
  const [chatDetail, setChatDetail] = useState<ChatDetailData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChatDetail = async () => {
      try {
        const response = await fetch(
            `https://companychats-production.up.railway.app/chats?companyId=${companyId}&contactPhone=${contactPhone}`,
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
          throw new Error("Failed to fetch chat details")
        }
        const data = await response.json()
        setChatDetail(data)
      } catch (error) {
        console.error("Error fetching chat details:", error)
        if (error instanceof TypeError && error.message.includes("CORS")) {
          setError("Error CORS: No se puede acceder al servidor de chat. Por favor, contacte con soporte.")
        } else {
          setError("No se pudieron cargar los detalles del chat. Por favor, inténtelo de nuevo más tarde.")
        }
      }
    }

    if (companyId && contactPhone) {
      fetchChatDetail()
    }
  }, [companyId, contactPhone])

  if (!chatDetail) {
    return (
        <div className="h-full flex items-center justify-center">
          {error ? (
              <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>
          ) : (
              <div className="text-gray-500">Cargando detalles del chat...</div>
          )}
        </div>
    )
  }

  return (
      <div className="h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-800 text-white p-4">
          <h2 className="text-xl font-semibold">Chat con {chatDetail.contact.displayName || chatDetail.contact.phone}</h2>
          <p className="text-sm text-gray-300 mt-1">
            Empresa: {chatDetail.companyAlias} | Teléfono: {chatDetail.companyPhone}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatDetail.messages.map((message) => (
              <div key={message.messageId} className={`flex ${message.role === "human" ? "justify-end" : "justify-start"}`}>
                <div
                    className={`p-3 rounded-lg max-w-[70%] ${
                        message.role === "human" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                >
                  <p>{message.body}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {format(new Date(message.date), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                  </p>
                </div>
              </div>
          ))}
        </div>
        <div className="border-t border-gray-200 p-4">
          <form className="flex space-x-2">
            <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </form>
        </div>
      </div>
  )
}

