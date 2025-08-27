'use client';
import { useEffect } from "react";
import { useAppContext } from "@/contexts/app-context";
import { PageHeader } from "@/components/page-header";
import UsersClient from "./users-client";

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
       <UsersClient />
    </>
  );
}
