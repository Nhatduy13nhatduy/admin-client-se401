"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

export default function VouchersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    quantity: "",
    expired_at: "",
  })

  const vouchers = [
    {
      voucher_id: 1,
      name: "Giảm giá mùa hè",
      value: 50000,
      expired_at: "2024-08-31",
      quantity: 100,
      used: 23,
      created_at: "2024-06-01",
      updated_at: "2024-06-15",
    },
    {
      voucher_id: 2,
      name: "Miễn phí vận chuyển",
      value: 30000,
      expired_at: "2024-12-31",
      quantity: 200,
      used: 56,
      created_at: "2024-05-01",
      updated_at: "2024-05-20",
    },
    {
      voucher_id: 3,
      name: "Khách hàng mới",
      value: 100000,
      expired_at: "2024-12-31",
      quantity: 50,
      used: 8,
      created_at: "2024-01-01",
      updated_at: "2024-01-15",
    },
    {
      voucher_id: 4,
      name: "Black Friday",
      value: 150000,
      expired_at: "2023-11-26",
      quantity: 100,
      used: 100,
      created_at: "2023-11-20",
      updated_at: "2023-11-25",
    },
    {
      voucher_id: 5,
      name: "Sinh nhật shop",
      value: 75000,
      expired_at: "2024-07-20",
      quantity: 20,
      used: 4,
      created_at: "2024-07-10",
      updated_at: "2024-07-12",
    },
  ]

  const getStatus = (expiredAt: string, quantity: number, used: number) => {
    const today = new Date()
    const expiredDate = new Date(expiredAt)

    if (expiredDate < today) return "Đã hết hạn"
    if (used >= quantity) return "Đã hết"

    const daysLeft = Math.ceil((expiredDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 7) return "Sắp hết hạn"

    return "Đang hoạt động"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Xử lý tạo voucher mới
    console.log("Tạo voucher mới:", formData)

    // Reset form và đóng dialog
    setFormData({
      name: "",
      value: "",
      quantity: "",
      expired_at: "",
    })
    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý voucher khuyến mãi</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tạo voucher mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tạo voucher mới</DialogTitle>
              <DialogDescription>Nhập thông tin để tạo voucher khuyến mãi mới.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên voucher
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập tên voucher"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Giá trị (đ)
                  </Label>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    value={formData.value}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Số lượng
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expired_at" className="text-right">
                    Ngày hết hạn
                  </Label>
                  <Input
                    id="expired_at"
                    name="expired_at"
                    type="date"
                    value={formData.expired_at}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Tạo voucher</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng voucher</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vouchers.length}</div>
            <p className="text-xs text-muted-foreground">Đã tạo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vouchers.filter((v) => getStatus(v.expired_at, v.quantity, v.used) === "Đang hoạt động").length}
            </div>
            <p className="text-xs text-muted-foreground">Voucher</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã sử dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vouchers.reduce((sum, v) => sum + v.used, 0)}</div>
            <p className="text-xs text-muted-foreground">Lượt sử dụng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vouchers.reduce((sum, v) => sum + v.value * v.used, 0).toLocaleString()}đ
            </div>
            <p className="text-xs text-muted-foreground">Đã sử dụng</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách voucher</CardTitle>
          <CardDescription>Quản lý tất cả voucher khuyến mãi trong hệ thống.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên voucher</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Đã sử dụng</TableHead>
                <TableHead>Hạn sử dụng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.map((voucher) => {
                const status = getStatus(voucher.expired_at, voucher.quantity, voucher.used)
                return (
                  <TableRow key={voucher.voucher_id}>
                    <TableCell className="font-medium">#{voucher.voucher_id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{voucher.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Cập nhật: {new Date(voucher.updated_at).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{voucher.value.toLocaleString()}đ</TableCell>
                    <TableCell>{voucher.quantity}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{voucher.used}</span>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${(voucher.used / voucher.quantity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(voucher.expired_at).toLocaleDateString("vi-VN")}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status === "Đang hoạt động"
                            ? "default"
                            : status === "Sắp hết hạn"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(voucher.created_at).toLocaleDateString("vi-VN")}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-6 w-6" asChild>
                          <Link href={`/admin/vouchers/view/${voucher.voucher_id}`}>
                            <Eye className="h-2.5 w-2.5" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" className="h-6 w-6" asChild>
                          <Link href={`/admin/vouchers/edit/${voucher.voucher_id}`}>
                            <Pencil className="h-2.5 w-2.5" />
                          </Link>
                        </Button>
                        <Button variant="destructive" size="icon" className="h-6 w-6">
                          <Trash2 className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
