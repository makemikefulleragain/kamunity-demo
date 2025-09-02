"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, Download, Eye, Calendar, User, Tag } from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';
import { DemoRoomData } from '@/lib/admin/database';
import { downloadCSV, generateRoomsCSV } from '@/lib/admin/csv-export';

export default function AdminRoomsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rooms, setRooms] = useState<DemoRoomData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<DemoRoomData | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/rooms', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms);
      } else if (response.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      const response = await fetch('/api/admin/rooms', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ roomId })
      });

      if (response.ok) {
        setRooms(rooms.filter(room => room.id !== roomId));
      }
    } catch (error) {
      console.error('Failed to delete room:', error);
    }
  };

  const exportRooms = () => {
    const csv = generateRoomsCSV(rooms);
    downloadCSV(csv, `kamunity-rooms-${new Date().toISOString().split('T')[0]}.csv`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRooms();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Room Management</h1>
              <p className="text-gray-600 mt-2">Manage all demo rooms created by users</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportRooms}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={fetchRooms}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-emerald-600">{rooms.length}</div>
            <div className="text-gray-600">Total Rooms</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-blue-600">
              {rooms.filter(r => r.specification).length}
            </div>
            <div className="text-gray-600">With Specifications</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(rooms.map(r => r.createdBy)).size}
            </div>
            <div className="text-gray-600">Unique Users</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(rooms.reduce((sum, r) => sum + (r.engagement || 0), 0) / rooms.length) || 0}%
            </div>
            <div className="text-gray-600">Avg Engagement</div>
          </div>
        </div>

        {/* Rooms Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Demo Rooms</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No rooms found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{room.title}</div>
                          <div className="text-sm text-gray-500">{room.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{room.createdBy}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {room.category && (
                            <div className="flex items-center">
                              <Tag className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-600">{room.category}</span>
                            </div>
                          )}
                          {room.engagement && (
                            <div className="text-xs text-emerald-600 font-medium">
                              {room.engagement}% engagement
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(room.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedRoom(room)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="View specification"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteRoom(room.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete room"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Room Specification Modal */}
        {selectedRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">Room Specification</h3>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedRoom.title}</h4>
                    <p className="text-gray-600">{selectedRoom.description}</p>
                  </div>
                  
                  {selectedRoom.specification && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Complete Specification</h5>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(selectedRoom.specification, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Category:</span> {selectedRoom.category || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Engagement:</span> {selectedRoom.engagement || 0}%
                    </div>
                    <div>
                      <span className="font-medium">Created by:</span> {selectedRoom.createdBy}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {new Date(selectedRoom.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  {selectedRoom.tags.length > 0 && (
                    <div>
                      <span className="font-medium">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedRoom.tags.map((tag, index) => (
                          <span key={index} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
