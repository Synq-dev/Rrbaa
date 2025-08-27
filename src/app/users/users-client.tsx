
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Search, Wallet, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { User, ApiMeta, WalletTransaction } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Badge } from "@/components/ui/badge";


const fetcher = (url: string) => api(url).then(res => res);

const adjustWalletSchema = z.object({
  amount_paise: z.coerce.number().int(),
  note: z.string().min(1, "Note is required.").max(100),
});


function AdjustWalletForm({ user, onSuccess }: { user: User, onSuccess: () => void }) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof adjustWalletSchema>>({
        resolver: zodResolver(adjustWalletSchema),
        defaultValues: { amount_paise: 0, note: "" },
    });

    async function onSubmit(values: z.infer<typeof adjustWalletSchema>) {
        try {
            const res = await api(`/users/${user.discord_id}/wallet_adjust`, {
                method: 'POST',
                body: JSON.stringify(values),
            });
            if (res.ok) {
                toast({ title: "Success", description: "Wallet adjusted successfully." });
                onSuccess();
                setOpen(false);
                form.reset();
            } else {
                throw new Error((res as any).error || "An error occurred");
            }
        } catch (err) {
            toast({ variant: 'destructive', title: "Error", description: err instanceof Error ? err.message : "Failed to adjust wallet." });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm"><Wallet className="mr-2 h-4 w-4" /> Adjust Wallet</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adjust Wallet for {user.username}</DialogTitle>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name="amount_paise"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Amount (in paise)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 10000 for ₹100, -5000 for -₹50" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Note / Reason</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Manual bonus" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function ViewWalletTransactions({ userId }: { userId: string }) {
    const { data, isLoading } = useSWR<{data: WalletTransaction[]}>(`/users/${userId}/wallet_tx?limit=20`, fetcher);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">View History</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Wallet Transaction History</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-5" /></TableCell></TableRow>
                                ))
                            ) : (data?.data ?? []).length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">No transactions found.</TableCell>
                                </TableRow>
                            ) : (data?.data ?? []).map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={tx.type === 'CREDIT' ? 'default' : 'destructive'} className={tx.type === 'CREDIT' ? 'bg-green-100 text-green-800' : ''}>{tx.type}</Badge>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">{tx.note}</TableCell>
                                    <TableCell className={`text-right font-medium ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                      {tx.type === 'CREDIT' ? '+' : '-'}₹{(Math.abs(tx.amount_paise) / 100).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )

}

export default function UsersClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: '10',
    ...(search && { q: search }),
  });

  const { data, error, isLoading, mutate } = useSWR<{data: User[], meta: ApiMeta}>(`/users?${queryParams.toString()}`, fetcher, { revalidateOnFocus: false });
  const users = data?.data ?? [];
  const meta = data?.meta;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center justify-between gap-2 p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by Discord ID or Username" className="pl-9 w-72" onChange={handleSearchChange} value={search} />
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={() => mutate()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Discord ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Wallet Balance</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-8 w-48 rounded-md" /></TableCell>
                  </TableRow>
                ))
              : users.length === 0 
              ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">No users found.</TableCell>
                </TableRow>
              )
              : users.map((user, index) => (
                  <TableRow key={`${user.discord_id}-${index}`}>
                    <TableCell>{user.discord_id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell className="font-medium">
                      ₹{(user.wallet_balance_paise / 100).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <AdjustWalletForm user={user} onSuccess={mutate} />
                            <ViewWalletTransactions userId={user.discord_id} />
                        </div>
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
