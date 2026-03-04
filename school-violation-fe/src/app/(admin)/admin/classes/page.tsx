"use client";

import { Page } from "@/components/commons";
import { ClassCreateForm } from "./_components/class-create-form";
import { ClassTable } from "./_components/class-table";

export default function ClassesPage() {
    return (
        <Page>
            <Page.Header>
                <Page.Title>Kelas</Page.Title>
            </Page.Header>

            <Page.Body>
                <ClassCreateForm />
                <ClassTable />
            </Page.Body>
        </Page>
    );
}
