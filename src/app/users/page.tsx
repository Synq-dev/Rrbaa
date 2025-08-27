'use client';
import { useEffect } from "react";
import { useAppContext } from "@/contexts/app-context";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  const { setPageTitle } = useAppContext();

  useEffect(() => {
    setPageTitle("Users");
  }, [setPageTitle]);

  return (
    <>
      <PageHeader
        title="Users"
        description="Search, view, and manage user accounts and wallets."
      />
       <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            User management is being built.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>The user management interface will include:</p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
            <li>A searchable and filterable table of all users.</li>
            <li>Ability to view user details and wallet history.</li>
            <li>A modal to adjust a user's wallet balance with notation.</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
