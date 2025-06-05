"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">Đã xảy ra lỗi</h1>
      <p className="text-muted-foreground">Đã có lỗi xảy ra khi tải trang này.</p>
      <Button onClick={() => reset()}>Thử lại</Button>
    </div>
  )
}
