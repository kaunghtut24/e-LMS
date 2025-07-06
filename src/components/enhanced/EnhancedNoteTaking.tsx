import React, { useState, useRef } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  Clock,
  Tag,
  BookmarkPlus,
  Download,
  Share
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';
import { Note } from '../../types';

interface EnhancedNote extends Note {
  id: string;
  title: string;
  tags: string[];
  isBookmarked: boolean;
  lessonTitle: string;
}

interface EnhancedNoteTakingProps {
  notes: EnhancedNote[];
  currentLessonId: string;
  currentLessonTitle: string;
  onAddNote: (content: string, title: string, tags: string[]) => void;
  onUpdateNote: (noteId: string, content: string, title: string, tags: string[]) => void;
  onDeleteNote: (noteId: string) => void;
  onBookmarkNote: (noteId: string) => void;
  className?: string;
}

const EnhancedNoteTaking: React.FC<EnhancedNoteTakingProps> = ({
  notes,
  currentLessonId,
  currentLessonTitle,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onBookmarkNote,
  className
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('current');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter notes based on search and filters
  const filteredNotes = React.useMemo(() => {
    let filtered = notes;

    // Filter by lesson
    if (activeTab === 'current') {
      filtered = filtered.filter(note => note.lessonId === currentLessonId);
    } else if (activeTab === 'bookmarked') {
      filtered = filtered.filter(note => note.isBookmarked);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by tag
    if (filterTag) {
      filtered = filtered.filter(note => note.tags.includes(filterTag));
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notes, currentLessonId, activeTab, searchQuery, filterTag]);

  // Get all unique tags
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [notes]);

  const handleCreateNote = () => {
    if (!newNoteContent.trim()) return;

    const tags = newNoteTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onAddNote(
      newNoteContent,
      newNoteTitle || `Note from ${currentLessonTitle}`,
      tags
    );

    // Reset form
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteTags('');
    setIsCreating(false);
  };

  const handleUpdateNote = (note: EnhancedNote) => {
    if (!newNoteContent.trim()) return;

    const tags = newNoteTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onUpdateNote(note.id, newNoteContent, newNoteTitle, tags);
    setEditingNoteId(null);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteTags('');
  };

  const startEditing = (note: EnhancedNote) => {
    setEditingNoteId(note.id);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    setNewNoteTags(note.tags.join(', '));
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setIsCreating(false);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteTags('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Notes</CardTitle>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download as Text
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => setIsCreating(true)}
              size="sm"
              disabled={isCreating || editingNoteId !== null}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {allTags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                <Button
                  variant={filterTag === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterTag(null)}
                  className="h-6 text-xs"
                >
                  All
                </Button>
                {allTags.slice(0, 5).map(tag => (
                  <Button
                    key={tag}
                    variant={filterTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                    className="h-6 text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mx-4 mb-4">
            <TabsTrigger value="current">Current Lesson</TabsTrigger>
            <TabsTrigger value="all">All Notes</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto px-4 pb-4">
            {/* Create Note Form */}
            {isCreating && (
              <Card className="mb-4 border-primary">
                <CardContent className="p-4 space-y-3">
                  <Input
                    placeholder="Note title (optional)"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                  />
                  <Textarea
                    ref={textareaRef}
                    placeholder="Write your note here..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    rows={4}
                    autoFocus
                  />
                  <Input
                    placeholder="Tags (comma separated)"
                    value={newNoteTags}
                    onChange={(e) => setNewNoteTags(e.target.value)}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={cancelEditing}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleCreateNote}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes List */}
            <TabsContent value={activeTab} className="mt-0 space-y-3">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookmarkPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notes found</p>
                  <p className="text-sm">
                    {activeTab === 'current' 
                      ? 'Start taking notes for this lesson'
                      : 'Create your first note to get started'
                    }
                  </p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <Card key={note.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {editingNoteId === note.id ? (
                        <div className="space-y-3">
                          <Input
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            placeholder="Note title"
                          />
                          <Textarea
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            rows={4}
                          />
                          <Input
                            value={newNoteTags}
                            onChange={(e) => setNewNoteTags(e.target.value)}
                            placeholder="Tags (comma separated)"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={cancelEditing}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={() => handleUpdateNote(note)}>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-sm">{note.title}</h3>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onBookmarkNote(note.id)}
                                className="h-6 w-6 p-0"
                              >
                                <BookmarkPlus className={cn(
                                  "w-3 h-3",
                                  note.isBookmarked ? "text-yellow-500 fill-current" : "text-muted-foreground"
                                )} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditing(note)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteNote(note.id)}
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
                            {note.content}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {note.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  <Tag className="w-2 h-2 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimestamp(note.timestamp)}
                            </div>
                          </div>
                          
                          {activeTab !== 'current' && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs text-muted-foreground">
                                From: {note.lessonTitle}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedNoteTaking;
