"use client";

import { Page } from "@/components/commons";
import { StudentCreateForm } from "./_components/student-create-form";
import { StudentTable } from "./_components/student-table";

export default function StudentsPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Siswa</Page.Title>
      </Page.Header>

      <Page.Body>
        <StudentCreateForm />
        <StudentTable />
      </Page.Body>
    </Page>
  );
}
