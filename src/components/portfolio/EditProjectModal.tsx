import { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolioStore';
import { toast } from 'sonner';
import type { PortfolioProject } from '@/types/phase1-phase2';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PortfolioProject | null;
}

export default function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const { updateProject, isLoading } = usePortfolioStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_type: 'personal' as 'course_project' | 'personal' | 'capstone' | 'hackathon',
    visibility: 'public' as 'private' | 'organization' | 'public',
    github_url: '',
    live_demo_url: '',
    video_url: '',
    skills: [] as string[],
  });

  const [currentSkill, setCurrentSkill] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description || '',
        project_type: project.project_type || 'personal',
        visibility: project.visibility,
        github_url: project.github_url || '',
        live_demo_url: project.live_demo_url || '',
        video_url: project.video_url || '',
        skills: project.skills || [],
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!project) return;

    if (!formData.title.trim()) {
      toast.error('Please enter a project title');
      return;
    }

    await updateProject(project.id, {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      project_type: formData.project_type,
      visibility: formData.visibility,
      github_url: formData.github_url.trim() || undefined,
      live_demo_url: formData.live_demo_url.trim() || undefined,
      video_url: formData.video_url.trim() || undefined,
      skills: formData.skills,
    });

    toast.success('Project updated successfully!');
    onClose();
  };

  const handleAddSkill = () => {
    const skill = currentSkill.trim().toLowerCase();
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Edit Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="E-Commerce Website"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Describe your project, the technologies used, and what you learned..."
            />
          </div>

          {/* Project Type & Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Type
              </label>
              <select
                value={formData.project_type}
                onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value as any }))}
                className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="personal">Personal Project</option>
                <option value="course_project">Course Project</option>
                <option value="capstone">Capstone Project</option>
                <option value="hackathon">Hackathon Project</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Visibility
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as any }))}
                className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="public">Public (Everyone can see)</option>
                <option value="organization">Organization Only</option>
                <option value="private">Private (Only you)</option>
              </select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Skills Used
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., React, TypeScript, Node.js"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-primary/70 transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://github.com/username/project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Live Demo URL
              </label>
              <input
                type="url"
                value={formData.live_demo_url}
                onChange={(e) => setFormData(prev => ({ ...prev, live_demo_url: e.target.value }))}
                className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://myproject.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Video Demo URL (YouTube, Vimeo, etc.)
              </label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                className="w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
