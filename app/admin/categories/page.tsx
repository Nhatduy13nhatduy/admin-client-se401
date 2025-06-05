import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Eye, Pencil, Trash2, Search, FolderOpen, Package } from "lucide-react"
import Link from "next/link"

export default function CategoriesPage() {
  const categories = [
    {
      id: 1,
      name: "Sneakers",
      description: "Giày thể thao thời trang",
      products: 45,
      size: "Lớn",
      type: "Thể thao",
      created_at: "2023-01-15T08:30:00Z",
      updated_at: "2024-12-01T10:15:00Z",
    },
    {
      id: 2,
      name: "Running",
      description: "Giày chạy bộ chuyên dụng",
      products: 32,
      size: "Trung bình",
      type: "Chạy bộ",
      created_at: "2023-01-20T10:15:00Z",
      updated_at: "2024-11-28T14:30:00Z",
    },
    {
      id: 3,
      name: "Casual",
      description: "Giày thường ngày thoải mái",
      products: 28,
      size: "Trung bình",
      type: "Thường ngày",
      created_at: "2023-02-01T14:20:00Z",
      updated_at: "2024-11-25T09:45:00Z",
    },
    {
      id: 4,
      name: "Skateboard",
      description: "Giày trượt ván chuyên dụng",
      products: 15,
      size: "Nhỏ",
      type: "Thể thao",
      created_at: "2023-02-10T09:45:00Z",
      updated_at: "2024-11-20T16:20:00Z",
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const totalCategories = categories.length
  const totalProducts = categories.reduce((sum, c) => sum + c.products, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h1>
        <p className="text-muted-foreground">Quản lý tất cả danh mục sản phẩm trong hệ thống cửa hàng.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng danh mục</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">Danh mục đã tạo</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Trong tất cả danh mục</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trung bình</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalProducts / totalCategories)}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm/danh mục</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Danh sách danh mục
              </CardTitle>
              <CardDescription>Quản lý tất cả danh mục sản phẩm trong hệ thống.</CardDescription>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/admin/categories/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm danh mục
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Tìm kiếm danh mục..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Tất cả ({totalCategories})</TabsTrigger>
              <TabsTrigger value="active">Có sản phẩm ({categories.filter((c) => c.products > 0).length})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Số sản phẩm</TableHead>
                  <TableHead>Kích thước</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Ngày cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{category.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{category.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {category.products}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {category.size}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {category.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(category.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="icon" className="h-6 w-6" asChild>
                          <Link href={`/admin/categories/view/${category.id}`}>
                            <Eye className="h-2.5 w-2.5" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" className="h-6 w-6" asChild>
                          <Link href={`/admin/categories/edit/${category.id}`}>
                            <Pencil className="h-2.5 w-2.5" />
                          </Link>
                        </Button>
                        <Button variant="destructive" size="icon" className="h-6 w-6">
                          <Trash2 className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
