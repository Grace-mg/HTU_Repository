"use client";

import * as React from "react";
import { Tags, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminService } from "@/services/supabase-admin-service";

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [catName, setCatName] = React.useState("");
  const [catDesc, setCatDesc] = React.useState("");

  const [categories, setCategories] = React.useState<any[]>([
    { id: "cat-1", name: "Software & Web Apps", slug: "software-web-apps", description: "Web platforms, mobile apps, and enterprise software.", recordCount: 0 },
    { id: "cat-2", name: "Hardware & IoT Prototypes", slug: "hardware-iot-prototypes", description: "Microcontrollers, solar telemetry, and IoT sensors.", recordCount: 0 },
    { id: "cat-3", name: "Fashion & Textile Design", slug: "fashion-textile-design", description: "Sustainable textiles, apparel design, and pattern drafting.", recordCount: 0 },
    { id: "cat-4", name: "Research & Analytical Theses", slug: "research-analytical-theses", description: "Academic research dissertations and statistical papers.", recordCount: 0 },
  ]);

  React.useEffect(() => {
    async function loadCategories() {
      const data = await adminService.getCategories();
      if (data && data.length > 0) {
        setCategories(
          data.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description || "Repository classification category",
            recordCount: c.record_count || 0,
          }))
        );
      }
    }
    loadCategories();
  }, []);

  const filteredCategories = React.useMemo(() => {
    return categories.filter((c) =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    setCategories((prev) => [
      ...prev,
      {
        id: `cat-${Date.now()}`,
        name: catName,
        slug,
        description: catDesc || "Custom repository category",
        recordCount: 0,
      },
    ]);
    setCatName("");
    setCatDesc("");
    setModalOpen(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Card with Create Button inside */}
      <PageHeader
        title="Repository Categories"
        description="Manage classification tags and categories for student projects and academic research theses from Supabase database."
        actions={
          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" /> Create Category
          </Button>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories by name or slug..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-xs h-9"
        />
      </div>

      <div className="w-full rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
            <tr>
              <th className="p-4">Category Name & Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4">Associated Records</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCategories.map((c) => (
              <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                <td className="p-4 font-bold text-foreground flex items-center gap-2">
                  <Tags className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>{c.name}</span>
                  <span className="font-mono text-[10px] bg-muted px-2 py-0.5 rounded">{c.slug}</span>
                </td>
                <td className="p-4 text-muted-foreground">{c.description}</td>
                <td className="p-4 font-semibold text-foreground">{c.recordCount} records</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Category Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Create New Classification Category</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCategory} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Category Name
              </label>
              <Input
                placeholder="e.g. Renewable Energy Systems"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief category scope..."
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)} className="text-xs font-semibold">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4">
                Save Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
