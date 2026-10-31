
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import "./BlogDetail.css";

export default function BlogDetail() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBlog() {
      setLoading(true);
      setError("");
      setBlog(null);

      try {
        const response = await fetch(
          `/api/blogs/${encodeURIComponent(slug)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Blog not found."
              : "Unable to load this article."
          );
        }

        const result = await response.json();
        setBlog(result.data);
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

    loadBlog();

    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} | Accutech ERP`;
    }
  }, [blog]);

  if (loading) {
    return (
      <div className="accu-detail-message">
        Loading article...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="accu-detail-message">
        <h2>{error || "Blog not found"}</h2>
        <Link to="/blogs">Back to Blogs</Link>
      </div>
    );
  }

  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      )
    : "";

  return (
    <main className="accu-blog-detail">

      <section className="accu-detail-heading">
        <div className="accu-detail-container">

          <Link to="/blogs" className="accu-back-link">
            <ArrowLeft size={17} />
            Back to All Blogs
          </Link>

          <h1>{blog.title}</h1>

          <div className="accu-detail-meta">
            <span>
              <CalendarDays size={17} />
              {formattedDate}
            </span>

            <span>
              <UserRound size={17} />
              {blog.author || "Accutech ERP Team"}
            </span>
          </div>

        </div>
      </section>

      <article className="accu-detail-container">

        {blog.image && (
          <div className="accu-detail-image">
            <img
              src={blog.image}
              alt={blog.title}
            />
          </div>
        )}

        {blog.excerpt && (
          <p className="accu-detail-excerpt">
            {blog.excerpt}
          </p>
        )}

        <div
          className="accu-detail-content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              blog.content || ""
            ),
          }}
        />

        {blog.tags && (
          <div className="accu-detail-tags">
            {blog.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
              .map((tag, index) => (
                <span key={index}>
                  {tag}
                </span>
              ))}
          </div>
        )}

        <Link to="/blogs" className="accu-bottom-back">
          <ArrowLeft size={17} />
          View More Blogs
        </Link>

      </article>

    </main>
  );
}
