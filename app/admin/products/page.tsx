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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PlusCircle,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Package,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useProduct } from '@/hooks/use-product';
import { toast } from 'sonner';
import { Product, ProductQueryParams } from '@/type/product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');

  // Use our product hook
  const { onGetProducts, onDeleteProduct } = useProduct();

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products only when search term changes (debounced)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        // Only include search parameters that actually require a new API call
        const params: ProductQueryParams = {
          page: 1,
          limit: 50,
        };

        // Only add search term if it exists
        if (debouncedSearchTerm) {
          params.search = debouncedSearchTerm;
        }

        const response = await onGetProducts(params);
        console.log('API Response:', response);

        let productItems: Product[] = [];

        if (Array.isArray(response)) {
          productItems = response;
        } else if (Array.isArray(response?.items)) {
          productItems = response.items;
        } else {
          productItems = [];
        }

        const enhancedProducts = productItems.map((product: Product) => ({
          ...product,
          sold: Math.floor(Math.random() * 300),
          rating: (Math.random() * 2 + 3).toFixed(1),
          isFeatured: Math.random() > 0.7,
          status:
            product.inStock > 20
              ? 'Còn hàng'
              : product.inStock > 0
              ? 'Sắp hết'
              : 'Hết hàng',
        }));

        setProducts(enhancedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Không thể tải danh sách sản phẩm');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchTerm]);

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này không?')) {
      return;
    }

    try {
      await onDeleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success('Đã xóa sản phẩm thành công');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Không thể xóa sản phẩm');
    }
  };

  // Filter products based on the selected tab - this is client-side filtering
  const getFilteredProducts = () => {
    switch (selectedTab) {
      case 'in-stock':
        return products.filter((p) => p.inStock > 0);
      case 'low-stock':
        return products.filter((p) => p.inStock > 0 && p.inStock <= 20);
      case 'out-of-stock':
        return products.filter((p) => p.inStock === 0);
      case 'featured':
        return products.filter((p) => p.isFeatured);
      default:
        return products;
    }
  };

  // Filter products based on the selected brand - this is client-side filtering
  const getBrandFilteredProducts = () => {
    const tabFiltered = getFilteredProducts();
    if (selectedBrand === 'all') return tabFiltered;

    // This assumes your product name contains the brand name
    // In a real app, you might have a dedicated brand field
    return tabFiltered.filter((p) =>
      p.name.toLowerCase().includes(selectedBrand.toLowerCase())
    );
  };

  const filteredProducts = getBrandFilteredProducts();

  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Statistics
  const totalProducts = products.length;
  const totalSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);
  const inStockProducts = products.filter((p) => p.inStock > 0).length;
  const outOfStockProducts = products.filter((p) => p.inStock === 0).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
        <p className="text-muted-foreground">
          Quản lý tất cả sản phẩm giày trong hệ thống cửa hàng.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm đã tạo</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã bán</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSold}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm đã bán</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Còn hàng</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inStockProducts}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm có sẵn</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground">Cần nhập thêm</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Danh sách sản phẩm
              </CardTitle>
              <CardDescription>
                Quản lý tất cả sản phẩm giày trong hệ thống cửa hàng.
              </CardDescription>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/admin/products/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm sản phẩm mới
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tên, mã sản phẩm..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                  <SelectItem value="nike">Nike</SelectItem>
                  <SelectItem value="adidas">Adidas</SelectItem>
                  <SelectItem value="converse">Converse</SelectItem>
                  <SelectItem value="vans">Vans</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Lọc
              </Button>
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Tất cả ({totalProducts})</TabsTrigger>
              <TabsTrigger value="in-stock">
                Còn hàng ({inStockProducts})
              </TabsTrigger>
              <TabsTrigger value="low-stock">
                Sắp hết (
                {
                  products.filter((p) => p.inStock > 0 && p.inStock <= 20)
                    .length
                }
                )
              </TabsTrigger>
              <TabsTrigger value="out-of-stock">
                Hết hàng ({outOfStockProducts})
              </TabsTrigger>
              <TabsTrigger value="featured">
                Nổi bật ({products.filter((p) => p.isFeatured).length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Đang tải dữ liệu...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Không tìm thấy sản phẩm nào</p>
              <p className="text-muted-foreground">
                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[300px]">Sản phẩm</TableHead>
                    <TableHead>Giá bán</TableHead>
                    <TableHead>Tồn kho</TableHead>
                    <TableHead>Đã bán</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Image
                              src={
                                product.mainPhotoUrl ||
                                product.photos.find((p) => p.isMain)?.url ||
                                '/placeholder.svg'
                              }
                              alt={product.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover border"
                            />
                            {product.isFeatured && (
                              <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-1 rounded-full">
                                ★
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm leading-tight">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.id}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.sizes.slice(0, 4).map((size) => (
                                <Badge
                                  key={size.id}
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  {size.size}
                                </Badge>
                              ))}
                              {product.sizes.length > 4 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  +{product.sizes.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            product.inStock < 20 ? 'text-red-600' : ''
                          }`}
                        >
                          {product.inStock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{product.sold}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="font-medium">{product.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            asChild
                          >
                            <Link href={`/admin/products/view/${product.id}`}>
                              <Eye className="h-2.5 w-2.5" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            asChild
                          >
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <Pencil className="h-2.5 w-2.5" />
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteProduct(product.id)}
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
