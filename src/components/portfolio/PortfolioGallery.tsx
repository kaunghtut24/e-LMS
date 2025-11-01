import React, { useState } from 'react';
import { Calendar, ExternalLink, Github, Eye, Heart, Filter } from 'lucide-react';
import { format } from 'date-fns';
import type { PortfolioProject } from '@/types/phase1-phase2';

interface PortfolioGalleryProps {
  projects: PortfolioProject[];
  onSelectProject: (project: PortfolioProject) => void;
  viewMode?: 'grid' | 'list';
}

export default function PortfolioGallery({
  projects,
  onSelectProject,
  viewMode = 'grid',
}: PortfolioGalleryProps) {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const getProjectTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      personal: 'Personal',
      course_project: 'Course Project',
      capstone: 'Capstone',
      hackathon: 'Hackathon',
    };
    return types[type] || type;
  };

  const getVisibilityIcon = (visibility: string) => {
    // Could add lock icon for private, etc.
    return null;
  };

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Eye className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
        <p className="text-muted-foreground">
          {filter === 'all'
            ? 'Create your first project to get started'
            : `No ${filter} projects found`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="all">All Projects</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer bg-card border rounded-lg overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-200"
            >
              {/* Project Image/Thumbnail */}
              <div className="aspect-video bg-muted flex items-center justify-center">
                {project.artifacts && project.artifacts.length > 0 ? (
                  <img
                    src={project.artifacts[0].url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground">
                    <Eye className="h-12 w-12" />
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  {getVisibilityIcon(project.visibility)}
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {project.description || 'No description provided'}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    {getProjectTypeLabel(project.project_type)}
                  </span>
                  {project.skills.slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {project.skills.length > 2 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                      +{project.skills.length - 2}
                    </span>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(project.created_at), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {project.view_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {project.like_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer bg-card border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-32 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                  {project.artifacts && project.artifacts.length > 0 ? (
                    <img
                      src={project.artifacts[0].url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Eye className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          title="View on GitHub"
                        >
                          <Github className="h-4 w-4 text-muted-foreground" />
                        </a>
                      )}
                      {project.live_demo_url && (
                        <a
                          href={project.live_demo_url}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          title="View Live Demo"
                        >
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {getProjectTypeLabel(project.project_type)}
                      </span>
                      {project.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(project.created_at), 'MMM d, yyyy')}
                      </div>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {project.view_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
