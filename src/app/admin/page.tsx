'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Container } from '@/components/ui'

// Admin Dashboard for Kamunity Demo
// Context: Demo-only (200 users, few hours), data export and monitoring

interface DashboardStats {
  totalUsers: number
  totalMessages: number
  totalRooms: number
  totalAnalyticsEvents: number
  totalNewsItems: number
  totalComments: number
  activeUsers: number
  signupsLast24h: number
}

interface RecentActivity {
  id: string
  type: 'signup' | 'login' | 'error' | 'room_created' | 'message_sent'
  user_id?: string
  username?: string
  email?: string
  message: string
  timestamp: string
  status: 'success' | 'failure' | 'warning'
  error_category?: 'auth' | 'database' | 'validation' | 'network'
  details?: any
}

interface FailureSummary {
  auth_failures: number
  database_failures: number
  validation_failures: number
  network_failures: number
  last_failure?: RecentActivity
}

interface ExportData {
  users: any[]
  messages: any[]
  rooms: any[]
  analytics_events: any[]
  news_items: any[]
  news_comments: any[]
  user_sessions: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [exportData, setExportData] = useState<ExportData | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [failureSummary, setFailureSummary] = useState<FailureSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔧 Fetching admin dashboard stats...')

      // Get counts from all tables with fresh data
      const [
        usersResult,
        messagesResult,
        roomsResult,
        analyticsResult,
        newsResult,
        commentsResult
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }).order('created_at', { ascending: false }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('rooms').select('*', { count: 'exact', head: true }),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }),
        supabase.from('news_items').select('*', { count: 'exact', head: true }),
        supabase.from('news_comments').select('*', { count: 'exact', head: true })
      ])

      // Get active users (users with messages in last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { count: activeUsersCount } = await supabase
        .from('messages')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', oneHourAgo)

      // Get signups in last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { count: recentSignupsCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twentyFourHoursAgo)

      const dashboardStats: DashboardStats = {
        totalUsers: usersResult.count || 0,
        totalMessages: messagesResult.count || 0,
        totalRooms: roomsResult.count || 0,
        totalAnalyticsEvents: analyticsResult.count || 0,
        totalNewsItems: newsResult.count || 0,
        totalComments: commentsResult.count || 0,
        activeUsers: activeUsersCount || 0,
        signupsLast24h: recentSignupsCount || 0
      }

      setStats(dashboardStats)
      console.log('✅ Dashboard stats loaded:', dashboardStats)
      setLastUpdate(new Date())

    } catch (err: any) {
      console.error('❌ Failed to fetch dashboard stats:', err)
      setError(`Failed to fetch stats: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Fetch recent activity from multiple sources
  const fetchRecentActivity = async () => {
    try {
      console.log('🔧 Fetching recent activity...')
      
      // Get recent users (signups) with enhanced debugging
      console.log('🔍 Fetching recent users...')
      const { data: recentUsers, error: usersError } = await supabase
        .from('users')
        .select('id, username, email, created_at')
        .order('created_at', { ascending: false })
        .limit(10) // Increased to see more recent activity
      
      if (usersError) {
        console.error('❌ Error fetching recent users:', usersError)
      } else {
        console.log('✅ Recent users fetched:', recentUsers?.length || 0)
        console.log('📋 Latest users:', recentUsers?.slice(0, 3).map(u => ({ username: u.username, created: u.created_at })))
      }
      
      // Get recent analytics events (errors, activities)
      const { data: recentEvents } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      // Get recent user sessions (login attempts) - skip if 400 error
      let recentSessions = null
      try {
        const { data: sessions } = await supabase
          .from('user_sessions')
          .select('*')
          .order('started_at', { ascending: false })
          .limit(5)
        recentSessions = sessions
      } catch (sessionError) {
        console.warn('⚠️ User sessions query failed (non-critical):', sessionError)
      }
      
      // Combine and format activity
      const activities: RecentActivity[] = []
      
      // Add signup activities with debugging
      console.log('🔍 Processing signup activities for', recentUsers?.length || 0, 'users')
      recentUsers?.forEach((user, index) => {
        const activity = {
          id: `signup_${user.id}`,
          type: 'signup' as const,
          user_id: user.id,
          username: user.username,
          email: user.email,
          message: `New user signup: ${user.username} (${user.email})`,
          timestamp: user.created_at,
          status: 'success' as const
        }
        activities.push(activity)
        if (index < 2) {
          console.log(`📝 Added signup activity:`, { username: user.username, timestamp: user.created_at })
        }
      })
      
      // Add analytics events (including errors)
      recentEvents?.forEach(event => {
        const isError = event.event_type.includes('error') || event.event_type.includes('failure')
        activities.push({
          id: `event_${event.id}`,
          type: isError ? 'error' : 'login',
          user_id: event.user_id,
          message: `${event.event_type}: ${JSON.stringify(event.event_data).substring(0, 100)}`,
          timestamp: event.created_at,
          status: isError ? 'failure' : 'success',
          error_category: isError ? 'auth' : undefined,
          details: event.event_data
        })
      })
      
      // Sort by timestamp and take latest 10
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)
      
      console.log('📊 Final sorted activities:', sortedActivities.length)
      console.log('🔝 Top 3 activities:', sortedActivities.slice(0, 3).map(a => ({ 
        type: a.type, 
        message: a.message.substring(0, 50), 
        timestamp: a.timestamp 
      })))
      
      setRecentActivity(sortedActivities)
      
      // Calculate failure summary
      const failures = sortedActivities.filter(a => a.status === 'failure')
      const failureSummary: FailureSummary = {
        auth_failures: failures.filter(f => f.error_category === 'auth').length,
        database_failures: failures.filter(f => f.error_category === 'database').length,
        validation_failures: failures.filter(f => f.error_category === 'validation').length,
        network_failures: failures.filter(f => f.error_category === 'network').length,
        last_failure: failures[0] || undefined
      }
      
      setFailureSummary(failureSummary)
      console.log('✅ Recent activity loaded:', sortedActivities.length, 'events')
      console.log('📊 Activity breakdown:', {
        signups: activities.filter(a => a.type === 'signup').length,
        events: activities.filter(a => a.type !== 'signup').length,
        total: sortedActivities.length
      })
      
    } catch (err: any) {
      console.warn('⚠️ Failed to fetch recent activity:', err)
    }
  }

  // Export all data for download
  const exportAllData = async () => {
    try {
      setExporting(true)
      setError(null)

      console.log('🔧 Exporting all demo data...')

      // Fetch all data from all tables
      const [
        usersData,
        messagesData,
        roomsData,
        analyticsData,
        newsData,
        commentsData,
        sessionsData
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('messages').select('*'),
        supabase.from('rooms').select('*'),
        supabase.from('analytics_events').select('*'),
        supabase.from('news_items').select('*'),
        supabase.from('news_comments').select('*'),
        supabase.from('user_sessions').select('*')
      ])

      const exportData: ExportData = {
        users: usersData.data || [],
        messages: messagesData.data || [],
        rooms: roomsData.data || [],
        analytics_events: analyticsData.data || [],
        news_items: newsData.data || [],
        news_comments: commentsData.data || [],
        user_sessions: sessionsData.data || []
      }

      setExportData(exportData)
      console.log('✅ Data export completed')

      // Trigger download
      downloadAsJSON(exportData)

    } catch (err: any) {
      console.error('❌ Failed to export data:', err)
      setError(`Failed to export data: ${err.message}`)
    } finally {
      setExporting(false)
    }
  }

  // Download data as JSON file
  const downloadAsJSON = (data: ExportData) => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `kamunity-demo-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Download data as CSV
  const downloadAsCSV = (tableName: keyof ExportData) => {
    if (!exportData || !exportData[tableName]) return

    const data = exportData[tableName]
    if (data.length === 0) return

    // Convert to CSV
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          if (typeof value === 'object') return JSON.stringify(value)
          return `"${String(value).replace(/"/g, '""')}"`
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `kamunity-${tableName}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Apply RLS migration
  const applyRLSMigration = async () => {
    try {
      setLoading(true)
      console.log('🔧 Applying RLS migration...')

      const response = await fetch('/api/admin/apply-demo-rls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()
      
      if (response.ok) {
        console.log('✅ RLS migration applied:', result)
        alert('RLS policies updated successfully!')
        fetchStats() // Refresh stats
      } else {
        console.error('❌ RLS migration failed:', result)
        setError(`RLS migration failed: ${result.error}`)
      }
    } catch (err: any) {
      console.error('❌ RLS migration error:', err)
      setError(`RLS migration error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Initial load and auto-refresh setup
  useEffect(() => {
    fetchStats()
    fetchRecentActivity()
  }, [])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard...')
      fetchStats()
      fetchRecentActivity()
    }, 8000) // Refresh every 8 seconds for demo reliability
    
    return () => clearInterval(interval)
  }, [autoRefresh])

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kamunity Demo Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor demo activity and export data (Demo: 200 users, few hours)
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Quick Actions & Status */}
          <div className="mb-8 flex flex-wrap gap-4 items-center">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Stats'}
            </button>
            
            <button
              onClick={exportAllData}
              disabled={exporting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : 'Export All Data (JSON)'}
            </button>

            <button
              onClick={applyRLSMigration}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Fix Database Policies
            </button>
            
            {/* Auto-refresh toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="autoRefresh" className="text-sm text-gray-600">
                Auto-refresh (8s)
              </label>
            </div>
            
            {/* Last update indicator */}
            {lastUpdate && (
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Users" value={stats.totalUsers} color="blue" />
              <StatCard title="Active Users (1h)" value={stats.activeUsers} color="green" />
              <StatCard title="New Signups (24h)" value={stats.signupsLast24h} color="purple" />
              <StatCard title="Total Messages" value={stats.totalMessages} color="orange" />
              <StatCard title="Total Rooms" value={stats.totalRooms} color="indigo" />
              <StatCard title="News Items" value={stats.totalNewsItems} color="pink" />
              <StatCard title="Comments" value={stats.totalComments} color="yellow" />
              <StatCard title="Analytics Events" value={stats.totalAnalyticsEvents} color="gray" />
            </div>
          )}
          
          {/* Real-time Monitoring Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <span className="text-sm text-gray-500">Live Updates</span>
              </div>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="border-l-4 border-gray-200 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            activity.status === 'success' ? 'bg-green-500' :
                            activity.status === 'failure' ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                          <span className="font-medium text-sm">
                            {activity.type.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{activity.message}</p>
                      {activity.username && (
                        <p className="text-xs text-gray-500">User: {activity.username}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
            
            {/* Failure Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Failure Monitoring</h2>
              
              {failureSummary ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {failureSummary.auth_failures}
                      </div>
                      <div className="text-sm text-red-700">Auth Failures</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {failureSummary.database_failures}
                      </div>
                      <div className="text-sm text-orange-700">DB Failures</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {failureSummary.validation_failures}
                      </div>
                      <div className="text-sm text-yellow-700">Validation</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {failureSummary.network_failures}
                      </div>
                      <div className="text-sm text-purple-700">Network</div>
                    </div>
                  </div>
                  
                  {failureSummary.last_failure && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-medium text-red-800 mb-2">Latest Failure:</h3>
                      <p className="text-sm text-red-700">{failureSummary.last_failure.message}</p>
                      <p className="text-xs text-red-600 mt-1">
                        {new Date(failureSummary.last_failure.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-green-600">✅</div>
                  <p className="text-green-700 mt-2">No failures detected</p>
                </div>
              )}
            </div>
          </div>

          {/* Export Options */}
          {exportData && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Export Individual Tables</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(exportData).map(([tableName, data]) => (
                  <div key={tableName} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2 capitalize">
                      {tableName.replace('_', ' ')} ({data.length} records)
                    </h3>
                    <button
                      onClick={() => downloadAsCSV(tableName as keyof ExportData)}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                    >
                      Download CSV
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value.toLocaleString()}</p>
    </div>
  )
}
