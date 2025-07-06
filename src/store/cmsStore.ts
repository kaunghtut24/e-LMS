import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CMSState, CMSData } from '../types/cms';

// Default CMS Content
const defaultContent: CMSData = {
  homePage: {
    hero: {
      title: "Transform Your Future with Expert-Led Online Learning",
      subtitle: "Master in-demand skills with our comprehensive online courses. Join thousands of learners advancing their careers with expert-led, hands-on education.",
      primaryButton: {
        text: "Start Learning Today",
        link: "/register"
      },
      secondaryButton: {
        text: "Browse Courses",
        link: "/courses"
      }
    },
    stats: [
      { icon: "Users", label: "Active Students", value: "50,000+" },
      { icon: "BookOpen", label: "Quality Courses", value: "500+" },
      { icon: "Award", label: "Expert Instructors", value: "200+" },
      { icon: "Globe", label: "Countries Reached", value: "100+" }
    ],
    featuredCourse: {
      title: "Complete React & TypeScript Mastery",
      description: "Master modern React development with TypeScript",
      rating: 5,
      reviews: 342,
      price: 89
    },
    cta: {
      title: "Ready to Start Learning?",
      description: "Join thousands of students already learning on EduLearn. Start your journey today and unlock your potential.",
      primaryButton: {
        text: "Get Started Free",
        link: "/register"
      }
    }
  },
  aboutPage: {
    header: {
      title: "About EduLearn",
      subtitle: "We're on a mission to democratize education and make high-quality learning accessible to everyone, everywhere."
    },
    stats: [
      { icon: "Users", title: "50,000+", description: "Active Students" },
      { icon: "Target", title: "500+", description: "Quality Courses" },
      { icon: "Award", title: "200+", description: "Expert Instructors" },
      { icon: "Globe", title: "100+", description: "Countries Reached" }
    ],
    story: {
      title: "Our Story",
      content: "Founded in 2020, EduLearn emerged from a simple belief: that everyone deserves access to world-class education, regardless of their location, background, or circumstances. Our founders, having experienced firsthand the transformative power of learning, set out to create a platform that would bridge the gap between ambition and opportunity."
    },
    mission: {
      title: "Our Mission",
      content: "To empower individuals worldwide with the skills and knowledge they need to succeed in an ever-evolving digital economy. We believe that learning should be engaging, practical, and accessible to all."
    },
    values: [
      {
        title: "Excellence",
        description: "We maintain the highest standards in everything we do",
        icon: "Award"
      },
      {
        title: "Innovation",
        description: "We continuously evolve our platform and teaching methods",
        icon: "Lightbulb"
      },
      {
        title: "Accessibility",
        description: "We make quality education available to everyone",
        icon: "Globe"
      }
    ]
  },
  contactPage: {
    header: {
      title: "Contact Us",
      subtitle: "Have a question or need help? We're here to assist you on your learning journey."
    },
    contactInfo: {
      emails: ["contact@edulearn.com", "support@edulearn.com"],
      phones: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      addresses: [
        {
          label: "Main Office",
          address: "123 Education Street, Learning City, LC 12345"
        }
      ],
      hours: "Monday - Friday: 9:00 AM - 6:00 PM PST"
    },
    form: {
      title: "Send us a message",
      fields: [
        { name: "name", label: "Full Name", placeholder: "Enter your full name", type: "text", required: true },
        { name: "email", label: "Email", placeholder: "Enter your email", type: "email", required: true },
        { name: "subject", label: "Subject", placeholder: "What's this about?", type: "text", required: true },
        { name: "message", label: "Message", placeholder: "Tell us more...", type: "textarea", required: true }
      ],
      submitButton: "Send Message",
      successMessage: "Thank you for your message! We'll get back to you soon."
    }
  },
  navigation: {
    brand: {
      name: "EduLearn"
    },
    links: [
      { label: "Home", path: "/", order: 1 },
      { label: "Courses", path: "/courses", order: 2 },
      { label: "About", path: "/about", order: 3 },
      { label: "Contact", path: "/contact", order: 4 }
    ],
    search: {
      placeholder: "Search courses..."
    },
    auth: {
      signInText: "Sign In",
      signUpText: "Sign Up"
    }
  },
  footer: {
    brand: {
      name: "EduLearn",
      description: "Empowering learners worldwide with high-quality, accessible online education. Join our community and unlock your potential."
    },
    linkCategories: {
      courses: [
        { label: "Web Development", href: "/courses?category=web-development" },
        { label: "Programming", href: "/courses?category=programming" },
        { label: "Design", href: "/courses?category=design" },
        { label: "Data Science", href: "/courses?category=data-science" }
      ],
      company: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
        { label: "Blog", href: "#" }
      ],
      support: [
        { label: "Help Center", href: "#" },
        { label: "Community", href: "#" },
        { label: "Student Resources", href: "#" },
        { label: "Instructor Resources", href: "#" },
        { label: "Status", href: "#" }
      ],
      legal: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "GDPR", href: "#" }
      ]
    },
    socialLinks: [
      { platform: "Facebook", href: "#", icon: "Facebook" },
      { platform: "Twitter", href: "#", icon: "Twitter" },
      { platform: "LinkedIn", href: "#", icon: "Linkedin" },
      { platform: "Instagram", href: "#", icon: "Instagram" }
    ],
    copyright: {
      text: "EduLearn. All rights reserved.",
      year: new Date().getFullYear()
    }
  },
  siteSettings: {
    general: {
      siteName: "EduLearn",
      tagline: "Learn. Grow. Succeed.",
      description: "Transform your future with expert-led online learning"
    },
    theme: {
      primaryColor: "#2563eb",
      secondaryColor: "#7c3aed",
      accentColor: "#06b6d4",
      darkMode: false
    },
    contact: {
      email: "contact@edulearn.com",
      phone: "+1 (555) 123-4567",
      address: "123 Education Street, Learning City, LC 12345"
    },
    social: {
      facebook: "https://facebook.com/edulearn",
      twitter: "https://twitter.com/edulearn",
      linkedin: "https://linkedin.com/company/edulearn",
      instagram: "https://instagram.com/edulearn"
    },
    seo: {
      metaTitle: "EduLearn - Transform Your Future with Online Learning",
      metaDescription: "Master in-demand skills with our comprehensive online courses. Join thousands of learners advancing their careers.",
      keywords: ["online learning", "education", "courses", "skills", "career development"]
    }
  },
  lastUpdated: new Date().toISOString(),
  version: "1.0.0"
};

