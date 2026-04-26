import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { apiClient } from '@/api/client'

interface FileUploadProps {
  onUploadComplete?: (data: any) => void
}

const ALLOWED_FORMATS = ['ipa', 'app', 'apk', 'aab', 'dsym', 'xcarchive']
const MAX_SIZE = 500 * 1024 * 1024 // 500MB

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.error('No files accepted')
      return
    }

    const file = acceptedFiles[0]

    // Validate format
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_FORMATS.includes(ext || '')) {
      toast.error(`Unsupported format. Allowed: ${ALLOWED_FORMATS.join(', ')}`)
      return
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      toast.error('File too large (max 500MB)')
      return
    }

    setUploading(true)
    try {
      const response = await apiClient.uploadAnalysis(file)
      toast.success(`Analysis started: ${file.name}`)
      onUploadComplete?.(response)
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Upload failed'
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }, [onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: uploading,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />

      <svg
        className="w-12 h-12 mx-auto mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
        />
      </svg>

      {uploading ? (
        <>
          <p className="text-gray-600 font-medium">Yükleniyor...</p>
          <p className="text-sm text-gray-500 mt-2">Lütfen bekleyin</p>
        </>
      ) : (
        <>
          <p className="text-gray-600 font-medium">
            {isDragActive ? 'Dosyayı buraya bırak' : 'Dosyayı sürükle veya tıkla'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            IPA, APP, APK, AAB, dSYM, XCArchive destekleniyor (Max 500MB)
          </p>
        </>
      )}
    </div>
  )
}
