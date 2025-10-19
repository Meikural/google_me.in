"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";

interface Link {
  id: string;
  url: string;
  title: string;
  category: string;
  createdAt: string;
}

interface LinksContextType {
  links: Link[];
  isLoading: boolean;
  fetchLinks: () => Promise<void>;
  addLink: (url: string, title: string, category: string) => Promise<boolean>;
  updateLink: (id: string, url: string, title: string, category: string) => Promise<boolean>;
  deleteLink: (id: string) => Promise<boolean>;
}

const LinksContext = createContext<LinksContextType | undefined>(undefined);

export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLinks = useCallback(async () => {
    try {
      const response = await fetch("/api/links");
      const data = await response.json();

      if (response.ok) {
        setLinks(data.links || []);
      } else {
        console.error("Failed to fetch links:", data.error);
      }
    } catch (err) {
      console.error("Error fetching links:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addLink = useCallback(async (url: string, title: string, category: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, title, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to add link");
        return false;
      }

      // Add the new link to the state
      setLinks((prev) => [data.link, ...prev]);
      toast.success("Link added successfully!");
      return true;
    } catch (err) {
      console.error("Error adding link:", err);
      toast.error("Failed to add link");
      return false;
    }
  }, []);

  const updateLink = useCallback(async (id: string, url: string, title: string, category: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, title, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update link");
        return false;
      }

      // Update the link in state
      setLinks((prev) => prev.map((link) => (link.id === id ? data.link : link)));
      toast.success("Link updated successfully!");
      return true;
    } catch (err) {
      console.error("Error updating link:", err);
      toast.error("Failed to update link");
      return false;
    }
  }, []);

  const deleteLink = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to delete link");
        return false;
      }

      // Remove the link from state
      setLinks((prev) => prev.filter((link) => link.id !== id));
      toast.success("Link deleted successfully!");
      return true;
    } catch (err) {
      console.error("Error deleting link:", err);
      toast.error("Failed to delete link");
      return false;
    }
  }, []);

  return (
    <LinksContext.Provider
      value={{
        links,
        isLoading,
        fetchLinks,
        addLink,
        updateLink,
        deleteLink,
      }}
    >
      {children}
    </LinksContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (context === undefined) {
    throw new Error("useLinks must be used within a LinksProvider");
  }
  return context;
}
