'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Typography'
import { Flex } from '@/components/ui/Layout'
import { cn } from '@/lib/utils'
import { CreateContentUploadData } from '@/types/content'

interface ContentUploadProps {
  onUploadComplete?: (upload: any) => void
  onUploadError?: (error: string) => void
  className?: string
  maxFileSize?: number // in bytes
  acceptedTypes?: string[]
}

export const ContentUpload = ({
  onUploadComplete,
  onUploadError,
  className,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt']
}: ContentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    // Validate file size
    if (file.size > maxFileSize) {
      const maxSizeMB = maxFileSize / (1024 * 1024)
      onUploadError?.(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }

    // Validate file type
    const isValidType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0]
        return file.type.startsWith(baseType)
      }
      return file.type === type || file.name.toLowerCase().endsWith(type)
    })

    if (!isValidType) {
      onUploadError?.('File type not supported')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('originalName', file.name)
      formData.append('fileType', getFileType(file.type))

      // TODO: Replace with actual API call
      // For now, simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Mock successful upload response
      const mockUpload = {
        id: `upload-${Date.now()}`,
        filename: `${Date.now()}-${file.name}`,
        originalName: file.name,
        fileType: getFileType(file.type),
        fileSize: file.size,
        mimeType: file.type,
        storageLocation: `/uploads/${Date.now()}-${file.name}`,
        moderationStatus: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      onUploadComplete?.(mockUpload)
      
      // Reset state
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }, 1000)

    } catch (error) {
      console.error('Upload failed:', error)
      onUploadError?.('Upload failed. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const getFileType = (mimeType: string): 'image' | 'document' | 'video' | 'audio' => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    return 'document'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging
            ? 'border-primary-400 bg-primary-50'
            : 'border-neutral-300 hover:border-neutral-400',
          isUploading && 'pointer-events-none opacity-75'
        )}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <Text weight="medium" className="text-neutral-900 mb-2">
                Uploading...
              </Text>
              <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <Text size="sm" color="muted">
                {uploadProgress}% complete
              </Text>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-neutral-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div>
              <Text weight="medium" className="text-neutral-900 mb-2">
                {isDragging ? 'Drop your file here' : 'Drag and drop your file here'}
              </Text>
              <Text size="sm" color="muted" className="mb-4">
                or click to browse your files
              </Text>
            </div>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Choose File
            </Button>

            <div className="text-xs text-neutral-500 space-y-1">
              <div>Supported formats: Images, PDFs, Documents</div>
              <div>Maximum file size: {formatFileSize(maxFileSize)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept={acceptedTypes.join(',')}
        className="hidden"
        aria-label="File upload input"
      />
    </div>
  )
}
