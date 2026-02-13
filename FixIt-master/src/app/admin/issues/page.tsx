"use client";

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { allIssuesData, updateIssuePriorityInDb, updateIssueStatusInDb } from '@/lib/mock-db';
import { Issue, IssuePriority, IssueStatus } from '@/types/issue';
import { format } from 'date-fns';

const statusOptions: IssueStatus[] = ["Pending", "Verified", "In Progress", "Resolved"];
const priorityOptions: IssuePriority[] = ["Low", "Medium", "High"];

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIssues([...allIssuesData].sort((a, b) => b.reportedAt - a.reportedAt));
  }, []);

  const refreshIssues = () => setIssues([...allIssuesData].sort((a, b) => b.reportedAt - a.reportedAt));

  const handleStatusChange = (id: string, status: IssueStatus) => {
    updateIssueStatusInDb(id, status);
    refreshIssues();
  };

  const handlePriorityChange = (id: string, priority: IssuePriority) => {
    updateIssuePriorityInDb(id, priority);
    refreshIssues();
  };

  const filteredIssues = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return issues.filter((i) => i.title.toLowerCase().includes(term) || i.reportedById.toLowerCase().includes(term) || i.type.toLowerCase().includes(term));
  }, [issues, searchTerm]);

  const priorityBadgeClass = (priority: IssuePriority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const statusBadgeClass = (status: IssueStatus) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Verified':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pending':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const totalIssues = issues.length;
  const openIssues = issues.filter(i => i.status !== 'Resolved').length;
  const pendingIssues = issues.filter(i => i.status === 'Pending' || i.status === 'Verified').length;
  const highPriorityIssues = issues.filter(i => i.priority === 'High').length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{totalIssues}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{openIssues}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending / Verify</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{pendingIssues}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{highPriorityIssues}</div>
          </CardContent>
        </Card>
      </section>

      {/* Issues Table */}
      <Card className="bg-white border border-emerald-50 shadow-sm">
        <CardHeader className="border-b border-emerald-50 bg-white pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">All Issues</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Manage status and priority for citizen-reported issues</p>
            </div>
            <Input
              placeholder="Search by title, reporter, or type..."
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
                  <TableHead className="font-semibold text-slate-700">Title</TableHead>
                  <TableHead className="font-semibold text-slate-700">Reporter</TableHead>
                  <TableHead className="font-semibold text-slate-700">Type</TableHead>
                  <TableHead className="font-semibold text-slate-700">Priority</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Reported Date</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow 
                    key={issue.id} 
                    className="border-b border-slate-100 hover:bg-emerald-50/30 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-900 py-4">{issue.title}</TableCell>
                    <TableCell className="text-sm text-slate-600">{issue.reportedById}</TableCell>
                    <TableCell className="text-sm text-slate-600">{issue.type}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityBadgeClass(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(issue.status)}`}>
                        {issue.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                      {format(new Date(issue.reportedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Select 
                          value={issue.priority} 
                          onValueChange={(v) => handlePriorityChange(issue.id, v as IssuePriority)}
                        >
                          <SelectTrigger className="w-28 h-9 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityOptions.map((p) => (
                              <SelectItem key={p} value={p} className="text-sm">{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select 
                          value={issue.status} 
                          onValueChange={(v) => handleStatusChange(issue.id, v as IssueStatus)}
                        >
                          <SelectTrigger className="w-36 h-9 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((s) => (
                              <SelectItem key={s} value={s} className="text-sm">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredIssues.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500 py-12">
                      {searchTerm ? 'No issues match your search criteria.' : 'No issues found.'}
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
