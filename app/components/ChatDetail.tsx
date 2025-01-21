"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"

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
          setError("CORS error: Unable to access the chat server. Please contact support.")
        } else {
          setError("Failed to load chat details. Please try again later.")
        }
      }
    }

    if (companyId && contactPhone) {
      fetchChatDetail()
    }
  }, [companyId, contactPhone])

  if (!chatDetail) {
    return (
        <>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div>Loading chat details...</div>
        </>
    )
  }

  return (
      <div className="max-w-4xl mx-auto">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <h2 className="text-2xl font-bold mb-4">
          Chat with {chatDetail.contact.displayName || chatDetail.contact.phone}
        </h2>
        <div className="bg-white shadow-md rounded-lg p-4 max-h-[90vh] overflow-y-auto">
          <div className="mb-4">
            <p>
              <strong>Company:</strong> {chatDetail.companyAlias}
            </p>
            <p>
              <strong>Company Phone:</strong> {chatDetail.companyPhone}
            </p>
          </div>
          <div className="space-y-4">
            {chatDetail.messages.map((message) => (
                <div
                    key={message.messageId}
                    className={`p-3 rounded-lg ${
                        message.role === "human" ? "bg-blue-100 ml-auto" : "bg-gray-100"
                    } max-w-[70%]`}
                >
                  <p>{message.body}</p>
                  <p className="text-xs text-gray-500 mt-1">{format(new Date(message.date), "dd/MM/yyyy HH:mm:ss")}</p>
                </div>
            ))}
          </div>
        </div>
      </div>
  )
}

