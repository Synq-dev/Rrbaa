'use client';
import { useEffect } from "react";
import { useAppContext } from "@/contexts/app-context";
import { PageHeader } from "@/components/page-header";
import OffersClient from "./offers-client";

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
      <OffersClient />
    </>
  );
}
