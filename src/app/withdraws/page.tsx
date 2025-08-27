'use client';
import { useEffect } from "react";
import { useAppContext } from "@/contexts/app-context";
import { PageHeader } from "@/components/page-header";
import WithdrawsClient from "./withdraws-client";

export default function WithdrawsPage() {
  const { setPageTitle } = useAppContext();

  useEffect(() => {
    setPageTitle("Withdrawal Requests");
  }, [setPageTitle]);

  return (
    <>
      <PageHeader
        title="Withdrawal Requests"
        description="Approve or reject user withdrawal requests."
      />
       <WithdrawsClient />
    </>
  );
}
