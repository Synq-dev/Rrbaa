
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Offer } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

const offerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  payout_user_paise: z.coerce.number().int().positive("Payout must be a positive number"),
  base_link: z.string().url("Must be a valid URL"),
  account_open_guide: z.string().url("Must be a valid URL"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  terms: z.string().optional(),
  benefits: z.string().optional(),
  is_active: z.boolean().default(true),
});

type OfferFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  offer?: Offer
  onSuccess: () => void
}

export function OfferFormDialog({ open, onOpenChange, offer, onSuccess }: OfferFormDialogProps) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof offerSchema>>({
    resolver: zodResolver(offerSchema),
  });
  
  React.useEffect(() => {
    if (offer) {
        form.reset({
            ...offer,
            payout_user_paise: offer.payout_user_paise,
        });
    } else {
        form.reset({
            title: "",
            payout_user_paise: 0,
            base_link: "",
            account_open_guide: "",
            image_url: "",
            terms: "",
            benefits: "",
            is_active: true,
        });
    }
  }, [offer, form, open]);


  const onSubmit = async (values: z.infer<typeof offerSchema>) => {
    try {
        const method = offer ? 'PUT' : 'POST';
        const endpoint = offer ? `/offers/${offer._id}` : '/offers';
        
        const res = await api(endpoint, {
            method,
            body: JSON.stringify(values),
        });

        if (res.ok) {
            toast({ title: "Success", description: `Offer ${offer ? 'updated' : 'created'} successfully.` });
            onSuccess();
        } else {
            throw new Error((res as any).error || 'An unexpected error occurred.');
        }
    } catch (err) {
        toast({
            variant: "destructive",
            title: "Error",
            description: err instanceof Error ? err.message : 'Failed to save offer.'
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{offer ? "Edit Offer" : "Create New Offer"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl><Input placeholder="e.g., Bank X Savings Account" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="payout_user_paise"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>User Payout (in paise)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 10000 for ₹100" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="base_link"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Base Referral Link</FormLabel>
                    <FormControl><Input placeholder="https://example.com/ref/abc" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="account_open_guide"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Account Opening Guide URL</FormLabel>
                    <FormControl><Input placeholder="https://guides.com/how-to" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl><Input placeholder="https://images.com/offer.png" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Benefits</FormLabel>
                    <FormControl><Textarea placeholder="List the benefits, one per line." {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Terms & Conditions</FormLabel>
                    <FormControl><Textarea placeholder="List the terms, one per line." {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Active Status</FormLabel>
                            <p className="text-sm text-muted-foreground">
                                Is this offer currently active and available to users?
                            </p>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Offer'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
