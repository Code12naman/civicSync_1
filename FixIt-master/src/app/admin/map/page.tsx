"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { allIssuesData } from '@/lib/mock-db';
import { IssueStatus } from '@/types/issue';
import dynamic from 'next/dynamic';

const GoogleIssueMap = dynamic(() => import('@/components/admin/google-issue-map'), {
  ssr: false,
  loading: () => <div className="h-96 bg-emerald-50 rounded-lg flex items-center justify-center text-slate-600">Loading map...</div>,
});

const statusOptions: IssueStatus[] = ["Pending", "Verified", "In Progress", "Resolved"];

export default function AdminMapPage() {
  const [issues, setIssues] = useState(allIssuesData);
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');

  const filteredIssues = issues.filter(issue => {
    const statusMatch = statusFilter === 'all' || issue.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || issue.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const statsByStatus = {
    Pending: issues.filter(i => i.status === 'Pending').length,
    Verified: issues.filter(i => i.status === 'Verified').length,
    'In Progress': issues.filter(i => i.status === 'In Progress').length,
    Resolved: issues.filter(i => i.status === 'Resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Status Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{statsByStatus.Pending}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-amber-700">{statsByStatus.Verified}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-emerald-700">{statsByStatus['In Progress']}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-emerald-800">{statsByStatus.Resolved}</div>
          </CardContent>
        </Card>
      </section>

      {/* Map */}
      <Card className="bg-white border border-emerald-50 shadow-sm">
        <CardHeader className="border-b border-emerald-50 bg-white pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">City Issue Map</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Visualize all reported issues on the map. Total: {filteredIssues.length}</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as IssueStatus | 'all')}>
                <SelectTrigger className="w-40 h-9 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-sm">All Statuses</SelectItem>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s} className="text-sm">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as 'all' | 'High' | 'Medium' | 'Low')}>
                <SelectTrigger className="w-40 h-9 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-sm">All Priorities</SelectItem>
                  <SelectItem value="High" className="text-sm">High</SelectItem>
                  <SelectItem value="Medium" className="text-sm">Medium</SelectItem>
                  <SelectItem value="Low" className="text-sm">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="w-full h-96 rounded-lg overflow-hidden border border-emerald-100">
            <GoogleIssueMap issues={filteredIssues} />
          </div>
          <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-sm text-slate-700">
              <strong>{filteredIssues.length}</strong> issue{filteredIssues.length !== 1 ? 's' : ''} matching your filters.
              {filteredIssues.length === 0 && ' Try adjusting your filters.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
