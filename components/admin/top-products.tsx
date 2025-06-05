import { Badge } from "@/components/ui/badge"

export function TopProducts() {
  const topProducts = [
    {
      name: "Nike Air Force 1 '07",
      sales: 234,
      revenue: "468,000,000đ",
      trend: "+12%",
      category: "Sneakers",
    },
    {
      name: "Adidas Ultraboost 22",
      sales: 189,
      revenue: "378,000,000đ",
      trend: "+8%",
      category: "Running",
    },
    {
      name: "Converse Chuck Taylor",
      sales: 156,
      revenue: "234,000,000đ",
      trend: "+15%",
      category: "Casual",
    },
    {
      name: "Vans Old Skool",
      sales: 134,
      revenue: "201,000,000đ",
      trend: "+5%",
      category: "Skateboard",
    },
    {
      name: "New Balance 990v5",
      sales: 98,
      revenue: "294,000,000đ",
      trend: "+22%",
      category: "Lifestyle",
    },
  ]

  return (
    <div className="space-y-4">
      {topProducts.map((product, index) => (
        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary font-bold">
              #{index + 1}
            </div>
            <div>
              <p className="font-medium">{product.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{product.sales} đôi</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{product.revenue}</p>
            <p className="text-xs text-green-600">{product.trend}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
