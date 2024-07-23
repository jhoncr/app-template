'use client';
import Image from "next/image"
import Link from "next/link"
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToolbar } from "./nav_tools"
import { useEffect } from "react"


export default function UserHomepage() {
    const { setTools } = useToolbar();

    useEffect(() => {
        setTools(<SearchTool />);
    }, []);

    const SearchTool = () => {
        return <>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
        </>
    }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="archived" className="hidden sm:flex">
                  Archived
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Item
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Items</CardTitle>
                  <CardDescription>
                    Manage your items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserTable rows={dummyData} />
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    items
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
    </div>
  )
  }

interface utablerow {
    name:string;
    status:string;
    price:number;
    total_sales:number;
    created_at:string;
} 

interface UserTableProps {
    rows: utablerow[];
}

const dummyData: utablerow[] = [
    {
        name: "Laser Lemonade Machine",
        status: "Draft",
        price: 499.99,
        total_sales: 25,
        created_at: "2023-07-12 10:42 AM",
    },
    {
        name: "Hypernova Headphones",
        status: "Active",
        price: 129.99,
        total_sales: 100,
        created_at: "2023-10-18 03:21 PM",
    },
    {
        name: "AeroGlow Desk Lamp",
        status: "Active",
        price: 39.99,
        total_sales: 50,
        created_at: "2023-11-29 08:15 AM",
    },
    {
        name: "TechTonic Energy Drink",
        status: "Draft",
        price: 2.99,
        total_sales: 0,
        created_at: "2023-12-25 11:59 PM",
    },
    {
        name: "Gamer Gear Pro Controller",
        status: "Active",
        price: 59.99,
        total_sales: 75,
        created_at: "2024-01-01 12:00 AM",
    },
    {
        name: "Luminous VR Headset",
        status: "Active",
        price: 199.99,
        total_sales: 30,
        created_at: "2024-02-14 02:14 PM",
    },
];

function UserTable( { rows }: UserTableProps) {
    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                    Price
                </TableHead>
                <TableHead className="hidden md:table-cell">
                    Total Sales
                </TableHead>
                <TableHead className="hidden md:table-cell">
                    Created at
                </TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {
            rows.map( row => (
            <TableRow>
                <TableCell className="hidden sm:table-cell">
                    <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src="/placeholder.svg"
                        width="64" />
                </TableCell>
                <TableCell className="font-medium">
                    {row.name}
                </TableCell>
                <TableCell>
                    <Badge variant="outline">{row.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {row.price}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {row.total_sales}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                   {row.created_at}
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
            ))
            }
        </TableBody>
    </Table>
}

