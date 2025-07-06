import React, { useState } from 'react';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { useCMSStore } from '../../store/cmsStore';
import { SiteSettings } from '../../types/cms';

const SiteSettingsEditor: React.FC = () => {
  const { content, updateContent } = useCMSStore();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(content.siteSettings);
  const [showPreview, setShowPreview] = useState(false);

  const handleUpdate = (updatedSettings: SiteSettings) => {
    setSiteSettings(updatedSettings);
    updateContent('siteSettings', updatedSettings);
  };

  const updateGeneral = (field: string, value: any) => {
    const updated = {
      ...siteSettings,
      general: {
        ...siteSettings.general,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateTheme = (field: string, value: any) => {
    const updated = {
      ...siteSettings,
      theme: {
        ...siteSettings.theme,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateContact = (field: string, value: string) => {
    const updated = {
      ...siteSettings,
      contact: {
        ...siteSettings.contact,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateSocial = (field: string, value: string) => {
    const updated = {
      ...siteSettings,
      social: {
        ...siteSettings.social,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateSEO = (field: string, value: any) => {
    const updated = {
      ...siteSettings,
      seo: {
        ...siteSettings.seo,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const addKeyword = () => {
    const updated = {
      ...siteSettings,
      seo: {
        ...siteSettings.seo,
        keywords: [...siteSettings.seo.keywords, 'new keyword']
      }
    };
    handleUpdate(updated);
  };

  const updateKeyword = (index: number, value: string) => {
    const updatedKeywords = [...siteSettings.seo.keywords];
    updatedKeywords[index] = value;
    updateSEO('keywords', updatedKeywords);
  };

  const removeKeyword = (index: number) => {
    const updatedKeywords = siteSettings.seo.keywords.filter((_, i) => i !== index);
    updateSEO('keywords', updatedKeywords);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage global site configuration</p>
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

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                value={siteSettings.general.siteName}
                onChange={(e) => updateGeneral('siteName', e.target.value)}
                placeholder="Your site name"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={siteSettings.general.tagline}
                onChange={(e) => updateGeneral('tagline', e.target.value)}
                placeholder="Your site tagline"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea
              id="site-description"
              value={siteSettings.general.description}
              onChange={(e) => updateGeneral('description', e.target.value)}
              placeholder="Brief description of your site"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="logo-url">Logo URL</Label>
              <Input
                id="logo-url"
                value={siteSettings.general.logo || ''}
                onChange={(e) => updateGeneral('logo', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <Label htmlFor="favicon-url">Favicon URL</Label>
              <Input
                id="favicon-url"
                value={siteSettings.general.favicon || ''}
                onChange={(e) => updateGeneral('favicon', e.target.value)}
                placeholder="https://example.com/favicon.ico"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={siteSettings.theme.primaryColor}
                  onChange={(e) => updateTheme('primaryColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={siteSettings.theme.primaryColor}
                  onChange={(e) => updateTheme('primaryColor', e.target.value)}
                  placeholder="#2563eb"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={siteSettings.theme.secondaryColor}
                  onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={siteSettings.theme.secondaryColor}
                  onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                  placeholder="#7c3aed"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={siteSettings.theme.accentColor}
                  onChange={(e) => updateTheme('accentColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={siteSettings.theme.accentColor}
                  onChange={(e) => updateTheme('accentColor', e.target.value)}
                  placeholder="#06b6d4"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={siteSettings.theme.darkMode}
              onCheckedChange={(checked) => updateTheme('darkMode', checked)}
            />
            <Label htmlFor="dark-mode">Enable Dark Mode by Default</Label>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={siteSettings.contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              placeholder="contact@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="contact-phone">Phone</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={siteSettings.contact.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div>
            <Label htmlFor="contact-address">Address</Label>
            <Textarea
              id="contact-address"
              value={siteSettings.contact.address}
              onChange={(e) => updateContact('address', e.target.value)}
              placeholder="Your business address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={siteSettings.social.facebook || ''}
                onChange={(e) => updateSocial('facebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={siteSettings.social.twitter || ''}
                onChange={(e) => updateSocial('twitter', e.target.value)}
                placeholder="https://twitter.com/youraccount"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={siteSettings.social.linkedin || ''}
                onChange={(e) => updateSocial('linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={siteSettings.social.instagram || ''}
                onChange={(e) => updateSocial('instagram', e.target.value)}
                placeholder="https://instagram.com/youraccount"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="youtube">YouTube</Label>
            <Input
              id="youtube"
              value={siteSettings.social.youtube || ''}
              onChange={(e) => updateSocial('youtube', e.target.value)}
              placeholder="https://youtube.com/yourchannel"
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta-title">Meta Title</Label>
            <Input
              id="meta-title"
              value={siteSettings.seo.metaTitle}
              onChange={(e) => updateSEO('metaTitle', e.target.value)}
              placeholder="Your site meta title"
            />
          </div>
          
          <div>
            <Label htmlFor="meta-description">Meta Description</Label>
            <Textarea
              id="meta-description"
              value={siteSettings.seo.metaDescription}
              onChange={(e) => updateSEO('metaDescription', e.target.value)}
              placeholder="Brief description for search engines"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>SEO Keywords</Label>
              <Button onClick={addKeyword} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Keyword
              </Button>
            </div>
            <div className="space-y-2">
              {siteSettings.seo.keywords.map((keyword, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={keyword}
                    onChange={(e) => updateKeyword(index, e.target.value)}
                    placeholder="SEO keyword"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeKeyword(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
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
              {/* General Settings Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                <div className="space-y-2">
                  <div><strong>Site Name:</strong> {siteSettings.general.siteName}</div>
                  <div><strong>Tagline:</strong> {siteSettings.general.tagline}</div>
                  <div><strong>Description:</strong> {siteSettings.general.description}</div>
                </div>
              </div>

              {/* Theme Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Theme Colors</h3>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: siteSettings.theme.primaryColor }}
                    ></div>
                    <span className="text-sm">Primary</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: siteSettings.theme.secondaryColor }}
                    ></div>
                    <span className="text-sm">Secondary</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: siteSettings.theme.accentColor }}
                    ></div>
                    <span className="text-sm">Accent</span>
                  </div>
                  <Badge variant={siteSettings.theme.darkMode ? "default" : "outline"}>
                    Dark Mode: {siteSettings.theme.darkMode ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>

              {/* Contact Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Email:</strong> {siteSettings.contact.email}</div>
                  <div><strong>Phone:</strong> {siteSettings.contact.phone}</div>
                  <div><strong>Address:</strong> {siteSettings.contact.address}</div>
                </div>
              </div>

              {/* Social Media Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(siteSettings.social).map(([platform, url]) => 
                    url && (
                      <Badge key={platform} variant="outline">
                        {platform}: {url}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              {/* SEO Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Meta Title:</strong> {siteSettings.seo.metaTitle}</div>
                  <div><strong>Meta Description:</strong> {siteSettings.seo.metaDescription}</div>
                  <div>
                    <strong>Keywords:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {siteSettings.seo.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
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

export default SiteSettingsEditor;