export const useCMSStore = create<CMSState>()(
  persist(
    (set, get) => ({
      content: defaultContent,
      isLoading: false,
      isDirty: false,
      lastSaved: null,

      loadContent: async () => {
        set({ isLoading: true });
        try {
          // In a real app, this would fetch from an API
          // For now, we'll use the persisted data or default content
          const state = get();
          if (!state.content) {
            set({ content: defaultContent });
          }
        } catch (error) {
          console.error('Failed to load CMS content:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateContent: (section, data) => {
        const state = get();
        const updatedContent = {
          ...state.content,
          [section]: data,
          lastUpdated: new Date().toISOString()
        };
        
        set({
          content: updatedContent,
          isDirty: true
        });
      },

      saveContent: async () => {
        const state = get();
        try {
          // In a real app, this would save to an API
          // For now, we'll just update the lastSaved timestamp
          set({
            isDirty: false,
            lastSaved: new Date().toISOString()
          });
          
          return Promise.resolve();
        } catch (error) {
          console.error('Failed to save CMS content:', error);
          throw error;
        }
      },

      resetContent: () => {
        set({
          content: defaultContent,
          isDirty: false,
          lastSaved: null
        });
      },

      exportContent: () => {
        const state = get();
        return JSON.stringify(state.content, null, 2);
      },

      importContent: (data) => {
        try {
          const parsedData = JSON.parse(data);
          set({
            content: parsedData,
            isDirty: true,
            lastSaved: null
          });
        } catch (error) {
          console.error('Failed to import CMS content:', error);
          throw new Error('Invalid JSON format');
        }
      }
    }),
    {
      name: 'cms-content',
      version: 1
    }
  )
);
