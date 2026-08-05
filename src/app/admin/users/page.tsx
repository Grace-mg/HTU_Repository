"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Shield,
  Edit,
  MoreVertical,
  CheckCircle2,
  UserPlus,
  Ban,
  Trash2,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminInviteDialog } from "@/components/admin/admin-invite-dialog";
import { adminService } from "@/services/supabase-admin-service";
import { UserRole } from "@/types/auth";

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [notice, setNotice] = React.useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);

  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = React.useState<any | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      const data = await adminService.getUsers();
      if (data) {
        setUsers(data);
      }
      setLoading(false);
    }
    loadUsers();
  }, []);

  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !searchQuery ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const toggleUserRole = (id: string, currentRole: UserRole) => {
    const nextRole: UserRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: nextRole } : u))
    );
    setNotice(`Updated user role to ${nextRole}`);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleToggleSuspend = async (user: any) => {
    const nextSuspendState = !user.is_suspended;
    const success = await adminService.toggleSuspendUser(user.id, nextSuspendState);

    if (success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_suspended: nextSuspendState } : u))
      );
      setNotice(`User account ${user.email} ${nextSuspendState ? "suspended" : "reactivated"} successfully.`);
      setTimeout(() => setNotice(null), 3500);
    }
  };

  const handleOpenDeleteModal = (user: any) => {
    setSelectedUserForDelete(user);
    setDeleteConfirmationText("");
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserForDelete || deleteConfirmationText !== "DELETE") return;

    setIsDeleting(true);
    const success = await adminService.deleteUser(selectedUserForDelete.id);
    setIsDeleting(false);

    if (success) {
      setUsers((prev) => prev.filter((u) => u.id !== selectedUserForDelete.id));
      setNotice(`User account ${selectedUserForDelete.email} permanently deleted.`);
      setTimeout(() => setNotice(null), 3500);
    }

    setDeleteModalOpen(false);
    setSelectedUserForDelete(null);
    setDeleteConfirmationText("");
  };

  const handleInviteSuccess = (invitedEmail: string) => {
    setNotice(`Official Admin Email Invitation dispatched to ${invitedEmail}`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Card */}
      <PageHeader
        title="User Account & Role Management"
        description="Manage registered student and faculty accounts, suspend or delete users, and handle security credentials directly from Supabase."
        actions={
          <Button
            type="button"
            onClick={() => setInviteModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold h-9 px-4 gap-1.5 shrink-0"
          >
            <UserPlus className="h-4 w-4" /> Invite Admin
          </Button>
        }
      />

      {notice && (
        <div className="rounded-md border border-purple-200 bg-purple-50/80 p-3.5 text-xs text-purple-900 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search user by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All User Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All User Roles</SelectItem>
            <SelectItem value="ADMIN">Administrators</SelectItem>
            <SelectItem value="USER">Standard Users / Students</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="w-full rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
            <tr>
              <th className="p-4">User Details</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Registration Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-xs text-muted-foreground">
                  Loading user accounts from database...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-xs text-muted-foreground">
                  No registered user accounts found in database.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-medium">
                    <div className="font-bold text-foreground">{u.full_name || u.email?.split("@")[0]}</div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate max-w-[150px]">{u.id}</div>
                  </td>

                  <td className="p-4 text-muted-foreground font-medium">{u.email}</td>

                  <td className="p-4">
                    {u.role === "ADMIN" ? (
                      <Badge className="bg-purple-600 text-white text-[10px] gap-1">
                        <Shield className="h-3 w-3" /> ADMIN
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-[10px]">
                        USER
                      </Badge>
                    )}
                  </td>

                  <td className="p-4">
                    {u.is_suspended ? (
                      <Badge variant="destructive" className="text-[10px]">
                        SUSPENDED
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">
                        ACTIVE
                      </Badge>
                    )}
                  </td>

                  <td className="p-4 text-muted-foreground">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}
                  </td>

                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52 p-1.5 space-y-1 shadow-lg border border-border bg-card">
                        <DropdownMenuItem className="p-0">
                          <Link href={`/admin/users/${u.id}/edit`} className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md cursor-pointer hover:bg-accent transition-colors w-full">
                            <Edit className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span>Edit Account</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => toggleUserRole(u.id, u.role)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md cursor-pointer hover:bg-accent transition-colors"
                        >
                          <Shield className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                          <span>{u.role === "ADMIN" ? "Demote to USER" : "Promote to ADMIN"}</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleToggleSuspend(u)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md cursor-pointer hover:bg-accent transition-colors"
                        >
                          {u.is_suspended ? (
                            <>
                              <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span>Unsuspend User</span>
                            </>
                          ) : (
                            <>
                              <Ban className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                              <span>Suspend User</span>
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-1 border-border" />

                        <DropdownMenuItem
                          onClick={() => handleOpenDeleteModal(u)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-destructive rounded-md cursor-pointer hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive shrink-0" />
                          <span>Delete User Account</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Invite Admin Dialog */}
      <AdminInviteDialog
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        onSuccess={handleInviteSuccess}
      />

      {/* Delete User Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Confirm User Account Deletion
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              This action will permanently delete <strong className="text-foreground">{selectedUserForDelete?.email}</strong> from Supabase Auth and database profiles.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="rounded-md border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900 leading-relaxed">
              To confirm deletion of this user, please type <strong className="font-mono text-destructive uppercase">DELETE</strong> in the box below.
            </div>

            <Input
              placeholder="Type DELETE to confirm..."
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              className="text-xs font-mono h-9 uppercase"
            />
          </div>

          <DialogFooter className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={deleteConfirmationText !== "DELETE" || isDeleting}
              onClick={handleConfirmDelete}
              className="text-xs font-semibold px-4"
            >
              {isDeleting ? "Deleting..." : "Delete User Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
