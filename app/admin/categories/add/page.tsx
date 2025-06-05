import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, FolderOpen } from "lucide-react"
import Link from "next/link"

export default function AddCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/categories">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Thêm danh mục mới</h1>
            <p className="text-muted-foreground">Tạo danh mục sản phẩm mới cho cửa hàng</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Hủy</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Save className="mr-2 h-4 w-4" />
            Lưu danh mục
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Thông tin danh mục
              </CardTitle>
              <CardDescription>Nhập thông tin cơ bản của danh mục sản phẩm.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tên danh mục *</Label>
                <Input id="name" placeholder="VD: Sneakers, Running, Casual..." className="font-medium" required />
                <p className="text-xs text-muted-foreground">Tên danh mục sẽ hiển thị trên website</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả danh mục *</Label>
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả ngắn gọn về danh mục..."
                  rows={4}
                  className="resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground">Mô tả sẽ giúp khách hàng hiểu rõ hơn về danh mục</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Kích thước *</Label>
                  <Select>
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Chọn kích thước" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="large">Lớn</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="small">Nhỏ</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Kích thước ảnh hưởng đến vị trí hiển thị</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Loại *</Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sport">Thể thao</SelectItem>
                      <SelectItem value="running">Chạy bộ</SelectItem>
                      <SelectItem value="casual">Thường ngày</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Phân loại giúp khách hàng tìm kiếm dễ dàng hơn</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Tên danh mục</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Sử dụng tên ngắn gọn, dễ hiểu</li>
                  <li>• Tránh sử dụng ký tự đặc biệt</li>
                  <li>• Tối đa 50 ký tự</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Mô tả</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Mô tả ngắn gọn về loại sản phẩm</li>
                  <li>• Giúp khách hàng dễ dàng tìm kiếm</li>
                  <li>• Tối đa 255 ký tự</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin bổ sung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Sau khi tạo danh mục, bạn có thể:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Thêm sản phẩm vào danh mục</li>
                  <li>• Chỉnh sửa thông tin danh mục</li>
                  <li>• Xem thống kê sản phẩm</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
