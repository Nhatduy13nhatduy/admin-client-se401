'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TruckIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function OrdersPage() {
  // Sample order data based on class diagram
  const orders = [
    {
      id: 'ORD-1234',
      customer: {
        id: 'USR-2',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      date: '12/05/2023',
      total_price: '1,299,000đ',
      shipping_fee: '30,000đ',
      payment_type: 'COD',
      order_status: 'Đã giao',
      products: [
        {
          id: 'SHOE-001',
          name: "Nike Air Force 1 '07",
          quantity: 1,
          price: '1,299,000đ',
        },
      ],
      created_at: '12/05/2023 08:30',
      updated_at: '15/05/2023 14:20',
    },
    {
      id: 'ORD-1235',
      customer: {
        id: 'USR-3',
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      date: '13/05/2023',
      total_price: '2,499,000đ',
      shipping_fee: '50,000đ',
      payment_type: 'Banking',
      order_status: 'Đang vận chuyển',
      products: [
        {
          id: 'SHOE-002',
          name: 'Adidas Ultraboost 22',
          quantity: 1,
          price: '2,499,000đ',
        },
      ],
      created_at: '13/05/2023 10:15',
      updated_at: '14/05/2023 09:45',
    },
    {
      id: 'ORD-1236',
      customer: {
        id: 'USR-4',
        name: 'Lê Văn C',
        email: 'levanc@example.com',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      date: '14/05/2023',
      total_price: '899,000đ',
      shipping_fee: '30,000đ',
      payment_type: 'Momo',
      order_status: 'Đã tiếp nhận',
      products: [
        {
          id: 'SHOE-003',
          name: 'Converse Chuck Taylor All Star',
          quantity: 1,
          price: '899,000đ',
        },
      ],
      created_at: '14/05/2023 15:30',
      updated_at: '14/05/2023 15:30',
    },
    {
      id: 'ORD-1237',
      customer: {
        id: 'USR-5',
        name: 'Phạm Thị D',
        email: 'phamthid@example.com',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      date: '15/05/2023',
      total_price: '3,999,000đ',
      shipping_fee: '50,000đ',
      payment_type: 'Credit Card',
      order_status: 'Đã hủy',
      products: [
        {
          id: 'SHOE-004',
          name: 'Vans Old Skool',
          quantity: 2,
          price: '1,890,000đ',
        },
        {
          id: 'SHOE-005',
          name: 'New Balance 990v5',
          quantity: 1,
          price: '2,109,000đ',
        },
        {
          id: 'SHOE-006',
          name: 'Converse Chuck Taylor',
          quantity: 3,
          price: '1,590,000đ',
        },
      ],
      created_at: '15/05/2023 09:10',
      updated_at: '15/05/2023 14:25',
    },
    {
      id: 'ORD-1238',
      customer: {
        id: 'USR-6',
        name: 'Hoàng Văn E',
        email: 'hoangvane@example.com',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      date: '16/05/2023',
      total_price: '1,799,000đ',
      shipping_fee: '30,000đ',
      payment_type: 'Banking',
      order_status: 'Đã giao',
      products: [
        {
          id: 'SHOE-001',
          name: "Nike Air Force 1 '07",
          quantity: 1,
          price: '1,799,000đ',
        },
        {
          id: 'SHOE-007',
          name: 'Adidas Stan Smith',
          quantity: 2,
          price: '1,299,000đ',
        },
      ],
      created_at: '16/05/2023 11:20',
      updated_at: '18/05/2023 16:30',
    },
  ];

  const getStatusBadge = (status: string, orderId: string) => {
    const statusConfig = {
      'Đã tiếp nhận': {
        className:
          'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
        value: 'received',
      },
      'Đang vận chuyển': {
        className:
          'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
        value: 'shipping',
      },
      'Đã giao': {
        className:
          'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
        value: 'delivered',
      },
      'Đã hủy': {
        className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
        value: 'cancelled',
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <Select
        defaultValue={config.value}
        onValueChange={(value) => handleStatusChange(orderId, value)}
      >
        <SelectTrigger
          className={`w-auto h-7 text-xs ${config.className} rounded-full font-medium border-0 px-3`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(statusConfig).map((key) => {
            const item = statusConfig[key as EOrderState];
            return (
              <SelectItem value={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log(`Changing order ${orderId} status to ${newStatus}`);
    // Handle status change logic here
  };

  const renderProducts = (products: OrderProduct[]) => {
    if (products.length === 1) {
      return (
        <div className="flex items-center">
          <span className="text-sm font-medium">{products[0].name}</span>
          <span className="text-xs text-muted-foreground">
            {' '}
            x{products[0].quantity}
          </span>
        </div>
      );
    }

    const totalItems = products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    return (
      <div className="group relative">
        <div className="flex items-center cursor-pointer">
          <span className="text-sm font-medium">{products[0].name}</span>
          <span className="text-xs text-muted-foreground">
            {' '}
            x{products[0].quantity}
          </span>
          <Badge
            variant="secondary"
            className="text-xs px-2 py-1 rounded-full ml-2"
          >
            +{products.length - 1} khác
          </Badge>
        </div>

        {/* Tooltip hiển thị khi hover */}
        <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500 mb-2">
              Tổng: {products.length} sản phẩm ({totalItems} món)
            </div>
            {products.map((product, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm font-medium">{product.name}</span>
                <span className="text-xs text-muted-foreground">
                  x{product.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground">
          Quản lý tất cả đơn hàng trong hệ thống.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Đơn hàng đã tạo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Chờ thanh toán
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.order_status === 'Đã tiếp nhận').length}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã giao</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.order_status === 'Đã giao').length}
            </div>
            <p className="text-xs text-muted-foreground">Hoàn thành</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã hủy</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.order_status === 'Đã hủy').length}
            </div>
            <p className="text-xs text-muted-foreground">Cần xem xét</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách đơn hàng</CardTitle>
              <CardDescription>
                Quản lý tất cả đơn hàng trong hệ thống.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Tìm kiếm đơn hàng..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-4">
            <TabsList>
              {Object.keys(statusConfig).map((key) => {
                const item = statusConfig[key as EOrderState];
                return (
                  <TabsTrigger value={item.value}>{item.label}</TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead className="w-[250px]">Sản phẩm</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Phí vận chuyển</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={order.customer.avatar || '/placeholder.svg'}
                          alt={order.customer.name}
                        />
                        <AvatarFallback>
                          {order.customer.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{renderProducts(order.products)}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell className="font-medium">
                    {order.total_price}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TruckIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{order.shippingCost}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.order_status, order.id)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
