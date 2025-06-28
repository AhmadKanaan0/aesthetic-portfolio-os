import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/animated-section"
import { useQuery } from '@tanstack/react-query'
import { fetchBlogPosts, type PostNode } from '@/lib/hashnode'
import { format } from 'date-fns'
import { Skeleton } from "@/components/ui/skeleton"
import { OptimizedImage } from "@/components/optimized-image"
import { VirtualList } from "@/components/virtual-list"
import { useDebounce } from "@/hooks/use-debounce"
import { useState, useMemo } from "react"
import { SEOHead } from "@/components/seo-head"

interface BlogPost {
  id: string
  title: string
  brief: string
  publishedAt: string
  readTimeInMinutes: number
  coverImage?: {
    url: string
  }
  tags: Array<{
    name: string
  }>
  url: string
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { data: posts, isLoading, isError } = useQuery<PostNode[]>({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  const blogPosts = useMemo(() => 
    posts?.map((post: BlogPost) => ({
      id: post.id,
      title: post.title,
      excerpt: post.brief,
      date: format(new Date(post.publishedAt), "MMM dd, yyyy"),
      readTime: `${post.readTimeInMinutes} min read`,
      category: post.tags.length > 0 ? post.tags[0].name : "General",
      image: post.coverImage?.url || "/placeholder.svg",
      url: post.url
    })) || [], [posts])

  const allCategories = useMemo(() => 
    ["All", ...new Set(posts?.flatMap(post => 
      post.tags.map(tag => tag.name)
    ) || [])], [posts])

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [blogPosts, debouncedSearchTerm, selectedCategory])

  const renderBlogPost = (post: typeof blogPosts[0], index: number) => (
    <AnimatedItem key={post.id}>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow border-0">
        <div className="aspect-video overflow-hidden">
          <OptimizedImage
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            priority={index < 3} // Prioritize first 3 images
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-xs text-muted-foreground">{post.date}</span>
          </div>
          <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-0">
          <span className="text-xs text-muted-foreground">{post.readTime}</span>
          <Button variant="ghost" size="sm" asChild>
            <a href={post.url} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </Button>
        </CardFooter>
      </Card>
    </AnimatedItem>
  )

  if (isLoading) {
    return (
      <>
        <SEOHead 
          title="Blog - Ahmad Kanaan"
          description="Read my latest articles about web development, React, Node.js, and modern programming techniques."
          type="website"
        />
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-t-lg" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <SEOHead 
          title="Blog - Ahmad Kanaan"
          description="Read my latest articles about web development, React, Node.js, and modern programming techniques."
          type="website"
        />
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Failed to load posts</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't fetch the blog posts. Please try again later.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEOHead 
        title="Blog - Ahmad Kanaan"
        description="Read my latest articles about web development, React, Node.js, and modern programming techniques."
        type="website"
        keywords={['blog', 'web development', 'react', 'nodejs', 'programming', 'tutorials']}
      />
      <div className="space-y-8 max-w-5xl mx-auto">
        <AnimatedSection variant="slideUp" duration={0.6}>
          <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Blog</h1>
              <p className="text-gray-700 dark:text-gray-300">Thoughts, tutorials, and insights on web development</p>
            </div>
            <div className="flex items-center w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search articles..." 
                  className="pl-8 w-full bg-white dark:bg-gray-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection variant="slideUp" delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-6">
            {allCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1} threshold={0.1}>
          {filteredPosts.length > 20 ? (
            <VirtualList
              items={filteredPosts}
              itemHeight={400}
              containerHeight={800}
              renderItem={renderBlogPost}
              className="grid gap-6"
            />
          ) : (
            <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {filteredPosts.map((post, index) => renderBlogPost(post, index))}
            </div>
          )}
        </AnimatedSection>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
          </div>
        )}

        <AnimatedSection variant="fadeIn" delay={0.4} className="flex justify-center">
          <Button variant="outline">Load More Articles</Button>
        </AnimatedSection>
      </div>
    </>
  )
}