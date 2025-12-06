import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, X, Video, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { adminAPI } from '@/lib/api-client'

interface BugReportAttachment {
  path: string
  type: 'image' | 'video'
  name: string
}

interface AttachmentGalleryProps {
  attachments: BugReportAttachment[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export function AttachmentGallery({
  attachments,
  isOpen,
  onClose,
  initialIndex = 0,
}: AttachmentGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const currentAttachment = attachments[currentIndex]
  const hasMultiple = attachments.length > 1

  const { data: signedUrl, isLoading } = useQuery({
    queryKey: ['bug-report-attachment-url', currentAttachment.path],
    queryFn: async () => {
      return await adminAPI.getBugReportAttachmentUrl(currentAttachment.path)
    },
    enabled: isOpen && !!currentAttachment.path,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  // Reset index when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? attachments.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === attachments.length - 1 ? 0 : prev + 1))
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === 'Escape') onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='max-w-5xl w-[95vw] h-[95vh] p-0 gap-0'
        onKeyDown={handleKeyDown}
      >
        <div className='relative flex items-center justify-center h-full bg-black/95'>
          {/* Close button */}
          <Button
            variant='ghost'
            size='icon'
            className='absolute top-4 right-4 z-50 text-white hover:bg-white/20'
            onClick={onClose}
          >
            <X className='h-5 w-5' />
          </Button>

          {/* Previous button */}
          {hasMultiple && (
            <Button
              variant='ghost'
              size='icon'
              className='absolute left-4 z-50 text-white hover:bg-white/20 h-12 w-12'
              onClick={goToPrevious}
            >
              <ChevronLeft className='h-6 w-6' />
            </Button>
          )}

          {/* Content */}
          <div className='flex-1 flex items-center justify-center h-full p-4'>
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-white' />
              </div>
            ) : signedUrl ? (
              <div className='max-w-full max-h-full flex items-center justify-center'>
                {currentAttachment.type === 'image' ? (
                  <img
                    src={signedUrl}
                    alt={currentAttachment.name}
                    className='max-w-full max-h-full object-contain'
                  />
                ) : (
                  <div className='w-full max-w-4xl'>
                    <video
                      src={signedUrl}
                      controls
                      className='w-full max-h-[80vh]'
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center text-white'>
                <p className='text-lg mb-2'>Failed to load attachment</p>
                <p className='text-sm text-white/70'>{currentAttachment.name}</p>
              </div>
            )}
          </div>

          {/* Next button */}
          {hasMultiple && (
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-4 z-50 text-white hover:bg-white/20 h-12 w-12'
              onClick={goToNext}
            >
              <ChevronRight className='h-6 w-6' />
            </Button>
          )}

          {/* Counter and info */}
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50'>
            <div className='bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-4'>
              <span className='text-sm'>
                {currentIndex + 1} of {attachments.length}
              </span>
              {signedUrl && (
                <a
                  href={signedUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white hover:text-white/80'
                >
                  <ExternalLink className='h-4 w-4' />
                </a>
              )}
            </div>
          </div>

          {/* Attachment name */}
          <div className='absolute bottom-16 left-1/2 transform -translate-x-1/2 z-50'>
            <p className='bg-black/70 text-white px-4 py-2 rounded-lg text-sm max-w-md truncate'>
              {currentAttachment.name}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

