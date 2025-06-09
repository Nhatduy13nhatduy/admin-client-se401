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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  Tag,
  Info,
  ImageIcon,
  Trash2,
  X,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useProduct } from '@/hooks/use-product';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Category, Product, ProductSize } from '@/type/product';

// Define the form schema
const productFormSchema = z.object({
  name: z.string().min(2, { message: 'Tên sản phẩm phải có ít nhất 2 ký tự' }),
  description: z
    .string()
    .min(10, { message: 'Mô tả sản phẩm phải có ít nhất 10 ký tự' }),
  price: z.coerce
    .number()
    .min(10000, { message: 'Giá phải lớn hơn 10,000 VND' }),
  inStock: z.coerce.number().min(0, { message: 'Tồn kho không được âm' }),
  categoryIds: z
    .array(z.string())
    .min(1, { message: 'Phải chọn ít nhất 1 danh mục' }),
  // We'll handle sizes separately since we need to track add/update/remove operations
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Extended types for our form state
interface SizeState {
  id?: string;
  size: string;
  quantity: number;
  status: 'existing' | 'new' | 'modified' | 'deleted';
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { onGetProductById, onUpdateProduct, onGetCategories } = useProduct();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );

  // Photo management states
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);
  const [mainPhotoId, setMainPhotoId] = useState<string | null>(null);

  // Size management states
  const [sizes, setSizes] = useState<SizeState[]>([]);

  // Add this new state to track if a new photo should be the main photo
  const [mainPhotoIsNew, setMainPhotoIsNew] = useState<boolean>(false);
  const [mainPhotoNewIndex, setMainPhotoNewIndex] = useState<number>(-1);

  // Set up form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      inStock: 0,
      categoryIds: [],
    },
  });

  // Fetch product and categories, then populate form
  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        setIsLoading(true);
        const productId = params.id as string;

        // Fetch product data
        const productResponse = await onGetProductById(productId);
        setProduct(productResponse);

        // Find main photo
        const mainPhoto = productResponse.photos.find((p) => p.isMain);
        if (mainPhoto) {
          setMainPhotoId(mainPhoto.id);
        }

        // Initialize sizes state
        const initialSizes = productResponse.sizes.map((size) => ({
          id: size.id,
          size: size.size,
          quantity: size.quantity,
          status: 'existing' as const,
        }));
        setSizes(initialSizes);

        // Populate form with existing data
        form.reset({
          name: productResponse.name,
          description: productResponse.description,
          price: productResponse.price,
          inStock: productResponse.inStock,
          categoryIds: productResponse.categories.map((cat) => cat.id),
        });

        // Fetch all available categories
        const categoriesResponse = await onGetCategories();
        setAvailableCategories(categoriesResponse || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Không thể tải thông tin sản phẩm');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProductAndCategories();
    }
  }, [params.id, form]);

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    if (!product) return;

    try {
      setIsSaving(true);

      // Prepare size management data
      const sizesToAdd = sizes
        .filter((s) => s.status === 'new')
        .map(({ size, quantity }) => ({ size, quantity }));

      const sizesToUpdate = sizes
        .filter((s) => s.status === 'modified' && s.id)
        .map(({ id, size, quantity }) => ({ id, size, quantity }));

      const sizeIdsToRemove = sizes
        .filter((s) => s.status === 'deleted' && s.id)
        .map((s) => s.id as string);

      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add basic product data
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('inStock', data.inStock.toString());

      // Add category IDs
      data.categoryIds.forEach((categoryId) => {
        formData.append('categoryIds', categoryId);
      });

      // Add main photo ID if set
      if (mainPhotoId) {
        formData.append('mainPhotoId', mainPhotoId);
      }

      // Add photos to remove
      photosToDelete.forEach((photoId) => {
        formData.append('photoIdsToRemove', photoId);
      });

      // Add new photos
      if (newPhotos.length > 0) {
        if (
          mainPhotoIsNew &&
          mainPhotoNewIndex >= 0 &&
          mainPhotoNewIndex < newPhotos.length
        ) {
          // Add the selected new photo as main image
          formData.append('mainImage', newPhotos[mainPhotoNewIndex]);

          // Add the rest as additional images
          newPhotos.forEach((file, index) => {
            if (index !== mainPhotoNewIndex) {
              formData.append('additionalImages', file);
            }
          });
        } else {
          // No new main photo selected, add all as additional
          newPhotos.forEach((file) => {
            formData.append('additionalImages', file);
          });
        }
      }

      // Add sizes
      sizesToAdd.forEach((size, index) => {
        formData.append(`sizesToAdd[${index}].size`, size.size);
        formData.append(
          `sizesToAdd[${index}].quantity`,
          size.quantity.toString()
        );
      });

      sizesToUpdate.forEach((size, index) => {
        formData.append(`sizesToUpdate[${index}].id`, size.id as string);
        formData.append(`sizesToUpdate[${index}].size`, size.size);
        formData.append(
          `sizesToUpdate[${index}].quantity`,
          size.quantity.toString()
        );
      });

      sizeIdsToRemove.forEach((sizeId) => {
        formData.append('sizeIdsToRemove', sizeId);
      });

      // Send the updated data
      await onUpdateProduct(product.id, formData, true);
      toast.success('Sản phẩm đã được cập nhật thành công');

      // Redirect to product details page
      router.push(`/admin/products/view/${product.id}`);
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Không thể cập nhật sản phẩm');
    } finally {
      setIsSaving(false);
    }
  };

  // Size management handlers
  const addSize = () => {
    setSizes([
      ...sizes,
      {
        size: '',
        quantity: 0,
        status: 'new',
      },
    ]);
  };

  const updateSize = (
    index: number,
    field: 'size' | 'quantity',
    value: string | number
  ) => {
    const updatedSizes = [...sizes];
    const size = updatedSizes[index];

    if (field === 'size') {
      size.size = value as string;
    } else if (field === 'quantity') {
      size.quantity = value as number;
    }

    // Mark as modified if it was an existing size
    if (size.status === 'existing') {
      size.status = 'modified';
    }

    setSizes(updatedSizes);
  };

  const removeSize = (index: number) => {
    const size = sizes[index];
    if (size.id) {
      // If it's an existing size, mark it for deletion
      const updatedSizes = [...sizes];
      updatedSizes[index].status = 'deleted';
      setSizes(updatedSizes);
    } else {
      // If it's a new size, remove it from the array
      setSizes(sizes.filter((_, i) => i !== index));
    }
  };

  // Photo management handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewPhotos((prev) => [...prev, ...filesArray]);
    }
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!product) return;

    // Add to photos to delete list
    setPhotosToDelete((prev) => [...prev, photoId]);

    // Update product state to reflect the change
    setProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        photos: prev.photos.filter((p) => p.id !== photoId),
      };
    });

    toast.success('Ảnh sẽ bị xóa khi lưu thay đổi');
  };

  const handleSetMainPhoto = (photoId: string) => {
    if (!product) return;

    // Set as main photo
    setMainPhotoId(photoId);

    // Update product state to reflect the change
    setProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        photos: prev.photos.map((p) => ({
          ...p,
          isMain: p.id === photoId,
        })),
      };
    });

    toast.success('Ảnh sẽ được đặt làm ảnh chính khi lưu thay đổi');
  };

  // Add this function to handle setting a new photo as main
  const handleSetNewPhotoAsMain = (index: number) => {
    setMainPhotoIsNew(true);
    setMainPhotoNewIndex(index);
    setMainPhotoId('new'); // Special marker to indicate a new photo is main

    toast.success('Ảnh mới sẽ được đặt làm ảnh chính khi lưu thay đổi');
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

  // Filter out sizes marked for deletion for display purposes
  const activeSizes = sizes.filter((size) => size.status !== 'deleted');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/products/view/${product.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chỉnh sửa sản phẩm
            </h1>
            <p className="text-muted-foreground">ID: {product.id}</p>
          </div>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-600 to-indigo-600"
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
                <CardDescription>
                  Nhập thông tin cơ bản của sản phẩm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên sản phẩm</FormLabel>
                      <FormControl>
                        <Input placeholder="Nike Air Max 90" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả sản phẩm</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả chi tiết về sản phẩm..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá bán (VND)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2,000,000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tổng tồn kho</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Danh mục & Phân loại</CardTitle>
                <CardDescription>
                  Chọn danh mục và phân loại cho sản phẩm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Danh mục sản phẩm</FormLabel>
                        <FormDescription>
                          Chọn ít nhất một danh mục cho sản phẩm
                        </FormDescription>
                      </div>
                      <div className="space-y-2">
                        {availableCategories.map((category) => (
                          <FormField
                            key={category.id}
                            control={form.control}
                            name="categoryIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={category.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        category.id
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              category.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== category.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-normal">
                                      {category.name}
                                    </FormLabel>
                                    {category.description && (
                                      <FormDescription className="text-xs">
                                        {category.description}
                                      </FormDescription>
                                    )}
                                  </div>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quản lý hình ảnh</CardTitle>
              <CardDescription>
                Thêm, xóa hoặc đặt ảnh chính cho sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {product.photos
                    .filter((photo) => !photosToDelete.includes(photo.id))
                    .map((photo) => (
                      <div
                        key={photo.id}
                        className="relative group border rounded-md overflow-hidden"
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={photo.url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {(photo.isMain || photo.id === mainPhotoId) && (
                          <div className="absolute bottom-0 left-0 right-0 bg-primary text-xs text-white text-center py-0.5">
                            Ảnh chính
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!(photo.isMain || photo.id === mainPhotoId) && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => handleSetMainPhoto(photo.id)}
                            >
                              Đặt chính
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeletePhoto(photo.id)}
                            disabled={photo.isMain || photo.id === mainPhotoId}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                  {/* Preview of new photos */}
                  {newPhotos.map((photo, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative group border rounded-md overflow-hidden"
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={URL.createObjectURL(photo)}
                          alt={`New photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute top-1 right-1">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => removeNewPhoto(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      {mainPhotoIsNew && mainPhotoNewIndex === index && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary text-xs text-white text-center py-0.5">
                          Ảnh chính mới
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!(mainPhotoIsNew && mainPhotoNewIndex === index) && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleSetNewPhotoAsMain(index)}
                          >
                            Đặt chính
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add photo button */}
                  <div className="border border-dashed rounded-md flex items-center justify-center aspect-square">
                    <label
                      htmlFor="add-photo"
                      className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                    >
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Thêm ảnh
                      </span>
                      <input
                        id="add-photo"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Quản lý kích cỡ</CardTitle>
                  <CardDescription>
                    Thêm hoặc chỉnh sửa kích cỡ và số lượng tồn kho
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSize}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm kích cỡ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSizes.map((size, index) => (
                  <div
                    key={size.id || `new-size-${index}`}
                    className="flex items-end gap-3 border p-3 rounded-md"
                  >
                    <div className="flex-1">
                      <FormLabel>Kích cỡ</FormLabel>
                      <Input
                        value={size.size}
                        onChange={(e) =>
                          updateSize(index, 'size', e.target.value)
                        }
                        placeholder="VD: M, L, XL, 39, 40..."
                      />
                    </div>

                    <div className="flex-1">
                      <FormLabel>Số lượng</FormLabel>
                      <Input
                        type="number"
                        value={size.quantity}
                        onChange={(e) =>
                          updateSize(
                            index,
                            'quantity',
                            parseInt(e.target.value)
                          )
                        }
                        placeholder="10"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => removeSize(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {activeSizes.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-md">
                    <Tag className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Chưa có kích cỡ nào
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={addSize}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm kích cỡ
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
