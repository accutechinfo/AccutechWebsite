
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./Blogs.css";

// Format blog published date
const formatDate = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Generate compact pagination numbers
const getPaginationNumbers = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  const sortedPages = [...pages]
    .filter((number) => number >= 1 && number <= totalPages)
    .sort((a, b) => a - b);

  const result = [];

  sortedPages.forEach((number, index) => {
    if (index > 0) {
      const previous = sortedPages[index - 1];
      const difference = number - previous;

      if (difference === 2) {
        result.push(previous + 1);
      } else if (difference > 2) {
        result.push("...");
      }
    }

    result.push(number);
  });

  return result;
};

export default function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(
    1,
    Math.floor(Number(searchParams.get("page")) || 1)
  );

  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch blogs from Laravel API
  useEffect(() => {
    const controller = new AbortController();

    async function loadBlogs() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/blogs?page=${page}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load blogs.");
        }

        const result = await response.json();

        if (controller.signal.aborted) return;

        setBlogs(result.data || []);
        setPagination(result.pagination || null);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load blogs.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBlogs();

    return () => controller.abort();
  }, [page]);

  // Change pagination page
  const changePage = (newPage) => {
    const totalPages = pagination?.last_page || 1;

    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === page
    ) {
      return;
    }

    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);

        if (newPage === 1) {
          next.delete("page");
        } else {
          next.set("page", String(newPage));
        }

        return next;
      }
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const totalPages = pagination?.last_page || 1;

  const pageNumbers = getPaginationNumbers(
    page,
    totalPages
  );

  return (
    <main className="accu-blogs-page">

      {/* HERO SECTION */}
      <section className="accu-blogs-hero">
        <div className="accu-blog-container">

          <span className="accu-blogs-eyebrow">
            BLOGS & INSIGHTS
          </span>

          <h1>All News & Blogs</h1>

          <p>
            Browse every article, guide, and update from
            our team. Use the pages below to explore
            more posts.
          </p>

          <div className="accu-blog-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Blogs</span>
          </div>

        </div>
      </section>

      {/* BLOG LIST SECTION */}
      <section className="accu-blogs-section">

        <div className="accu-blog-container">

          {/* LOADING */}
          {loading && (
            <div className="accu-blog-message">
              Loading latest articles...
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="accu-blog-message accu-blog-error">
              {error}
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && blogs.length === 0 && (
            <div className="accu-blog-message">
              No published blogs available.
            </div>
          )}

          {/* BLOGS GRID */}
          {!loading && !error && (
            <>

              <div className="accu-blogs-grid">

                {blogs.map((blog) => (
                  <article
                    className="accu-blog-card"
                    key={blog.id}
                  >

                    {/* BLOG IMAGE */}
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="accu-blog-card-image"
                    >
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="accu-blog-no-image">
                          Accutech ERP
                        </div>
                      )}
                    </Link>

                    {/* BLOG CONTENT */}
                    <div className="accu-blog-card-body">

                      {/* TAGS */}
                      {blog.tags && (
                        <div className="accu-blog-tags">
                          {blog.tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                            .slice(0, 3)
                            .map((tag, index) => (
                              <span key={index}>
                                {tag.startsWith("#")
                                  ? tag
                                  : `#${tag}`}
                              </span>
                            ))}
                        </div>
                      )}

                      {/* DATE */}
                      <div className="accu-blog-date">
                        <CalendarDays size={15} />
                        {formatDate(blog.published_at)}
                      </div>

                      {/* TITLE */}
                      <h2>
                        <Link to={`/blog/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h2>

                      {/* EXCERPT */}
                      <p className="accu-blog-excerpt">
                        {blog.excerpt}
                      </p>

                      {/* READ MORE */}
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="accu-blog-readmore"
                      >
                        Continue Reading
                        <ArrowRight size={17} />
                      </Link>

                    </div>

                  </article>
                ))}

              </div>

              {/* COMPACT PAGINATION */}
              {pagination && totalPages > 1 && (

                <nav
                  className="accu-pagination"
                  aria-label="Blog pagination"
                >

                  {/* PREVIOUS */}
                  <button
                    type="button"
                    className="accu-page-nav"
                    onClick={() => changePage(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={17} />
                    <span>Prev</span>
                  </button>

                  {/* PAGE NUMBERS */}
                  {pageNumbers.map((number, index) => {

                    if (number === "...") {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="accu-pagination-dots"
                          aria-hidden="true"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        type="button"
                        key={number}
                        onClick={() => changePage(number)}
                        className={
                          page === number ? "active" : ""
                        }
                        aria-label={`Go to page ${number}`}
                        aria-current={
                          page === number
                            ? "page"
                            : undefined
                        }
                      >
                        {number}
                      </button>
                    );

                  })}

                  {/* NEXT */}
                  <button
                    type="button"
                    className="accu-page-nav"
                    onClick={() => changePage(page + 1)}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                  >
                    <span>Next</span>
                    <ChevronRight size={17} />
                  </button>

                </nav>
              )}

            </>
          )}

        </div>

      </section>

    </main>
  );
}
