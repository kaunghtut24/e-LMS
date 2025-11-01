import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Pin,
  Lock,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Star,
  CheckCircle2,
  MessageSquare,
  Send,
  MoreHorizontal,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForumStore } from '@/store/forumStore';
import { ReactionType } from '@/types/phase3-forums';

export default function ThreadView() {
  const { courseId, threadId } = useParams<{ courseId: string; threadId: string }>();
  const {
    currentThread,
    posts,
    fetchThread,
    fetchPosts,
    createPost,
    addReaction,
    removeReaction,
    incrementViews,
    isLoading,
    error,
    clearError,
  } = useForumStore();

  const [newPostContent, setNewPostContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    if (threadId) {
      fetchThread(threadId);
      fetchPosts(threadId);
      incrementViews(threadId);
    }
    clearError();
  }, [threadId]);

  const handleSubmitPost = async () => {
    if (!newPostContent.trim() || !threadId) return;

    const success = await createPost({
      thread_id: threadId,
      content: newPostContent,
      parent_post_id: replyingTo || undefined,
    });

    if (success) {
      setNewPostContent('');
      setReplyingTo(null);
      fetchPosts(threadId);
    }
  };

  const handleReaction = async (postId: string, reactionType: ReactionType) => {
    const post = posts.find((p) => p.id === postId);
    const userReaction = post?.reactions?.find((r) => r.user_id === 'current-user-id');

    if (userReaction?.reaction_type === reactionType) {
      await removeReaction(postId, reactionType);
    } else {
      await addReaction({ post_id: postId, reaction_type: reactionType });
      if (userReaction) {
        await removeReaction(postId, userReaction.reaction_type);
      }
    }
    if (threadId) {
      fetchPosts(threadId);
    }
  };

  const getReactionIcon = (type: ReactionType) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="h-4 w-4" />;
      case 'upvote':
        return <ThumbsUp className="h-4 w-4" />;
      case 'downvote':
        return <ThumbsDown className="h-4 w-4" />;
      case 'helpful':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'celebrate':
        return <Star className="h-4 w-4" />;
      case 'insightful':
        return <Eye className="h-4 w-4" />;
      case 'agree':
        return <CheckCircle className="h-4 w-4" />;
      case 'disagree':
        return <X className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const getReactionColor = (type: ReactionType) => {
    switch (type) {
      case 'like':
        return 'text-blue-600 hover:bg-blue-50';
      case 'upvote':
        return 'text-green-600 hover:bg-green-50';
      case 'downvote':
        return 'text-red-600 hover:bg-red-50';
      case 'helpful':
        return 'text-purple-600 hover:bg-purple-50';
      case 'celebrate':
        return 'text-yellow-600 hover:bg-yellow-50';
      case 'insightful':
        return 'text-indigo-600 hover:bg-indigo-50';
      case 'agree':
        return 'text-green-600 hover:bg-green-50';
      case 'disagree':
        return 'text-red-600 hover:bg-red-50';
      default:
        return 'text-gray-600 hover:bg-gray-50';
    }
  };

  const groupReactions = (reactions: any[]) => {
    const grouped: Record<ReactionType, any[]> = {
      like: [],
      upvote: [],
      downvote: [],
      helpful: [],
      celebrate: [],
      insightful: [],
      agree: [],
      disagree: [],
    };
    reactions?.forEach((reaction) => {
      if (grouped[reaction.reaction_type]) {
        grouped[reaction.reaction_type].push(reaction);
      }
    });
    return grouped;
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

  if (isLoading && !currentThread) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading thread...</p>
        </div>
      </div>
    );
  }

  if (!currentThread) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Thread not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Link to={`/courses/${courseId}/forum`}>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Button>
      </Link>

      {/* Error Message */}
      {error && (
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      {/* Thread Header */}
      <Card>
        <CardHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {currentThread.is_pinned && <Pin className="h-4 w-4 text-muted-foreground" />}
              {currentThread.is_locked && <Lock className="h-4 w-4 text-muted-foreground" />}
              {currentThread.is_solved && (
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Solved
                </Badge>
              )}
              <Badge variant="outline">{currentThread.type}</Badge>
            </div>
            <h1 className="text-2xl font-bold">{currentThread.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={currentThread.creator?.avatar_url} />
                  <AvatarFallback>
                    {currentThread.creator?.first_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {currentThread.creator?.first_name} {currentThread.creator?.last_name}
                </span>
              </div>
              <span>•</span>
              <span>{formatTimeAgo(currentThread.created_at)}</span>
              <span>•</span>
              <span>{currentThread.views_count} views</span>
              <span>•</span>
              <span>{currentThread.replies_count} replies</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p>{currentThread.content}</p>
          </div>
          {currentThread.tags && currentThread.tags.length > 0 && (
            <div className="flex gap-2 mt-4">
              {currentThread.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => {
          const groupedReactions = groupReactions(post.reactions || []);
          const userReaction = post.reactions?.find((r) => r.user_id === 'current-user-id');

          return (
            <Card key={post.id} className={post.is_solution ? 'border-green-500' : ''}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Post Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.creator?.avatar_url} />
                        <AvatarFallback>
                          {post.creator?.first_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">
                          {post.creator?.first_name} {post.creator?.last_name}
                          {post.is_instructor_reply && (
                            <Badge variant="outline" className="ml-2">
                              Instructor
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTimeAgo(post.created_at)}
                          {post.is_edited && (
                            <span className="ml-2">(edited)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {post.is_solution && (
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Solution
                      </Badge>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{post.content}</p>
                  </div>

                  {/* Post Attachments */}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="space-y-2">
                      {post.attachments.map((attachment) => (
                        <div key={attachment.id} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {attachment.original_filename}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {Object.entries(groupedReactions).map(([type, reactions]) =>
                      reactions.length > 0 ? (
                        <Button
                          key={type}
                          variant={userReaction?.reaction_type === type ? 'default' : 'outline'}
                          size="sm"
                          className={`h-8 ${userReaction?.reaction_type === type ? '' : getReactionColor(type as ReactionType)}`}
                          onClick={() => handleReaction(post.id, type as ReactionType)}
                        >
                          {getReactionIcon(type as ReactionType)}
                          <span className="ml-1 text-xs">{reactions.length}</span>
                        </Button>
                      ) : null
                    )}
                    {!currentThread.is_locked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(post.id)}
                      >
                        Reply
                      </Button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyingTo === post.id && (
                    <div className="space-y-2 mt-4">
                      <Textarea
                        placeholder="Write a reply..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSubmitPost}>
                          <Send className="h-4 w-4 mr-2" />
                          Post Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReplyingTo(null);
                            setNewPostContent('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {post.replies && post.replies.length > 0 && (
                    <div className="space-y-4 pl-6 border-l-2">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={reply.creator?.avatar_url} />
                              <AvatarFallback>
                                {reply.creator?.first_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {reply.creator?.first_name} {reply.creator?.last_name}
                            </span>
                            <span>•</span>
                            <span>{formatTimeAgo(reply.created_at)}</span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* New Post Form */}
      {!currentThread.is_locked && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Add a Reply</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={6}
              />
              <Button onClick={handleSubmitPost} disabled={!newPostContent.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Post Reply
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked Message */}
      {currentThread.is_locked && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Lock className="h-5 w-5" />
              <span>This thread is locked. No new replies are allowed.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Import X icon
import { X } from 'lucide-react';
