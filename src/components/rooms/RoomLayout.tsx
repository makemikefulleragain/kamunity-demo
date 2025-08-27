'use client'

import React, { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

export interface RoomTheme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: {
    section: string
    component: string
  }
}

export interface RoomSection {
  id: string
  title: string
  icon?: React.ReactNode
  content: React.ReactNode
  priority: 'high' | 'medium' | 'low'
  defaultExpanded?: boolean
  badge?: string | number
}

export interface QuickAction {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  count?: number
}

export interface RoomLayoutProps {
  title: string
  backUrl?: string
  theme?: RoomTheme
  sections: RoomSection[]
  hero?: React.ReactNode
  sidebar?: React.ReactNode
  quickActions?: QuickAction[]
  className?: string
}

// Default theme (clean modern)
const defaultTheme: RoomTheme = {
  name: 'default',
  colors: {
    primary: 'bg-blue-600',
    secondary: 'bg-blue-50',
    accent: 'bg-blue-100',
    background: 'bg-gradient-to-br from-blue-50 via-white to-green-50',
    surface: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600'
  },
  fonts: {
    heading: 'font-bold',
    body: 'font-normal'
  },
  spacing: {
    section: 'mb-6',
    component: 'mb-4'
  }
}

// Lore theme (dark amber)
export const loreTheme: RoomTheme = {
  name: 'lore',
  colors: {
    primary: 'bg-amber-700',
    secondary: 'bg-amber-900/20',
    accent: 'bg-amber-500',
    background: 'bg-[#0b0a09]',
    surface: 'bg-[#13110f]',
    text: 'text-neutral-100',
    textSecondary: 'text-neutral-300'
  },
  fonts: {
    heading: 'font-semibold tracking-wide',
    body: 'font-normal'
  },
  spacing: {
    section: 'mb-8',
    component: 'mb-4'
  }
}

