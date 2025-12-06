import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Video, Loader2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { adminAPI } from '@/lib/api-client'
import { AttachmentGallery } from './attachment-gallery'

interface BugReportAttachment {
  path: string
  type: 'image' | 'video'
  name: string
}

interface AttachmentGalleryViewProps {
  attachments: BugReportAttachment[]
}

export function AttachmentGalleryView({
  attachments,
}: AttachmentGalleryViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const hasMultiple = attachments.length > 1
  const currentAttachment = attachments[currentIndex]

  const { data: signedUrl, isLoading } = useQuery({
    queryKey: ['bug-report-attachment-url', currentAttachment.path],
    queryFn: async () => {
      return await adminAPI.getBugReportAttachmentUrl(currentAttachment.path)
    },
    enabled: !!currentAttachment.path,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? attachments.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === attachments.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className='relative border rounded-lg bg-muted/50 overflow-hidden'>
        {/* Navigation buttons */}
        {hasMultiple && (
          <>
            <Button
              variant='ghost'
              size='icon'
              className='absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-background/80 hover:bg-background shadow-md'
              onClick={goToPrevious}
            >
              <ChevronLeft className='h-5 w-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-background/80 hover:bg-background shadow-md'
              onClick={goToNext}
            >
              <ChevronRight className='h-5 w-5' />
            </Button>
          </>
        )}

        {/* Fullscreen button */}
        <Button
          variant='ghost'
          size='icon'
          className='absolute top-2 right-2 z-10 h-9 w-9 bg-background/80 hover:bg-background shadow-md'
          onClick={() => setFullscreenOpen(true)}
        >
          <Maximize2 className='h-4 w-4' />
        </Button>

        {/* Content area */}
        <div className='aspect-video w-full flex items-center justify-center bg-black/5 dark:bg-black/20'>
          {isLoading ? (
            <div className='flex items-center justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : signedUrl ? (
            <div className='w-full h-full flex items-center justify-center p-4'>
              {currentAttachment.type === 'image' ? (
                <img
                  src={signedUrl}
                  alt={currentAttachment.name}
                  className='max-w-full max-h-full object-contain rounded-lg'
                />
                ) : (
                <video
                  src={signedUrl}
                  controls
                  className='max-w-full max-h-full rounded-lg'
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center text-muted-foreground'>
              <p className='text-lg mb-2'>Failed to load attachment</p>
              <p className='text-sm'>{currentAttachment.name}</p>
            </div>
          )}
        </div>

        {/* Footer with counter and name */}
        <div className='p-3 bg-background border-t flex items-center justify-between'>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium truncate'>{currentAttachment.name}</p>
          </div>
          {hasMultiple && (
            <div className='ml-4 text-sm text-muted-foreground whitespace-nowrap'>
              {currentIndex + 1} of {attachments.length}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen gallery */}
      <AttachmentGallery
        attachments={attachments}
        isOpen={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        initialIndex={currentIndex}
      />
    </>
  )
}

