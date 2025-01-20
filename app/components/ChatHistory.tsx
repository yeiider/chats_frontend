import type { Chat, Message } from "../types"

interface ChatHistoryProps {
  chat: Chat
}

export function ChatHistory({ chat }: ChatHistoryProps) {
  // En una aplicación real, obtendrías este historial de una API
  const messages: Message[] = [
    { id: "1", sender: "Usuario", content: "Hola, ¿cómo estás?" },
    { id: "2", sender: "Bot", content: "Hola! Estoy bien, ¿en qué puedo ayudarte?" },
  ]

  return (
    <div className="flex-1 p-4">
      <h2 className="text-xl font-bold mb-4">{chat.name}</h2>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded-lg ${message.sender === "Usuario" ? "bg-blue-100 ml-auto" : "bg-gray-100"}`}
          >
            <p className="font-semibold">{message.sender}</p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

