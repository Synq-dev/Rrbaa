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
import { Eye, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeadsClient() {
  const leads = [
    {
      id: "1",
      created_at: "2024-05-21T10:00:00Z",
      offer_title: "Upstox Pro",
      referrer_discord_id: "user#1234",
      customer_name: "John Doe",
      status: "PENDING",
      payout_user_paise: 50000,
    },
    {
      id: "2",
      created_at: "2024-05-20T15:30:00Z",
      offer_title: "Groww",
      referrer_discord_id: "another#5678",
      customer_name: "Jane Smith",
      status: "VERIFIED",
      payout_user_paise: 75000,
    },
    {
      id: "3",
      created_at: "2024-05-19T09:00:00Z",
      offer_title: "Zerodha Kite",
      referrer_discord_id: "tester#9101",
      customer_name: "Peter Jones",
      status: "REJECTED",
      payout_user_paise: 60000,
    },
  ];
  const isLoading = false;

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
              <Input placeholder="Search leads..." className="pl-9 w-64" />
            </div>
            <Select defaultValue="all">
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
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
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
              ? Array.from({ length: 5 }).map((_, i) => (
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
         {/* Pagination would go here */}
      </CardContent>
    </Card>
  );
}
