import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "JobRoute — AI job matching for developers";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #4338ca 0%, #4f46e5 45%, #7c3aed 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.18)",
              borderRadius: 18,
              fontSize: 38,
              fontWeight: 800,
            }}
          >
            J
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>
            JobRoute
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 920,
          }}
        >
          AI job matching for developers
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "rgba(255,255,255,0.82)",
            maxWidth: 880,
          }}
        >
          Hybrid AI matching, cover letters, and interview prep — all in one.
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 56 }}>
          {["Hybrid Matching", "AI Cover Letter", "Interview Prep"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 600,
                padding: "12px 24px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
