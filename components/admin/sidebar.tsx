"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  PlusCircle,
  Eye,
  ShoppingBag,
  Tag,
} from "lucide-react"
import { useState } from "react"

interface SidebarItemProps {
  icon: React.ElementType
  title: string
  path: string
  expanded: boolean
  isActive: boolean
  hasSubMenu?: boolean
  subMenuItems?: { icon: React.ElementType; title: string; path: string }[]
}

const SidebarItem = ({
  icon: Icon,
  title,
  path,
  expanded,
  isActive,
  hasSubMenu = false,
  subMenuItems = [],
}: SidebarItemProps) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false)

  const handleSubMenuToggle = (e: React.MouseEvent) => {
    if (hasSubMenu) {
      e.preventDefault()
      e.stopPropagation()
      setSubMenuOpen(!subMenuOpen)
    }
  }

  // Nếu sidebar thu nhỏ và có submenu, chuyển thành link trực tiếp
  const shouldShowAsDirectLink = !expanded && hasSubMenu

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            {shouldShowAsDirectLink ? (
              <Link
                href={path}
                className={cn(
                  "group flex h-12 w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-primary-50 hover:text-primary",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all mx-auto",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-primary",
                  )}
                />
              </Link>
            ) : hasSubMenu ? (
              <button
                onClick={handleSubMenuToggle}
                className={cn(
                  "group flex h-12 w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all text-left",
                  isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-primary-50 hover:text-primary",
                  subMenuOpen && !isActive && "bg-primary-50",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all",
                    expanded ? "mr-3" : "mx-auto",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-primary",
                  )}
                />
                {expanded && <span className="flex-1 truncate">{title}</span>}
                {expanded && (
                  <ChevronRight
                    className={cn("h-4 w-4 transition-transform duration-200", subMenuOpen && "rotate-90")}
                  />
                )}
              </button>
            ) : (
              <Link
                href={path}
                className={cn(
                  "group flex h-12 w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-primary-50 hover:text-primary",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all",
                    expanded ? "mr-3" : "mx-auto",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-primary",
                  )}
                />
                {expanded && <span className="flex-1 truncate">{title}</span>}
              </Link>
            )}
          </TooltipTrigger>
          {!expanded && (
            <TooltipContent side="right" className="flex items-center gap-4">
              {title}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence initial={false}>
        {hasSubMenu && subMenuOpen && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden pl-4"
          >
            <div className="ml-2 border-l border-gray-200 pl-2 pt-1">
              {subMenuItems.map((item, idx) => (
                <SubMenuItem key={idx} item={item} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const SubMenuItem = ({ item }: { item: { icon: React.ElementType; title: string; path: string } }) => {
  const ItemIcon = item.icon
  const subPath = item.path
  const isSubActive = usePathname() === subPath

  return (
    <Link
      href={subPath}
      className={cn(
        "flex h-10 items-center rounded-lg px-3 py-2 text-sm transition-all",
        isSubActive ? "bg-primary text-white" : "text-gray-700 hover:bg-primary-50 hover:text-primary",
      )}
    >
      <ItemIcon className={cn("mr-2 h-4 w-4", isSubActive ? "text-white" : "text-gray-500")} />
      <span className="truncate">{item.title}</span>
    </Link>
  )
}

export function AdminSidebar() {
  const { expanded, toggleSidebar } = useSidebar()
  const pathname = usePathname()

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      path: "/admin",
      hasSubMenu: false,
    },
    {
      icon: Package,
      title: "Quản lý sản phẩm",
      path: "/admin/products",
      hasSubMenu: true,
      subMenuItems: [
        {
          icon: Eye,
          title: "Danh sách sản phẩm",
          path: "/admin/products",
        },
        {
          icon: PlusCircle,
          title: "Thêm sản phẩm",
          path: "/admin/products/add",
        },
      ],
    },
    {
      icon: ShoppingBag,
      title: "Quản lý danh mục",
      path: "/admin/categories",
      hasSubMenu: true,
      subMenuItems: [
        {
          icon: Eye,
          title: "Danh sách danh mục",
          path: "/admin/categories",
        },
        {
          icon: PlusCircle,
          title: "Thêm danh mục",
          path: "/admin/categories/add",
        },
      ],
    },
    {
      icon: ShoppingCart,
      title: "Quản lý đơn hàng",
      path: "/admin/orders",
      hasSubMenu: false,
    },
    {
      icon: Users,
      title: "Quản lý người dùng",
      path: "/admin/users",
      hasSubMenu: false,
    },
    {
      icon: Tag,
      title: "Quản lý voucher",
      path: "/admin/vouchers",
      hasSubMenu: false,
    },
  ]

  return (
    <TooltipProvider>
      <motion.div
        initial={false}
        animate={{
          width: expanded ? "var(--sidebar-width-expanded)" : "var(--sidebar-width-collapsed)",
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        className={cn(
          "relative flex h-full flex-col border-r border-gray-200 bg-white shadow-sm",
          "transition-all duration-300 ease-in-out",
        )}
        style={
          {
            "--sidebar-width-expanded": "320px",
            "--sidebar-width-collapsed": "80px",
          } as React.CSSProperties
        }
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-3">
          <AnimatePresence initial={false} mode="wait">
            {expanded ? (
              <motion.div
                key="logo-expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <span className="text-lg font-bold text-white">👟</span>
                </div>
                <span className="text-xl font-bold text-gray-900">ShoesAdmin</span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mx-auto"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <span className="text-lg font-bold text-white">👟</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={toggleSidebar}>
            {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>

        <ScrollArea className="flex-1 py-2">
          <div className="flex flex-col gap-1 px-2">
            {sidebarItems.map((item, idx) => (
              <SidebarItem
                key={idx}
                icon={item.icon}
                title={item.title}
                path={item.path}
                expanded={expanded}
                isActive={pathname === item.path}
                hasSubMenu={item.hasSubMenu}
                subMenuItems={item.subMenuItems}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="mt-auto border-t border-gray-200 p-3">
          <div className={cn("flex items-center gap-3 rounded-lg p-2", expanded ? "justify-start" : "justify-center")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary">
              <span className="text-sm font-medium">AD</span>
            </div>
            {expanded && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">Admin User</span>
                <span className="text-xs text-gray-500">admin@shoesstore.com</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
