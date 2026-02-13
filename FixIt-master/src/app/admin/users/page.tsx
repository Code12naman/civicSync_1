"use client";

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { users, getUserProfile, UserProfile } from '@/lib/mock-users';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const [userList, setUserList] = useState<(typeof users[0] & { profile?: UserProfile; disabled?: boolean })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Enrich users with profile data
    const enrichedUsers = users.map(user => ({
      ...user,
      profile: getUserProfile(user.email),
      disabled: false, // Default all to enabled
    }));
    // Remove duplicates (keep only unique emails, prefer admin over citizen if both exist)
    const uniqueUsers = Array.from(
      new Map(
        enrichedUsers.map(u => [
          u.email,
          enrichedUsers.filter(x => x.email === u.email).sort((a, b) => {
            if (a.role === 'admin') return -1;
            if (b.role === 'admin') return 1;
            return 0;
          })[0],
        ])
      ).values()
    );
    setUserList(uniqueUsers);
  }, []);

  const handleRoleChange = (email: string, newRole: 'citizen' | 'admin') => {
    setUserList(prev =>
      prev.map(u =>
        u.email === email ? { ...u, role: newRole } : u
      )
    );
  };

  const handleToggleDisable = (email: string) => {
    setUserList(prev =>
      prev.map(u =>
        u.email === email ? { ...u, disabled: !u.disabled } : u
      )
    );
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return userList.filter(u =>
      u.email.toLowerCase().includes(term) ||
      u.profile?.displayName.toLowerCase().includes(term)
    );
  }, [userList, searchTerm]);

  const totalUsers = userList.length;
  const adminUsers = userList.filter(u => u.role === 'admin').length;
  const citizenUsers = userList.filter(u => u.role === 'citizen').length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{adminUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Citizens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{citizenUsers}</div>
          </CardContent>
        </Card>
      </section>

      {/* Users Table */}
      <Card className="bg-white border border-emerald-50 shadow-sm">
        <CardHeader className="border-b border-emerald-50 bg-white pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">All Users</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Manage user accounts, roles, and permissions</p>
            </div>
            <Input
              placeholder="Search by email or name..."
              className="w-full sm:w-80 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50 border-b border-emerald-100">
                  <TableHead className="font-semibold text-slate-700">Name</TableHead>
                  <TableHead className="font-semibold text-slate-700">Email</TableHead>
                  <TableHead className="font-semibold text-slate-700">Role</TableHead>
                  <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Created</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.email}
                    className="border-b border-slate-100 hover:bg-emerald-50/30 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-900 py-4">
                      {user.profile?.displayName || user.email.split('@')[0]}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Citizen'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                      {user.profile?.createdAt ? format(new Date(user.profile.createdAt), 'MMM d, yyyy') : '—'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.disabled
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {user.disabled ? 'Disabled' : 'Active'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Select
                          value={user.role}
                          onValueChange={(v) => handleRoleChange(user.email, v as 'citizen' | 'admin')}
                        >
                          <SelectTrigger className="w-32 h-9 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="citizen" className="text-sm">Citizen</SelectItem>
                            <SelectItem value="admin" className="text-sm">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={user.disabled ? 'disabled' : 'active'}
                          onValueChange={(v) => handleToggleDisable(user.email)}
                        >
                          <SelectTrigger className="w-28 h-9 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active" className="text-sm">Active</SelectItem>
                            <SelectItem value="disabled" className="text-sm">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-12">
                      {searchTerm ? 'No users match your search criteria.' : 'No users found.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
