import React, { useState } from 'react';
import { Plus, Trash2, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { useCMSStore } from '../../store/cmsStore';
import { NavigationContent } from '../../types/cms';

const NavigationEditor: React.FC = () => {
  const { content, updateContent } = useCMSStore();
  const [navContent, setNavContent] = useState<NavigationContent>(content.navigation);
  const [showPreview, setShowPreview] = useState(false);

  const handleUpdate = (updatedContent: NavigationContent) => {
    setNavContent(updatedContent);
    updateContent('navigation', updatedContent);
  };

  const updateBrand = (field: string, value: string) => {
    const updated = {
      ...navContent,
      brand: {
        ...navContent.brand,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateLink = (index: number, field: string, value: any) => {
    const updatedLinks = [...navContent.links];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };
    const updated = {
      ...navContent,
      links: updatedLinks
    };
    handleUpdate(updated);
  };

  const addLink = () => {
    const newOrder = Math.max(...navContent.links.map(link => link.order), 0) + 1;
    const updated = {
      ...navContent,
      links: [
        ...navContent.links,
        { label: 'New Link', path: '/new', order: newOrder }
      ]
    };
    handleUpdate(updated);
  };

  const removeLink = (index: number) => {
    const updated = {
      ...navContent,
      links: navContent.links.filter((_, i) => i !== index)
    };
    handleUpdate(updated);
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    const updatedLinks = [...navContent.links];
    const currentLink = updatedLinks[index];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < updatedLinks.length) {
      const targetLink = updatedLinks[targetIndex];
      
      // Swap orders
      const tempOrder = currentLink.order;
      currentLink.order = targetLink.order;
      targetLink.order = tempOrder;
      
      // Swap positions in array
      updatedLinks[index] = targetLink;
      updatedLinks[targetIndex] = currentLink;
      
      const updated = {
        ...navContent,
        links: updatedLinks
      };
      handleUpdate(updated);
    }
  };

  const updateSearch = (field: string, value: string) => {
    const updated = {
      ...navContent,
      search: {
        ...navContent.search,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateAuth = (field: string, value: string) => {
    const updated = {
      ...navContent,
      auth: {
        ...navContent.auth,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  // Sort links by order for display
  const sortedLinks = [...navContent.links].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Navigation Content</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your site navigation and branding</p>
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

      {/* Brand Section */}
      <Card>
        <CardHeader>
          <CardTitle>Brand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="brand-name">Site Name</Label>
            <Input
              id="brand-name"
              value={navContent.brand.name}
              onChange={(e) => updateBrand('name', e.target.value)}
              placeholder="Your site name"
            />
          </div>
          
          <div>
            <Label htmlFor="brand-logo">Logo URL (optional)</Label>
            <Input
              id="brand-logo"
              value={navContent.brand.logo || ''}
              onChange={(e) => updateBrand('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Navigation Links</CardTitle>
            <Button onClick={addLink} size="sm" className="flex items-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>Add Link</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedLinks.map((link, index) => {
              const originalIndex = navContent.links.findIndex(l => l.order === link.order);
              return (
                <div key={link.order} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveLink(originalIndex, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveLink(originalIndex, 'down')}
                      disabled={index === sortedLinks.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={link.label}
                        onChange={(e) => updateLink(originalIndex, 'label', e.target.value)}
                        placeholder="Link label"
                      />
                    </div>
                    <div>
                      <Label>Path</Label>
                      <Input
                        value={link.path}
                        onChange={(e) => updateLink(originalIndex, 'path', e.target.value)}
                        placeholder="/path"
                      />
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={link.order}
                        onChange={(e) => updateLink(originalIndex, 'order', parseInt(e.target.value))}
                        placeholder="Order"
                      />
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeLink(originalIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Search Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="search-placeholder">Search Placeholder</Label>
            <Input
              id="search-placeholder"
              value={navContent.search.placeholder}
              onChange={(e) => updateSearch('placeholder', e.target.value)}
              placeholder="Search placeholder text"
            />
          </div>
        </CardContent>
      </Card>

      {/* Authentication Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Buttons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="signin-text">Sign In Button Text</Label>
              <Input
                id="signin-text"
                value={navContent.auth.signInText}
                onChange={(e) => updateAuth('signInText', e.target.value)}
                placeholder="Sign In"
              />
            </div>
            <div>
              <Label htmlFor="signup-text">Sign Up Button Text</Label>
              <Input
                id="signup-text"
                value={navContent.auth.signUpText}
                onChange={(e) => updateAuth('signUpText', e.target.value)}
                placeholder="Sign Up"
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
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {/* Navigation Preview */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                {/* Brand Preview */}
                <div className="flex items-center space-x-2">
                  {navContent.brand.logo && (
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">Logo</span>
                    </div>
                  )}
                  <span className="text-xl font-bold text-blue-600">{navContent.brand.name}</span>
                </div>

                {/* Links Preview */}
                <div className="hidden md:flex items-center space-x-6">
                  {sortedLinks.map((link) => (
                    <Badge key={link.order} variant="outline">
                      {link.label}
                    </Badge>
                  ))}
                </div>

                {/* Search Preview */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                  <div className="w-full relative">
                    <Badge variant="secondary" className="w-full justify-start">
                      {navContent.search.placeholder}
                    </Badge>
                  </div>
                </div>

                {/* Auth Buttons Preview */}
                <div className="flex items-center space-x-2">
                  <Badge variant="ghost">{navContent.auth.signInText}</Badge>
                  <Badge variant="default">{navContent.auth.signUpText}</Badge>
                </div>
              </div>

              {/* Mobile Menu Preview */}
              <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                <div className="text-sm font-medium mb-2">Mobile Menu:</div>
                <div className="space-y-2">
                  {sortedLinks.map((link) => (
                    <div key={link.order} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded">
                      {link.label}
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

export default NavigationEditor;
