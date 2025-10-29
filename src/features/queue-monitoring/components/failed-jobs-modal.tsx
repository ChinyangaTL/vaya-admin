import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  RotateCcw,
  Trash2,
  Eye,
  RefreshCw,
  XCircle,
  CheckCircle,
} from 'lucide-react'
import { adminAPI } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface FailedJob {
  id: string
  name: string
  data: any
  failedReason: string
  attemptsMade: number
  processedOn?: number
  finishedOn?: number
  timestamp: number
}

interface JobDetails {
  id: string
  name: string
  data: any
  opts: any
  progress: number
  returnvalue: any
  failedReason: string
  stacktrace: string[]
  attemptsMade: number
  processedOn?: number
  finishedOn?: number
  timestamp: number
  state: string
}

interface FailedJobsModalProps {
  isOpen: boolean
  onClose: () => void
  queueName: string
  queueDisplayName: string
}

export function FailedJobsModal({
  isOpen,
  onClose,
  queueName,
  queueDisplayName,
}: FailedJobsModalProps) {
  const [failedJobs, setFailedJobs] = useState<FailedJob[]>([])
  const [selectedJob, setSelectedJob] = useState<JobDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRetrying, setIsRetrying] = useState<string | null>(null)
  const [isRemoving, setIsRemoving] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchFailedJobs = async () => {
    if (!isOpen) return

    setIsLoading(true)
    try {
      const data = await adminAPI.getFailedJobs(queueName, 100, 0)
      setFailedJobs(data.failedJobs || [])
    } catch (error) {
      console.error('Error fetching failed jobs:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch failed jobs',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchJobDetails = async (jobId: string) => {
    try {
      const data = await adminAPI.getJobDetails(queueName, jobId)
      setSelectedJob(data.jobDetails)
    } catch (error) {
      console.error('Error fetching job details:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch job details',
        variant: 'destructive',
      })
    }
  }

  const retryJob = async (jobId: string) => {
    setIsRetrying(jobId)
    try {
      await adminAPI.retryFailedJob(queueName, jobId)
      toast({
        title: 'Success',
        description: 'Job retried successfully',
      })
      await fetchFailedJobs() // Refresh the list
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to retry job',
        variant: 'destructive',
      })
    } finally {
      setIsRetrying(null)
    }
  }

  const retryAllJobs = async () => {
    setIsRetrying('all')
    try {
      const data = await adminAPI.retryAllFailedJobs(queueName)
      toast({
        title: 'Success',
        description: `${data.retryCount} jobs retried successfully`,
      })
      await fetchFailedJobs() // Refresh the list
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to retry all jobs',
        variant: 'destructive',
      })
    } finally {
      setIsRetrying(null)
    }
  }

  const removeJob = async (jobId: string) => {
    setIsRemoving(jobId)
    try {
      await adminAPI.removeFailedJob(queueName, jobId)
      toast({
        title: 'Success',
        description: 'Job removed successfully',
      })
      await fetchFailedJobs() // Refresh the list
      if (selectedJob?.id === jobId) {
        setSelectedJob(null)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove job',
        variant: 'destructive',
      })
    } finally {
      setIsRemoving(null)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchFailedJobs()
    }
  }, [isOpen, queueName])

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getJobTypeDisplay = (jobName: string) => {
    switch (jobName) {
      case 'processPayment':
        return 'Payment Processing'
      case 'processCommission':
        return 'Commission Processing'
      case 'sendNotification':
        return 'Notification Sending'
      case 'sendSMS':
        return 'SMS Sending'
      case 'sendPushNotification':
        return 'Push Notification'
      default:
        return jobName
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[80vh] max-w-4xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-red-500' />
            Failed Jobs - {queueDisplayName}
          </DialogTitle>
          <DialogDescription>
            Manage failed jobs in the {queueDisplayName} queue. You can retry
            individual jobs or remove them permanently.
          </DialogDescription>
        </DialogHeader>

        <div className='flex gap-4'>
          {/* Failed Jobs List */}
          <div className='flex-1'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>
                Failed Jobs ({failedJobs.length})
              </h3>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={fetchFailedJobs}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                  />
                  Refresh
                </Button>
                {failedJobs.length > 0 && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={retryAllJobs}
                    disabled={isRetrying === 'all'}
                  >
                    <RotateCcw className='h-4 w-4' />
                    Retry All
                  </Button>
                )}
              </div>
            </div>

            <ScrollArea className='h-[400px]'>
              {isLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <div className='text-center'>
                    <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
                    <p className='text-muted-foreground'>
                      Loading failed jobs...
                    </p>
                  </div>
                </div>
              ) : failedJobs.length === 0 ? (
                <div className='flex items-center justify-center py-8'>
                  <div className='text-center'>
                    <CheckCircle className='mx-auto mb-4 h-12 w-12 text-green-500' />
                    <p className='text-muted-foreground'>
                      No failed jobs found
                    </p>
                  </div>
                </div>
              ) : (
                <div className='space-y-2'>
                  {failedJobs.map((job) => (
                    <div
                      key={job.id}
                      className='hover:bg-muted/50 cursor-pointer rounded-lg border p-4'
                      onClick={() => fetchJobDetails(job.id)}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                          <div className='mb-2 flex items-center gap-2'>
                            <Badge variant='destructive' className='text-xs'>
                              {getJobTypeDisplay(job.name)}
                            </Badge>
                            <Badge variant='outline' className='text-xs'>
                              {job.attemptsMade} attempts
                            </Badge>
                          </div>
                          <p className='text-muted-foreground mb-1 text-sm'>
                            Failed: {formatTimestamp(job.timestamp)}
                          </p>
                          <p className='line-clamp-2 text-sm font-medium'>
                            {job.failedReason}
                          </p>
                        </div>
                        <div className='ml-4 flex gap-1'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={(e) => {
                              e.stopPropagation()
                              fetchJobDetails(job.id)
                            }}
                          >
                            <Eye className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={(e) => {
                              e.stopPropagation()
                              retryJob(job.id)
                            }}
                            disabled={isRetrying === job.id}
                          >
                            <RotateCcw className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={(e) => {
                              e.stopPropagation()
                              removeJob(job.id)
                            }}
                            disabled={isRemoving === job.id}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Job Details */}
          {selectedJob && (
            <>
              <Separator orientation='vertical' />
              <div className='flex-1'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-lg font-semibold'>Job Details</h3>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setSelectedJob(null)}
                  >
                    <XCircle className='h-4 w-4' />
                  </Button>
                </div>

                <ScrollArea className='h-[400px]'>
                  <div className='space-y-4'>
                    {/* Basic Info */}
                    <div>
                      <h4 className='mb-2 font-medium'>Basic Information</h4>
                      <div className='bg-muted/50 space-y-2 rounded-lg p-3 text-sm'>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Job ID:</span>
                          <span className='font-mono'>{selectedJob.id}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Type:</span>
                          <span>{getJobTypeDisplay(selectedJob.name)}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>State:</span>
                          <Badge variant='destructive'>
                            {selectedJob.state}
                          </Badge>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>
                            Attempts:
                          </span>
                          <span>{selectedJob.attemptsMade}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>
                            Created:
                          </span>
                          <span>{formatTimestamp(selectedJob.timestamp)}</span>
                        </div>
                        {selectedJob.processedOn && (
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Processed:
                            </span>
                            <span>
                              {formatTimestamp(selectedJob.processedOn)}
                            </span>
                          </div>
                        )}
                        {selectedJob.finishedOn && (
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Finished:
                            </span>
                            <span>
                              {formatTimestamp(selectedJob.finishedOn)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Error Information */}
                    <div>
                      <h4 className='mb-2 font-medium'>Error Information</h4>
                      <div className='rounded-lg bg-red-50 p-3 dark:bg-red-950/20'>
                        <p className='mb-2 text-sm font-medium text-red-800 dark:text-red-200'>
                          Error Message:
                        </p>
                        <p className='mb-3 text-sm text-red-700 dark:text-red-300'>
                          {selectedJob.failedReason}
                        </p>
                        {selectedJob.stacktrace &&
                          selectedJob.stacktrace.length > 0 && (
                            <>
                              <p className='mb-2 text-sm font-medium text-red-800 dark:text-red-200'>
                                Stack Trace:
                              </p>
                              <pre className='overflow-x-auto text-xs whitespace-pre-wrap text-red-700 dark:text-red-300'>
                                {selectedJob.stacktrace.join('\n')}
                              </pre>
                            </>
                          )}
                      </div>
                    </div>

                    {/* Job Data */}
                    <div>
                      <h4 className='mb-2 font-medium'>Job Data</h4>
                      <div className='bg-muted/50 rounded-lg p-3'>
                        <pre className='overflow-x-auto text-xs whitespace-pre-wrap'>
                          {JSON.stringify(selectedJob.data, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className='flex gap-2'>
                      <Button
                        onClick={() => retryJob(selectedJob.id)}
                        disabled={isRetrying === selectedJob.id}
                        className='flex-1'
                      >
                        <RotateCcw className='mr-2 h-4 w-4' />
                        Retry Job
                      </Button>
                      <Button
                        variant='destructive'
                        onClick={() => removeJob(selectedJob.id)}
                        disabled={isRemoving === selectedJob.id}
                        className='flex-1'
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Remove Job
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}



