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
import { useCategory } from '@/hooks/use-category';
import { toast } from 'sonner';
import { CategoryDto, UpdateCategoryDto } from '@/type/category';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { onGetCategoryById, onUpdateCategory } = useCategory();
  const [category, setCategory] = useState<CategoryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState('');

  // Fetch category data when component mounts
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const categoryId = params.id as string;
        const response = await onGetCategoryById(categoryId);
        setCategory(response);

        // Initialize form with existing data
        setName(response.name);
        setDescription(response.description);
        setSize(response.size);
        setType(response.type);
      } catch (error) {
        console.error('Failed to fetch category:', error);
        toast.error('Không thể tải thông tin danh mục');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCategory();
    }
  }, [params.id]);

  const handleSubmit = async () => {
    if (!category) return;

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
      setIsSaving(true);

      const categoryData: UpdateCategoryDto = {
        name,
        description,
        size,
        type,
      };

      await onUpdateCategory(category.id, categoryData);

      toast.success('Danh mục đã được cập nhật thành công');
      router.push(`/admin/categories/view/${category.id}`);
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error('Không thể cập nhật danh mục. Vui lòng thử lại sau.');
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
            Đang tải thông tin danh mục...
          </p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy danh mục</h2>
        <p className="text-muted-foreground mb-6">
          Danh mục không tồn tại hoặc đã bị xóa
        </p>
        <Button asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách danh mục
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
            <Link href={`/admin/categories/view/${category.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chỉnh sửa danh mục
            </h1>
            <p className="text-muted-foreground">ID: {category.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild disabled={isSaving}>
            <Link href={`/admin/categories/view/${category.id}`}>Hủy</Link>
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
            <CardTitle className="text-lg">Thông tin danh mục</CardTitle>
            <CardDescription>
              Chỉnh sửa thông tin cơ bản của danh mục sản phẩm.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục *</Label>
              <Input
                id="name"
                placeholder="VD: Sneakers, Running, Casual..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả danh mục *</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả ngắn gọn về danh mục..."
                rows={5}
                className="resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
