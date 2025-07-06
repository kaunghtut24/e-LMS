import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  File,
  Image,
  Video,
  FileText,
  Music,
  Archive,
  X,
  Check,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
  preview?: string;
}

interface FileUploadProps {
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  maxFiles?: number;
  onFilesUploaded: (files: UploadedFile[]) => void;
  existingFiles?: UploadedFile[];
  className?: string;
  uploadEndpoint?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  acceptedTypes = ['image/*', 'video/*', 'application/pdf', '.doc', '.docx', '.ppt', '.pptx'],
  maxFileSize = 100, // 100MB default
  maxFiles = 10,
  onFilesUploaded,
  existingFiles = [],
  className,
  uploadEndpoint = '/api/upload'
}) => {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (fileType.startsWith('video/')) return <Video className="w-6 h-6" />;
    if (fileType.startsWith('audio/')) return <Music className="w-6 h-6" />;
    if (fileType.includes('pdf')) return <FileText className="w-6 h-6" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      return file.type === type || file.name.toLowerCase().endsWith(type);
    });

    if (!isValidType) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create initial file object
    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: '',
      uploadProgress: 0,
      status: 'uploading'
    };

    // Add to files list
    setFiles(prev => [...prev, uploadedFile]);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileId', fileId);

      // Simulate upload progress (replace with actual upload logic)
      const simulateUpload = () => {
        return new Promise<string>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              // Mock URL - replace with actual uploaded file URL
              resolve(`/uploads/${fileId}-${file.name}`);
            }
            
            setFiles(prev => prev.map(f => 
              f.id === fileId 
                ? { ...f, uploadProgress: Math.min(progress, 100) }
                : f
            ));
          }, 200);
        });
      };

      const fileUrl = await simulateUpload();

      // Generate preview for images
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      // Update file with completed status
      const completedFile: UploadedFile = {
        ...uploadedFile,
        url: fileUrl,
        uploadProgress: 100,
        status: 'completed',
        preview
      };

      setFiles(prev => prev.map(f => 
        f.id === fileId ? completedFile : f
      ));

      return completedFile;

    } catch (error) {
      // Update file with error status
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error' as const }
          : f
      ));
      throw error;
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const newFiles = Array.from(fileList);

    // Check max files limit
    if (files.length + newFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate files
    const validFiles: File[] = [];
    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    // Upload files
    try {
      const uploadPromises = validFiles.map(file => uploadFile(file));
      const uploadedFiles = await Promise.all(uploadPromises);
      onFilesUploaded(uploadedFiles);
      toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error('Some files failed to upload');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  }, [files.length]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId);
      onFilesUploaded(newFiles.filter(f => f.status === 'completed'));
      return newFiles;
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          "hover:border-primary hover:bg-primary/5"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Upload Files</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop files here, or click to select files
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span>Supported formats:</span>
            {acceptedTypes.slice(0, 3).map((type, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {type.replace('*', '').replace('/', '').toUpperCase()}
              </Badge>
            ))}
            {acceptedTypes.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{acceptedTypes.length - 3} more
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Max file size: {maxFileSize}MB • Max files: {maxFiles}
          </p>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="p-4">
                <div className="flex items-center space-x-3">
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                    
                    {/* Upload Progress */}
                    {file.status === 'uploading' && (
                      <div className="mt-2">
                        <Progress value={file.uploadProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploading... {Math.round(file.uploadProgress)}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center space-x-2">
                    {file.status === 'completed' && (
                      <>
                        <Check className="w-5 h-5 text-green-500" />
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    {file.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    
                    {file.status === 'uploading' && (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
