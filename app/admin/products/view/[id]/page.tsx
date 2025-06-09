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
  Package,
  Tag,
  Info,
  DollarSign,
  ShoppingBag,
  Clock,
  Star,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useProduct } from '@/hooks/use-product';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

// Define types based on the actual API response
interface ProductPhoto {
  id: string;
  url: string;
  isMain: boolean;
  publicId: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  size: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  products: any[];
}

interface ProductSize {
  id: string;
  size: string;
  quantity: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: number;
  mainPhotoUrl: string;
  createdAt: string;
  updatedAt: string;
  photos: ProductPhoto[];
  categories: Category[];
  sizes: ProductSize[];

  // Client-side properties
  sold?: number;
  rating?: number;
  isFeatured?: boolean;
  status?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { onGetProductById, onDeleteProduct } = useProduct();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productId = params.id as string;
        const response = await onGetProductById(productId);

        // Enhance the product with additional client-side properties
        const enhancedProduct = {
          ...response,
          sold: Math.floor(Math.random() * 300),
          rating: (Math.random() * 2 + 3).toFixed(1),
          isFeatured: Math.random() > 0.7,
          status:
            response.inStock > 20
              ? 'Còn hàng'
              : response.inStock > 0
              ? 'Sắp hết'
              : 'Hết hàng',
        };

        setProduct(enhancedProduct);

        // Set the main image from mainPhotoUrl or the first image marked as main
        setMainImage(
          enhancedProduct.mainPhotoUrl ||
            enhancedProduct.photos.find((p) => p.isMain)?.url ||
            '/placeholder.svg'
        );
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Không thể tải thông tin sản phẩm');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleDeleteProduct = async () => {
    if (!product) return;

    if (!confirm('Bạn có chắc muốn xóa sản phẩm này không?')) {
      return;
    }

    try {
      await onDeleteProduct(product.id);
      toast.success('Đã xóa sản phẩm thành công');
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Không thể xóa sản phẩm');
    }
  };

  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
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
            Đang tải thông tin sản phẩm...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-muted-foreground mb-6">
          Sản phẩm không tồn tại hoặc đã bị xóa
        </p>
        <Button asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách sản phẩm
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
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-muted-foreground">ID: {product.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/products/edit/${product.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDeleteProduct}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa sản phẩm
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Hình ảnh sản phẩm
                </CardTitle>
                <Badge
                  variant={
                    product.status === 'Còn hàng'
                      ? 'default'
                      : product.status === 'Sắp hết'
                      ? 'secondary'
                      : 'destructive'
                  }
                  className={
                    product.status === 'Còn hàng'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : product.status === 'Sắp hết'
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      : 'bg-red-100 text-red-700 border-red-200'
                  }
                >
                  {product.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="aspect-square relative rounded-lg overflow-hidden border">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className={`aspect-square relative rounded-lg overflow-hidden border cursor-pointer ${
                        mainImage === photo.url ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setMainImage(photo.url)}
                    >
                      <Image
                        src={photo.url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Chi tiết
              </TabsTrigger>
              <TabsTrigger value="sizes" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Kích cỡ
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Danh mục
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Kho hàng
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="border rounded-lg p-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Mô tả sản phẩm</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Ngày tạo</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(product.createdAt)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      Cập nhật lần cuối
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(product.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sizes" className="border rounded-lg p-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Thông tin kích cỡ</h3>
                {product.sizes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Không có thông tin kích cỡ
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {product.sizes.map((size) => (
                      <div key={size.id} className="border rounded-lg p-3">
                        <div className="text-xl font-bold text-center mb-1">
                          {size.size}
                        </div>
                        <div className="text-sm text-center text-muted-foreground">
                          Số lượng: {size.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="categories"
              className="border rounded-lg p-4 mt-4"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Danh mục</h3>
                {product.categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Không có danh mục
                  </p>
                ) : (
                  <div className="space-y-3">
                    {product.categories.map((category) => (
                      <div key={category.id} className="border rounded-lg p-3">
                        <h4 className="font-medium">{category.name}</h4>
                        {category.description && (
                          <p className="text-sm text-muted-foreground">
                            {category.description || 'Không có mô tả'}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {category.type && (
                            <Badge variant="secondary" className="text-xs">
                              {category.type}
                            </Badge>
                          )}
                          {category.size && (
                            <Badge variant="outline" className="text-xs">
                              {category.size}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="inventory"
              className="border rounded-lg p-4 mt-4"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Thông tin kho hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-1">Tổng tồn kho</h4>
                    <p className="text-2xl font-bold">{product.inStock}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-1">Đã bán</h4>
                    <p className="text-2xl font-bold">{product.sold || 0}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Tồn kho theo kích cỡ
                  </h4>
                  <div className="space-y-2">
                    {product.sizes.map((size) => (
                      <div
                        key={size.id}
                        className="flex items-center justify-between"
                      >
                        <span className="font-medium">Size {size.size}</span>
                        <span
                          className={
                            size.quantity < 5 ? 'text-red-500 font-medium' : ''
                          }
                        >
                          {size.quantity} đôi
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Thông tin bán hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Giá bán</p>
                  <p className="text-xl font-bold">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tồn kho</p>
                  <p className="text-xl font-bold">
                    {product.inStock} sản phẩm
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Đã bán</span>
                  </div>
                  <span className="font-medium">{product.sold || 0} đôi</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Đánh giá</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-medium">{product.rating}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Trạng thái</span>
                  </div>
                  <Badge
                    variant={
                      product.status === 'Còn hàng'
                        ? 'default'
                        : product.status === 'Sắp hết'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className={
                      product.status === 'Còn hàng'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : product.status === 'Sắp hết'
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Lịch sử hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="w-px h-full bg-muted"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sản phẩm được tạo</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(product.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="w-px h-full bg-muted"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cập nhật lần cuối</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(product.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Thống kê danh mục
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {product.categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {category.type || 'Không phân loại'}
                    </Badge>
                  </div>
                ))}
                {product.categories.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Không có danh mục
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
