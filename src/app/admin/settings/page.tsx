"use client";

import * as React from "react";
import { Settings, Save, CheckCircle2, Shield, Database, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminSettingsPage() {
  const [success, setSuccess] = React.useState(false);
  const [settings, setSettings] = React.useState({
    appName: "HTU Student Projects & Research Repository Hub",
    adminEmail: "wonderdogbe595@gmail.com",
    maxUploadMB: 50,
    storageBucket: "repository-files",
    requireApproval: true,
    maintenanceMode: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="System Settings & Configuration"
        description="Configure repository parameters, file upload limits, approval workflow enforcement, and storage settings."
      />

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50/80 p-3.5 text-xs text-green-900 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span>System settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <Settings className="h-4 w-4 text-blue-600" /> General Repository Settings
        </h2>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">Application Title</label>
            <Input
              value={settings.appName}
              onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block">Primary Administrator Email</label>
              <Input
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block">Max PDF Attachment Size (MB)</label>
              <Input
                type="number"
                value={settings.maxUploadMB}
                onChange={(e) => setSettings({ ...settings, maxUploadMB: Number(e.target.value) })}
                className="text-xs h-9"
              />
            </div>
          </div>
        </div>

        <h2 className="text-sm font-bold text-foreground border-b border-border pt-4 pb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-purple-600" /> Security & Workflow Controls
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="requireApproval"
              checked={settings.requireApproval}
              onCheckedChange={(checked) => setSettings({ ...settings, requireApproval: !!checked })}
            />
            <label htmlFor="requireApproval" className="font-medium text-foreground cursor-pointer select-none">
              Mandatory HOD & Dean Approval before public publication
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: !!checked })}
            />
            <label htmlFor="maintenanceMode" className="font-medium text-foreground cursor-pointer select-none text-amber-700 font-semibold">
              Enable Maintenance Mode (restricts public access to repository)
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-6 gap-1.5"
          >
            <Save className="h-3.5 w-3.5" /> Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
