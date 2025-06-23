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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Trash2,
  FolderOpen,
  Package,
  Info,
  Clock,
  Tag,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useCategory } from '@/hooks/use-category';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { CategoryDto } from '@/type/category';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { onGetCategoryById, onDeleteCategory } = useCategory();
  const [category, setCategory] = useState<CategoryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const categoryId = params.id as string;
        const response = await onGetCategoryById(categoryId);
        setCategory(response);
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

  const handleDeleteCategory = async () => {
    if (!category) return;

    if (!confirm('Bạn có chắc muốn xóa danh mục này không?')) {
      return;
    }

    try {
      await onDeleteCategory(category.id);
      toast.success('Đã xóa danh mục thành công');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Không thể xóa danh mục');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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
            <Link href="/admin/categories">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {category.name}
            </h1>
            <p className="text-muted-foreground">ID: {category.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/categories/edit/${category.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDeleteCategory}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Thông tin danh mục</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Mô tả</h3>
                <p className="text-sm">{category.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm">Loại</h3>
                  <Badge className="mt-1">{category.type}</Badge>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Kích thước</h3>
                  <Badge variant="outline" className="mt-1">
                    {category.size}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="flex gap-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">Ngày tạo</p>
                    <p className="text-sm font-medium">
                      {formatDate(category.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">Cập nhật lần cuối</p>
                    <p className="text-sm font-medium">
                      {formatDate(category.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Sản phẩm
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Chi tiết
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="products"
              className="border rounded-lg p-4 mt-4"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">
                  Sản phẩm trong danh mục
                </h3>

                {category.products.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Chưa có sản phẩm nào trong danh mục này</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Mã SP</TableHead>
                          <TableHead>Tên sản phẩm</TableHead>
                          <TableHead>Giá bán</TableHead>
                          <TableHead>Tồn kho</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-mono text-xs">
                              {product.id.substring(0, 8)}...
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'USD',
                              }).format(product.price)}
                            </TableCell>
                            <TableCell>{product.inStock}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <Link
                                  href={`/admin/products/view/${product.id}`}
                                >
                                  Xem
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="border rounded-lg p-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Thông tin chi tiết</h3>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Tổng sản phẩm</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {category.products.length}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Loại</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge>{category.type}</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Thống kê nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Tổng sản phẩm</span>
                  <span className="font-medium">
                    {category.products.length}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm">Kích thước</span>
                  <Badge variant="outline">{category.size}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm">Loại</span>
                  <Badge>{category.type}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Thông tin thêm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Ngày tạo</span>
                <span className="text-sm">
                  {formatDate(category.createdAt)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm">Cập nhật lần cuối</span>
                <span className="text-sm">
                  {formatDate(category.updatedAt)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm">ID</span>
                <span className="text-sm font-mono">
                  {category.id.substring(0, 8)}...
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
