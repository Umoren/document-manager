import { useState } from 'react'
import { useRouter } from 'next/router'
import { Folder, Search, FileText, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from 'next/link'

interface Category {
    id: string
    name: string
    documentCount: number
    icon: keyof typeof icons
}

const icons = {
    Folder,
    FileText,
}

interface CategoryCardProps {
    category: Category
    isLoading?: boolean
}

const CategoryCard = ({ category, isLoading }: CategoryCardProps) => {
    const Icon = icons[category.icon] || Folder
    const router = useRouter();

    if (isLoading) {
        return (
            <Card className="h-[200px] transition-all hover:scale-105 hover:shadow-md">
                <CardHeader className="flex items-center justify-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                </CardHeader>
                <CardContent className="text-center">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-9 w-1/2" />
                </CardFooter>
            </Card>
        )
    }

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`/categories/${category.id}`);
    };

    return (
        <Card className="h-[200px] transition-all hover:scale-105 hover:shadow-md cursor-pointer">
            <CardHeader className="flex items-center justify-center">
                <Icon className="h-12 w-12 text-primary" />
            </CardHeader>
            <CardContent className="text-center">
                <h3 className="text-xl font-semibold">{category.name}</h3>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    {category.documentCount} documents
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClick}
                >
                    View Documents
                </Button>
            </CardFooter>
        </Card>
    );
}

interface CategoriesProps {
    categories: Category[]
    isLoading?: boolean
    error?: string
}

export default function Categories({ categories, isLoading, error }: CategoriesProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="h-40 mb-8 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold mb-2">Document Categories</h1>
                <p className="text-xl text-muted-foreground mb-4">
                    {categories.length} total categories
                </p>
                <div className="w-full max-w-md relative">
                    <Input
                        type="search"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10" // Added padding for the icon
                    />
                    <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            {error ? (
                <div className="text-center text-red-500 flex flex-col items-center justify-center h-64">
                    <AlertCircle className="h-12 w-12 mb-4" />
                    <p>{error}</p>
                </div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {[...Array(6)].map((_, index) => (
                        <CategoryCard key={index} category={{} as Category} isLoading />
                    ))}
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-64">
                    <Folder className="h-12 w-12 mb-4" />
                    <p>No categories found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {filteredCategories.map(category => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            )}
        </div>
    )
}