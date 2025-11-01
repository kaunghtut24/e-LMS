import React, { useState } from 'react';
import {
  Save,
  X,
  Upload,
  FileText,
  Video,
  HelpCircle,
  BookOpen,
  Settings,
  Eye,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface LessonItem {
  id: string;
  title: string;
  type: 'text' | 'video' | 'quiz' | 'assignment' | 'interactive' | 'document';
  content: any;
  duration: string;
  isPreview: boolean;
  order: number;
}

interface LessonEditorProps {
  lesson: LessonItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: LessonItem) => void;
}

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

const LessonEditor: React.FC<LessonEditorProps> = ({
  lesson,
  isOpen,
  onClose,
  onSave
}) => {
  const [editingLesson, setEditingLesson] = useState<LessonItem>(
    lesson || {
      id: `lesson-${Date.now()}`,
      title: 'New Lesson',
      type: 'text',
      content: {},
      duration: '5m',
      isPreview: false,
      order: 0
    }
  );

  const handleSave = () => {
    onSave(editingLesson);
    onClose();
  };

  const updateContent = (updates: any) => {
    setEditingLesson(prev => ({
      ...prev,
      content: { ...prev.content, ...updates }
    }));
  };

  const renderTextEditor = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Lesson Content</Label>
        <Textarea
          placeholder="Write your lesson content here..."
          rows={10}
          value={editingLesson.content.text || ''}
          onChange={(e) => updateContent({ text: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Images (Optional)</Label>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Image URL or upload"
            value={editingLesson.content.imageUrl || ''}
            onChange={(e) => updateContent({ imageUrl: e.target.value })}
          />
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>
    </div>
  );

  const renderVideoEditor = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Video Source</Label>
        <Select
          value={editingLesson.content.videoSource || 'url'}
          onValueChange={(value) => updateContent({ videoSource: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="url">Direct URL</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
            <SelectItem value="embed">Embed Code</SelectItem>
            <SelectItem value="upload">Upload File</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {editingLesson.content.videoSource === 'youtube' && (
        <div className="space-y-2">
          <Label>YouTube Video ID or URL</Label>
          <Input
            placeholder="e.g., dQw4w9WgXcQ or https://youtube.com/watch?v=dQw4w9WgXcQ"
            value={editingLesson.content.videoUrl || ''}
            onChange={(e) => updateContent({ videoUrl: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Enter YouTube video ID or full URL. Will be embedded automatically.
          </p>
        </div>
      )}

      {editingLesson.content.videoSource === 'vimeo' && (
        <div className="space-y-2">
          <Label>Vimeo Video ID or URL</Label>
          <Input
            placeholder="e.g., 123456789 or https://vimeo.com/123456789"
            value={editingLesson.content.videoUrl || ''}
            onChange={(e) => updateContent({ videoUrl: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Enter Vimeo video ID or full URL. Will be embedded automatically.
          </p>
        </div>
      )}

      {editingLesson.content.videoSource === 'embed' && (
        <div className="space-y-2">
          <Label>Embed Code</Label>
          <Textarea
            placeholder="Paste embed code here (iframe or video tag)"
            rows={6}
            value={editingLesson.content.embedCode || ''}
            onChange={(e) => updateContent({ embedCode: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Paste the embed code from any video platform
          </p>
        </div>
      )}

      {(editingLesson.content.videoSource === 'url' || editingLesson.content.videoSource === 'upload') && (
        <div className="space-y-2">
          <Label>Video URL</Label>
          <Input
            placeholder="Enter direct video URL (.mp4, .webm, etc.)"
            value={editingLesson.content.videoUrl || ''}
            onChange={(e) => updateContent({ videoUrl: e.target.value })}
          />
          <div className="flex items-center space-x-2">
            <Button type="button" variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </Button>
            <Button type="button" variant="outline" size="sm">
              <Video className="w-4 h-4 mr-2" />
              Record Video
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Video Duration</Label>
        <Input
          placeholder="e.g., 10:30"
          value={editingLesson.content.videoDuration || ''}
          onChange={(e) => updateContent({ videoDuration: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Video Transcript (Optional)</Label>
        <Textarea
          placeholder="Add video transcript for accessibility and SEO..."
          rows={6}
          value={editingLesson.content.transcript || ''}
          onChange={(e) => updateContent({ transcript: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Transcripts improve accessibility and help with searchability
        </p>
      </div>

      <div className="space-y-2">
        <Label>Video Thumbnail</Label>
        <Input
          placeholder="Thumbnail URL"
          value={editingLesson.content.thumbnailUrl || ''}
          onChange={(e) => updateContent({ thumbnailUrl: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={editingLesson.content.allowDownload || false}
          onCheckedChange={(checked) => updateContent({ allowDownload: checked })}
        />
        <Label>Allow students to download video</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={editingLesson.content.enableNotes || false}
          onCheckedChange={(checked) => updateContent({ enableNotes: checked })}
        />
        <Label>Enable timestamped notes</Label>
      </div>
    </div>
  );

  const renderQuizEditor = () => {
    const questions: QuizQuestion[] = editingLesson.content.questions || [];

    const addQuestion = () => {
      const newQuestion: QuizQuestion = {
        id: `question-${Date.now()}`,
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        points: 1
      };
      updateContent({ questions: [...questions, newQuestion] });
    };

    const updateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
      const updatedQuestions = questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      );
      updateContent({ questions: updatedQuestions });
    };

    const deleteQuestion = (questionId: string) => {
      const updatedQuestions = questions.filter(q => q.id !== questionId);
      updateContent({ questions: updatedQuestions });
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Time Limit (minutes)</Label>
            <Input
              type="number"
              min="0"
              value={editingLesson.content.timeLimit || 0}
              onChange={(e) => updateContent({ timeLimit: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label>Passing Score (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={editingLesson.content.passingScore || 70}
              onChange={(e) => updateContent({ passingScore: parseInt(e.target.value) || 70 })}
            />
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Questions</h3>
          <Button onClick={addQuestion} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {questions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No questions yet</p>
              <Button onClick={addQuestion} className="mt-2" size="sm">
                Add Your First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Question {index + 1}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={question.type}
                        onValueChange={(value: QuizQuestion['type']) =>
                          updateQuestion(question.id, { type: value })
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                          <SelectItem value="short-answer">Short Answer</SelectItem>
                          <SelectItem value="essay">Essay</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuestion(question.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Textarea
                      placeholder="Enter your question..."
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                    />
                  </div>

                  {question.type === 'multiple-choice' && (
                    <div className="space-y-2">
                      <Label>Answer Options</Label>
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <Input
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(question.options || [])];
                              newOptions[optionIndex] = e.target.value;
                              updateQuestion(question.id, { options: newOptions });
                            }}
                          />
                          <Button
                            variant={question.correctAnswer === optionIndex ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateQuestion(question.id, { correctAnswer: optionIndex })}
                          >
                            {question.correctAnswer === optionIndex ? 'Correct' : 'Mark Correct'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant={question.correctAnswer === 'true' ? "default" : "outline"}
                          onClick={() => updateQuestion(question.id, { correctAnswer: 'true' })}
                        >
                          True
                        </Button>
                        <Button
                          variant={question.correctAnswer === 'false' ? "default" : "outline"}
                          onClick={() => updateQuestion(question.id, { correctAnswer: 'false' })}
                        >
                          False
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Points</Label>
                      <Input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Explanation (Optional)</Label>
                      <Input
                        placeholder="Explain the correct answer..."
                        value={question.explanation || ''}
                        onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAssignmentEditor = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Assignment Instructions</Label>
        <Textarea
          placeholder="Provide clear instructions for the assignment..."
          rows={6}
          value={editingLesson.content.instructions || ''}
          onChange={(e) => updateContent({ instructions: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Submission Type</Label>
          <Select
            value={editingLesson.content.submissionType || 'text'}
            onValueChange={(value) => updateContent({ submissionType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Submission</SelectItem>
              <SelectItem value="file">File Upload</SelectItem>
              <SelectItem value="url">URL Submission</SelectItem>
              <SelectItem value="both">Text + File</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Maximum Score</Label>
          <Input
            type="number"
            min="1"
            value={editingLesson.content.maxScore || 100}
            onChange={(e) => updateContent({ maxScore: parseInt(e.target.value) || 100 })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Grading Rubric (Optional)</Label>
        <Textarea
          placeholder="Define grading criteria..."
          rows={4}
          value={editingLesson.content.rubric || ''}
          onChange={(e) => updateContent({ rubric: e.target.value })}
        />
      </div>
    </div>
  );

  const renderDocumentEditor = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Document</Label>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Document URL or upload file"
            value={editingLesson.content.fileUrl || ''}
            onChange={(e) => updateContent({ fileUrl: e.target.value })}
          />
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>File Name</Label>
          <Input
            placeholder="Document name"
            value={editingLesson.content.fileName || ''}
            onChange={(e) => updateContent({ fileName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>File Type</Label>
          <Select
            value={editingLesson.content.fileType || 'pdf'}
            onValueChange={(value) => updateContent({ fileType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="doc">Word Document</SelectItem>
              <SelectItem value="ppt">PowerPoint</SelectItem>
              <SelectItem value="txt">Text File</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Describe the document content..."
          rows={3}
          value={editingLesson.content.description || ''}
          onChange={(e) => updateContent({ description: e.target.value })}
        />
      </div>
    </div>
  );

  const renderContentEditor = () => {
    switch (editingLesson.type) {
      case 'text':
        return renderTextEditor();
      case 'video':
        return renderVideoEditor();
      case 'quiz':
        return renderQuizEditor();
      case 'assignment':
        return renderAssignmentEditor();
      case 'document':
        return renderDocumentEditor();
      default:
        return <div>Content editor for {editingLesson.type} not implemented yet.</div>;
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      case 'assignment': return <BookOpen className="w-4 h-4" />;
      case 'interactive': return <Settings className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getLessonIcon(editingLesson.type)}
            <span>Edit Lesson</span>
            <Badge variant="outline">{editingLesson.type}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Lesson Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Lesson Title</Label>
              <Input
                value={editingLesson.title}
                onChange={(e) => setEditingLesson(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter lesson title"
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                value={editingLesson.duration}
                onChange={(e) => setEditingLesson(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 10m, 1h 30m"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={editingLesson.isPreview}
                onCheckedChange={(checked) => 
                  setEditingLesson(prev => ({ ...prev, isPreview: checked }))
                }
              />
              <Label>Free Preview</Label>
            </div>
          </div>

          <Separator />

          {/* Content Editor */}
          <div>
            <h3 className="text-lg font-medium mb-4">Lesson Content</h3>
            {renderContentEditor()}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Lesson
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonEditor;
