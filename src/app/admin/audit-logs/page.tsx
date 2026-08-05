"use client";

import * as React from "react";
import {
  ShieldCheck,
  Search,
  FileSpreadsheet,
  Calendar,
  User,
  Activity,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminAuditLogsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState("all");
  const [exportNotice, setExportNotice] = React.useState<string | null>(null);

  const logs = [
    {
      id: "log-501",
      timestamp: "2026-08-05T01:01:14Z",
      actorName: "System Administrator",
      actorEmail: "wonderdogbe595@gmail.com",
      action: "ROLE_CHANGE",
      target: "User wonderdogbe595@gmail.com promoted to ADMIN",
      ipAddress: "192.168.1.42",
    },
    {
      id: "log-502",
      timestamp: "2026-08-04T16:30:00Z",
      actorName: "Dr. Seth Mensah",
      actorEmail: "smensah@htu.edu.gh",
      action: "APPROVE_RECORD",
      target: "Record rec-001 (IoT Solar Irrigation)",
      ipAddress: "192.168.1.88",
    },
    {
      id: "log-503",
      timestamp: "2026-08-04T09:15:00Z",
      actorName: "Kwame Asante",
      actorEmail: "kasante@student.htu.edu.gh",
      action: "CREATE_RECORD",
      target: "Record rec-001 created",
      ipAddress: "192.168.1.102",
    },
    {
      id: "log-504",
      timestamp: "2026-08-03T11:00:00Z",
      actorName: "System Administrator",
      actorEmail: "wonderdogbe595@gmail.com",
      action: "LOGIN",
      target: "Admin session authenticated",
      ipAddress: "192.168.1.42",
    },
  ];

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !searchQuery ||
        log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAction = actionFilter === "all" || log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [searchQuery, actionFilter]);

  const handleExportCSV = () => {
    setExportNotice("Security Audit Trail logs exported to CSV.");
    setTimeout(() => setExportNotice(null), 3000);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "ROLE_CHANGE":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30 text-[10px]">ROLE CHANGE</Badge>;
      case "APPROVE_RECORD":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">APPROVE RECORD</Badge>;
      case "CREATE_RECORD":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30 text-[10px]">CREATE RECORD</Badge>;
      case "LOGIN":
        return <Badge variant="outline" className="text-muted-foreground text-[10px]">LOGIN</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <PageHeader
          title="Security & System Audit Logs"
          description="Read-only immutable timeline of security events, administrative actions, and record changes."
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="text-xs font-semibold gap-1.5 shrink-0 h-9"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Audit Log (CSV)
        </Button>
      </div>

      {exportNotice && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-900 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by actor name, email, target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Action Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Action Types</SelectItem>
            <SelectItem value="ROLE_CHANGE">Role Changes</SelectItem>
            <SelectItem value="APPROVE_RECORD">Record Approvals</SelectItem>
            <SelectItem value="CREATE_RECORD">Record Creations</SelectItem>
            <SelectItem value="LOGIN">User Logins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Action Type</th>
                <th className="p-3.5">Target & Rationale</th>
                <th className="p-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-3.5 font-semibold text-foreground whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-foreground font-sans">{log.actorName}</div>
                    <div className="text-[10px] text-muted-foreground">{log.actorEmail}</div>
                  </td>
                  <td className="p-3.5 font-sans">{getActionBadge(log.action)}</td>
                  <td className="p-3.5 text-foreground font-sans font-medium">{log.target}</td>
                  <td className="p-3.5 text-muted-foreground">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
