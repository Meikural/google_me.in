export default function BooksPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Books</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your reading list, favorite books, and recommendations
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <p className="text-gray-500 dark:text-gray-400">
          Books management coming soon...
        </p>
      </div>
    </div>
  )
}
