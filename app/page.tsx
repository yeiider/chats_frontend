"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ChatList from "./components/ChatList"
import ChatDetail from "./components/ChatDetail"

export default function Home() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const companyId = searchParams.get("companyId")

  useEffect(() => {
    if (!companyId) {
      console.error("Company ID is missing from URL parameters")
    }else {
        console.log("companyId", companyId)
    }
  }, [companyId])

  return (
    <>
      <ChatList companyId={companyId || ""} onSelectChat={setSelectedChat} />
      <main className="flex-1 p-5">
        {selectedChat ? (
          <ChatDetail companyId={companyId || ""} contactPhone={selectedChat} />
        ) : (
          <p>Select a chat to view details</p>
        )}
      </main>
    </>
  )
}

