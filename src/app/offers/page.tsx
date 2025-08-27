'use client';
import { useEffect } from "react";
import { useAppContext } from "@/contexts/app-context";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OffersPage() {
  const { setPageTitle } = useAppContext();

  useEffect(() => {
    setPageTitle("Offers");
  }, [setPageTitle]);

  return (
    <>
      <PageHeader
        title="Offers"
        description="Create, edit, and manage referral offers."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            This section is under construction. You'll soon be able to manage all offers from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>The offers management interface will include:</p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
            <li>A list of all offers with quick status toggles.</li>
            <li>A form to create and edit offers.</li>
            <li>Functionality to update offer details in real-time.</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
