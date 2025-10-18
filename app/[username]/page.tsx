"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface UserLink {
  id: string;
  url: string;
  title: string | null;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  createdAt: string;
  links: UserLink[];
}

interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface LinkWithMetadata extends UserLink {
  metadata?: Metadata;
  metadataLoading?: boolean;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkWithMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/user/${username}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "User not found");
        setIsLoading(false);
        return;
      }

      setUser(data.user);
      const linksWithMetadata = data.user.links.map((link: UserLink) => ({
        ...link,
        metadataLoading: true,
      }));
      setLinks(linksWithMetadata);
      setIsLoading(false);

      // Fetch metadata for each link
      data.user.links.forEach((link: UserLink) => {
        fetchMetadata(link);
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load user profile");
      setIsLoading(false);
    }
  };

  const fetchMetadata = async (link: UserLink) => {
    try {
      const response = await fetch("/api/metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: link.url }),
      });

      if (response.ok) {
        const data = await response.json();
        setLinks((prevLinks) =>
          prevLinks.map((l) =>
            l.id === link.id
              ? { ...l, metadata: data.metadata, metadataLoading: false }
              : l
          )
        );
      } else {
        setLinks((prevLinks) =>
          prevLinks.map((l) =>
            l.id === link.id ? { ...l, metadataLoading: false } : l
          )
        );
      }
    } catch (err) {
      console.error("Error fetching metadata:", err);
      setLinks((prevLinks) =>
        prevLinks.map((l) =>
          l.id === link.id ? { ...l, metadataLoading: false } : l
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The user &quot;{username}&quot; does not exist.
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold mb-2">@{user.username}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {links.length} {links.length === 1 ? "link" : "links"}
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No links shared yet
              </p>
            </div>
          ) : (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {link.metadataLoading ? (
                  <div className="flex items-center gap-4">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-gray-500">Loading preview...</span>
                  </div>
                ) : link.metadata?.image ? (
                  <div className="flex gap-4">
                    <Image
                      src={link.metadata.image}
                      alt={link.metadata.title || "Link preview"}
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {link.title ||
                          link.metadata.title ||
                          "Untitled Link"}
                      </h3>
                      {link.metadata.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
                          {link.metadata.description}
                        </p>
                      )}
                      <p className="text-blue-600 dark:text-blue-400 text-sm truncate">
                        {link.url}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {link.title ||
                        link.metadata?.title ||
                        "Untitled Link"}
                    </h3>
                    {link.metadata?.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {link.metadata.description}
                      </p>
                    )}
                    <p className="text-blue-600 dark:text-blue-400 text-sm break-all">
                      {link.url}
                    </p>
                  </div>
                )}
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
