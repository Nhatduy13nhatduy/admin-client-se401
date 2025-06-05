import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  const recentSales = [
    {
      customer: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      product: "Nike Air Force 1",
      amount: "+2,990,000đ",
      avatar: "/placeholder.svg?height=36&width=36",
    },
    {
      customer: "Trần Thị B",
      email: "tranthib@email.com",
      product: "Adidas Ultraboost 22",
      amount: "+4,290,000đ",
      avatar: "/placeholder.svg?height=36&width=36",
    },
    {
      customer: "Lê Văn C",
      email: "levanc@email.com",
      product: "Converse Chuck Taylor",
      amount: "+1,590,000đ",
      avatar: "/placeholder.svg?height=36&width=36",
    },
    {
      customer: "Phạm Thị D",
      email: "phamthid@email.com",
      product: "Vans Old Skool",
      amount: "+1,890,000đ",
      avatar: "/placeholder.svg?height=36&width=36",
    },
    {
      customer: "Hoàng Văn E",
      email: "hoangvane@email.com",
      product: "New Balance 990v5",
      amount: "+5,490,000đ",
      avatar: "/placeholder.svg?height=36&width=36",
    },
  ]

  return (
    <div className="space-y-8">
      {recentSales.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.avatar || "/placeholder.svg"} alt={sale.customer} />
            <AvatarFallback>
              {sale.customer
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customer}</p>
            <p className="text-sm text-muted-foreground">{sale.product}</p>
          </div>
          <div className="ml-auto font-medium">{sale.amount}</div>
        </div>
      ))}
    </div>
  )
}
