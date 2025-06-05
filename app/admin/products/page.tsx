import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PlusCircle,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Package,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProductsPage() {
  const products = [
    {
      id: "PROD-001",
      name: "Nike Air Force 1 '07 Low White",
      description: "Giày thể thao Nike Air Force 1 '07 với thiết kế cổ điển, đế đệm Air và chất liệu da cao cấp.",
      categories: ["Sneakers", "Lifestyle"],
      price: 2990000,
      originalPrice: 3290000,
      sizes: ["38", "39", "40", "41", "42", "43", "44"],
      colors: ["Trắng", "Đen", "Xám", "Navy"],
      inStock: 145,
      sold: 234,
      status: "Còn hàng",
      images: ["/placeholder.svg?height=60&width=60"],
      createdAt: "2023-01-15",
      updatedAt: "2023-05-20",
      isActive: true,
      isFeatured: true,
      rating: 4.8,
    },
    {
      id: "PROD-002",
      name: "Adidas Ultraboost 22 Core Black",
      description: "Giày chạy bộ Adidas Ultraboost 22 với công nghệ đệm Boost và thân giày Primeknit co giãn.",
      categories: ["Running", "Sport"],
      price: 4290000,
      originalPrice: 4590000,
      sizes: ["39", "40", "41", "42", "43", "44", "45"],
      colors: ["Đen", "Xanh navy", "Trắng", "Xám"],
      inStock: 89,
      sold: 189,
      status: "Còn hàng",
      images: ["/placeholder.svg?height=60&width=60"],
      createdAt: "2023-02-10",
      updatedAt: "2023-05-18",
      isActive: true,
      isFeatured: true,
      rating: 4.5,
    },
    {
      id: "PROD-003",
      name: "Converse Chuck Taylor All Star Classic",
      description: "Giày Converse Chuck Taylor All Star cổ điển với thiết kế biểu tượng và đế cao su bền bỉ.",
      categories: ["Casual", "Lifestyle"],
      price: 1590000,
      originalPrice: 1790000,
      sizes: ["36", "37", "38", "39", "40", "41", "42"],
      colors: ["Đen", "Trắng", "Đỏ", "Xanh", "Vàng"],
      inStock: 12,
      sold: 156,
      status: "Sắp hết",
      images: ["/placeholder.svg?height=60&width=60"],
      createdAt: "2023-01-20",
      updatedAt: "2023-05-15",
      isActive: true,
      isFeatured: false,
      rating: 4.2,
    },
    {
      id: "PROD-004",
      name: "Vans Old Skool Classic Skate",
      description: "Giày Vans Old Skool với thiết kế đặc trưng sọc bên hông và đế waffle chống trượt.",
      categories: ["Skateboard", "Street"],
      price: 1890000,
      originalPrice: 2090000,
      sizes: ["38", "39", "40", "41", "42", "43"],
      colors: ["Đen/Trắng", "Xanh navy", "Đỏ", "Checkerboard"],
      inStock: 0,
      sold: 134,
      status: "Hết hàng",
      images: ["/placeholder.svg?height=60&width=60"],
      createdAt: "2023-03-05",
      updatedAt: "2023-05-10",
      isActive: true,
      isFeatured: false,
      rating: 4.7,
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const totalProducts = products.length
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0)
  const inStockProducts = products.filter((p) => p.inStock > 0).length
  const outOfStockProducts = products.filter((p) => p.inStock === 0).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
        <p className="text-muted-foreground">Quản lý tất cả sản phẩm giày trong hệ thống cửa hàng.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm đã tạo</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã bán</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSold}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm đã bán</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Còn hàng</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inStockProducts}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm có sẵn</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground">Cần nhập thêm</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Danh sách sản phẩm
              </CardTitle>
              <CardDescription>Quản lý tất cả sản phẩm giày trong hệ thống cửa hàng.</CardDescription>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/admin/products/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm sản phẩm mới
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Tìm kiếm theo tên, mã sản phẩm..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                  <SelectItem value="nike">Nike</SelectItem>
                  <SelectItem value="adidas">Adidas</SelectItem>
                  <SelectItem value="converse">Converse</SelectItem>
                  <SelectItem value="vans">Vans</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Tất cả ({totalProducts})</TabsTrigger>
              <TabsTrigger value="in-stock">Còn hàng ({inStockProducts})</TabsTrigger>
              <TabsTrigger value="low-stock">Sắp hết (1)</TabsTrigger>
              <TabsTrigger value="out-of-stock">Hết hàng ({outOfStockProducts})</TabsTrigger>
              <TabsTrigger value="featured">Nổi bật (2)</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[300px]">Sản phẩm</TableHead>
                  <TableHead>Giá bán</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead>Đã bán</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover border"
                          />
                          {product.isFeatured && (
                            <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-1 rounded-full">
                              ★
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm leading-tight">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.id}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.sizes.slice(0, 4).map((size) => (
                              <Badge key={size} variant="outline" className="text-xs px-1 py-0">
                                {size}
                              </Badge>
                            ))}
                            {product.sizes.length > 4 && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                +{product.sizes.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${product.inStock < 20 ? "text-red-600" : ""}`}>
                        {product.inStock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{product.sold}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-medium">{product.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "Còn hàng"
                            ? "default"
                            : product.status === "Sắp hết"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          product.status === "Còn hàng"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : product.status === "Sắp hết"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="icon" className="h-6 w-6" asChild>
                          <Link href={`/admin/products/view/${product.id}`}>
                            <Eye className="h-2.5 w-2.5" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" className="h-6 w-6" asChild>
                          <Link href={`/admin/products/edit/${product.id}`}>
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
