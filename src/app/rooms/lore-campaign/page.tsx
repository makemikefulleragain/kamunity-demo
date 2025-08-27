'use client'

import React, { useState } from 'react'
import { RoomLayout, loreTheme, type RoomSection } from '@/components/rooms/RoomLayout'
import { KaiAssistant, kaiPersonalities } from '@/components/rooms/KaiAssistant'
import { SimulationEngine, simulationConfigs, createInitialSimulationData, type SimulationData } from '@/components/rooms/SimulationEngine'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Sword, 
  Trophy, 
  Map, 
  Calendar,
  Scroll,
  Crown,
  Target,
  MessageSquare,
  Activity
} from 'lucide-react'

// Enhanced lore-specific data structures
interface Battle {
  id: string
  date: Date
  location: string
  winner: string
  loser: string
  points: number
  notes: string
}

interface Showcase {
  id: string
  title: string
  caption: string
  url?: string
}

interface Honour {
  id: string
  title: string
  awardee: string
}

interface Meeting {
  id: string
  title: string
  when: Date
  where: string
  focus: string
}

interface Task {
  id: string
  title: string
  status: 'todo' | 'in-progress' | 'done'
  tags: string[]
}

export default function LoreCampaignPage() {
  // Simulation state
  const [simulationData, setSimulationData] = useState<SimulationData>(
    createInitialSimulationData('lore')
  )
  const [isSimulationPlaying] = useState(true)

  // Lore-specific state
  const [battles] = useState<Battle[]>([
    { 
      id: 'b1', 
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), 
      location: 'Blackfen Ford', 
      winner: 'House Vesper', 
      loser: 'Red Banner', 
      points: 18, 
      notes: 'Flank held; cavalry charge decisive.' 
    },
    { 
      id: 'b2', 
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), 
      location: 'Gilder Pass', 
      winner: 'Red Banner', 
      loser: 'House Vesper', 
      points: 12, 
      notes: 'Ambush in the pass; archers sang.' 
    },
    { 
      id: 'b3', 
      date: new Date(Date.now() - 1000 * 60 * 60 * 18), 
      location: 'The Old Quarry', 
      winner: 'Free Company of Lark', 
      loser: 'Red Banner', 
      points: 25, 
      notes: 'Terrain mastery. Night raid.' 
    }
  ])

  const [showcases] = useState<Showcase[]>([
    { id: 's1', title: 'Vesper Halberdiers', caption: 'Steel in ranks.' },
    { id: 's2', title: 'Red Banner Cavalry', caption: 'Scarlet thunder.' },
    { id: 's3', title: 'Free Company Standard', caption: 'Colours aloft.' }
  ])

  const [honours] = useState<Honour[]>([
    { id: 'h1', title: 'Defender of the Ford', awardee: 'House Vesper' },
    { id: 'h2', title: 'Master of Ambush', awardee: 'Red Banner' },
    { id: 'h3', title: 'Night Raider', awardee: 'Free Company of Lark' }
  ])

  const [meetings] = useState<Meeting[]>([
    { 
      id: 'm1', 
      title: 'Skirmish at Sunhollow', 
      when: new Date(Date.now() + 1000 * 60 * 60 * 26), 
      where: 'Sunhollow Fields', 
      focus: 'Border clash' 
    },
    { 
      id: 'm2', 
      title: 'War Council', 
      when: new Date(Date.now() + 1000 * 60 * 60 * 72), 
      where: 'Hall of Banners', 
      focus: 'Treaties & Lines' 
    }
  ])

  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', title: 'Draft Battle Log form', status: 'todo', tags: ['MVP'] },
    { id: 't2', title: 'Set up Showcase gallery', status: 'in-progress', tags: ['MVP'] },
    { id: 't3', title: 'Define Honours badges', status: 'done', tags: ['MVP'] }
  ])

  // Helper functions
  const fmtDateTime = (date: Date) => {
    return date.toLocaleDateString('en-AU', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const addTask = (title: string, column: Task['status']) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      title,
      status: column,
      tags: []
    }
    setTasks(prev => [...prev, newTask])
  }

  // Quick actions
  const quickActions = [
    {
      id: 'log-battle',
      label: 'Log Battle',
      icon: <Sword className="w-4 h-4" />,
      onClick: () => console.log('Log battle clicked'),
      count: battles.length
    },
    {
      id: 'view-map',
      label: 'View Map',
      icon: <Map className="w-4 h-4" />,
      onClick: () => console.log('View map clicked')
    },
    {
      id: 'upload-showcase',
      label: 'Upload Showcase',
      icon: <Trophy className="w-4 h-4" />,
      onClick: () => console.log('Upload showcase clicked'),
      count: showcases.length
    },
    {
      id: 'check-honours',
      label: 'Check Honours',
      icon: <Crown className="w-4 h-4" />,
      onClick: () => console.log('Check honours clicked'),
      count: honours.length
    }
  ]

  // Hero section
  const heroSection = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Main description */}
      <Card variant="ghost" className="border-amber-900/40 bg-[#13110f] p-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-amber-200">The Chronicle of the War</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-neutral-300 mb-4">
            An immersive digital war journal where every skirmish, painting triumph, and strategic decision is etched into campaign history.
          </p>
          <div className="text-xs text-neutral-400 mb-3">
            Locale: Australia/Perth • Demo mode: ON
          </div>
        </CardContent>
      </Card>

      {/* Impact tiles */}
      <div className="grid grid-cols-2 gap-3">
        <Card variant="ghost" className="bg-amber-800/50 border-amber-400/40 p-4 text-center">
          <div className="text-xs uppercase tracking-wide opacity-80 text-amber-200">Battles Logged</div>
          <div className="text-3xl font-bold mt-1 text-amber-100">{battles.length}</div>
        </Card>
        <Card variant="ghost" className="bg-sky-800/50 border-sky-400/40 p-4 text-center">
          <div className="text-xs uppercase tracking-wide opacity-80 text-sky-200">Map Control %</div>
          <div className="text-3xl font-bold mt-1 text-sky-100">{48 + (battles.length % 5)}</div>
        </Card>
        <Card variant="ghost" className="bg-emerald-800/50 border-emerald-400/40 p-4 text-center">
          <div className="text-xs uppercase tracking-wide opacity-80 text-emerald-200">Showcases</div>
          <div className="text-3xl font-bold mt-1 text-emerald-100">{showcases.length}</div>
        </Card>
        <Card variant="ghost" className="bg-indigo-800/50 border-indigo-400/40 p-4 text-center">
          <div className="text-xs uppercase tracking-wide opacity-80 text-indigo-200">Honours Awarded</div>
          <div className="text-3xl font-bold mt-1 text-indigo-100">{honours.length}</div>
        </Card>
      </div>

      {/* Next meeting */}
      <Card variant="ghost" className="border-amber-900/40 bg-[#13110f] p-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-amber-200">Next War Council</CardTitle>
            <Button variant="ghost" size="sm" className="text-amber-300 hover:text-amber-100">
              <Calendar className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {meetings.length > 0 ? (
            <div className="text-sm">
              <div className="font-medium text-amber-100">{meetings[0].title}</div>
              <div className="text-amber-200/90">{fmtDateTime(meetings[0].when)}</div>
              <div className="text-amber-200/90">{meetings[0].where}</div>
              <div className="italic text-amber-300/90 mt-1">Focus: {meetings[0].focus}</div>
            </div>
          ) : (
            <div className="text-sm opacity-80 text-amber-300">No councils scheduled.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // Sidebar with Kai Assistant
  const sidebar = (
    <KaiAssistant
      personality={kaiPersonalities.lorekeeper}
      roomContext={{
        type: 'lore',
        activity: simulationData.stats.engagement,
        members: simulationData.stats.activeMembers,
        recentActions: simulationData.activity.slice(-3).map(a => a.action)
      }}
      theme="lore"
    />
  )

  // Room sections with progressive disclosure
  const sections: RoomSection[] = [
    {
      id: 'chronicle',
      title: 'Campaign Chronicle',
      icon: <MessageSquare className="w-5 h-5" />,
      priority: 'high',
      defaultExpanded: true,
      badge: simulationData.messages.length,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Main chat */}
          <Card variant="ghost" className="border-amber-900/40 bg-[#13110f]">
            <CardHeader>
              <CardTitle className="text-amber-200 flex items-center gap-2">
                <Scroll className="w-5 h-5" />
                Chronicle Hall
                <span className="text-xs opacity-70 ml-auto">Live</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-auto">
                {simulationData.messages.slice(-8).map((message) => (
                  <div key={message.id} className="text-sm">
                    <span className="text-amber-300 font-medium">{message.author}:</span>{' '}
                    <span className="text-amber-100">{message.content}</span>
                    <span className="opacity-50 text-xs ml-2">· {fmtDateTime(message.timestamp)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity feed */}
          <Card variant="ghost" className="border-amber-900/40 bg-[#13110f]">
            <CardHeader>
              <CardTitle className="text-amber-200 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Deeds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-auto">
                {simulationData.activity.slice(-6).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="text-amber-200 font-medium">{activity.user}</div>
                      <div className="text-amber-300/90">{activity.action}</div>
                      {activity.detail && (
                        <div className="text-amber-400/80 text-xs">{activity.detail}</div>
                      )}
                      <div className="text-amber-500/60 text-xs">{fmtDateTime(activity.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'battles',
      title: 'Battle Log',
      icon: <Sword className="w-5 h-5" />,
      priority: 'high',
      badge: battles.length,
      content: (
        <div className="space-y-4">
          {battles.map(battle => (
            <Card key={battle.id} variant="ghost" className="border-amber-900/40 bg-amber-900/10 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-amber-200">{battle.location}</h4>
                  <div className="text-sm text-amber-300/80">{fmtDateTime(battle.date)}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-amber-100">{battle.points} pts</div>
                  <div className="text-xs text-amber-400">Victory Points</div>
                </div>
              </div>
              <div className="text-sm text-amber-200/90 mb-2">
                <span className="text-emerald-300">{battle.winner}</span> defeated{' '}
                <span className="text-red-300">{battle.loser}</span>
              </div>
              <div className="text-sm italic text-amber-300/80">{battle.notes}</div>
            </Card>
          ))}
        </div>
      )
    },
    {
      id: 'showcases',
      title: 'Hall of Showcases',
      icon: <Trophy className="w-5 h-5" />,
      priority: 'medium',
      badge: showcases.length,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showcases.map(showcase => (
            <Card key={showcase.id} variant="ghost" className="border-amber-900/40 bg-amber-900/10 p-4">
              <div className="aspect-square bg-amber-800/30 rounded-lg mb-3 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
              <h4 className="font-semibold text-amber-200 mb-1">{showcase.title}</h4>
              <p className="text-sm italic text-amber-300/80">{showcase.caption}</p>
            </Card>
          ))}
        </div>
      )
    },
    {
      id: 'honours',
      title: 'Roll of Honours',
      icon: <Crown className="w-5 h-5" />,
      priority: 'medium',
      badge: honours.length,
      content: (
        <div className="space-y-3">
          {honours.map(honour => (
            <Card key={honour.id} variant="ghost" className="border-amber-900/40 bg-indigo-900/20 p-4">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-amber-400" />
                <div>
                  <h4 className="font-semibold text-amber-200">{honour.title}</h4>
                  <div className="text-sm text-amber-300/80">Awarded to {honour.awardee}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )
    },
    {
      id: 'tasks',
      title: 'Campaign Tasks',
      icon: <Target className="w-5 h-5" />,
      priority: 'low',
      badge: tasks.filter(t => t.status !== 'done').length,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['todo', 'in-progress', 'done'] as const).map(status => (
            <Card key={status} variant="ghost" className="border-amber-900/40 bg-amber-900/10 p-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-amber-200 capitalize text-base">
                  {status.replace('-', ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 min-h-[120px]">
                  {tasks.filter(t => t.status === status).map(task => (
                    <div key={task.id} className="p-2 rounded-md bg-amber-900/20 border border-amber-900/40">
                      <div className="text-sm text-amber-200">{task.title}</div>
                      <div className="text-xs text-amber-400/70">Tags: {task.tags.join(', ') || 'None'}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const title = prompt('Enter task title:')
                      if (title) addTask(title, status)
                    }}
                    className="w-full text-amber-300 hover:text-amber-100 border-amber-700"
                  >
                    Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }
  ]

  return (
    <>
      {/* Simulation Engine */}
      <SimulationEngine
        config={simulationConfigs.lore}
        initialData={simulationData}
        isPlaying={isSimulationPlaying}
        onDataUpdate={setSimulationData}
        roomType="lore"
      />

      {/* Room Layout */}
      <RoomLayout
        title="Serious / Lore-Themed Campaign Room"
        description="An immersive digital war journal where every skirmish, painting triumph, and strategic decision is etched into campaign history."
        theme={loreTheme}
        sections={sections}
        hero={heroSection}
        sidebar={sidebar}
        quickActions={quickActions}
      />
    </>
  )
}
