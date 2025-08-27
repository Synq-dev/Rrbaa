"use client";

import { useState } from "react";
import useSWR from 'swr';
import Image from "next/image";
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
import { RefreshCw, PlusCircle, MoreVertical, Edit, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Offer, ApiMeta } from "@/types";
import { OfferFormDialog } from "./offer-form";

const fetcher = (url: string) => api(url).then(res => res);

export default function OffersClient() {
  const [page, setPage] = useState(1);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | undefined>(undefined);
  const { toast } = useToast();

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: '10',
  });

  const { data, error, isLoading, mutate } = useSWR<{data: Offer[], meta: ApiMeta}>(`/offers?${queryParams.toString()}`, fetcher, { revalidateOnFocus: false });

  const offers = data?.data ?? [];
  const meta = data?.meta;

  const handleNewOffer = () => {
    setSelectedOffer(undefined);
    setFormOpen(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setFormOpen(true);
  };

  const handleToggleActive = async (offer: Offer) => {
    try {
      const res = await api(`/offers/${offer.id}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !offer.is_active }),
      });

      if (res.ok) {
        toast({ title: 'Success', description: `Offer status updated.` });
        mutate();
      } else {
        throw new Error((res as any).error || 'An unexpected error occurred.');
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error ? err.message : `Failed to toggle offer status.`,
      });
    }
  };
  
  return (
    <>
      <OfferFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        offer={selectedOffer}
        onSuccess={() => {
          setFormOpen(false);
          mutate();
        }}
      />
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-2 p-4 border-b">
            <h3 className="text-lg font-semibold">All Offers</h3>
            <div className="flex items-center gap-2">
                <Button onClick={handleNewOffer}>
                    <PlusCircle className="mr-2" />
                    New Offer
                </Button>
                <Button variant="outline" size="icon" onClick={() => mutate()} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="flex items-center gap-4"><Skeleton className="h-12 w-12" /><Skeleton className="h-4 w-48" /></div></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                    </TableRow>
                  ))
                : offers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                           <Image src={offer.image_url || 'https://picsum.photos/100'} alt={offer.title} width={48} height={48} className="rounded-md object-cover" data-ai-hint="logo" />
                           <span className="font-medium">{offer.title}</span>
                        </div>
                      </TableCell>
                       <TableCell className="font-medium">
                        ₹{(offer.payout_user_paise / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={offer.is_active ? 'default' : 'secondary'} className={offer.is_active ? 'bg-green-100 text-green-800' : ''}>
                          {offer.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditOffer(offer)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleActive(offer)}>
                                    {offer.is_active ? <ToggleLeft className="mr-2 h-4 w-4" /> : <ToggleRight className="mr-2 h-4 w-4" />}
                                    {offer.is_active ? 'Set Inactive' : 'Set Active'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
    </>
  );
}
