import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/feedback/empty-state";

export default function UserDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Dashboard Overview"
        description="Manage saved records, profile preferences, and security settings."
      />
      <EmptyState
        title="Dashboard Shell Initialized"
        description="User overview widgets and saved records will display when data sources are configured."
      />
    </div>
  );
}
