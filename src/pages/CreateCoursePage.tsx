import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Save,
  Eye,
  Upload,
  FileText,
  Video,
  HelpCircle,
  BookOpen,
  Image,
  Link,
  GripVertical,
  Trash2,
  Edit,
  Settings
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import LessonEditor from '../components/course-builder/LessonEditor';

interface LessonItem {
  id: string;
  title: string;
  type: 'text' | 'video' | 'quiz' | 'assignment' | 'interactive' | 'document';
  content: any;
  duration: string;
  isPreview: boolean;
  order: number;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: LessonItem[];
  order: number;
}

interface CourseData {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  thumbnail: string;
  tags: string[];
  modules: CourseModule[];
  isPublished: boolean;
  language: string;
  duration: string;
}

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('basic');
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    thumbnail: '',
    tags: [],
    modules: [],
    isPublished: false,
    language: 'English',
    duration: ''
  });

  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);

  // Check if user can create courses
  const canCreateCourse = user?.role === 'instructor' || user?.role === 'admin';

  if (!canCreateCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You need to be an instructor or admin to create courses.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveCourse = async (publish = false) => {
    if (!courseData.title || !courseData.description) {
      toast.error('Please fill in the required fields');
      return;
    }

    try {
      const courseToSave = {
        ...courseData,
        isPublished: publish,
        instructorId: user?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Here you would typically save to your backend
      console.log('Saving course:', courseToSave);
      
      toast.success(publish ? 'Course published successfully!' : 'Course saved as draft!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save course');
    }
  };

  const addModule = () => {
    const newModule: CourseModule = {
      id: `module-${Date.now()}`,
      title: 'New Module',
      description: '',
      lessons: [],
      order: courseData.modules.length
    };
    
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
  };

  const updateModule = (moduleId: string, updates: Partial<CourseModule>) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId ? { ...module, ...updates } : module
      )
    }));
  };

  const deleteModule = (moduleId: string) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module.id !== moduleId)
    }));
  };

  const addLesson = (moduleId: string, lessonType: LessonItem['type']) => {
    const newLesson: LessonItem = {
      id: `lesson-${Date.now()}`,
      title: 'New Lesson',
      type: lessonType,
      content: getDefaultContent(lessonType),
      duration: '5m',
      isPreview: false,
      order: 0
    };

    updateModule(moduleId, {
      lessons: [...(courseData.modules.find(m => m.id === moduleId)?.lessons || []), newLesson]
    });
  };

  const getDefaultContent = (type: LessonItem['type']) => {
    switch (type) {
      case 'text':
        return { text: '', images: [] };
      case 'video':
        return { videoUrl: '', transcript: '' };
      case 'quiz':
        return { questions: [], timeLimit: 0, passingScore: 70 };
      case 'assignment':
        return { instructions: '', submissionType: 'text', maxScore: 100 };
      case 'interactive':
        return { htmlContent: '', interactions: [] };
      case 'document':
        return { fileUrl: '', fileName: '', fileType: '' };
      default:
        return {};
    }
  };

  const getLessonIcon = (type: LessonItem['type']) => {
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

  const categories = [
    'Technology', 'Business', 'Design', 'Marketing', 'Photography',
    'Music', 'Health & Fitness', 'Language', 'Personal Development', 'Other'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground mt-2">
            Build engaging courses with multiple lesson types
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleSaveCourse(false)}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSaveCourse(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Publish Course
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter course title"
                    value={courseData.title}
                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={courseData.category}
                    onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn in this course"
                  rows={4}
                  value={courseData.description}
                  onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select
                    value={courseData.level}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      setCourseData(prev => ({ ...prev, level: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={courseData.price}
                    onChange={(e) => setCourseData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={courseData.language}
                    onValueChange={(value) => setCourseData(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Course Thumbnail</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="thumbnail"
                    placeholder="Upload or enter image URL"
                    value={courseData.thumbnail}
                    onChange={(e) => setCourseData(prev => ({ ...prev, thumbnail: e.target.value }))}
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Course Content</h2>
            <Button onClick={addModule}>
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </div>

          {courseData.modules.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No modules yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building your course by adding modules and lessons
                </p>
                <Button onClick={addModule}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Module
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {courseData.modules.map((module, moduleIndex) => (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <Input
                            value={module.title}
                            onChange={(e) => updateModule(module.id, { title: e.target.value })}
                            className="font-medium"
                            placeholder="Module title"
                          />
                          <Input
                            value={module.description}
                            onChange={(e) => updateModule(module.id, { description: e.target.value })}
                            className="mt-2 text-sm"
                            placeholder="Module description"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {module.lessons.length} lessons
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteModule(module.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            {getLessonIcon(lesson.type)}
                            <div>
                              <p className="font-medium">{lesson.title}</p>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Badge variant="secondary" className="text-xs">
                                  {lesson.type}
                                </Badge>
                                <span>{lesson.duration}</span>
                                {lesson.isPreview && (
                                  <Badge variant="outline" className="text-xs">
                                    Preview
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingLesson(lesson);
                                setShowLessonDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedLessons = module.lessons.filter(l => l.id !== lesson.id);
                                updateModule(module.id, { lessons: updatedLessons });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addLesson(module.id, 'text')}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Text Lesson
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addLesson(module.id, 'video')}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Video Lesson
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addLesson(module.id, 'quiz')}
                        >
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Quiz
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addLesson(module.id, 'assignment')}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Assignment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this course visible to students
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={courseData.isPublished}
                  onCheckedChange={(checked) => 
                    setCourseData(prev => ({ ...prev, isPublished: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Course Tags</Label>
                <Input
                  placeholder="Enter tags separated by commas"
                  value={courseData.tags.join(', ')}
                  onChange={(e) => 
                    setCourseData(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{courseData.title || 'Course Title'}</h3>
                  <p className="text-muted-foreground mt-2">
                    {courseData.description || 'Course description will appear here'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{courseData.category || 'Category'}</Badge>
                  <Badge variant="outline">{courseData.level}</Badge>
                  <Badge variant="outline">{courseData.language}</Badge>
                  {courseData.price > 0 && (
                    <Badge variant="outline">${courseData.price}</Badge>
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Course Content</h4>
                  <p className="text-sm text-muted-foreground">
                    {courseData.modules.length} modules • {' '}
                    {courseData.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lesson Editor Dialog */}
      <LessonEditor
        lesson={editingLesson}
        isOpen={showLessonDialog}
        onClose={() => {
          setShowLessonDialog(false);
          setEditingLesson(null);
        }}
        onSave={(updatedLesson) => {
          // Find the module containing this lesson and update it
          setCourseData(prev => ({
            ...prev,
            modules: prev.modules.map(module => ({
              ...module,
              lessons: module.lessons.map(lesson =>
                lesson.id === updatedLesson.id ? updatedLesson : lesson
              )
            }))
          }));
          setShowLessonDialog(false);
          setEditingLesson(null);
          toast.success('Lesson updated successfully');
        }}
      />
    </div>
  );
};

export default CreateCoursePage;
