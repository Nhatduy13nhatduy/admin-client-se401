import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">404 - Không tìm thấy trang</h1>
      <p className="text-muted-foreground">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <Button asChild>
        <Link href="/admin">Quay lại Dashboard</Link>
      </Button>
    </div>
  )
}
