'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Ticket, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useVoucher } from '@/hooks/use-voucher';
import { toast } from 'sonner';
import { VoucherDto, UpdateVoucherDto } from '@/type/voucher';

export default function EditVoucherPage() {
  const params = useParams();
  const router = useRouter();
  const { onGetVoucherById, onUpdateVoucher } = useVoucher();
  const [voucher, setVoucher] = useState<VoucherDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [value, setValue] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [expiredAt, setExpiredAt] = useState('');

  // Fetch voucher data when component mounts
  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        setIsLoading(true);
        const voucherId = params.id as string;
        const response = await onGetVoucherById(voucherId);
        setVoucher(response);

        // Initialize form with existing data
        setName(response.name);
        setValue(response.value);
        setQuantity(response.quantity);

        // Format the date for the input field (YYYY-MM-DD)
        const date = new Date(response.expiredAt);
        setExpiredAt(date.toISOString().split('T')[0]);
      } catch (error) {
        console.error('Failed to fetch voucher:', error);
        toast.error('Không thể tải thông tin voucher');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchVoucher();
    }
  }, [params.id]);

  const handleSubmit = async () => {
    if (!voucher) return;

    // Validate inputs
    if (!name) {
      toast.error('Tên voucher là bắt buộc');
      return;
    }

    if (value <= 0) {
      toast.error('Giá trị voucher phải lớn hơn 0');
      return;
    }

    if (quantity <= 0) {
      toast.error('Số lượng voucher phải lớn hơn 0');
      return;
    }

    if (!expiredAt) {
      toast.error('Ngày hết hạn là bắt buộc');
      return;
    }

    try {
      setIsSaving(true);

      const voucherData: UpdateVoucherDto = {
        name,
        value,
        quantity,
        expiredAt: new Date(expiredAt),
      };

      await onUpdateVoucher(voucher.id, voucherData);

      toast.success('Voucher đã được cập nhật thành công');
      router.push(`/admin/vouchers/view/${voucher.id}`);
    } catch (error) {
      console.error('Failed to update voucher:', error);
      toast.error('Không thể cập nhật voucher. Vui lòng thử lại sau.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">
            Đang tải thông tin voucher...
          </p>
        </div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy voucher</h2>
        <p className="text-muted-foreground mb-6">
          Voucher không tồn tại hoặc đã bị xóa
        </p>
        <Button asChild>
          <Link href="/admin/vouchers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách voucher
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/vouchers/view/${voucher.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chỉnh sửa voucher
            </h1>
            <p className="text-muted-foreground">ID: {voucher.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild disabled={isSaving}>
            <Link href={`/admin/vouchers/view/${voucher.id}`}>Hủy</Link>
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin voucher</CardTitle>
            <CardDescription>
              Chỉnh sửa thông tin cơ bản của voucher khuyến mãi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên voucher *</Label>
              <Input
                id="name"
                placeholder="VD: Khuyến mãi mùa hè, Giảm giá Black Friday..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Giá trị (đ) *</Label>
              <Input
                id="value"
                type="number"
                placeholder="Nhập giá trị voucher..."
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Giá trị tiền mặt của voucher, ví dụ: 50000 (50,000đ)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Nhập số lượng voucher..."
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Tổng số voucher có thể sử dụng
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiredAt">Ngày hết hạn *</Label>
              <Input
                id="expiredAt"
                type="date"
                value={expiredAt}
                onChange={(e) => setExpiredAt(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Voucher sẽ hết hạn vào cuối ngày này
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
