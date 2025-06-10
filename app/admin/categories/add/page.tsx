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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, FolderOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCategory } from '@/hooks/use-category';
import { CreateCategoryDto } from '@/type/category';

export default function AddCategoryPage() {
  const router = useRouter();
  const { onCreateCategory } = useCategory();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = async () => {
    // Validate inputs
    if (!name) {
      toast.error('Tên danh mục là bắt buộc');
      return;
    }

    if (!description) {
      toast.error('Mô tả là bắt buộc');
      return;
    }

    try {
      setIsSubmitting(true);

      const categoryData: CreateCategoryDto = {
        name,
        description,
        size,
        type,
      };

      const response = await onCreateCategory(categoryData);

      toast.success('Danh mục đã được tạo thành công');
      router.push(`/admin/categories/view/${response.id}`);
    } catch (error) {
      console.error('Failed to create category:', error);
      toast.error('Không thể tạo danh mục. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/categories">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Thêm danh mục mới
            </h1>
            <p className="text-muted-foreground">
              Tạo danh mục sản phẩm mới cho cửa hàng
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/categories">Hủy</Link>
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu danh mục
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Thông tin danh mục
              </CardTitle>
              <CardDescription>
                Nhập thông tin cơ bản của danh mục sản phẩm.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tên danh mục *</Label>
                <Input
                  id="name"
                  placeholder="VD: Sneakers, Running, Casual..."
                  className="font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Tên danh mục sẽ hiển thị trên website
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả danh mục *</Label>
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả ngắn gọn về danh mục..."
                  rows={4}
                  className="resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Mô tả sẽ giúp khách hàng hiểu rõ hơn về danh mục
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
                <h4 className="font-medium text-sm">Tên danh mục</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Sử dụng tên ngắn gọn, dễ hiểu</li>
                  <li>• Tránh sử dụng ký tự đặc biệt</li>
                  <li>• Tối đa 50 ký tự</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Mô tả</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Mô tả ngắn gọn về loại sản phẩm</li>
                  <li>• Giúp khách hàng dễ dàng tìm kiếm</li>
                  <li>• Tối đa 255 ký tự</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin bổ sung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Sau khi tạo danh mục, bạn có thể:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Thêm sản phẩm vào danh mục</li>
                  <li>• Chỉnh sửa thông tin danh mục</li>
                  <li>• Xem thống kê sản phẩm</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
