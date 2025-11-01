import React from 'react';
import { Code, Palette, Gamepad2, Smartphone, Globe, Brain } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  previewImage?: string;
  defaultSkills: string[];
  projectType: 'personal' | 'course_project' | 'capstone' | 'hackathon';
}

interface PortfolioTemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
  onSkip?: () => void;
}

const templates: Template[] = [
  {
    id: 'web-app',
    name: 'Web Application',
    description: 'Full-stack web application with modern technologies',
    icon: <Globe className="h-6 w-6" />,
    category: 'Web Development',
    defaultSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    projectType: 'personal',
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Cross-platform mobile application',
    icon: <Smartphone className="h-6 w-6" />,
    category: 'Mobile Development',
    defaultSkills: ['React Native', 'JavaScript', 'API Integration'],
    projectType: 'personal',
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Data analysis and visualization project',
    icon: <Brain className="h-6 w-6" />,
    category: 'Data Science',
    defaultSkills: ['Python', 'Pandas', 'Matplotlib', 'Jupyter'],
    projectType: 'course_project',
  },
  {
    id: 'ui-design',
    name: 'UI/UX Design',
    description: 'User interface and experience design',
    icon: <Palette className="h-6 w-6" />,
    category: 'Design',
    defaultSkills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    projectType: 'personal',
  },
  {
    id: 'game-project',
    name: 'Game Development',
    description: 'Interactive game or simulation',
    icon: <Gamepad2 className="h-6 w-6" />,
    category: 'Game Development',
    defaultSkills: ['Unity', 'C#', 'Game Design', '3D Modeling'],
    projectType: 'personal',
  },
  {
    id: 'api-project',
    name: 'API & Backend',
    description: 'RESTful API or backend service',
    icon: <Code className="h-6 w-6" />,
    category: 'Backend',
    defaultSkills: ['Node.js', 'Express', 'MongoDB', 'API Design'],
    projectType: 'course_project',
  },
];

export default function PortfolioTemplateSelector({
  onSelectTemplate,
  onSkip,
}: PortfolioTemplateSelectorProps) {
  const categories = Array.from(new Set(templates.map((t) => t.category)));

  const getTemplatesByCategory = (category: string) =>
    templates.filter((t) => t.category === category);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Choose a Project Template
        </h3>
        <p className="text-muted-foreground">
          Select a template to get started quickly with pre-filled details
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h4 className="text-lg font-semibold text-foreground mb-3">{category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getTemplatesByCategory(category).map((template) => (
                <div
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="group cursor-pointer bg-card border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-foreground mb-1">
                        {template.name}
                      </h5>
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {template.defaultSkills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {template.defaultSkills.length > 4 && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                            +{template.defaultSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {onSkip && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onSkip}
            className="px-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip template selection
          </button>
        </div>
      )}
    </div>
  );
}
