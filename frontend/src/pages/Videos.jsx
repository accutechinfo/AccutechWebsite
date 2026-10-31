
import { useState } from "react";

const videos = [
  {
    id: "ztKL8Uonctw",
    title: "Getting Started with AccutechERP",
    description: "Overview & key workflows.",
  },
  {
    id: "DfBe35hIb8w",
    title: "Create & Sync Sale Orders",
    description: "Create orders and sync to cloud.",
  },
  {
    id: "oSD5-dC5Ih4",
    title: "Attendance & Visits Flow",
    description: "Mark attendance and validate visits.",
  },
  {
    id: "gUaG2kIwgMM",
    title: "Quick Tip (YouTube Short)",
    description: "A fast tip to speed up your work.",
  },
];

export default function Videos() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section
      style={{
        minHeight: "80vh",
        padding: "70px 20px",
        background: "#f5f8ff",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <span style={{ color: "#2451df" }}>
            Videos
          </span>

          <h1 style={{ color: "#172447" }}>
            For More Details,{" "}
            <span style={{ color: "#2451df" }}>
              Watch Our Videos
            </span>
          </h1>

          <p>
            Short, focused tutorials to help you get
            the most from AccutechERP &amp; SalesApp.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "22px",
          }}
        >
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveVideo(video)}
              style={{
                padding: 0,
                border: "1px solid #ddd",
                borderRadius: "12px",
                background: "#fff",
                overflow: "hidden",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <img
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <div style={{ padding: "18px" }}>
                <h3 style={{ color: "#2451df" }}>
                  {video.title}
                </h3>

                <p>{video.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeVideo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              style={{
                display: "block",
                margin: "0 0 12px auto",
                padding: "10px 18px",
                cursor: "pointer",
              }}
            >
              Close Video
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
              title={activeVideo.title}
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                border: 0,
              }}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
