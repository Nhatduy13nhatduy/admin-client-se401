import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/admin/overview"
import { RecentSales } from "@/components/admin/recent-sales"
import { TopProducts } from "@/components/admin/top-products"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Package,
  Users,
  Star,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Xem tổng quan về hoạt động kinh doanh của cửa hàng giày của bạn.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <div className="rounded-full bg-white p-2 dark:bg-blue-800">
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-200" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450,890,000đ</div>
            <div className="mt-1 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                20.1%
              </Badge>
              <span className="ml-2 text-muted-foreground">so với tháng trước</span>
            </div>
            <Progress className="mt-4" value={75} />
            <p className="mt-2 text-xs text-muted-foreground">75% của mục tiêu tháng</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng mới</CardTitle>
            <div className="rounded-full bg-white p-2 dark:bg-indigo-800">
              <ShoppingCart className="h-4 w-4 text-indigo-600 dark:text-indigo-200" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,234</div>
            <div className="mt-1 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                12.2%
              </Badge>
              <span className="ml-2 text-muted-foreground">so với tháng trước</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Đang xử lý</span>
                <span className="font-medium">124</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Đang giao</span>
                <span className="font-medium">62</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Hoàn thành</span>
                <span className="font-medium">1,048</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đôi giày đã bán</CardTitle>
            <div className="rounded-full bg-white p-2 dark:bg-purple-800">
              <Package className="h-4 w-4 text-purple-600 dark:text-purple-200" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5,678</div>
            <div className="mt-1 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                15.3%
              </Badge>
              <span className="ml-2 text-muted-foreground">so với tháng trước</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-md bg-white p-2 dark:bg-purple-900">
                <p className="text-xs text-muted-foreground">Bán chạy nhất</p>
                <p className="text-sm font-medium">Nike Air Force 1</p>
              </div>
              <div className="rounded-md bg-white p-2 dark:bg-purple-900">
                <p className="text-xs text-muted-foreground">Doanh thu cao nhất</p>
                <p className="text-sm font-medium">Adidas Ultraboost</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
            <div className="rounded-full bg-white p-2 dark:bg-amber-800">
              <Users className="h-4 w-4 text-amber-600 dark:text-amber-200" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+892</div>
            <div className="mt-1 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                8.4%
              </Badge>
              <span className="ml-2 text-muted-foreground">so với tháng trước</span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Tỷ lệ quay lại</span>
                <span className="font-medium">68%</span>
              </div>
              <Progress className="mt-1" value={68} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Doanh thu theo tháng</CardTitle>
              <CardDescription>Biểu đồ doanh thu theo từng tháng trong năm 2024</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                2024
              </Badge>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Đơn hàng gần đây</CardTitle>
              <CardDescription>10 đơn hàng mới nhất trong hệ thống</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orders">
                Xem tất cả
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Trạng thái đơn hàng</CardTitle>
            <CardDescription>Phân bổ trạng thái đơn hàng hiện tại</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Đã hoàn thành</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">1,048</span>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      85%
                    </Badge>
                  </div>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Đang xử lý</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">124</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      10%
                    </Badge>
                  </div>
                </div>
                <Progress value={10} className="h-2" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Đang giao hàng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">62</span>
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                      5%
                    </Badge>
                  </div>
                </div>
                <Progress value={5} className="h-2" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Đã hủy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">0</span>
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                      0%
                    </Badge>
                  </div>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Thống kê nhanh</CardTitle>
            <CardDescription>Các chỉ số quan trọng trong tháng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Đánh giá trung bình</span>
              </div>
              <span className="font-bold">4.8/5</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">Tỷ lệ chuyển đổi</span>
              </div>
              <span className="font-bold">3.2%</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Giá trị đơn hàng TB</span>
              </div>
              <span className="font-bold">1,890,000đ</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Sản phẩm trong kho</span>
              </div>
              <span className="font-bold">2,456</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
              <CardDescription>Top 5 sản phẩm bán chạy nhất tháng</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/products">
                Xem tất cả
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <TopProducts />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