export function RoomLayout({
  title,
  backUrl = '/rooms',
  theme = defaultTheme,
  sections,
  hero,
  sidebar,
  quickActions = [],
  className
}: RoomLayoutProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.defaultExpanded).map(s => s.id))
  )
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '')
  
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
    }
  }

  // Progressive disclosure: show high priority first, then medium, then low
  const prioritizedSections = [
    ...sections.filter(s => s.priority === 'high'),
    ...sections.filter(s => s.priority === 'medium'),
    ...sections.filter(s => s.priority === 'low')
  ]

  const isLoreTheme = theme.name === 'lore'

  return (
    <div className={cn(
      'min-h-screen w-full selection:bg-blue-600/40',
      theme.colors.background,
      theme.colors.text,
      isLoreTheme && 'selection:bg-amber-600/40',
      className
    )}>
      {/* Header with back navigation */}
      <div className={cn(
        'border-b',
        isLoreTheme ? 'bg-white' : theme.colors.surface
      )}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            href={backUrl} 
            className={cn(
              'flex items-center gap-2 hover:opacity-80 transition-opacity',
              isLoreTheme ? 'text-blue-600' : 'text-blue-600'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rooms
          </Link>
        </div>
      </div>

      {/* Sticky navigation for sections */}
      <nav className={cn(
        'sticky top-0 z-30 backdrop-blur border-b',
        isLoreTheme 
          ? 'bg-[#0b0a09]/80 border-amber-900/40' 
          : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'h-3 w-3 rounded-full shadow',
                isLoreTheme ? 'bg-amber-500' : 'bg-blue-500'
              )} />
              <h1 className={cn(
                'text-lg font-semibold',
                theme.fonts.heading,
                isLoreTheme ? 'text-amber-200' : theme.colors.text
              )}>
                {title}
              </h1>
            </div>
            
            {/* Section navigation - mobile: dropdown, desktop: horizontal */}
            <div className="hidden md:flex gap-2 flex-wrap">
              {prioritizedSections.slice(0, 6).map(section => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    'relative',
                    isLoreTheme && activeSection === section.id && 'bg-amber-700/60 border border-amber-500/40',
                    isLoreTheme && activeSection !== section.id && 'hover:bg-amber-900/30 text-amber-200'
                  )}
                >
                  {section.icon && <span className="mr-1">{section.icon}</span>}
                  {section.title}
                  {section.badge && (
                    <span className={cn(
                      'ml-2 px-1.5 py-0.5 text-xs rounded-full',
                      isLoreTheme ? 'bg-amber-500 text-amber-900' : 'bg-blue-100 text-blue-800'
                    )}>
                      {section.badge}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      {hero && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          {hero}
        </section>
      )}

      {/* Quick actions */}
      {quickActions.length > 0 && (
        <section className={cn('max-w-7xl mx-auto px-4', theme.spacing.component)}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map(action => (
              <Button
                key={action.id}
                variant="outline"
                onClick={action.onClick}
                className={cn(
                  'justify-start h-auto py-3',
                  isLoreTheme && 'border-amber-900/40 bg-[#13110f] hover:bg-amber-900/30 text-amber-200'
                )}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                <span className="flex-1 text-left">{action.label}</span>
                {action.count && (
                  <span className={cn(
                    'ml-2 px-2 py-1 text-xs rounded-full',
                    isLoreTheme ? 'bg-amber-700 text-amber-100' : 'bg-gray-100 text-gray-700'
                  )}>
                    {action.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </section>
      )}

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className={cn(
          'grid gap-6',
          sidebar ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'
        )}>
          {/* Main content */}
          <main className={sidebar ? 'lg:col-span-2' : 'col-span-1'}>
            {/* Progressive disclosure sections */}
            <div className="space-y-4">
              {prioritizedSections.map((section) => {
                const isExpanded = expandedSections.has(section.id)
                
                return (
                  <Card
                    key={section.id}
                    ref={(el) => { sectionRefs.current[section.id] = el }}
                    variant={isLoreTheme ? 'ghost' : 'default'}
                    padding="none"
                    className={cn(
                      'transition-all duration-200',
                      isLoreTheme && 'border-amber-900/40 bg-[#13110f]',
                      activeSection === section.id && !isLoreTheme && 'ring-2 ring-blue-500/20'
                    )}
                  >
                    <CardHeader 
                      className={cn(
                        'cursor-pointer select-none',
                        isLoreTheme ? 'p-4' : 'p-6 pb-4'
                      )}
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className={cn(
                          'flex items-center gap-2',
                          theme.fonts.heading,
                          isLoreTheme ? 'text-amber-200' : theme.colors.text
                        )}>
                          {section.icon}
                          {section.title}
                          {section.badge && (
                            <span className={cn(
                              'px-2 py-1 text-xs rounded-full',
                              isLoreTheme 
                                ? 'bg-amber-700/60 text-amber-200' 
                                : 'bg-blue-100 text-blue-800'
                            )}>
                              {section.badge}
                            </span>
                          )}
                        </CardTitle>
                        
                        <div className="flex items-center gap-2">
                          {/* Priority indicator */}
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            section.priority === 'high' && (isLoreTheme ? 'bg-amber-400' : 'bg-green-500'),
                            section.priority === 'medium' && (isLoreTheme ? 'bg-amber-600' : 'bg-yellow-500'),
                            section.priority === 'low' && (isLoreTheme ? 'bg-amber-800' : 'bg-gray-400')
                          )} />
                          
                          {/* Expand/collapse button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              'p-1 h-auto',
                              isLoreTheme && 'text-amber-300 hover:text-amber-100'
                            )}
                            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {/* Collapsible content */}
                    <div className={cn(
                      'overflow-hidden transition-all duration-200',
                      isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    )}>
                      <CardContent className={isLoreTheme ? 'p-4 pt-0' : 'p-6 pt-0'}>
                        {section.content}
                      </CardContent>
                    </div>
                  </Card>
                )
              })}
            </div>
          </main>

          {/* Sidebar */}
          {sidebar && (
            <aside className="lg:col-span-1">
              {sidebar}
            </aside>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={cn(
        'max-w-7xl mx-auto px-4 py-8 text-xs',
        theme.colors.textSecondary
      )}>
        <div className="text-center opacity-70">
          Report Issue / Suggest Improvement • Built for AU locale • Demo Mode
        </div>
      </footer>
    </div>
  )
}

export default RoomLayout
