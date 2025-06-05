import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Eye, Search, Filter, PlusCircle, Mail, Phone, Calendar, Shield } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  // Sample user data
  const users = [
    {
      id: "USR-1",
      name: "Nguyễn Văn A",
      username: "nguyenvana",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      role: "Admin",
      status: "Hoạt động",
      lastLogin: "12/05/2023",
      createdAt: "01/01/2023",
    },
    {
      id: "USR-2",
      name: "Trần Thị B",
      username: "tranthib",
      email: "tranthib@example.com",
      phone: "0912345678",
      role: "Khách hàng",
      status: "Hoạt động",
      lastLogin: "10/05/2023",
      createdAt: "15/01/2023",
    },
    {
      id: "USR-3",
      name: "Lê Văn C",
      username: "levanc",
      email: "levanc@example.com",
      phone: "0923456789",
      role: "Khách hàng",
      status: "Không hoạt động",
      lastLogin: "01/04/2023",
      createdAt: "20/02/2023",
    },
    {
      id: "USR-4",
      name: "Phạm Thị D",
      username: "phamthid",
      email: "phamthid@example.com",
      phone: "0934567890",
      role: "Nhân viên",
      status: "Hoạt động",
      lastLogin: "11/05/2023",
      createdAt: "05/03/2023",
    },
    {
      id: "USR-5",
      name: "Hoàng Văn E",
      username: "hoangvane",
      email: "hoangvane@example.com",
      phone: "0945678901",
      role: "Khách hàng",
      status: "Bị khóa",
      lastLogin: "05/03/2023",
      createdAt: "10/04/2023",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
        <p className="text-muted-foreground">Quản lý tất cả người dùng và phân quyền trong hệ thống.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Tài khoản đã đăng ký</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Người dùng hoạt động</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "Hoạt động").length}</div>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Người dùng mới</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Trong tháng này</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tài khoản bị khóa</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "Bị khóa").length}</div>
            <p className="text-xs text-muted-foreground">Cần xem xét</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách người dùng</CardTitle>
              <CardDescription>Quản lý tất cả người dùng trong hệ thống.</CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Tìm kiếm người dùng..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Đăng nhập cuối</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32&query=${user.name}`} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">@{user.username}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Mail className="mr-1 h-3 w-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Phone className="mr-1 h-3 w-3" />
                        {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="icon" className="h-6 w-6" asChild>
                      <Link href={`/admin/users/view/${user.id}`}>
                        <Eye className="h-2.5 w-2.5" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
