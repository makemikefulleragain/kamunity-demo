'use client'

import React, { useState, useEffect } from 'react';
import { Bell, X, ExternalLink, TrendingUp, MessageSquare, Users } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'golden_thread' | 'engagement' | 'promotion' | 'new_content';
  title: string;
  message: string;
  hub: string;
  href: string;
  timestamp: Date;
  isRead: boolean;
  goldenThread?: string;
}

interface SmartNotificationsProps {
  className?: string;
}

const SmartNotifications: React.FC<SmartNotificationsProps> = ({ className = '' }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate smart notifications based on user activity
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'golden_thread',
        title: 'Golden Thread Update',
        message: 'New activity in Parks & Gardens thread: Community Garden Planning chat is now eligible for Room promotion!',
        hub: 'chat',
        href: '/chat',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        isRead: false,
        goldenThread: 'parks-gardens'
      },
      {
        id: '2',
        type: 'promotion',
        title: 'Room Promoted to Club',
        message: 'Urban Gardening Collective has been promoted to Green Neighborhoods Alliance club!',
        hub: 'clubs',
        href: '/clubs',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        isRead: false,
        goldenThread: 'parks-gardens'
      },
      {
        id: '3',
        type: 'new_content',
        title: 'Related Content Available',
        message: 'New sustainability workshop added to Skills hub - matches your gardening interests',
        hub: 'rooms',
        href: '/rooms',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isRead: true,
        goldenThread: 'skills-practice'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'golden_thread':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'promotion':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'engagement':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'new_content':
        return <ExternalLink className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'golden_thread':
        return 'bg-blue-50 border-blue-200';
      case 'promotion':
        return 'bg-green-50 border-green-200';
      case 'engagement':
        return 'bg-purple-50 border-purple-200';
      case 'new_content':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Smart Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <Link
                    href={notification.href}
                    onClick={() => {
                      markAsRead(notification.id);
                      setIsOpen(false);
                    }}
                    className="block"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          
                          {notification.goldenThread && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                              🧵 {notification.goldenThread.replace('-', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 text-center">
              <Link
                href="/notifications"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartNotifications;
