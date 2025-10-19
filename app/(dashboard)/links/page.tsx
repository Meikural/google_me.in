"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLinks } from "@/contexts/LinksContext";

export default function LinksPage() {
  const { user } = useUser();
  const router = useRouter();
  const { links, isLoading, fetchLinks, updateLink, deleteLink } = useLinks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLinks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleEditClick = (link: any) => {
    setEditingId(link.id);
    setEditUrl(link.url);
    setEditTitle(link.title || "");
    setEditCategory(link.category || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditUrl("");
    setEditTitle("");
    setEditCategory("");
  };

  const handleUpdateLink = async (id: string) => {
    setIsSubmitting(true);

    const success = await updateLink(id, editUrl, editTitle, editCategory);

    if (success) {
      setEditingId(null);
      setEditUrl("");
      setEditTitle("");
      setEditCategory("");
    }

    setIsSubmitting(false);
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) {
      return;
    }

    await deleteLink(id);
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
                <TableHead className="w-[150px]">Category</TableHead>
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
                          placeholder="Title"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="url"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="https://example.com"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={editCategory} onValueChange={setEditCategory} required>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SOCIAL">Social</SelectItem>
                            <SelectItem value="BOOKS">Books</SelectItem>
                            <SelectItem value="MOVIES">Movies</SelectItem>
                            <SelectItem value="GAMES">Games</SelectItem>
                            <SelectItem value="EDUCATION">Education</SelectItem>
                            <SelectItem value="OTHERS">Others</SelectItem>
                          </SelectContent>
                        </Select>
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
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {link.category}
                        </span>
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
