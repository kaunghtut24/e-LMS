import React, { useState } from 'react';
import { Plus, Trash2, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { useCMSStore } from '../../store/cmsStore';
import { AboutPageContent } from '../../types/cms';

const AboutPageEditor: React.FC = () => {
  const { content, updateContent } = useCMSStore();
  const [aboutContent, setAboutContent] = useState<AboutPageContent>(content.aboutPage);
  const [showPreview, setShowPreview] = useState(false);

  const handleUpdate = (updatedContent: AboutPageContent) => {
    setAboutContent(updatedContent);
    updateContent('aboutPage', updatedContent);
  };

  const updateHeader = (field: string, value: string) => {
    const updated = {
      ...aboutContent,
      header: {
        ...aboutContent.header,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateStat = (index: number, field: string, value: string) => {
    const updatedStats = [...aboutContent.stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    const updated = {
      ...aboutContent,
      stats: updatedStats
    };
    handleUpdate(updated);
  };

  const addStat = () => {
    const updated = {
      ...aboutContent,
      stats: [
        ...aboutContent.stats,
        { icon: "Star", title: "New Stat", description: "Description" }
      ]
    };
    handleUpdate(updated);
  };

  const removeStat = (index: number) => {
    const updated = {
      ...aboutContent,
      stats: aboutContent.stats.filter((_, i) => i !== index)
    };
    handleUpdate(updated);
  };

  const updateStory = (field: string, value: string) => {
    const updated = {
      ...aboutContent,
      story: {
        ...aboutContent.story,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateMission = (field: string, value: string) => {
    const updated = {
      ...aboutContent,
      mission: {
        ...aboutContent.mission,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateValue = (index: number, field: string, value: string) => {
    const updatedValues = [...aboutContent.values];
    updatedValues[index] = {
      ...updatedValues[index],
      [field]: value
    };
    const updated = {
      ...aboutContent,
      values: updatedValues
    };
    handleUpdate(updated);
  };

  const addValue = () => {
    const updated = {
      ...aboutContent,
      values: [
        ...aboutContent.values,
        { title: "New Value", description: "Value description", icon: "Star" }
      ]
    };
    handleUpdate(updated);
  };

  const removeValue = (index: number) => {
    const updated = {
      ...aboutContent,
      values: aboutContent.values.filter((_, i) => i !== index)
    };
    handleUpdate(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Page Content</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your about page content</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
        </Button>
      </div>

      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="about-title">Page Title</Label>
            <Input
              id="about-title"
              value={aboutContent.header.title}
              onChange={(e) => updateHeader('title', e.target.value)}
              placeholder="About page title"
            />
          </div>
          
          <div>
            <Label htmlFor="about-subtitle">Subtitle</Label>
            <Textarea
              id="about-subtitle"
              value={aboutContent.header.subtitle}
              onChange={(e) => updateHeader('subtitle', e.target.value)}
              placeholder="About page subtitle"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Statistics</CardTitle>
            <Button onClick={addStat} size="sm" className="flex items-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>Add Stat</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aboutContent.stats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={stat.icon}
                      onChange={(e) => updateStat(index, 'icon', e.target.value)}
                      placeholder="Icon name"
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={stat.title}
                      onChange={(e) => updateStat(index, 'title', e.target.value)}
                      placeholder="Stat title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={stat.description}
                      onChange={(e) => updateStat(index, 'description', e.target.value)}
                      placeholder="Stat description"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeStat(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Story Section */}
      <Card>
        <CardHeader>
          <CardTitle>Our Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="story-title">Section Title</Label>
            <Input
              id="story-title"
              value={aboutContent.story.title}
              onChange={(e) => updateStory('title', e.target.value)}
              placeholder="Story section title"
            />
          </div>
          
          <div>
            <Label htmlFor="story-content">Story Content</Label>
            <Textarea
              id="story-content"
              value={aboutContent.story.content}
              onChange={(e) => updateStory('content', e.target.value)}
              placeholder="Tell your company's story"
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Mission Section */}
      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mission-title">Section Title</Label>
            <Input
              id="mission-title"
              value={aboutContent.mission.title}
              onChange={(e) => updateMission('title', e.target.value)}
              placeholder="Mission section title"
            />
          </div>
          
          <div>
            <Label htmlFor="mission-content">Mission Content</Label>
            <Textarea
              id="mission-content"
              value={aboutContent.mission.content}
              onChange={(e) => updateMission('content', e.target.value)}
              placeholder="Describe your mission"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Values Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Company Values</CardTitle>
            <Button onClick={addValue} size="sm" className="flex items-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>Add Value</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aboutContent.values.map((value, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Value Title</Label>
                      <Input
                        value={value.title}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        placeholder="Value title"
                      />
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <Input
                        value={value.icon}
                        onChange={(e) => updateValue(index, 'icon', e.target.value)}
                        placeholder="Icon name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={value.description}
                      onChange={(e) => updateValue(index, 'description', e.target.value)}
                      placeholder="Value description"
                      rows={2}
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeValue(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {/* Header Preview */}
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">{aboutContent.header.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{aboutContent.header.subtitle}</p>
              </div>
              
              <Separator />
              
              {/* Stats Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {aboutContent.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold">{stat.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              {/* Story Preview */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{aboutContent.story.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{aboutContent.story.content}</p>
              </div>
              
              <Separator />
              
              {/* Mission Preview */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{aboutContent.mission.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{aboutContent.mission.content}</p>
              </div>
              
              <Separator />
              
              {/* Values Preview */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aboutContent.values.map((value, index) => (
                    <div key={index} className="text-center">
                      <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AboutPageEditor;
