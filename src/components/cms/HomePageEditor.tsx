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
import { HomePageContent } from '../../types/cms';

const HomePageEditor: React.FC = () => {
  const { content, updateContent } = useCMSStore();
  const [homeContent, setHomeContent] = useState<HomePageContent>(content.homePage);
  const [showPreview, setShowPreview] = useState(false);

  const handleUpdate = (updatedContent: HomePageContent) => {
    setHomeContent(updatedContent);
    updateContent('homePage', updatedContent);
  };

  const updateHero = (field: string, value: any) => {
    const updated = {
      ...homeContent,
      hero: {
        ...homeContent.hero,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateHeroButton = (buttonType: 'primaryButton' | 'secondaryButton', field: string, value: string) => {
    const updated = {
      ...homeContent,
      hero: {
        ...homeContent.hero,
        [buttonType]: {
          ...homeContent.hero[buttonType],
          [field]: value
        }
      }
    };
    handleUpdate(updated);
  };

  const updateStat = (index: number, field: string, value: string) => {
    const updatedStats = [...homeContent.stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    const updated = {
      ...homeContent,
      stats: updatedStats
    };
    handleUpdate(updated);
  };

  const addStat = () => {
    const updated = {
      ...homeContent,
      stats: [
        ...homeContent.stats,
        { icon: "Star", label: "New Stat", value: "0" }
      ]
    };
    handleUpdate(updated);
  };

  const removeStat = (index: number) => {
    const updated = {
      ...homeContent,
      stats: homeContent.stats.filter((_, i) => i !== index)
    };
    handleUpdate(updated);
  };

  const updateFeaturedCourse = (field: string, value: any) => {
    const updated = {
      ...homeContent,
      featuredCourse: {
        ...homeContent.featuredCourse,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateCTA = (field: string, value: any) => {
    const updated = {
      ...homeContent,
      cta: {
        ...homeContent.cta,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateCTAButton = (buttonType: 'primaryButton' | 'secondaryButton', field: string, value: string) => {
    const updated = {
      ...homeContent,
      cta: {
        ...homeContent.cta,
        [buttonType]: {
          ...homeContent.cta[buttonType],
          [field]: value
        }
      }
    };
    handleUpdate(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Home Page Content</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your homepage content and layout</p>
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

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero-title">Main Title</Label>
            <Input
              id="hero-title"
              value={homeContent.hero.title}
              onChange={(e) => updateHero('title', e.target.value)}
              placeholder="Enter main title"
            />
          </div>
          
          <div>
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Textarea
              id="hero-subtitle"
              value={homeContent.hero.subtitle}
              onChange={(e) => updateHero('subtitle', e.target.value)}
              placeholder="Enter subtitle description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Primary Button</Label>
              <div className="space-y-2">
                <Input
                  value={homeContent.hero.primaryButton.text}
                  onChange={(e) => updateHeroButton('primaryButton', 'text', e.target.value)}
                  placeholder="Button text"
                />
                <Input
                  value={homeContent.hero.primaryButton.link}
                  onChange={(e) => updateHeroButton('primaryButton', 'link', e.target.value)}
                  placeholder="Button link"
                />
              </div>
            </div>
            
            <div>
              <Label>Secondary Button</Label>
              <div className="space-y-2">
                <Input
                  value={homeContent.hero.secondaryButton.text}
                  onChange={(e) => updateHeroButton('secondaryButton', 'text', e.target.value)}
                  placeholder="Button text"
                />
                <Input
                  value={homeContent.hero.secondaryButton.link}
                  onChange={(e) => updateHeroButton('secondaryButton', 'link', e.target.value)}
                  placeholder="Button link"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Statistics Section</CardTitle>
            <Button onClick={addStat} size="sm" className="flex items-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>Add Stat</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {homeContent.stats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={stat.icon}
                      onChange={(e) => updateStat(index, 'icon', e.target.value)}
                      placeholder="Icon name (e.g., Users)"
                    />
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      placeholder="Stat label"
                    />
                  </div>
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      placeholder="Stat value"
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

      {/* Featured Course Section */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course-title">Course Title</Label>
              <Input
                id="course-title"
                value={homeContent.featuredCourse.title}
                onChange={(e) => updateFeaturedCourse('title', e.target.value)}
                placeholder="Course title"
              />
            </div>
            <div>
              <Label htmlFor="course-price">Price</Label>
              <Input
                id="course-price"
                type="number"
                value={homeContent.featuredCourse.price}
                onChange={(e) => updateFeaturedCourse('price', parseFloat(e.target.value))}
                placeholder="Course price"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="course-description">Description</Label>
            <Textarea
              id="course-description"
              value={homeContent.featuredCourse.description}
              onChange={(e) => updateFeaturedCourse('description', e.target.value)}
              placeholder="Course description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course-rating">Rating</Label>
              <Input
                id="course-rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={homeContent.featuredCourse.rating}
                onChange={(e) => updateFeaturedCourse('rating', parseFloat(e.target.value))}
                placeholder="Rating (1-5)"
              />
            </div>
            <div>
              <Label htmlFor="course-reviews">Reviews Count</Label>
              <Input
                id="course-reviews"
                type="number"
                value={homeContent.featuredCourse.reviews}
                onChange={(e) => updateFeaturedCourse('reviews', parseInt(e.target.value))}
                placeholder="Number of reviews"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Call to Action Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cta-title">CTA Title</Label>
            <Input
              id="cta-title"
              value={homeContent.cta.title}
              onChange={(e) => updateCTA('title', e.target.value)}
              placeholder="Call to action title"
            />
          </div>
          
          <div>
            <Label htmlFor="cta-description">CTA Description</Label>
            <Textarea
              id="cta-description"
              value={homeContent.cta.description}
              onChange={(e) => updateCTA('description', e.target.value)}
              placeholder="Call to action description"
              rows={3}
            />
          </div>

          <div>
            <Label>Primary Button</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={homeContent.cta.primaryButton.text}
                onChange={(e) => updateCTAButton('primaryButton', 'text', e.target.value)}
                placeholder="Button text"
              />
              <Input
                value={homeContent.cta.primaryButton.link}
                onChange={(e) => updateCTAButton('primaryButton', 'link', e.target.value)}
                placeholder="Button link"
              />
            </div>
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
            <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {/* Hero Preview */}
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">{homeContent.hero.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{homeContent.hero.subtitle}</p>
                <div className="flex justify-center space-x-4">
                  <Badge variant="default">{homeContent.hero.primaryButton.text}</Badge>
                  <Badge variant="outline">{homeContent.hero.secondaryButton.text}</Badge>
                </div>
              </div>
              
              <Separator />
              
              {/* Stats Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {homeContent.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              {/* Featured Course Preview */}
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{homeContent.featuredCourse.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{homeContent.featuredCourse.description}</p>
                <div className="flex justify-center items-center space-x-4">
                  <Badge>${homeContent.featuredCourse.price}</Badge>
                  <Badge variant="outline">★ {homeContent.featuredCourse.rating} ({homeContent.featuredCourse.reviews} reviews)</Badge>
                </div>
              </div>
              
              <Separator />
              
              {/* CTA Preview */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">{homeContent.cta.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{homeContent.cta.description}</p>
                <Badge variant="default">{homeContent.cta.primaryButton.text}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomePageEditor;
