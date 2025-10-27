import { useState, useEffect } from 'react'
import {
  Play,
  Pause,
  Trash2,
  RefreshCw,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Server,
} from 'lucide-react'
import { adminAPI } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FailedJobsModal } from './failed-jobs-modal'

interface QueueStats {
  waiting: number
  active: number
  completed: number
  failed: number
}

interface QueueData {
  [queueName: string]: QueueStats
}

interface SystemHealth {
  status: 'healthy' | 'degraded'
  queues: QueueData
  metrics: {
    totalJobs: number
    totalFailed: number
    failureRate: number
  }
  timestamp: string
}

const QUEUE_NAMES = {
  'payment-processing': 'Payment Processing',
  'notification-sending': 'Notification Sending',
  'commission-processing': 'Commission Processing',
  'sms-sending': 'SMS Sending',
  'push-notification': 'Push Notifications',
} as const

const QUEUE_DESCRIPTIONS = {
  'payment-processing':
    'Handles core payment operations and wallet transactions',
  'notification-sending': 'Processes in-app notifications for users',
  'commission-processing': 'Calculates and processes platform commission',
  'sms-sending': 'Sends SMS notifications via Twilio',
  'push-notification': 'Sends push notifications to mobile devices',
} as const

export function QueueMonitoring() {
  const [queueStats, setQueueStats] = useState<QueueData>({})
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [failedJobsModal, setFailedJobsModal] = useState<{
    isOpen: boolean
    queueName: string
    queueDisplayName: string
  }>({
    isOpen: false,
    queueName: '',
    queueDisplayName: '',
  })
  const { toast } = useToast()

  const fetchQueueStats = async () => {
    try {
      const data = await adminAPI.getQueueStats()
      setQueueStats(data.queues)
    } catch (error) {
      console.error('Error fetching queue stats:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch queue statistics',
        variant: 'destructive',
      })
    }
  }

  const fetchSystemHealth = async () => {
    try {
      const data = await adminAPI.getSystemHealth()
      setSystemHealth(data)
    } catch (error) {
      console.error('Error fetching system health:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch system health',
        variant: 'destructive',
      })
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    await Promise.all([fetchQueueStats(), fetchSystemHealth()])
    setIsRefreshing(false)
  }

  const pauseQueue = async (queueName: string) => {
    try {
      await adminAPI.pauseQueue(queueName)
      toast({
        title: 'Success',
        description: `Queue ${queueName} paused successfully`,
      })
      await refreshData()
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to pause queue ${queueName}`,
        variant: 'destructive',
      })
    }
  }

  const resumeQueue = async (queueName: string) => {
    try {
      await adminAPI.resumeQueue(queueName)
      toast({
        title: 'Success',
        description: `Queue ${queueName} resumed successfully`,
      })
      await refreshData()
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to resume queue ${queueName}`,
        variant: 'destructive',
      })
    }
  }

  const clearQueue = async (queueName: string) => {
    try {
      await adminAPI.clearQueue(queueName)
      toast({
        title: 'Success',
        description: `Queue ${queueName} cleared successfully`,
      })
      await refreshData()
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to clear queue ${queueName}`,
        variant: 'destructive',
      })
    }
  }

  const openFailedJobsModal = (queueName: string, queueDisplayName: string) => {
    setFailedJobsModal({
      isOpen: true,
      queueName,
      queueDisplayName,
    })
  }

  const closeFailedJobsModal = () => {
    setFailedJobsModal({
      isOpen: false,
      queueName: '',
      queueDisplayName: '',
    })
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchQueueStats(), fetchSystemHealth()])
      setIsLoading(false)
    }
    loadData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600'
      case 'degraded':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className='h-4 w-4' />
      case 'degraded':
        return <AlertTriangle className='h-4 w-4' />
      default:
        return <Activity className='h-4 w-4' />
    }
  }

  if (isLoading) {
    return (
      <div className='flex h-[400px] items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
          <p className='text-muted-foreground'>Loading queue monitoring...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* System Health Overview */}
      {systemHealth && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='flex items-center gap-2'>
                  <Server className='h-5 w-5' />
                  System Health
                </CardTitle>
                <CardDescription>
                  Overall system status and queue performance metrics
                </CardDescription>
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={refreshData}
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                  Refresh
                </Button>
                <Badge
                  variant={
                    systemHealth.status === 'healthy'
                      ? 'default'
                      : 'destructive'
                  }
                  className='flex items-center gap-1'
                >
                  {getStatusIcon(systemHealth.status)}
                  {systemHealth.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Total Jobs</span>
                  <span className='text-muted-foreground text-sm'>
                    {systemHealth.metrics.totalJobs}
                  </span>
                </div>
                <Progress value={100} className='h-2' />
              </div>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Failed Jobs</span>
                  <span className='text-muted-foreground text-sm'>
                    {systemHealth.metrics.totalFailed}
                  </span>
                </div>
                <Progress
                  value={systemHealth.metrics.failureRate}
                  className='h-2'
                />
              </div>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Failure Rate</span>
                  <span className='text-muted-foreground text-sm'>
                    {systemHealth.metrics.failureRate.toFixed(2)}%
                  </span>
                </div>
                <Progress
                  value={systemHealth.metrics.failureRate}
                  className='h-2'
                />
              </div>
            </div>
            {systemHealth.status === 'degraded' && (
              <Alert className='mt-4'>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>
                  System performance is degraded. Check failed jobs and consider
                  restarting queues.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Queue Statistics */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {Object.entries(QUEUE_NAMES).map(([queueKey, queueName]) => {
          const stats = queueStats[queueKey]
          if (!stats) return null

          const totalJobs =
            stats.waiting + stats.active + stats.completed + stats.failed
          const hasJobs = totalJobs > 0
          const hasFailures = stats.failed > 0

          return (
            <Card key={queueKey}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg'>{queueName}</CardTitle>
                    <CardDescription className='text-sm'>
                      {
                        QUEUE_DESCRIPTIONS[
                          queueKey as keyof typeof QUEUE_DESCRIPTIONS
                        ]
                      }
                    </CardDescription>
                  </div>
                  <div className='flex items-center gap-1'>
                    {hasFailures && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => openFailedJobsModal(queueKey, queueName)}
                        className='text-red-600 hover:text-red-700'
                      >
                        <AlertTriangle className='h-4 w-4' />
                        Failed ({stats.failed})
                      </Button>
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => pauseQueue(queueKey)}
                      disabled={!hasJobs}
                    >
                      <Pause className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => resumeQueue(queueKey)}
                      disabled={!hasJobs}
                    >
                      <Play className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => clearQueue(queueKey)}
                      disabled={!hasJobs}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {/* Job Status Counts */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 text-blue-500' />
                      <div>
                        <div className='text-sm font-medium'>Waiting</div>
                        <div className='text-lg font-bold'>{stats.waiting}</div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Activity className='h-4 w-4 text-yellow-500' />
                      <div>
                        <div className='text-sm font-medium'>Active</div>
                        <div className='text-lg font-bold'>{stats.active}</div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500' />
                      <div>
                        <div className='text-sm font-medium'>Completed</div>
                        <div className='text-lg font-bold'>
                          {stats.completed}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <XCircle className='h-4 w-4 text-red-500' />
                      <div>
                        <div className='text-sm font-medium'>Failed</div>
                        <div className='text-lg font-bold'>{stats.failed}</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {hasJobs && (
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <span>Job Progress</span>
                        <span>{totalJobs} total</span>
                      </div>
                      <Progress
                        value={(stats.completed / totalJobs) * 100}
                        className='h-2'
                      />
                      <div className='text-muted-foreground flex justify-between text-xs'>
                        <span>{stats.completed} completed</span>
                        <span>{stats.failed} failed</span>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className='flex justify-center'>
                    <Badge
                      variant={
                        hasFailures
                          ? 'destructive'
                          : hasJobs
                            ? 'default'
                            : 'secondary'
                      }
                      className='flex items-center gap-1'
                    >
                      {hasFailures ? (
                        <>
                          <XCircle className='h-3 w-3' />
                          Issues Detected
                        </>
                      ) : hasJobs ? (
                        <>
                          <Activity className='h-3 w-3' />
                          Active
                        </>
                      ) : (
                        <>
                          <CheckCircle className='h-3 w-3' />
                          Idle
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Last Updated */}
      {systemHealth && (
        <div className='text-muted-foreground text-center text-sm'>
          Last updated: {new Date(systemHealth.timestamp).toLocaleString()}
        </div>
      )}

      {/* Failed Jobs Modal */}
      <FailedJobsModal
        isOpen={failedJobsModal.isOpen}
        onClose={closeFailedJobsModal}
        queueName={failedJobsModal.queueName}
        queueDisplayName={failedJobsModal.queueDisplayName}
      />
    </div>
  )
}
