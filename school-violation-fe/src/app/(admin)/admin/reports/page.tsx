"use client";

import { Page } from "@/components/commons";
import { ReportTable } from "./_components/report-table";

export default function ReportsPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Laporan Publik</Page.Title>
      </Page.Header>

      <Page.Body>
        <ReportTable />
      </Page.Body>
    </Page>
  );
}
