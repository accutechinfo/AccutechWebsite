import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublicPages, pageBannerUrl, publicPagePath, decodePageText } from '../services/publicPagesApi';
import './PublicPages.css';

function PageCard({ page }) {
  const [failed, setFailed] = useState(false);
  const banner = pageBannerUrl(page);
  const showImage = banner && !failed;
  const title = decodePageText(page.title || page.name || 'ERP Software');
  const excerpt = decodePageText(page.excerpt || page.short_description || '');
  const path = publicPagePath(page.slug);

  return (
    <article className="acc-pages-card">
      <Link to={path} className="acc-pages-cover" aria-label={title}>
        {showImage ? (
          <img src={banner} alt={title} loading="lazy" onError={() => setFailed(true)} />
        ) : (
          <span className="acc-pages-image-fallback" aria-hidden="true">ACCUTECH ERP</span>
        )}
      </Link>
      <div className="acc-pages-card-body">
        <h2><Link to={path}>{title}</Link></h2>
        <p>{excerpt}</p>
        <Link className="acc-pages-read" to={path}>Read More <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}

export default function Pages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetchPublicPages(controller.signal)
      .then(setPages)
      .catch(err => { if (err.name !== 'AbortError') setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  return (
    <main className="acc-pages">
      <div className="acc-pages-container">
        <header className="acc-pages-heading">
          <span className="acc-pages-badge">Pages</span>
          <h1>All <strong>ERP Pages</strong></h1>
          <p>Browse Accutech ERP solution pages, guides, and business software resources.</p>
        </header>
        {loading && <p role="status">Loading pages...</p>}
        {error && <p role="alert" className="acc-pages-error">{error}</p>}
        {!loading && !error && !pages.length && <p>No published pages found.</p>}
        {!loading && !error && <section className="acc-pages-grid" aria-label="ERP Pages">{pages.map((page, index) => (
          <PageCard key={page.id || page.slug || index} page={page} />
        ))}</section>}
      </div>
    </main>
  );
}
