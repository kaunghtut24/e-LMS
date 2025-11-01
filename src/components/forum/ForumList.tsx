import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MessageSquare,
  Pin,
  Lock,
  Eye,
  MessageCircle,
  Users,
  Clock,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForumStore } from '@/store/forumStore';
import { ThreadType, ThreadFilter } from '@/types/phase3-forums';

export default function ForumList() {
  const { courseId } = useParams<{ courseId: string }>();
  const {
    categories,
    threads,
    fetchCategories,
    fetchThreads,
    isLoading,
    error,
    clearError,
  } = useForumStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [filter, setFilter] = useState<ThreadFilter>({});

  useEffect(() => {
    if (courseId) {
      fetchCategories(courseId);
      fetchThreads(courseId);
    }
    clearError();
  }, [courseId]);

  const handleFilter = () => {
    if (!courseId) return;

    const newFilter: ThreadFilter = {
      search: searchQuery || undefined,
      category_id: selectedCategory === 'all' ? undefined : selectedCategory,
      type: selectedType === 'all' ? undefined : (selectedType as ThreadType),
    };

    setFilter(newFilter);
    fetchThreads(courseId, newFilter);
  };

  const getThreadIcon = (type: ThreadType) => {
    switch (type) {
      case 'announcement':
        return '📢';
      case 'question':
        return '❓';
      case 'poll':
        return '📊';
      case 'assignment':
        return '📝';
      default:
        return '💬';
    }
  };

  const getTypeColor = (type: ThreadType) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'question':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'poll':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'assignment':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading && threads.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading forum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Course Discussions</h1>
          <p className="text-muted-foreground mt-1">
            Engage with peers and instructors
          </p>
        </div>
        <Link to={`/courses/${courseId}/forum/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Thread
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      {/* Categories Overview */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Organize discussions by topic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    handleFilter();
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search threads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="discussion">Discussion</SelectItem>
                <SelectItem value="question">Question</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="poll">Poll</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleFilter} variant="default">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Threads List */}
      <div className="space-y-4">
        {threads.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No threads found. Be the first to start a discussion!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          threads.map((thread) => (
            <Card key={thread.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <Link to={`/courses/${courseId}/forum/${thread.id}`}>
                  <div className="space-y-3">
                    {/* Thread Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        {thread.is_pinned && <Pin className="h-4 w-4 text-muted-foreground" />}
                        {thread.is_locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                        {thread.is_solved && <Badge variant="outline" className="text-green-600">Solved</Badge>}
                        <Badge className={getTypeColor(thread.type)}>
                          {getThreadIcon(thread.type)} {thread.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTimeAgo(thread.last_activity_at)}
                      </div>
                    </div>

                    {/* Thread Title */}
                    <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                      {thread.title}
                    </h3>

                    {/* Thread Preview */}
                    <p className="text-muted-foreground line-clamp-2">
                      {thread.content}
                    </p>

                    {/* Thread Tags */}
                    {thread.tags && thread.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {thread.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Thread Stats */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{thread.views_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{thread.replies_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{thread.participants_count}</span>
                      </div>
                      {thread.creator && (
                        <div className="flex items-center gap-2 ml-auto">
                          {thread.creator.avatar_url ? (
                            <img
                              src={thread.creator.avatar_url}
                              alt={thread.creator.first_name}
                              className="h-6 w-6 rounded-full"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                              {thread.creator.first_name[0]}
                            </div>
                          )}
                          <span>
                            {thread.creator.first_name} {thread.creator.last_name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More Button */}
      {threads.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => courseId && fetchThreads(courseId)} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
