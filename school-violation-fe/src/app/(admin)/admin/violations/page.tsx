"use client";

import { Page } from "@/components/commons";
import { ViolationCreateForm } from "./_components/violation-create-form";
import { ViolationTable } from "./_components/violation-table";

export default function ViolationsPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Pelanggaran</Page.Title>
      </Page.Header>

      <Page.Body>
        <ViolationCreateForm />
        <ViolationTable />
      </Page.Body>
    </Page>
  );
}
