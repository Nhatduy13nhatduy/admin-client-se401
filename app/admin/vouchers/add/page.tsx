'use client';

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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useVoucher } from '@/hooks/use-voucher';
import { CreateVoucherDto } from '@/type/voucher';

export default function AddVoucherPage() {
  const router = useRouter();
  const { onCreateVoucher } = useVoucher();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [value, setValue] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [expiredAt, setExpiredAt] = useState('');

  const handleSubmit = async () => {
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
      setIsSubmitting(true);

      const voucherData: CreateVoucherDto = {
        name,
        value,
        quantity,
        expiredAt: new Date(expiredAt),
      };

      const response = await onCreateVoucher(voucherData);

      toast.success('Voucher đã được tạo thành công');
      router.push(`/admin/vouchers/view/${response.id}`);
    } catch (error) {
      console.error('Failed to create voucher:', error);
      toast.error('Không thể tạo voucher. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/vouchers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Thêm voucher mới
            </h1>
            <p className="text-muted-foreground">
              Tạo voucher khuyến mãi mới cho cửa hàng
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild disabled={isSubmitting}>
            <Link href="/admin/vouchers">Hủy</Link>
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Tạo voucher
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin voucher</CardTitle>
              <CardDescription>
                Nhập các thông tin cần thiết để tạo voucher mới
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
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Tên dễ nhận biết cho voucher
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Giá trị (đ) *</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder="Nhập giá trị voucher..."
                  value={value || ''}
                  onChange={(e) => setValue(parseFloat(e.target.value))}
                  required
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
                  value={quantity || ''}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  required
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
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Voucher sẽ hết hạn vào cuối ngày này
                </p>
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
                <h4 className="font-medium text-sm">Tên voucher</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Sử dụng tên ngắn gọn, dễ hiểu</li>
                  <li>• Tên nên thể hiện được mục đích của voucher</li>
                  <li>• Tránh sử dụng ký tự đặc biệt</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Giá trị</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Nhập giá trị bằng số, không cần dấu phẩy</li>
                  <li>• Giá trị nên phù hợp với chiến lược kinh doanh</li>
                  <li>
                    • Nên xem xét ngân sách marketing khi thiết lập giá trị
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Số lượng</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Số lượng giới hạn tạo tính khan hiếm</li>
                  <li>• Cân nhắc dựa trên mục tiêu marketing</li>
                  <li>• Có thể điều chỉnh sau nếu cần thiết</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Ngày hết hạn</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Thời hạn phù hợp với mục tiêu chiến dịch</li>
                  <li>• Tránh thời hạn quá ngắn gây áp lực cho khách hàng</li>
                  <li>• Không nên quá dài để tạo tính cấp bách</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
