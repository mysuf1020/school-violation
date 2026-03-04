"use client";

import { Page } from "@/components/commons";
import { SanctionRuleCreateForm } from "./_components/sanction-rule-create-form";
import { SanctionRuleTable } from "./_components/sanction-rule-table";

export default function SanctionRulesPage() {
  return (
    <Page>
      <Page.Header>
        <Page.Title>Aturan Sanksi</Page.Title>
      </Page.Header>

      <Page.Body>
        <SanctionRuleCreateForm />
        <SanctionRuleTable />
      </Page.Body>
    </Page>
  );
}
