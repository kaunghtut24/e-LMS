// Content Management System Types

export interface CMSContent {
  id: string;
  section: string;
  key: string;
  type: 'text' | 'rich_text' | 'image' | 'link' | 'number' | 'boolean' | 'array' | 'object';
  value: any;
  label: string;
  description?: string;
  category: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CMSSection {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  order: number;
}

export interface CMSCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

// Home Page Content Structure
export interface HomePageContent {
  hero: {
    title: string;
    subtitle: string;
    primaryButton: {
      text: string;
      link: string;
    };
    secondaryButton: {
      text: string;
      link: string;
    };
    backgroundImage?: string;
  };
  stats: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
  featuredCourse: {
    title: string;
    description: string;
    rating: number;
    reviews: number;
    price: number;
    image?: string;
  };
  cta: {
    title: string;
    description: string;
    primaryButton: {
      text: string;
      link: string;
    };
    secondaryButton?: {
      text: string;
      link: string;
    };
  };
}

// About Page Content Structure
export interface AboutPageContent {
  header: {
    title: string;
    subtitle: string;
  };
  stats: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  story: {
    title: string;
    content: string;
  };
  mission: {
    title: string;
    content: string;
  };
  vision: {
    title: string;
    content: string;
  };
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

// Contact Page Content Structure
export interface ContactPageContent {
  header: {
    title: string;
    subtitle: string;
  };
  contactInfo: {
    emails: string[];
    phones: string[];
    addresses: Array<{
      label: string;
      address: string;
    }>;
    hours: string;
  };
  form: {
    title: string;
    fields: Array<{
      name: string;
      label: string;
      placeholder: string;
      type: string;
      required: boolean;
    }>;
    submitButton: string;
    successMessage: string;
  };
}

// Navigation Content Structure
export interface NavigationContent {
  brand: {
    name: string;
    logo?: string;
  };
  links: Array<{
    label: string;
    path: string;
    order: number;
  }>;
  search: {
    placeholder: string;
  };
  auth: {
    signInText: string;
    signUpText: string;
  };
}

// Footer Content Structure
export interface FooterContent {
  brand: {
    name: string;
    description: string;
    logo?: string;
  };
  linkCategories: {
    courses: Array<{
      label: string;
      href: string;
    }>;
    company: Array<{
      label: string;
      href: string;
    }>;
    support: Array<{
      label: string;
      href: string;
    }>;
    legal: Array<{
      label: string;
      href: string;
    }>;
  };
  socialLinks: Array<{
    platform: string;
    href: string;
    icon: string;
  }>;
  copyright: {
    text: string;
    year: number;
  };
}

// Site Settings Structure
export interface SiteSettings {
  general: {
    siteName: string;
    tagline: string;
    description: string;
    logo?: string;
    favicon?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// Complete CMS Data Structure
export interface CMSData {
  homePage: HomePageContent;
  aboutPage: AboutPageContent;
  contactPage: ContactPageContent;
  navigation: NavigationContent;
  footer: FooterContent;
  siteSettings: SiteSettings;
  lastUpdated: string;
  version: string;
}

// CMS Store State
export interface CMSState {
  content: CMSData;
  isLoading: boolean;
  isDirty: boolean;
  lastSaved: string | null;
  
  // Actions
  loadContent: () => Promise<void>;
  updateContent: (section: keyof CMSData, data: any) => void;
  saveContent: () => Promise<void>;
  resetContent: () => void;
  exportContent: () => string;
  importContent: (data: string) => void;
}

// CMS Editor Props
export interface CMSEditorProps {
  section: keyof CMSData;
  title: string;
  description?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

// Form Field Types for CMS Editors
export interface CMSFormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'image' | 'color' | 'array';
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}
