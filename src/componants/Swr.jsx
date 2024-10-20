import { useState, useEffect } from "react";
import useSWR from "swr";
import "./Swr.css";

// Function to fetch API data using useSWR
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Swr = () => {
  const {
    data: books,
    error,
    isValidating,
  } = useSWR("https://gutendex.com/books", fetcher);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [wishlist, setWishlist] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(4); // Books per page

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Handles error and loading state
  if (error) return <div className="failed">Failed to load</div>;
  if (isValidating) return <div className="loading">Loading...</div>;

  // Get a list of all genres from books
  const genres = [
    ...new Set(
      books?.results?.reduce((acc, book) => {
        return acc.concat(book.subjects);
      }, []) || []
    ),
  ];

  // Filter books by title and genre
  const filteredBooks = books?.results
    ?.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((book) =>
      selectedGenre ? book.subjects.includes(selectedGenre) : true
    );

  // Pagination logic: Get current books for the current page
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks?.slice(indexOfFirstBook, indexOfLastBook);

  // Function to handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to toggle a book in the wishlist
  const toggleWishlist = (book) => {
    if (wishlist.some((wishlistedBook) => wishlistedBook.id === book.id)) {
      // Remove from wishlist
      setWishlist(
        wishlist.filter((wishlistedBook) => wishlistedBook.id !== book.id)
      );
    } else {
      // Add to wishlist
      setWishlist([...wishlist, book]);
    }
  };

  // Check if a book is in the wishlist
  const isWishlisted = (bookId) => {
    return wishlist.some((wishlistedBook) => wishlistedBook.id === bookId);
  };

  // Calculate total pages based on the filtered books
  const totalPages = Math.ceil(filteredBooks?.length / booksPerPage);

  return (
    <div className="pt-20">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Dropdown Genre Filter */}
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        className="genre-dropdown"
      >
        <option value="">All Genres</option>
        {genres?.map((genre, index) => (
          <option key={index} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      <div className="book-list">
        {currentBooks?.length > 0 ? (
          currentBooks.map((book, index) => (
            <div key={index} className="book-card">
              {/* Book Cover Image */}
              <img
                src={book.formats["image/jpeg"]}
                alt={`${book.title} cover`}
                width={100}
              />

              {/* Book Title */}
              <h3>{book.title}</h3>

              {/* Author Name */}
              <p>
                <strong>Author:</strong> {book.authors[0]?.name || "Unknown"}
              </p>

              {/* Book Genre/Subjects */}
              <p>
                <strong>Genre:</strong>{" "}
                {book.subjects.length > 0
                  ? book.subjects.join(", ")
                  : "No genres available"}
              </p>

              {/* Book ID */}
              <p>
                <strong>ID:</strong> {book.id}
              </p>

              {/* Wishlist Heart Icon */}
              <div
                className={`heart-icon ${
                  isWishlisted(book.id) ? "wishlisted" : ""
                }`}
                onClick={() => toggleWishlist(book)}
              >
                {isWishlisted(book.id) ? "💖" : "🤍"}
              </div>
            </div>
          ))
        ) : (
          <div>No books found</div>
        )}
      </div>

      {/* Pagination Buttons */}
      {filteredBooks?.length > booksPerPage && (
        <div className="pagination">
          {/* Previous Button */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={currentPage === number + 1 ? "active" : ""}
            >
              {number + 1}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Swr;
