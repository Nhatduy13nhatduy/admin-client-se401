'use client';

import { useEffect, useRef, useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  Search,
  Filter,
  Ticket,
  Loader2,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { useVoucher } from '@/hooks/use-voucher';
import { VoucherDto, CreateVoucherDto } from '@/type/voucher';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<VoucherDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateVoucherDto>({
    name: '',
    value: 0,
    expiredAt: '',
    quantity: 0,
  });
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use our voucher hook
  const { onGetVouchers, onCreateVoucher, onDeleteVoucher, onImportVouchers } =
    useVoucher();

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch vouchers when component mounts or search term changes
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setIsLoading(true);

        const params = {
          search: debouncedSearchTerm || undefined,
          pageSize: 50,
        };

        const response = await onGetVouchers(params);

        // Handle both paginated and non-paginated responses
        const voucherItems = Array.isArray(response)
          ? response
          : response?.items || [];

        // Calculate used quantity from total and available
        const vouchersWithUsage = voucherItems.map((voucher) => ({
          ...voucher,
          used: voucher.quantity - voucher.availableQuantity,
        }));

        setVouchers(vouchersWithUsage);
      } catch (error) {
        console.error('Failed to fetch vouchers:', error);
        toast.error('Không thể tải danh sách voucher');
        setVouchers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVouchers();
  }, [debouncedSearchTerm]);

  // Handle voucher deletion
  const handleDeleteVoucher = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa voucher này không?')) {
      return;
    }

    try {
      await onDeleteVoucher(id);
      setVouchers(vouchers.filter((v) => v.id !== id));
      toast.success('Đã xóa voucher thành công');
    } catch (error) {
      console.error('Failed to delete voucher:', error);
      toast.error('Không thể xóa voucher');
    }
  };

  // Get status based on expiration date and availability
  const getStatus = (voucher: VoucherDto) => {
    if (voucher.isExpired) return 'Đã hết hạn';
    if (voucher.availableQuantity <= 0) return 'Đã hết';

    const today = new Date();
    const expiredDate = new Date(voucher.expiredAt);
    const daysLeft = Math.ceil(
      (expiredDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft <= 7) return 'Sắp hết hạn';
    return 'Đang hoạt động';
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Đang hoạt động':
        return 'default';
      case 'Sắp hết hạn':
        return 'secondary';
      case 'Đã hết':
      case 'Đã hết hạn':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  // Update the handleSubmit function with enhanced toast notifications
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      if (!formData.name) {
        toast.error('Vui lòng nhập tên voucher');
        return;
      }

      if (formData.value <= 0) {
        toast.error('Giá trị voucher phải lớn hơn 0');
        return;
      }

      if (formData.quantity <= 0) {
        toast.error('Số lượng voucher phải lớn hơn 0');
        return;
      }

      if (!formData.expiredAt) {
        toast.error('Vui lòng chọn ngày hết hạn');
        return;
      }

      // Show loading toast
      toast.loading('Đang tạo voucher...', {
        id: 'create-voucher',
        duration: Infinity,
      });

      // Create voucher
      const newVoucher = await onCreateVoucher(formData);

      // Add to list with mock usage data
      setVouchers([
        {
          ...newVoucher,
          used: 0, // New voucher has 0 usage
        },
        ...vouchers,
      ]);

      // Dismiss loading toast and show success toast
      toast.dismiss('create-voucher');
      toast.success(
        <div className="flex flex-col gap-1">
          <div className="font-medium">Tạo voucher thành công!</div>
          <div>
            Đã tạo voucher {newVoucher.typeName} với giá trị{' '}
            {new Intl.NumberFormat('vi-VN').format(newVoucher.value)}đ
          </div>
        </div>,
        {
          duration: 5000,
          icon: '🎟️',
        }
      );

      // Reset form and close dialog
      setFormData({
        name: '',
        value: 0,
        expiredAt: '',
        quantity: 0,
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create voucher:', error);

      // Dismiss loading toast and show error toast
      toast.dismiss('create-voucher');
      toast.error(
        <div className="flex flex-col gap-1">
          <div className="font-medium">Tạo voucher thất bại</div>
          <div>Không thể tạo voucher. Vui lòng thử lại sau.</div>
        </div>,
        {
          duration: 5000,
        }
      );
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleImportClick = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validExcelTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel.sheet.macroEnabled.12',
      '.xls',
      '.xlsx',
    ];
    const validJsonTypes = ['application/json', '.json'];
    const validTypes = [...validExcelTypes, ...validJsonTypes];

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (
      !validTypes.includes(file.type) &&
      !validTypes.includes(`.${fileExtension}`)
    ) {
      toast.error(
        'Định dạng file không hợp lệ. Vui lòng chọn file Excel hoặc JSON.'
      );
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsImporting(true);

      // Determine format based on file extension
      const format = fileExtension === 'json' ? 'json' : 'excel';

      // Show processing toast
      toast.loading(`Đang xử lý file ${file.name}...`, {
        id: 'import-vouchers',
        duration: Infinity,
      });

      // Call API to import vouchers
      const result = await onImportVouchers(file, format);

      // Refresh voucher list after successful import
      const response = await onGetVouchers();
      const voucherItems = Array.isArray(response)
        ? response
        : response?.items || [];

      const vouchersWithUsage = voucherItems.map((voucher) => ({
        ...voucher,
        used: Math.floor(Math.random() * voucher.quantity),
      }));

      setVouchers(vouchersWithUsage);

      // Dismiss loading toast and show success toast
      toast.dismiss('import-vouchers');
      toast.success(
        <div className="flex flex-col gap-1">
          <div className="font-medium">Nhập voucher thành công!</div>
          <div>
            Đã nhập {result.importedCount || 0} voucher từ file {file.name}
          </div>
        </div>,
        {
          duration: 5000,
          icon: '🎉',
        }
      );
    } catch (error) {
      console.error('Error importing vouchers:', error);

      // Dismiss loading toast and show error toast
      toast.dismiss('import-vouchers');
      toast.error(
        <div className="flex flex-col gap-1">
          <div className="font-medium">Nhập voucher thất bại</div>
          <div>Đã xảy ra lỗi khi nhập file {file.name}</div>
        </div>,
        {
          duration: 5000,
        }
      );
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">
            Đang tải danh sách voucher...
          </p>
        </div>
      </div>
    );
  }

  // Calculate active vouchers
  const activeVouchers = vouchers.filter(
    (voucher) => getStatus(voucher) === 'Đang hoạt động'
  );

  // Calculate total used vouchers
  const totalUsed = vouchers.reduce(
    (sum, voucher) => sum + (voucher.used || 0),
    0
  );

  // Calculate total value of used vouchers
  const totalValue = vouchers.reduce(
    (sum, voucher) => sum + (voucher.used || 0) * voucher.value,
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý voucher</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả voucher khuyến mãi trong hệ thống.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tạo voucher mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tạo voucher mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin để tạo voucher khuyến mãi mới.
                </DialogDescription>
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
                      value={formData.value || ''}
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
                      value={formData.quantity || ''}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expiredAt" className="text-right">
                      Ngày hết hạn
                    </Label>
                    <Input
                      id="expiredAt"
                      name="expiredAt"
                      type="date"
                      value={formData.expiredAt}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">Tạo voucher</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleImportClick}
            disabled={isImporting}
          >
            {isImporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isImporting ? 'Đang nhập...' : 'Nhập voucher'}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.json,application/json"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng voucher</CardTitle>
            <Ticket className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vouchers.length}</div>
            <p className="text-xs text-muted-foreground">Đã tạo</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <Ticket className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                vouchers.filter((v) => !v.isExpired && v.availableQuantity > 0)
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Voucher</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã sử dụng</CardTitle>
            <Ticket className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vouchers.reduce(
                (sum, v) => sum + (v.quantity - v.availableQuantity),
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Lượt sử dụng</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
            <Ticket className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(
                vouchers.reduce(
                  (sum, v) =>
                    sum + (v.quantity - v.availableQuantity) * v.value,
                  0
                )
              )}
              đ
            </div>
            <p className="text-xs text-muted-foreground">Đã sử dụng</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Danh sách voucher
              </CardTitle>
              <CardDescription>
                Quản lý tất cả voucher khuyến mãi trong hệ thống.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm voucher..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
          {vouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Ticket className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Không có voucher nào</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bạn chưa tạo voucher nào hoặc không có voucher nào phù hợp với
                bộ lọc.
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm voucher mới
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>ID</TableHead>
                    <TableHead>Tên voucher</TableHead>
                    <TableHead>Giá trị</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Còn lại</TableHead>
                    <TableHead>Hạn sử dụng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((voucher) => {
                    const status = getStatus(voucher);
                    const statusVariant = getStatusBadgeVariant(status);
                    const usagePercent =
                      ((voucher.quantity - voucher.availableQuantity) /
                        voucher.quantity) *
                      100;

                    return (
                      <TableRow key={voucher.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {voucher.id.substring(0, 8) + '...'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{voucher.typeName}</p>
                            <p className="text-xs text-muted-foreground">
                              Cập nhật: {formatDate(voucher.updatedAt)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {new Intl.NumberFormat('vi-VN').format(voucher.value)}
                          đ
                        </TableCell>
                        <TableCell>{voucher.quantity}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-medium">
                              {voucher.availableQuantity}
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{ width: `${usagePercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(voucher.expiredAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant}>{status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(voucher.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              asChild
                            >
                              <Link href={`/admin/vouchers/view/${voucher.id}`}>
                                <Eye className="h-2.5 w-2.5" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              asChild
                            >
                              <Link href={`/admin/vouchers/edit/${voucher.id}`}>
                                <Pencil className="h-2.5 w-2.5" />
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDeleteVoucher(voucher.id)}
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
