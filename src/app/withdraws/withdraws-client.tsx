"use client";

import { useState } from "react";
import useSWR from 'swr';
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
import { RefreshCw, CheckCircle, XCircle, MoreVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Withdraw, ApiMeta } from "@/types";

type WithdrawStatus = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED';

const fetcher = (url: string) => api(url).then(res => res);

export default function WithdrawsClient() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<WithdrawStatus>('PENDING');
  const { toast } = useToast();

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: '10',
    ...(status !== 'all' && { status }),
  });

  const { data, error, isLoading, mutate } = useSWR<{data: Withdraw[], meta: ApiMeta}>(`/withdraws?${queryParams.toString()}`, fetcher, { revalidateOnFocus: false });

  const withdraws = data?.data ?? [];
  const meta = data?.meta;

  const handleStatusChange = (value: string) => {
    setStatus(value as WithdrawStatus);
    setPage(1);
  };
  
  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      let note;
      if (action === 'reject') {
        note = prompt('Enter rejection note (optional):');
        if (note === null) return; // User cancelled
      }
      
      const res = await api(`/withdraws/${id}/${action}`, {
        method: 'POST',
        body: note ? JSON.stringify({ note }) : undefined,
      });

      if (res.ok) {
        toast({ title: 'Success', description: `Request ${action}d successfully.` });
        mutate();
      } else {
        throw new Error((res as any).error || 'An unexpected error occurred.');
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error ? err.message : `Failed to ${action} request.`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
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
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
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
              <TableHead>User</TableHead>
              <TableHead>UPI ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                  </TableRow>
                ))
              : withdraws.map((withdraw) => (
                  <TableRow key={withdraw.id}>
                    <TableCell>{new Date(withdraw.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{withdraw.user.username} ({withdraw.user.discord_id})</TableCell>
                    <TableCell>{withdraw.upi_id}</TableCell>
                    <TableCell>{getStatusBadge(withdraw.status)}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{(withdraw.amount_paise / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {withdraw.status === 'PENDING' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction(withdraw.id, 'approve')}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction(withdraw.id, 'reject')}>
                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
