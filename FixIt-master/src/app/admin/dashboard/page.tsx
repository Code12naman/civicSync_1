"use client";

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { allIssuesData, updateIssuePriorityInDb, updateIssueStatusInDb } from '@/lib/mock-db';
import { Issue, IssuePriority, IssueStatus } from '@/types/issue';
import { format } from 'date-fns';

const statusOptions: IssueStatus[] = ["Pending", "Verified", "In Progress", "Resolved"];
const priorityOptions: IssuePriority[] = ["Low", "Medium", "High"];

export default function AdminDashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setIssues([...allIssuesData].sort((a, b) => b.reportedAt - a.reportedAt));
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const refreshIssues = () => {
    setIssues([...allIssuesData].sort((a, b) => b.reportedAt - a.reportedAt));
  };

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
    return issues.filter((i) =>
      i.title.toLowerCase().includes(term) ||
      i.reportedById.toLowerCase().includes(term) ||
      i.type.toLowerCase().includes(term)
    );
  }, [issues, searchTerm]);

  const openCount = issues.filter(i => i.status !== 'Resolved').length;
  const pendingCount = issues.filter(i => i.status === 'Pending' || i.status === 'Verified').length;
  const highCount = issues.filter(i => i.priority === 'High').length;

  const priorityBadge = (priority: IssuePriority) => {
    if (priority === 'High') return 'bg-red-100 text-red-700';
    if (priority === 'Medium') return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  const statusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-700';
      case 'In Progress':
        return 'bg-sky-100 text-sky-700';
      case 'Verified':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{loading ? '—' : issues.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{loading ? '—' : openCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending / Verify</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{loading ? '—' : pendingCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-emerald-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{loading ? '—' : highCount}</div>
          </CardContent>
        </Card>
      </section>

      <Card className="bg-white border border-emerald-50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Issues</CardTitle>
            <p className="text-sm text-slate-600">Shared collection of all citizen-reported issues.</p>
          </div>
          <Input
            placeholder="Search by title, reporter, or type"
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="whitespace-nowrap">Title</TableHead>
                  <TableHead className="whitespace-nowrap">Reporter</TableHead>
                  <TableHead className="whitespace-nowrap">Type</TableHead>
                  <TableHead className="whitespace-nowrap">Priority</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Reported</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow key={issue.id} className="border-slate-100">
                    <TableCell className="font-medium text-slate-900">{issue.title}</TableCell>
                    <TableCell className="text-sm text-slate-600">{issue.reportedById}</TableCell>
                    <TableCell className="text-sm text-slate-600">{issue.type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityBadge(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(issue.status)}`}>
                        {issue.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{format(new Date(issue.reportedAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right space-y-2 min-w-[220px]">
                      <div className="flex items-center gap-2 justify-end">
                        <Select value={issue.priority} onValueChange={(v) => handlePriorityChange(issue.id, v as IssuePriority)}>
                          <SelectTrigger className="w-28 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityOptions.map((p) => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={issue.status} onValueChange={(v) => handleStatusChange(issue.id, v as IssueStatus)}>
                          <SelectTrigger className="w-32 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange(issue.id, issue.status)} className="hidden">
                          Save
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && filteredIssues.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500 py-6">No issues match your search.</TableCell>
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
