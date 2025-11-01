import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useAchievementStore } from '@/store/achievementStore';
import { Plus, ExternalLink, Github, Eye, Heart, Award, Briefcase, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import CreateProjectModal from '@/components/portfolio/CreateProjectModal';
import EditProjectModal from '@/components/portfolio/EditProjectModal';
import type { PortfolioProject } from '@/types/phase1-phase2';

export default function PortfolioPage() {
  const { user } = useAuthStore();
  const { projects, isLoading, loadProjects, deleteProject, publishProject } = usePortfolioStore();
  const { userAchievements, loadUserAchievements } = useAchievementStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadProjects(user.id);
      loadUserAchievements(user.id);
    }
  }, [user?.id]);

  const handlePublish = async (projectId: string) => {
    try {
      await publishProject(projectId);
      toast.success('Project published successfully!');
    } catch (error) {
      toast.error('Failed to publish project');
    }
  };

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        toast.success('Project deleted');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleEdit = (project: PortfolioProject) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'text-gray-500',
      uncommon: 'text-green-500',
      rare: 'text-blue-500',
      epic: 'text-purple-500',
      legendary: 'text-orange-500',
    };
    return colors[rarity] || 'text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Briefcase className="h-8 w-8 text-primary" />
                My Portfolio
              </h1>
              <p className="mt-2 text-muted-foreground">
                Showcase your projects and achievements
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Project
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Projects */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Projects</h2>
              
              {projects.length === 0 ? (
                <div className="bg-card rounded-lg border p-12 text-center">
                  <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No projects yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start building your portfolio by adding your first project
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Add Your First Project
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            title="Edit project"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded-lg transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Skills */}
                      {project.skills && project.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex items-center gap-4 mb-4">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Github className="h-4 w-4" />
                            GitHub
                          </a>
                        )}
                        {project.live_demo_url && (
                          <a
                            href={project.live_demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Live Demo
                          </a>
                        )}
                      </div>

                      {/* Stats and Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {project.views_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {project.likes_count}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              project.status === 'published'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                        {project.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(project.id)}
                            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            Publish
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Achievements
              </h3>
              {userAchievements.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No achievements yet. Complete courses and projects to earn badges!
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {userAchievements.map((ua) => {
                    const achievement = ua.achievement as any;
                    return (
                      <div
                        key={ua.id}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        title={achievement.description}
                      >
                        <Award className={`h-8 w-8 ${getRarityColor(achievement.rarity)}`} />
                        <span className="text-xs text-center text-foreground font-medium line-clamp-2">
                          {achievement.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Projects</span>
                  <span className="text-lg font-bold text-foreground">{projects.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Published</span>
                  <span className="text-lg font-bold text-foreground">
                    {projects.filter(p => p.status === 'published').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Achievements</span>
                  <span className="text-lg font-bold text-foreground">{userAchievements.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Views</span>
                  <span className="text-lg font-bold text-foreground">
                    {projects.reduce((sum, p) => sum + p.views_count, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
      />
    </div>
  );
}
