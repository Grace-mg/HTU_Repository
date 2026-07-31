import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/feedback/empty-state";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Control Panel"
        description="System overview, repository record management, and administrative controls."
      />
      <EmptyState
        title="Admin Shell Initialized"
        description="Administrative management tools and statistics will display when real backend data is available."
      />
    </div>
  );
}
