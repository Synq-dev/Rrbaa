
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, RefreshCw, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Lead, ApiMeta } from "@/types";
import useSWR from 'swr';
import { useState } from "react";

type LeadStatus = 'all' | 'PENDING' | 'VERIFIED' | 'REJECTED';

const fetcher = (url: string) => api(url).then(res => res);

export default function LeadsClient() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<LeadStatus>('all');
  const [search, setSearch] = useState('');

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: '10',
    ...(status !== 'all' && { status }),
    ...(search && { q: search }),
  });

  const { data, error, isLoading, mutate } = useSWR<{data: Lead[], meta: ApiMeta}>(`/leads?${queryParams.toString()}`, fetcher, { revalidateOnFocus: false });
  const leads = data?.data ?? [];
  const meta = data?.meta;
  
  const handleStatusChange = (value: string) => {
    setStatus(value as LeadStatus);
    setPage(1);
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending</Badge>;
      case "VERIFIED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Verified</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center justify-between gap-2 p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search leads..." className="pl-9 w-64" onChange={handleSearchChange} value={search} />
            </div>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="icon" onClick={() => mutate()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Offer</TableHead>
              <TableHead>Referrer</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Payout</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                  </TableRow>
                ))
              : leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{lead.offer_title}</TableCell>
                    <TableCell>{lead.referrer_discord_id}</TableCell>
                    <TableCell>{lead.customer_name}</TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{(lead.payout_user_paise / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Page {meta?.page ?? 1} of {meta?.page_count ?? 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={!meta || meta.page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage(page - 1)} disabled={!meta || meta.page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage(page + 1)} disabled={!meta || meta.page === meta.page_count}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage(meta?.page_count ?? 1)} disabled={!meta || meta.page === meta.page_count}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
