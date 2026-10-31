import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ServiceDemoForm from "../components/ServiceDemoForm";
import "./ServicePages.css";

/** Exact HTML sections sourced from the supplied CI service views; form is React. */
export default function ServicePage({ page }) {
  const rootRef = useRef(null);
  const [mountNode, setMountNode] = React.useState(null);
  useEffect(() => {
    document.title = `${page.title} | Accutech ERP`;
    if (rootRef.current) {
      rootRef.current.innerHTML = page.html;
      setMountNode(rootRef.current.querySelector('[data-service-form="true"]'));
    }
    return () => { setMountNode(null); };
  }, [page]);
  return <div className="service-page-root">
    {page.css && <style>{page.css}</style>}
    <div ref={rootRef} />
    {mountNode && createPortal(<ServiceDemoForm service={page.title} />, mountNode)}
  </div>;
}
