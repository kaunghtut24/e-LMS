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
import { ContactPageContent } from '../../types/cms';

const ContactPageEditor: React.FC = () => {
  const { content, updateContent } = useCMSStore();
  const [contactContent, setContactContent] = useState<ContactPageContent>(content.contactPage);
  const [showPreview, setShowPreview] = useState(false);

  const handleUpdate = (updatedContent: ContactPageContent) => {
    setContactContent(updatedContent);
    updateContent('contactPage', updatedContent);
  };

  const updateHeader = (field: string, value: string) => {
    const updated = {
      ...contactContent,
      header: {
        ...contactContent.header,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateContactInfo = (field: string, value: any) => {
    const updated = {
      ...contactContent,
      contactInfo: {
        ...contactContent.contactInfo,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const addEmail = () => {
    const updated = {
      ...contactContent,
      contactInfo: {
        ...contactContent.contactInfo,
        emails: [...contactContent.contactInfo.emails, 'new@example.com']
      }
    };
    handleUpdate(updated);
  };

  const updateEmail = (index: number, value: string) => {
    const updatedEmails = [...contactContent.contactInfo.emails];
    updatedEmails[index] = value;
    updateContactInfo('emails', updatedEmails);
  };

  const removeEmail = (index: number) => {
    const updatedEmails = contactContent.contactInfo.emails.filter((_, i) => i !== index);
    updateContactInfo('emails', updatedEmails);
  };

  const addPhone = () => {
    const updated = {
      ...contactContent,
      contactInfo: {
        ...contactContent.contactInfo,
        phones: [...contactContent.contactInfo.phones, '+1 (555) 000-0000']
      }
    };
    handleUpdate(updated);
  };

  const updatePhone = (index: number, value: string) => {
    const updatedPhones = [...contactContent.contactInfo.phones];
    updatedPhones[index] = value;
    updateContactInfo('phones', updatedPhones);
  };

  const removePhone = (index: number) => {
    const updatedPhones = contactContent.contactInfo.phones.filter((_, i) => i !== index);
    updateContactInfo('phones', updatedPhones);
  };

  const addAddress = () => {
    const updated = {
      ...contactContent,
      contactInfo: {
        ...contactContent.contactInfo,
        addresses: [...contactContent.contactInfo.addresses, { label: 'New Office', address: 'Address here' }]
      }
    };
    handleUpdate(updated);
  };

  const updateAddress = (index: number, field: string, value: string) => {
    const updatedAddresses = [...contactContent.contactInfo.addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value
    };
    updateContactInfo('addresses', updatedAddresses);
  };

  const removeAddress = (index: number) => {
    const updatedAddresses = contactContent.contactInfo.addresses.filter((_, i) => i !== index);
    updateContactInfo('addresses', updatedAddresses);
  };

  const updateForm = (field: string, value: any) => {
    const updated = {
      ...contactContent,
      form: {
        ...contactContent.form,
        [field]: value
      }
    };
    handleUpdate(updated);
  };

  const updateFormField = (index: number, field: string, value: any) => {
    const updatedFields = [...contactContent.form.fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: value
    };
    updateForm('fields', updatedFields);
  };

  const addFormField = () => {
    const newField = {
      name: 'newField',
      label: 'New Field',
      placeholder: 'Enter value',
      type: 'text',
      required: false
    };
    const updatedFields = [...contactContent.form.fields, newField];
    updateForm('fields', updatedFields);
  };

  const removeFormField = (index: number) => {
    const updatedFields = contactContent.form.fields.filter((_, i) => i !== index);
    updateForm('fields', updatedFields);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Page Content</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your contact page content and form</p>
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
            <Label htmlFor="contact-title">Page Title</Label>
            <Input
              id="contact-title"
              value={contactContent.header.title}
              onChange={(e) => updateHeader('title', e.target.value)}
              placeholder="Contact page title"
            />
          </div>
          
          <div>
            <Label htmlFor="contact-subtitle">Subtitle</Label>
            <Textarea
              id="contact-subtitle"
              value={contactContent.header.subtitle}
              onChange={(e) => updateHeader('subtitle', e.target.value)}
              placeholder="Contact page subtitle"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Addresses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Email Addresses</Label>
              <Button onClick={addEmail} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Email
              </Button>
            </div>
            <div className="space-y-2">
              {contactContent.contactInfo.emails.map((email, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="email@example.com"
                    type="email"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEmail(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Phone Numbers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Phone Numbers</Label>
              <Button onClick={addPhone} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Phone
              </Button>
            </div>
            <div className="space-y-2">
              {contactContent.contactInfo.phones.map((phone, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={phone}
                    onChange={(e) => updatePhone(index, e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    type="tel"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removePhone(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Addresses</Label>
              <Button onClick={addAddress} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Address
              </Button>
            </div>
            <div className="space-y-4">
              {contactContent.contactInfo.addresses.map((address, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={address.label}
                      onChange={(e) => updateAddress(index, 'label', e.target.value)}
                      placeholder="Office label"
                    />
                    <Textarea
                      value={address.address}
                      onChange={(e) => updateAddress(index, 'address', e.target.value)}
                      placeholder="Full address"
                      rows={2}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAddress(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <Label htmlFor="hours">Business Hours</Label>
            <Input
              id="hours"
              value={contactContent.contactInfo.hours}
              onChange={(e) => updateContactInfo('hours', e.target.value)}
              placeholder="Monday - Friday: 9:00 AM - 6:00 PM PST"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Form Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={contactContent.form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              placeholder="Contact form title"
            />
          </div>

          <div>
            <Label htmlFor="submit-button">Submit Button Text</Label>
            <Input
              id="submit-button"
              value={contactContent.form.submitButton}
              onChange={(e) => updateForm('submitButton', e.target.value)}
              placeholder="Submit button text"
            />
          </div>

          <div>
            <Label htmlFor="success-message">Success Message</Label>
            <Textarea
              id="success-message"
              value={contactContent.form.successMessage}
              onChange={(e) => updateForm('successMessage', e.target.value)}
              placeholder="Message shown after successful submission"
              rows={2}
            />
          </div>

          {/* Form Fields */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Form Fields</Label>
              <Button onClick={addFormField} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Field
              </Button>
            </div>
            <div className="space-y-4">
              {contactContent.form.fields.map((field, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Field {index + 1}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFormField(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Field Name</Label>
                      <Input
                        value={field.name}
                        onChange={(e) => updateFormField(index, 'name', e.target.value)}
                        placeholder="fieldName"
                      />
                    </div>
                    <div>
                      <Label>Field Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateFormField(index, 'label', e.target.value)}
                        placeholder="Field Label"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Placeholder</Label>
                      <Input
                        value={field.placeholder}
                        onChange={(e) => updateFormField(index, 'placeholder', e.target.value)}
                        placeholder="Enter placeholder text"
                      />
                    </div>
                    <div>
                      <Label>Field Type</Label>
                      <select
                        value={field.type}
                        onChange={(e) => updateFormField(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="tel">Phone</option>
                        <option value="textarea">Textarea</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`required-${index}`}
                      checked={field.required}
                      onChange={(e) => updateFormField(index, 'required', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor={`required-${index}`}>Required field</Label>
                  </div>
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
            <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {/* Header Preview */}
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">{contactContent.header.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{contactContent.header.subtitle}</p>
              </div>
              
              <Separator />
              
              {/* Contact Info Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <strong>Email:</strong>
                      <div className="space-y-1">
                        {contactContent.contactInfo.emails.map((email, index) => (
                          <div key={index} className="text-sm text-gray-600 dark:text-gray-400">{email}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <strong>Phone:</strong>
                      <div className="space-y-1">
                        {contactContent.contactInfo.phones.map((phone, index) => (
                          <div key={index} className="text-sm text-gray-600 dark:text-gray-400">{phone}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <strong>Hours:</strong>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{contactContent.contactInfo.hours}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">{contactContent.form.title}</h3>
                  <div className="space-y-3">
                    {contactContent.form.fields.map((field, index) => (
                      <div key={index}>
                        <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
                        <Badge variant="outline" className="ml-2">{field.type}</Badge>
                      </div>
                    ))}
                    <Button className="w-full">{contactContent.form.submitButton}</Button>
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

export default ContactPageEditor;
