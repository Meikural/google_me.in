"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Link {
  id: string;
  url: string;
  title: string | null;
  createdAt: string;
}

export default function LinksPage() {
  const { user } = useUser();
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLinks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/links");
      const data = await response.json();

      if (response.ok) {
        setLinks(data.links || []);
      } else if (response.status === 404 && data.error === "User not found") {
        router.push("/setup");
        return;
      }
    } catch (err) {
      console.error("Error fetching links:", err);
      toast.error("Failed to fetch links");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (link: Link) => {
    setEditingId(link.id);
    setEditUrl(link.url);
    setEditTitle(link.title || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditUrl("");
    setEditTitle("");
  };

  const handleUpdateLink = async (id: string) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: editUrl,
          title: editTitle || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update link");
        setIsSubmitting(false);
        return;
      }

      setLinks(links.map((link) => (link.id === id ? data.link : link)));
      setEditingId(null);
      setEditUrl("");
      setEditTitle("");
      toast.success("Link updated successfully!");
    } catch (err) {
      console.error("Error updating link:", err);
      toast.error("Failed to update link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) {
      return;
    }

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setLinks(links.filter((link) => link.id !== id));
        toast.success("Link deleted successfully!");
      } else {
        toast.error("Failed to delete link");
      }
    } catch (err) {
      console.error("Error deleting link:", err);
      toast.error("Failed to delete link");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Links</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your links and share them with others
        </p>
      </div>

      {/* Links Table */}
      {links.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No links yet. Use Quick Create to add your first link!
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  {editingId === link.id ? (
                    <>
                      <TableCell>
                        <Input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title (optional)"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="url"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="https://example.com"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="icon"
                            onClick={() => handleUpdateLink(link.id)}
                            disabled={isSubmitting}
                            title="Save"
                          >
                            <IconCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={isSubmitting}
                            title="Cancel"
                          >
                            <IconX className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">
                        {link.title || <span className="text-gray-400 italic">No title</span>}
                      </TableCell>
                      <TableCell>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {link.url}
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditClick(link)}
                            title="Edit"
                          >
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteLink(link.id)}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
