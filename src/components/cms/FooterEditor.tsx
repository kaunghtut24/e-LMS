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
import { FooterContent } from '../../types/cms';

const FooterEditor: React.FC = () => {
  const { content, updateContent } = useCMSStore();
  const [footerContent, setFooterContent] = useState<FooterContent>(content.footer);
  const [showPreview, setShowPreview] = useState(false);

  const handleUpdate = (updatedContent: FooterContent) => {
    setFooterContent(updatedContent);
    updateContent('footer', updatedContent);
  };

  const updateBrand = (field: string, value: string) => {
    const updated = {
      ...footerContent,
      brand: {
        ...footerContent.brand,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateLinkCategory = (category: keyof FooterContent['linkCategories'], index: number, field: string, value: string) => {
    const updatedLinks = [...footerContent.linkCategories[category]];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };
    const updated = {
      ...footerContent,
      linkCategories: {
        ...footerContent.linkCategories,
        [category]: updatedLinks
      }
    };
    handleUpdate(updated);
  };

  const addLinkToCategory = (category: keyof FooterContent['linkCategories']) => {
    const updatedLinks = [...footerContent.linkCategories[category], { label: 'New Link', href: '#' }];
    const updated = {
      ...footerContent,
      linkCategories: {
        ...footerContent.linkCategories,
        [category]: updatedLinks
      }
    };
    handleUpdate(updated);
  };

  const removeLinkFromCategory = (category: keyof FooterContent['linkCategories'], index: number) => {
    const updatedLinks = footerContent.linkCategories[category].filter((_, i) => i !== index);
    const updated = {
      ...footerContent,
      linkCategories: {
        ...footerContent.linkCategories,
        [category]: updatedLinks
      }
    };
    handleUpdate(updated);
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const updatedSocialLinks = [...footerContent.socialLinks];
    updatedSocialLinks[index] = {
      ...updatedSocialLinks[index],
      [field]: value
    };
    const updated = {
      ...footerContent,
      socialLinks: updatedSocialLinks
    };
    handleUpdate(updated);
  };

  const addSocialLink = () => {
    const updated = {
      ...footerContent,
      socialLinks: [
        ...footerContent.socialLinks,
        { platform: 'New Platform', href: '#', icon: 'Globe' }
      ]
    };
    handleUpdate(updated);
  };

  const removeSocialLink = (index: number) => {
    const updated = {
      ...footerContent,
      socialLinks: footerContent.socialLinks.filter((_, i) => i !== index)
    };
    handleUpdate(updated);
  };

  const updateCopyright = (field: string, value: any) => {
    const updated = {
      ...footerContent,
      copyright: {
        ...footerContent.copyright,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const linkCategories = [
    { key: 'courses', title: 'Courses' },
    { key: 'company', title: 'Company' },
    { key: 'support', title: 'Support' },
    { key: 'legal', title: 'Legal' }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Footer Content</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your footer content and links</p>
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
          <CardTitle>Brand Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="footer-brand-name">Brand Name</Label>
            <Input
              id="footer-brand-name"
              value={footerContent.brand.name}
              onChange={(e) => updateBrand('name', e.target.value)}
              placeholder="Your brand name"
            />
          </div>
          
          <div>
            <Label htmlFor="footer-brand-description">Brand Description</Label>
            <Textarea
              id="footer-brand-description"
              value={footerContent.brand.description}
              onChange={(e) => updateBrand('description', e.target.value)}
              placeholder="Brief description of your brand"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="footer-brand-logo">Logo URL (optional)</Label>
            <Input
              id="footer-brand-logo"
              value={footerContent.brand.logo || ''}
              onChange={(e) => updateBrand('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </CardContent>
      </Card>

      {/* Link Categories */}
      {linkCategories.map(({ key, title }) => (
        <Card key={key}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{title} Links</CardTitle>
              <Button 
                onClick={() => addLinkToCategory(key)} 
                size="sm" 
                className="flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {footerContent.linkCategories[key].map((link, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={link.label}
                        onChange={(e) => updateLinkCategory(key, index, 'label', e.target.value)}
                        placeholder="Link label"
                      />
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={link.href}
                        onChange={(e) => updateLinkCategory(key, index, 'href', e.target.value)}
                        placeholder="Link URL"
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeLinkFromCategory(key, index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Social Media Links</CardTitle>
            <Button onClick={addSocialLink} size="sm" className="flex items-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>Add Social Link</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {footerContent.socialLinks.map((social, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Platform</Label>
                    <Input
                      value={social.platform}
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      placeholder="Platform name"
                    />
                  </div>
                  <div>
                    <Label>URL</Label>
                    <Input
                      value={social.href}
                      onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                      placeholder="Social media URL"
                    />
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <Input
                      value={social.icon}
                      onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                      placeholder="Icon name (e.g., Facebook)"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Copyright Section */}
      <Card>
        <CardHeader>
          <CardTitle>Copyright Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="copyright-text">Copyright Text</Label>
              <Input
                id="copyright-text"
                value={footerContent.copyright.text}
                onChange={(e) => updateCopyright('text', e.target.value)}
                placeholder="Your Company. All rights reserved."
              />
            </div>
            <div>
              <Label htmlFor="copyright-year">Copyright Year</Label>
              <Input
                id="copyright-year"
                type="number"
                value={footerContent.copyright.year}
                onChange={(e) => updateCopyright('year', parseInt(e.target.value))}
                placeholder="2024"
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
              {/* Footer Preview */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                  {/* Brand Section */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                      {footerContent.brand.logo && (
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">Logo</span>
                        </div>
                      )}
                      <span className="text-xl font-bold text-blue-600">{footerContent.brand.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                      {footerContent.brand.description}
                    </p>
                    
                    {/* Social Links */}
                    <div className="flex space-x-4">
                      {footerContent.socialLinks.map((social, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {social.platform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Link Categories */}
                  {linkCategories.map(({ key, title }) => (
                    <div key={key}>
                      <h3 className="font-semibold mb-4">{title}</h3>
                      <div className="space-y-2">
                        {footerContent.linkCategories[key].map((link, index) => (
                          <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            {link.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    © {footerContent.copyright.year} {footerContent.copyright.text}
                  </div>
                  
                  <div className="flex space-x-6">
                    {footerContent.linkCategories.legal.map((link, index) => (
                      <Badge key={index} variant="ghost" className="text-xs">
                        {link.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FooterEditor;
