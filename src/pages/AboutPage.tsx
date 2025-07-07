import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Target, Award, Globe, Lightbulb } from 'lucide-react';
import { useCMSStore } from '../store/cmsStore';

const AboutPage: React.FC = () => {
  const { content, loadContent } = useCMSStore();

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Get dynamic content from CMS with fallbacks
  const aboutPageContent = content.aboutPage || {
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
      content: "Founded in 2020, EduLearn emerged from a simple belief: that everyone deserves access to world-class education, regardless of their location, background, or circumstances."
    },
    mission: {
      title: "Our Mission",
      content: "To empower individuals worldwide with the skills and knowledge they need to succeed in an ever-evolving digital economy. We believe that learning should be engaging, practical, and accessible to all."
    },
    vision: {
      title: "Our Vision",
      content: "A world where geographical boundaries don't limit educational opportunities, where anyone with the desire to learn can access the same quality of education as those in the world's leading universities and institutions."
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
  };

  // Map icon names to actual icons
  const iconMap: { [key: string]: any } = {
    Users, Target, Award, Globe, Lightbulb
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {aboutPageContent?.header?.title || "About EduLearn"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {aboutPageContent?.header?.subtitle || "We're on a mission to democratize education"}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {(aboutPageContent?.stats || []).map((stat, index) => {
            const IconComponent = iconMap[stat?.icon] || Target;
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <IconComponent className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>{stat?.title || stat?.value || "N/A"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">{stat?.description || stat?.label || "Description"}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{aboutPageContent?.mission?.title || "Our Mission"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {aboutPageContent?.mission?.content || "Mission content goes here..."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{aboutPageContent?.vision?.title || "Our Vision"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {aboutPageContent?.vision?.content || "Vision content goes here..."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">{aboutPageContent?.story?.title || "Our Story"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none dark:prose-invert mx-auto">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center">
                  {aboutPageContent?.story?.content || "Story content goes here..."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(aboutPageContent?.values || []).map((value, index) => {
              const IconComponent = iconMap[value?.icon] || Award;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <IconComponent className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle className="text-xl">{value?.title || "Value"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value?.description || "Description"}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;