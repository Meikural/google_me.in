"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  username: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setError("");

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/user/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to search users");
        setSearchResults([]);
        return;
      }

      setSearchResults(data.users || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search users");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (username: string) => {
    router.push(`/${username}`);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8">
      <main className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Find People</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for users and discover their links
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-6 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          />

          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            {searchResults.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserClick(user.username)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user.username}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {searchQuery.length >= 2 && !isLoading && searchResults.length === 0 && !error && (
          <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
            No users found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </main>
    </div>
  );
}
