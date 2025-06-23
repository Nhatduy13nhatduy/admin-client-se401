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

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  Save,
  Upload,
  Plus,
  X,
  ImageIcon,
  Tag,
  Package,
  Palette,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

import { useProduct } from '@/hooks/use-product';

export default function AddProductPage() {
  const router = useRouter();
  const { onGetCategories, onCreateProduct } = useProduct();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [inStock, setInStock] = useState<number | ''>('');
  const [minStock, setMinStock] = useState<number | ''>('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload refs and state
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<
    string[]
  >([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await onGetCategories();
        if (response) {
          setCategories(response);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const availableSizes = [
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
  ];
  const availableColors = [
    { name: 'Đen', value: 'black', hex: '#000000' },
    { name: 'Trắng', value: 'white', hex: '#FFFFFF' },
    { name: 'Xám', value: 'gray', hex: '#808080' },
    { name: 'Đỏ', value: 'red', hex: '#FF0000' },
    { name: 'Xanh navy', value: 'navy', hex: '#000080' },
    { name: 'Xanh dương', value: 'blue', hex: '#0000FF' },
    { name: 'Nâu', value: 'brown', hex: '#8B4513' },
    { name: 'Vàng', value: 'yellow', hex: '#FFFF00' },
  ];

  // State for tracking selected sizes and quantities
  const [selectedSizes, setSelectedSizes] = useState<{
    [size: string]: {
      selected: boolean;
      quantity: number;
    };
  }>(
    {} as {
      [size: string]: {
        selected: boolean;
        quantity: number;
      };
    }
  );

  // Initialize the state with available sizes
  useEffect(() => {
    const initialSizes = availableSizes.reduce((acc, size) => {
      acc[size] = { selected: false, quantity: 0 };
      return acc;
    }, {} as { [size: string]: { selected: boolean; quantity: number } });

    setSelectedSizes(initialSizes);
  }, []);

  // Function to toggle size selection
  const toggleSizeSelection = (size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [size]: {
        ...prev[size],
        selected: !prev[size].selected,
      },
    }));
  };

  // Function to update quantity for a size
  const updateSizeQuantity = (size: string, quantity: number) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [size]: {
        ...prev[size],
        quantity,
      },
    }));
  };

  // Add state for custom sizes
  // State for custom sizes
  const [customSizes, setCustomSizes] = useState<
    { id: string; size: string; quantity: number }[]
  >([]);

  // Function to add a custom size
  const addCustomSize = () => {
    setCustomSizes((prev) => [
      ...prev,
      { id: crypto.randomUUID(), size: '', quantity: 0 },
    ]);
  };

  // Function to update a custom size
  const updateCustomSize = (
    id: string,
    field: 'size' | 'quantity',
    value: string | number
  ) => {
    setCustomSizes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Function to remove a custom size
  const removeCustomSize = (id: string) => {
    setCustomSizes((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (
        !name ||
        !description ||
        !price ||
        !inStock ||
        selectedCategoryIds.length === 0
      ) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      if (!mainImage) {
        toast.error('Vui lòng tải lên hình ảnh chính cho sản phẩm');
        return;
      }

      setIsSubmitting(true);

      // Prepare size data
      const productSizes = Object.entries(selectedSizes)
        .filter(([_, data]) => data.selected && data.quantity > 0)
        .map(([size, data]) => ({
          size,
          quantity: data.quantity,
        }));

      // Add custom sizes
      const customProductSizes = customSizes
        .filter((size) => size.size.trim() !== '' && size.quantity > 0)
        .map((size) => ({
          size: size.size,
          quantity: size.quantity,
        }));

      // Combine both size arrays
      const allSizes = [...productSizes, ...customProductSizes];

      if (allSizes.length === 0) {
        toast.error(
          'Vui lòng chọn ít nhất một kích cỡ và số lượng cho sản phẩm'
        );
        return;
      }

      // Prepare product data
      const productData = {
        name,
        description,
        price: Number(price),
        inStock: Number(inStock),
        categoryIds: selectedCategoryIds,
        sizes: allSizes,
      };

      // Prepare files data
      const files = {
        mainImage,
        additionalImages:
          additionalImages.length > 0 ? additionalImages : undefined,
      };

      // Call API to create product
      const response = await onCreateProduct(productData, files);

      toast.success('Sản phẩm đã được tạo thành công');

      // Redirect to product detail page
      router.push(`/admin/products/view/${response.id}`);
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Không thể tạo sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategoryIds((prev) => [...prev, categoryId]);
    } else {
      setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
    }
  };

  // Handle main image upload
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle additional images upload
  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setAdditionalImages((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setAdditionalImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remove additional image
  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      additionalImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mainImagePreview, additionalImagePreviews]);

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
              Thêm sản phẩm mới
            </h1>
            <p className="text-muted-foreground">
              Tạo sản phẩm giày mới cho cửa hàng
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isSubmitting}>
            Lưu nháp
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
                Lưu & Xuất bản
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Thông tin cơ bản
          </TabsTrigger>
          <TabsTrigger value="variants" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Phân loại
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Hình ảnh
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Giá & Kho
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin sản phẩm</CardTitle>
                  <CardDescription>
                    Nhập thông tin cơ bản của sản phẩm giày.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-full">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tên sản phẩm *</Label>
                      <Input
                        id="name"
                        placeholder="VD: Nike Air Force 1 '07 Low White"
                        className="font-medium"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả sản phẩm *</Label>
                    <Textarea
                      id="description"
                      placeholder="Nhập mô tả chi tiết về sản phẩm, chất liệu, tính năng đặc biệt..."
                      rows={5}
                      className="resize-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danh mục sản phẩm</CardTitle>
                  <CardDescription>
                    Chọn các danh mục phù hợp cho sản phẩm.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingCategories ? (
                    <div className="flex items-center justify-center p-6">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">
                        Đang tải danh mục...
                      </span>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <p className="text-muted-foreground">
                        Không tìm thấy danh mục nào
                      </p>
                      <Link
                        href="/admin/categories/add"
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        Thêm danh mục mới
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50"
                        >
                          <Checkbox
                            id={category.id}
                            checked={selectedCategoryIds.includes(category.id)}
                            onCheckedChange={(checked) =>
                              handleCategoryChange(
                                category.id,
                                checked === true
                              )
                            }
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={category.id}
                              className="font-medium cursor-pointer"
                            >
                              {category.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {category.description || 'Không có mô tả'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Phân loại sản phẩm
              </CardTitle>
              <CardDescription>
                Quản lý các phân loại về size của sản phẩm và số lượng tồn kho
                cho mỗi size.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Size selection with quantity inputs */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Chọn size và số lượng
                </Label>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {availableSizes.map((size) => (
                    <div
                      key={size}
                      className="flex flex-col space-y-2 p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size}`}
                          checked={selectedSizes[size]?.selected || false}
                          onCheckedChange={() => toggleSizeSelection(size)}
                        />
                        <Label
                          htmlFor={`size-${size}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          Size {size}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`quantity-${size}`}
                          className="text-xs text-muted-foreground"
                        >
                          Số lượng:
                        </Label>
                        <Input
                          id={`quantity-${size}`}
                          type="number"
                          placeholder="0"
                          value={selectedSizes[size]?.quantity || 0}
                          onChange={(e) =>
                            updateSizeQuantity(
                              size,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="h-8 text-sm"
                          disabled={!selectedSizes[size]?.selected}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Information about size selection */}
              <div className="rounded-md border p-4 bg-blue-50">
                <h4 className="font-medium text-blue-900 mb-2">Hướng dẫn</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Chọn các size bạn muốn bán cho sản phẩm này</li>
                  <li>• Nhập số lượng tồn kho cho mỗi size</li>
                  <li>
                    • Các size không được chọn sẽ không xuất hiện trong trang
                    sản phẩm
                  </li>
                </ul>
              </div>

              {/* Custom size section */}
              <div className="space-y-3 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    Thêm size tùy chỉnh
                  </Label>
                  <Button variant="outline" size="sm" onClick={addCustomSize}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm size mới
                  </Button>
                </div>

                <div className="space-y-3">
                  {customSizes.map((customSize) => (
                    <div key={customSize.id} className="flex items-end gap-3">
                      <div className="flex-1">
                        <Label
                          htmlFor={`size-${customSize.id}`}
                          className="text-sm"
                        >
                          Kích cỡ
                        </Label>
                        <Input
                          id={`size-${customSize.id}`}
                          value={customSize.size}
                          onChange={(e) =>
                            updateCustomSize(
                              customSize.id,
                              'size',
                              e.target.value
                            )
                          }
                          placeholder="XL, XXL, One Size..."
                          className="h-9"
                        />
                      </div>
                      <div className="flex-1">
                        <Label
                          htmlFor={`quantity-${customSize.id}`}
                          className="text-sm"
                        >
                          Số lượng
                        </Label>
                        <Input
                          id={`quantity-${customSize.id}`}
                          type="number"
                          value={customSize.quantity}
                          onChange={(e) =>
                            updateCustomSize(
                              customSize.id,
                              'quantity',
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          className="h-9"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-2"
                        onClick={() => removeCustomSize(customSize.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Hình ảnh sản phẩm
              </CardTitle>
              <CardDescription>
                Tải lên hình ảnh cho sản phẩm giày. Hình đầu tiên sẽ là hình đại
                diện.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Hình ảnh chính *
                </Label>
                <div
                  className={`relative flex h-64 items-center justify-center rounded-lg border-2 
                    ${
                      mainImagePreview
                        ? 'border-solid border-primary'
                        : 'border-dashed border-muted-foreground/25 hover:border-muted-foreground/50'
                    } 
                    transition-colors cursor-pointer overflow-hidden`}
                  onClick={() => mainImageInputRef.current?.click()}
                >
                  {mainImagePreview ? (
                    <>
                      <Image
                        src={mainImagePreview}
                        alt="Main product image"
                        fill
                        className="object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMainImage(null);
                          setMainImagePreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          Kéo thả hoặc click để tải lên
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Hỗ trợ PNG, JPG, WEBP (Tối đa 10MB)
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Chọn file
                      </Button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={mainImageInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Hình ảnh bổ sung
                </Label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {/* Display additional image previews */}
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="aspect-square relative">
                      <div className="h-full w-full overflow-hidden rounded-lg border-2 border-solid border-primary">
                        <Image
                          src={preview}
                          alt={`Additional image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                        onClick={() => removeAdditionalImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  {/* Add new image button */}
                  <div
                    className="aspect-square cursor-pointer"
                    onClick={() => additionalImagesInputRef.current?.click()}
                  >
                    <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          Thêm ảnh
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={additionalImagesInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Hướng dẫn chụp ảnh
                </Label>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Ảnh chính
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Chụp từ góc 3/4 để thể hiện form dáng</li>
                      <li>• Nền trắng hoặc trong suốt</li>
                      <li>• Độ phân giải tối thiểu 1000x1000px</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50">
                    <h4 className="font-medium text-green-900 mb-2">
                      Ảnh bổ sung
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Ảnh mặt bên, mặt sau, đế giày</li>
                      <li>• Chi tiết logo, chất liệu</li>
                      <li>• Ảnh đang sử dụng (lifestyle)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giá</CardTitle>
                <CardDescription>
                  Thiết lập giá bán của sản phẩm.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full">
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá bán (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="100"
                      value={price}
                      onChange={(e) =>
                        setPrice(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quản lý kho</CardTitle>
                <CardDescription>
                  Thiết lập số lượng tồn kho và cảnh báo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Số lượng tồn kho *</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="100"
                      value={inStock}
                      onChange={(e) =>
                        setInStock(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-stock">
                      Cảnh báo tồn kho tối thiểu
                    </Label>
                    <Input
                      id="min-stock"
                      type="number"
                      placeholder="10"
                      value={minStock}
                      onChange={(e) =>
                        setMinStock(
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
