'use client';

import { useEffect, useState } from 'react';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  Search,
  FolderOpen,
  Package,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useCategory } from '@/hooks/use-category';
import { toast } from 'sonner';
import { CategoryDto } from '@/type/category';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Use our category hook
  const { onGetCategories, onDeleteCategory } = useCategory();

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch categories when component mounts or search term changes
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);

        const params = {
          search: debouncedSearchTerm || undefined,
          pageSize: 50,
        };

        const response = await onGetCategories(params);

        // Handle both paginated and non-paginated responses
        const categoryItems = Array.isArray(response)
          ? response
          : response?.items || [];

        setCategories(categoryItems);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Không thể tải danh sách danh mục');
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [debouncedSearchTerm]);

  // Handle category deletion
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này không?')) {
      return;
    }

    try {
      await onDeleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success('Đã xóa danh mục thành công');
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Không thể xóa danh mục');
    }
  };

  // Filter categories based on the selected tab
  const filteredCategories =
    selectedTab === 'all'
      ? categories
      : categories.filter((c) => c.products.length > 0);

  // Calculate totals
  const totalCategories = categories.length;
  const totalProducts = categories.reduce(
    (sum, c) => sum + c.products.length,
    0
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h1>
        <p className="text-muted-foreground">
          Quản lý tất cả danh mục sản phẩm trong hệ thống cửa hàng.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng danh mục</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">Danh mục đã tạo</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Trong tất cả danh mục
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trung bình</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCategories
                ? Math.round(totalProducts / totalCategories)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Sản phẩm/danh mục</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Danh sách danh mục
              </CardTitle>
              <CardDescription>
                Quản lý tất cả danh mục sản phẩm trong hệ thống.
              </CardDescription>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/admin/categories/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm danh mục
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            className="mb-4"
            value={selectedTab}
            onValueChange={setSelectedTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Tất cả ({totalCategories})</TabsTrigger>
              <TabsTrigger value="active">
                Có sản phẩm (
                {categories.filter((c) => c.products.length > 0).length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Đang tải danh mục...
                </p>
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-medium mb-1">Không tìm thấy danh mục nào</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {debouncedSearchTerm
                  ? `Không tìm thấy danh mục nào khớp với từ khóa "${debouncedSearchTerm}"`
                  : 'Bạn chưa tạo danh mục nào. Hãy tạo danh mục đầu tiên.'}
              </p>
              <Button asChild>
                <Link href="/admin/categories/add">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Thêm danh mục mới
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>ID</TableHead>
                    <TableHead>Tên danh mục</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Ngày cập nhật</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {typeof category.id === 'string'
                          ? category.id.substring(0, 8) + '...'
                          : category.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{category.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </TableCell>
                      <TableCell>{formatDate(category.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            asChild
                          >
                            <Link
                              href={`/admin/categories/view/${category.id}`}
                            >
                              <Eye className="h-2.5 w-2.5" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            asChild
                          >
                            <Link
                              href={`/admin/categories/edit/${category.id}`}
                            >
                              <Pencil className="h-2.5 w-2.5" />
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
