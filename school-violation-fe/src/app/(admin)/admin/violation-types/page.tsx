"use client";

import { Page } from "@/components/commons";
import { ViolationTypeCreateForm } from "./_components/violation-type-create-form";
import { ViolationTypeTable } from "./_components/violation-type-table";

export default function ViolationTypesPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Jenis Pelanggaran</Page.Title>
      </Page.Header>

      <Page.Body>
        <ViolationTypeCreateForm />
        <ViolationTypeTable />
      </Page.Body>
    </Page>
  );
}
