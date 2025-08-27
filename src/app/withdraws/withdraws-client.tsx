
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea";

type WithdrawStatus = 'all' | 'pending' | 'approved' | 'rejected';

const fetcher = (url: string) => api(url).then(res => res);

function RejectWithdrawDialog({ withdrawId, onReject }: { withdrawId: string; onReject: (id: string, note?: string) => void }) {
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onReject(withdrawId, note);
    setOpen(false);
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <XCircle className="mr-2 h-4 w-4 text-red-500" />
          Reject
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Withdraw Request</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Enter rejection reason (optional)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleSubmit}>Reject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function WithdrawsClient() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<WithdrawStatus>('pending');
  const { toast } = useToast();

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: '10',
    ...(status !== 'all' && { status }),
  });

  const { data, error, isLoading, mutate } = useSWR<{data: Withdraw[], meta: ApiMeta}>(`/withdraws?${queryParams.toString()}`, fetcher, { revalidateOnFocus: false });

  const withdraws = data?.data ?? [];
  const meta = data?.meta;
  const pageCount = meta ? Math.ceil(meta.total / meta.limit) : 1;

  const handleStatusChange = (value: string) => {
    setStatus(value as WithdrawStatus);
    setPage(1);
  };
  
  const handleAction = async (id: string, action: 'approve' | 'reject', note?: string) => {
    try {
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
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 capitalize">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 capitalize">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="capitalize">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="capitalize">{status}</Badge>;
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
              <TableHead>User Discord ID</TableHead>
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
                  <TableRow key={withdraw._id}>
                    <TableCell>{new Date(withdraw.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{withdraw.user_discord_id}</TableCell>
                    <TableCell>{withdraw.upi}</TableCell>
                    <TableCell>{getStatusBadge(withdraw.status)}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{(withdraw.amount_paise / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {withdraw.status === 'pending' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction(withdraw._id, 'approve')}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              Approve
                            </DropdownMenuItem>
                            <RejectWithdrawDialog withdrawId={withdraw._id} onReject={handleAction} />
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
             Page {meta?.page ?? 1} of {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={!meta || meta.page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage(page - 1)} disabled={!meta || meta.page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage(page + 1)} disabled={!meta || meta.page === pageCount}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setPage(pageCount)} disabled={!meta || meta.page === pageCount}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
