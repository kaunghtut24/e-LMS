import React, { useState, useEffect } from 'react';
import {
  Home,
  Info,
  Phone,
  Navigation,
  Settings,
  Save,
  RotateCcw,
  Download,
  Upload,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../components/ui/breadcrumb';
import { toast } from 'sonner';
import { useCMSStore } from '../store/cmsStore';
import { useAuthStore } from '../store/authStore';
import { Navigate, Link } from 'react-router-dom';

// Import CMS Editors (we'll create these next)
import HomePageEditor from '../components/cms/HomePageEditor';
import AboutPageEditor from '../components/cms/AboutPageEditor';
import ContactPageEditor from '../components/cms/ContactPageEditor';
import NavigationEditor from '../components/cms/NavigationEditor';
import FooterEditor from '../components/cms/FooterEditor';
import SiteSettingsEditor from '../components/cms/SiteSettingsEditor';

const CMSPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    content, 
    isLoading, 
    isDirty, 
    lastSaved, 
    loadContent, 
    saveContent, 
    resetContent, 
    exportContent, 
    importContent 
  } = useCMSStore();
  
  const [activeTab, setActiveTab] = useState('home');
  const [isSaving, setIsSaving] = useState(false);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveContent();
      toast.success('Content saved successfully!');
    } catch (error) {
      toast.error('Failed to save content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all content to defaults? This action cannot be undone.')) {
      resetContent();
      toast.success('Content reset to defaults');
    }
  };

  const handleExport = () => {
    const data = exportContent();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cms-content-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Content exported successfully!');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        importContent(data);
        toast.success('Content imported successfully!');
      } catch (error) {
        toast.error('Failed to import content. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const cmsNavigation = [
    { id: 'home', label: 'Home Page', icon: Home, description: 'Hero, stats, featured content' },
    { id: 'about', label: 'About Page', icon: Info, description: 'Company story, mission, values' },
    { id: 'contact', label: 'Contact Page', icon: Phone, description: 'Contact info, form settings' },
    { id: 'navigation', label: 'Navigation', icon: Navigation, description: 'Menu links, branding' },
    { id: 'footer', label: 'Footer', icon: Settings, description: 'Footer links, social media' },
    { id: 'settings', label: 'Site Settings', icon: Settings, description: 'Global site configuration' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Content Management System
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage your website content dynamically
                </p>
              </div>
            </div>
            
            {/* Status and Actions */}
            <div className="flex items-center space-x-4">
              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                {isDirty ? (
                  <Badge variant="destructive" className="flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Unsaved Changes</span>
                  </Badge>
                ) : (
                  <Badge variant="default" className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Saved</span>
                  </Badge>
                )}
                
                {lastSaved && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Last saved: {new Date(lastSaved).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import</span>
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center space-x-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </Button>
                
                <Button
                  onClick={handleSave}
                  disabled={!isDirty || isSaving}
                  className="flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <Breadcrumb className="mt-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Admin Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Content Management</BreadcrumbPage>
              </BreadcrumbItem>
              {activeTab && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {cmsNavigation.find(item => item.id === activeTab)?.label || 'Content Editor'}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* CMS Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Content Sections</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">
                    <Eye className="w-4 h-4 mr-1" />
                    View Site
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cmsNavigation.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-start space-y-2"
                  onClick={() => setActiveTab(item.id)}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <p className="text-sm text-left opacity-70">{item.description}</p>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Editors */}
        <div className="space-y-6">
          {activeTab === 'home' && <HomePageEditor />}
          {activeTab === 'about' && <AboutPageEditor />}
          {activeTab === 'contact' && <ContactPageEditor />}
          {activeTab === 'navigation' && <NavigationEditor />}
          {activeTab === 'footer' && <FooterEditor />}
          {activeTab === 'settings' && <SiteSettingsEditor />}
        </div>
      </div>
    </div>
  );
};

export default CMSPage;
