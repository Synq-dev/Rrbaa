'use client';
import { useEffect } from "react";
import LeadsClient from "./leads-client";
import { useAppContext } from "@/contexts/app-context";
import { PageHeader } from "@/components/page-header";

export default function LeadsPage() {
  const { setPageTitle } = useAppContext();

  useEffect(() => {
    setPageTitle("Leads");
  }, [setPageTitle]);

  return (
    <>
      <PageHeader
        title="Leads"
        description="Manage and review all user-submitted leads."
      />
      <LeadsClient />
    </>
  );
}
