import React, { useState } from 'react';
import { Text } from '@/components/ui';

interface ContentUploadProps {
  onUploadComplete: (file: File) => void;
  maxFileSize: number;
  acceptedTypes: string[];
}

const ContentUpload: React.FC<ContentUploadProps> = ({
  onUploadComplete,
  maxFileSize,
  acceptedTypes
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size <= maxFileSize) {
        onUploadComplete(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= maxFileSize) {
        onUploadComplete(file);
      }
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-300 hover:border-primary-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        <div className="text-4xl">📎</div>
        <div>
          <Text variant="body-large" className="mb-2">
            Drop your file here or click to browse
          </Text>
          <Text variant="body-small" color="muted">
            Max size: {Math.round(maxFileSize / 1024 / 1024)}MB
          </Text>
        </div>
        <input
          type="file"
          onChange={handleFileInput}
          accept={acceptedTypes.join(',')}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer transition-colors"
        >
          Choose File
        </label>
      </div>
    </div>
  );
};

export default ContentUpload;
