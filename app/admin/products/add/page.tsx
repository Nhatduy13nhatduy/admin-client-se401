import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Upload, Plus, X, ImageIcon, Tag, Package, Palette } from "lucide-react"
import Link from "next/link"

export default function AddProductPage() {
  const availableSizes = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"]
  const availableColors = [
    { name: "Đen", value: "black", hex: "#000000" },
    { name: "Trắng", value: "white", hex: "#FFFFFF" },
    { name: "Xám", value: "gray", hex: "#808080" },
    { name: "Đỏ", value: "red", hex: "#FF0000" },
    { name: "Xanh navy", value: "navy", hex: "#000080" },
    { name: "Xanh dương", value: "blue", hex: "#0000FF" },
    { name: "Nâu", value: "brown", hex: "#8B4513" },
    { name: "Vàng", value: "yellow", hex: "#FFFF00" },
  ]

  const categories = [
    { id: "sneakers", name: "Sneakers", description: "Giày thể thao thời trang" },
    { id: "running", name: "Running", description: "Giày chạy bộ" },
    { id: "casual", name: "Casual", description: "Giày thường ngày" },
    { id: "skateboard", name: "Skateboard", description: "Giày trượt ván" },
    { id: "lifestyle", name: "Lifestyle", description: "Giày phong cách sống" },
    { id: "basketball", name: "Basketball", description: "Giày bóng rổ" },
    { id: "football", name: "Football", description: "Giày bóng đá" },
    { id: "tennis", name: "Tennis", description: "Giày tennis" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Thêm sản phẩm mới</h1>
            <p className="text-muted-foreground">Tạo sản phẩm giày mới cho cửa hàng</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Lưu nháp</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Save className="mr-2 h-4 w-4" />
            Lưu & Xuất bản
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Thông tin cơ bản
          </TabsTrigger>
          <TabsTrigger value="variants" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Phân loại
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Hình ảnh
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Giá & Kho
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin sản phẩm</CardTitle>
                  <CardDescription>Nhập thông tin cơ bản của sản phẩm giày.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tên sản phẩm *</Label>
                      <Input id="name" placeholder="VD: Nike Air Force 1 '07 Low White" className="font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">Mã sản phẩm (SKU) *</Label>
                      <Input id="sku" placeholder="VD: PROD-001" className="font-mono" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả sản phẩm *</Label>
                    <Textarea
                      id="description"
                      placeholder="Nhập mô tả chi tiết về sản phẩm, chất liệu, tính năng đặc biệt..."
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danh mục sản phẩm</CardTitle>
                  <CardDescription>Chọn các danh mục phù hợp cho sản phẩm.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <Checkbox id={category.id} />
                        <div className="flex-1">
                          <Label htmlFor={category.id} className="font-medium cursor-pointer">
                            {category.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Phân loại sản phẩm
              </CardTitle>
              <CardDescription>Quản lý các phân loại về size và màu sắc của sản phẩm.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Size có sẵn</Label>
                <div className="grid grid-cols-6 gap-2 md:grid-cols-12">
                  {availableSizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox id={`size-${size}`} />
                      <Label htmlFor={`size-${size}`} className="text-sm font-medium cursor-pointer">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Màu sắc có sẵn</Label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {availableColors.map((color) => (
                    <div key={color.value} className="flex items-center space-x-2 p-2 border rounded-lg">
                      <Checkbox id={`color-${color.value}`} />
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      <Label htmlFor={`color-${color.value}`} className="text-sm cursor-pointer">
                        {color.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Bảng phân loại chi tiết</Label>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left font-medium">Size</th>
                          <th className="p-3 text-left font-medium">Màu sắc</th>
                          <th className="p-3 text-left font-medium">SKU</th>
                          <th className="p-3 text-left font-medium">Số lượng</th>
                          <th className="p-3 text-left font-medium">Giá (VNĐ)</th>
                          <th className="p-3 text-left font-medium">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3">39</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-black border"></div>
                              Đen
                            </div>
                          </td>
                          <td className="p-3">
                            <Input defaultValue="PROD-001-39-BLACK" className="h-8 text-sm" />
                          </td>
                          <td className="p-3">
                            <Input type="number" defaultValue="10" className="h-8 w-20 text-sm" />
                          </td>
                          <td className="p-3">
                            <Input type="number" defaultValue="2990000" className="h-8 w-32 text-sm" />
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">40</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-black border"></div>
                              Đen
                            </div>
                          </td>
                          <td className="p-3">
                            <Input defaultValue="PROD-001-40-BLACK" className="h-8 text-sm" />
                          </td>
                          <td className="p-3">
                            <Input type="number" defaultValue="15" className="h-8 w-20 text-sm" />
                          </td>
                          <td className="p-3">
                            <Input type="number" defaultValue="2990000" className="h-8 w-32 text-sm" />
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm phân loại mới
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Hình ảnh sản phẩm
              </CardTitle>
              <CardDescription>Tải lên hình ảnh cho sản phẩm giày. Hình đầu tiên sẽ là hình đại diện.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Hình ảnh chính *</Label>
                <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Kéo thả hoặc click để tải lên</p>
                      <p className="text-xs text-muted-foreground">Hỗ trợ PNG, JPG, WEBP (Tối đa 10MB)</p>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Chọn file
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Hình ảnh bổ sung</Label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="aspect-square">
                      <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                        <div className="flex flex-col items-center gap-1 text-center">
                          <Plus className="h-6 w-6 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Thêm ảnh</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Hướng dẫn chụp ảnh</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-medium text-blue-900 mb-2">Ảnh chính</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Chụp từ góc 3/4 để thể hiện form dáng</li>
                      <li>• Nền trắng hoặc trong suốt</li>
                      <li>• Độ phân giải tối thiểu 1000x1000px</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50">
                    <h4 className="font-medium text-green-900 mb-2">Ảnh bổ sung</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Ảnh mặt bên, mặt sau, đế giày</li>
                      <li>• Chi tiết logo, chất liệu</li>
                      <li>• Ảnh đang sử dụng (lifestyle)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giá</CardTitle>
                <CardDescription>Thiết lập giá bán và giá gốc của sản phẩm.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá bán (VNĐ) *</Label>
                    <Input id="price" type="number" placeholder="2990000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="original-price">Giá gốc (VNĐ)</Label>
                    <Input id="original-price" type="number" placeholder="3290000" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cost-price">Giá vốn (VNĐ)</Label>
                    <Input id="cost-price" type="number" placeholder="1500000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profit-margin">Lợi nhuận (%)</Label>
                    <Input id="profit-margin" type="number" placeholder="99.3" disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quản lý kho</CardTitle>
                <CardDescription>Thiết lập số lượng tồn kho và cảnh báo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Số lượng tồn kho *</Label>
                    <Input id="stock" type="number" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-stock">Cảnh báo tồn kho tối thiểu</Label>
                    <Input id="min-stock" type="number" placeholder="10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warehouse">Kho hàng</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn kho hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Kho chính - Hà Nội</SelectItem>
                      <SelectItem value="south">Kho miền Nam - TP.HCM</SelectItem>
                      <SelectItem value="central">Kho miền Trung - Đà Nẵng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
