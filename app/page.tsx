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
        } else {
            console.log("companyId", companyId)
        }
    }, [companyId])

    return (
        <div className="flex h-screen bg-gray-100">
            <ChatList companyId={companyId || ""} onSelectChat={setSelectedChat} />
            <main className="flex-1 p-5 overflow-hidden">
                {selectedChat ? (
                    <ChatDetail companyId={companyId || ""} contactPhone={selectedChat} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-xl text-gray-500">Selecciona un chat para ver los detalles</p>
                    </div>
                )}
            </main>
        </div>
    )
}

