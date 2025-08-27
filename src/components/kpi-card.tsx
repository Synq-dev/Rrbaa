import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
}

export function KpiCard({ title, value, icon: Icon }: KpiCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      </CardContent>
      <div className="h-1 bg-primary" />
    </Card>
  );
}

export function KpiCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-2/4" />
                <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent className="pb-4">
                <Skeleton className="h-7 w-1/4" />
            </CardContent>
            <div className="h-1 bg-muted" />
        </Card>
    )
}
