"use client"

import LeftSidebar from "@/components/left-sidebar"
import ContentArea from "@/components/content-area"
import RightSidebar from "@/components/right-sidebar"

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--void)" }}>
      <LeftSidebar />
      <ContentArea />
      <RightSidebar />
    </div>
  )
}
