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
  Settings,
  AlertCircle,
  CheckCircle
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
import { Alert, AlertDescription } from '../components/ui/alert';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
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
  longDescription: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  originalPrice: number;
  thumbnail: string;
  tags: string[];
  requirements: string[];
  learningOutcomes: string[];
  modules: CourseModule[];
  isPublished: boolean;
  language: string;
  duration: string;
  subtitles: string[];
}

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { categories, addCourse } = useDataStore();
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    longDescription: '',
    category: '',
    level: 'beginner',
    price: 0,
    originalPrice: 0,
    thumbnail: '',
    tags: [],
    requirements: [],
    learningOutcomes: [],
    modules: [],
    isPublished: false,
    language: 'English',
    duration: '',
    subtitles: ['English']
  });

  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);

  // Check if user can create courses
  const canCreateCourse = user?.role === 'instructor' || user?.role === 'admin';

  // Validation function
  const validateCourseData = (data: CourseData): { [key: string]: string } => {
    const newErrors: { [key: string]: string } = {};

    if (!data.title.trim()) {
      newErrors.title = 'Course title is required';
    } else if (data.title.length < 10) {
      newErrors.title = 'Course title must be at least 10 characters';
    }

    if (!data.description.trim()) {
      newErrors.description = 'Short description is required';
    } else if (data.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!data.longDescription.trim()) {
      newErrors.longDescription = 'Detailed description is required';
    } else if (data.longDescription.length < 100) {
      newErrors.longDescription = 'Detailed description must be at least 100 characters';
    }

    if (!data.category) {
      newErrors.category = 'Please select a category';
    }

    if (data.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (data.originalPrice < data.price) {
      newErrors.originalPrice = 'Original price must be greater than or equal to current price';
    }

    if (data.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    if (data.requirements.length === 0) {
      newErrors.requirements = 'At least one requirement is required';
    }

    if (data.learningOutcomes.length === 0) {
      newErrors.learningOutcomes = 'At least one learning outcome is required';
    }

    if (data.modules.length === 0) {
      newErrors.modules = 'At least one module is required';
    }

    return newErrors;
  };

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
    // Validate course data
    const validationErrors = validateCourseData(courseData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the validation errors before saving');
      return;
    }

    try {
      const courseToSave = {
        id: `course-${Date.now()}`,
        slug: courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        ...courseData,
        instructorId: user?.id || '',
        instructorName: `${user?.first_name} ${user?.last_name}` || 'Unknown Instructor',
        totalLessons: courseData.modules.reduce((total, module) => total + module.lessons.length, 0),
        totalStudents: 0,
        rating: 0,
        totalReviews: 0,
        currency: 'USD',
        features: [
          `${courseData.modules.length} modules`,
          `${courseData.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons`,
          'Lifetime access',
          'Certificate of completion'
        ],
        createdDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        publishedDate: publish ? new Date().toISOString() : '',
        status: publish ? 'published' : 'draft',
        isPopular: false,
        isBestseller: false,
        difficulty: courseData.level === 'beginner' ? 1 : courseData.level === 'intermediate' ? 2 : 3,
        isPublished: publish
      };

      // Add course to the data store
      addCourse(courseToSave);

      toast.success(publish ? 'Course published successfully!' : 'Course saved as draft!');
      navigate('/course-management');
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
    if (window.confirm('Are you sure you want to delete this module? All lessons in this module will be lost.')) {
      setCourseData(prev => ({
        ...prev,
        modules: prev.modules.filter(module => module.id !== moduleId)
      }));
      toast.success('Module deleted successfully');
    }
  };

  const addLesson = (moduleId: string, lessonType: 'video' | 'text' | 'quiz' | 'assignment' = 'video') => {
    const newLesson: LessonItem = {
      id: `lesson-${Date.now()}`,
      title: `New ${lessonType.charAt(0).toUpperCase() + lessonType.slice(1)} Lesson`,
      type: lessonType,
      content: getDefaultContent(lessonType),
      duration: lessonType === 'quiz' ? '10 min' : '5 min',
      isPreview: false,
      order: 0
    };

    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lessons: [...module.lessons, { ...newLesson, order: module.lessons.length }]
            }
          : module
      )
    }));

    toast.success(`${lessonType.charAt(0).toUpperCase() + lessonType.slice(1)} lesson added successfully`);
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<LessonItem>) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, ...updates } : lesson
              )
            }
          : module
      )
    }));
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      setCourseData(prev => ({
        ...prev,
        modules: prev.modules.map(module =>
          module.id === moduleId
            ? {
                ...module,
                lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
              }
            : module
        )
      }));
      toast.success('Lesson deleted successfully');
    }
  };

  // Helper functions for managing arrays
  const addTag = (tag: string) => {
    if (tag.trim() && !courseData.tags.includes(tag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = (requirement: string) => {
    if (requirement.trim()) {
      setCourseData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirement.trim()]
      }));
    }
  };

  const removeRequirement = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addLearningOutcome = (outcome: string) => {
    if (outcome.trim()) {
      setCourseData(prev => ({
        ...prev,
        learningOutcomes: [...prev.learningOutcomes, outcome.trim()]
      }));
    }
  };

  const removeLearningOutcome = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index)
    }));
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

      {/* Validation Errors Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors: {Object.keys(errors).length} field(s) need attention
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className={errors.title || errors.description || errors.category ? 'text-red-600' : ''}>
            Basic Info
            {(errors.title || errors.description || errors.category) && <AlertCircle className="w-3 h-3 ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="content" className={errors.modules ? 'text-red-600' : ''}>
            Course Content
            {errors.modules && <AlertCircle className="w-3 h-3 ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="settings" className={errors.price || errors.tags ? 'text-red-600' : ''}>
            Settings
            {(errors.price || errors.tags) && <AlertCircle className="w-3 h-3 ml-1" />}
          </TabsTrigger>
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
                    placeholder="Enter course title (minimum 10 characters)"
                    value={courseData.title}
                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={courseData.category}
                    onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description * (minimum 50 characters)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn in this course"
                  rows={4}
                  value={courseData.description}
                  onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {courseData.description.length}/50 characters minimum
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription">Detailed Description * (minimum 100 characters)</Label>
                <Textarea
                  id="longDescription"
                  placeholder="Provide a detailed description of the course content, what students will achieve, and why they should take this course"
                  rows={6}
                  value={courseData.longDescription}
                  onChange={(e) => setCourseData(prev => ({ ...prev, longDescription: e.target.value }))}
                  className={errors.longDescription ? 'border-red-500' : ''}
                />
                {errors.longDescription && (
                  <p className="text-sm text-red-500">{errors.longDescription}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {courseData.longDescription.length}/100 characters minimum
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <Label htmlFor="price">Current Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={courseData.price}
                    onChange={(e) => setCourseData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price ($)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={courseData.originalPrice}
                    onChange={(e) => setCourseData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                    className={errors.originalPrice ? 'border-red-500' : ''}
                  />
                  {errors.originalPrice && (
                    <p className="text-sm text-red-500">{errors.originalPrice}</p>
                  )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      id="thumbnail"
                      placeholder="Enter image URL"
                      value={courseData.thumbnail}
                      onChange={(e) => setCourseData(prev => ({ ...prev, thumbnail: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>
                {courseData.thumbnail && (
                  <div className="mt-2">
                    <img
                      src={courseData.thumbnail}
                      alt="Course thumbnail preview"
                      className="w-32 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags Section */}
          <Card>
            <CardHeader>
              <CardTitle>Course Tags *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {courseData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag (e.g., React, JavaScript, Web Development)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className={errors.tags ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addTag(input.value);
                    input.value = '';
                  }}
                >
                  Add Tag
                </Button>
              </div>
              {errors.tags && (
                <p className="text-sm text-red-500">{errors.tags}</p>
              )}
            </CardContent>
          </Card>

          {/* Requirements Section */}
          <Card>
            <CardHeader>
              <CardTitle>Course Requirements *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {courseData.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={requirement}
                      onChange={(e) => {
                        const updated = [...courseData.requirements];
                        updated[index] = e.target.value;
                        setCourseData(prev => ({ ...prev, requirements: updated }));
                      }}
                      placeholder="Enter a requirement"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => addRequirement('New requirement')}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Requirement
              </Button>
              {errors.requirements && (
                <p className="text-sm text-red-500">{errors.requirements}</p>
              )}
            </CardContent>
          </Card>

          {/* Learning Outcomes Section */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Outcomes *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {courseData.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={outcome}
                      onChange={(e) => {
                        const updated = [...courseData.learningOutcomes];
                        updated[index] = e.target.value;
                        setCourseData(prev => ({ ...prev, learningOutcomes: updated }));
                      }}
                      placeholder="What will students learn?"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLearningOutcome(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => addLearningOutcome('Students will learn...')}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Learning Outcome
              </Button>
              {errors.learningOutcomes && (
                <p className="text-sm text-red-500">{errors.learningOutcomes}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Course Content *</h2>
            <Button onClick={addModule}>
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </div>

          {errors.modules && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.modules}</AlertDescription>
            </Alert>
          )}

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
                              onClick={() => deleteLesson(module.id, lesson.id)}
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
