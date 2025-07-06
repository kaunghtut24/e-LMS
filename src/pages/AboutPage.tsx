import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Target, Award, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About EduLearn</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're on a mission to democratize education and make high-quality learning accessible to everyone, everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>50,000+</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">Active Students</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>500+</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">Quality Courses</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>200+</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">Expert Instructors</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>100+</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">Countries Reached</p>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-lg max-w-4xl mx-auto dark:prose-invert">
          <h2>Our Story</h2>
          <p>
            Founded in 2020, EduLearn emerged from a simple belief: that everyone deserves access to world-class education, 
            regardless of their location, background, or circumstances. Our founders, having experienced firsthand the 
            transformative power of learning, set out to create a platform that would bridge the gap between ambition and opportunity.
          </p>

          <h2>Our Mission</h2>
          <p>
            To empower individuals worldwide with the skills and knowledge they need to succeed in an ever-evolving digital economy. 
            We believe that learning should be engaging, practical, and accessible to all.
          </p>

          <h2>What Sets Us Apart</h2>
          <ul>
            <li><strong>Expert Instructors:</strong> Our courses are taught by industry professionals with real-world experience</li>
            <li><strong>Practical Learning:</strong> Every course includes hands-on projects and real-world applications</li>
            <li><strong>Community Support:</strong> Join a global community of learners and get support when you need it</li>
            <li><strong>Lifetime Access:</strong> Once enrolled, access your courses anytime, anywhere, forever</li>
          </ul>

          <h2>Looking Forward</h2>
          <p>
            As we continue to grow, we remain committed to our core values of accessibility, quality, and innovation. 
            We're constantly expanding our course catalog, improving our platform, and finding new ways to support 
            our learners on their educational journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;