
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import "./Blogs.css";

const formatDate = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(
    1,
    Number(searchParams.get("page")) || 1
  );

  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        setBlogs(result.data || []);
        setPagination(result.pagination);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
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

  const changePage = (newPage) => {
    if (
      newPage < 1 ||
      newPage > (pagination?.last_page || 1)
    ) {
      return;
    }

    setSearchParams(
      newPage === 1 ? {} : { page: String(newPage) }
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="accu-blogs-page">
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

      <section className="accu-blogs-section">
        <div className="accu-blog-container">

          {loading && (
            <div className="accu-blog-message">
              Loading latest articles...
            </div>
          )}

          {error && (
            <div className="accu-blog-message accu-blog-error">
              {error}
            </div>
          )}

          {!loading && !error && blogs.length === 0 && (
            <div className="accu-blog-message">
              No published blogs available.
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="accu-blogs-grid">
                {blogs.map((blog) => (
                  <article
                    className="accu-blog-card"
                    key={blog.id}
                  >
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

                    <div className="accu-blog-card-body">

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

                      <div className="accu-blog-date">
                        <CalendarDays size={15} />
                        {formatDate(blog.published_at)}
                      </div>

                      <h2>
                        <Link to={`/blog/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h2>

                      <p className="accu-blog-excerpt">
                        {blog.excerpt}
                      </p>

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

              {pagination && pagination.last_page > 1 && (
                <nav
                  className="accu-pagination"
                  aria-label="Blog pagination"
                >
                  <button
                    onClick={() => changePage(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={19} />
                  </button>

                  {Array.from(
                    { length: pagination.last_page },
                    (_, index) => index + 1
                  ).map((number) => (
                    <button
                      key={number}
                      onClick={() => changePage(number)}
                      className={
                        page === number ? "active" : ""
                      }
                      aria-current={
                        page === number ? "page" : undefined
                      }
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => changePage(page + 1)}
                    disabled={page >= pagination.last_page}
                    aria-label="Next page"
                  >
                    <ChevronRight size={19} />
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
