'use client';
import { useEffect } from "react";
import { useAppContext } from "@/contexts/app-context";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WithdrawsPage() {
  const { setPageTitle } = useAppContext();

  useEffect(() => {
    setPageTitle("Withdraws");
  }, [setPageTitle]);

  return (
    <>
      <PageHeader
        title="Withdrawal Requests"
        description="Approve or reject user withdrawal requests."
      />
       <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Withdrawal request management is under development.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>The withdrawals interface will feature:</p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
            <li>A filterable list of all withdrawal requests by status.</li>
            <li>Actions to approve or reject requests.</li>
            <li>A modal to add a note when rejecting a request.</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
