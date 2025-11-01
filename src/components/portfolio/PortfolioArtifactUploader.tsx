import React, { useState, useCallback } from 'react';
import { Upload, X, File, Image, Video, FileText, Loader2 } from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolioStore';
import { toast } from 'sonner';
import type { PortfolioArtifact } from '@/types/phase1-phase2';

interface PortfolioArtifactUploaderProps {
  projectId: string;
  onUploadComplete?: (artifact: PortfolioArtifact) => void;
}

type FileType = 'image' | 'video' | 'document' | 'link';

export default function PortfolioArtifactUploader({
  projectId,
  onUploadComplete,
}: PortfolioArtifactUploaderProps) {
  const { addArtifact, isLoading } = usePortfolioStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [projectId]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0]; // Handle single file for now
    setUploading(true);
    setUploadProgress(0);

    try {
      // Determine file type based on MIME type
      const fileType: FileType = getFileType(file.type);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // In a real implementation, you would upload to Supabase Storage
      // For now, we'll create a mock artifact
      const mockUrl = URL.createObjectURL(file);

      const artifact = await addArtifact(projectId, {
        type: fileType,
        title: file.name,
        description: '',
        url: mockUrl,
        order_index: Date.now(), // Use timestamp as order for now
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (artifact) {
        toast.success('Artifact uploaded successfully!');
        onUploadComplete?.(artifact);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload artifact');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileType = (mimeType: string): FileType => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
      return 'document';
    }
    return 'document';
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'image':
        return <Image className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          disabled={uploading || isLoading}
        />

        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {uploading ? (
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            ) : (
              <Upload className="h-6 w-6 text-primary" />
            )}
          </div>

          {uploading ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Uploading...</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground mb-1">
                Drag and drop files here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: Images (JPG, PNG, GIF), Videos (MP4, MOV), Documents (PDF, DOC)
              </p>
            </>
          )}
        </div>
      </div>

      {/* File Type Info */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2 p-2 bg-muted rounded">
          <Image className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Images</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-muted rounded">
          <Video className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Videos</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-muted rounded">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Documents</span>
        </div>
      </div>
    </div>
  );
}
