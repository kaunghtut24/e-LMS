import React, { useState } from 'react';
import { X, Link, Twitter, Linkedin, Facebook, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PortfolioShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectUrl: string;
}

export default function PortfolioShareModal({
  isOpen,
  onClose,
  projectTitle,
  projectUrl,
}: PortfolioShareModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const shareText = `Check out my project: ${projectTitle}`;
  const shareUrl = encodeURIComponent(projectUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    email: `mailto:?subject=${encodedText}&body=${encodedText}%20${shareUrl}`,
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Share Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Project URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Project Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={projectUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-background border rounded-lg text-sm"
              />
              <Button
                onClick={() => handleCopy(projectUrl, 'url')}
                variant="outline"
                size="sm"
              >
                {copiedField === 'url' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Link className="h-4 w-4" />
                )}
                Copy
              </Button>
            </div>
          </div>

          {/* Share Buttons */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Share on Social Media
            </label>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-lg transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="text-sm font-medium">Twitter</span>
              </a>

              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] rounded-lg transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="text-sm font-medium">LinkedIn</span>
              </a>

              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-lg transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="text-sm font-medium">Facebook</span>
              </a>

              <a
                href={shareLinks.email}
                className="flex items-center gap-2 p-3 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm font-medium">Email</span>
              </a>
            </div>
          </div>

          {/* Embed Code */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Embed Code
            </label>
            <div className="relative">
              <textarea
                readOnly
                value={`<iframe src="${projectUrl}" width="100%" height="400" frameborder="0"></iframe>`}
                className="w-full px-4 py-2 bg-background border rounded-lg text-xs font-mono"
                rows={3}
              />
              <Button
                onClick={() =>
                  handleCopy(
                    `<iframe src="${projectUrl}" width="100%" height="400" frameborder="0"></iframe>`,
                    'embed'
                  )
                }
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
              >
                {copiedField === 'embed' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Link className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
