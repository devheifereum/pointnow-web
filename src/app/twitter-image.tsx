import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "PointNow - Loyalty Points Management System";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #dcfce7 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(123, 199, 77, 0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(123, 199, 77, 0.08)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #7bc74d 0%, #6ab63d 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "16px",
            }}
          >
            <span style={{ color: "white", fontSize: "32px", fontWeight: "bold" }}>P</span>
          </div>
          <span style={{ fontSize: "48px", fontWeight: "800", color: "#111" }}>
            PointNow
          </span>
        </div>

        {/* Main heading */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: "800",
            color: "#111",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          Loyalty Points Management
        </div>

        {/* Subheading */}
        <div
          style={{
            fontSize: "28px",
            color: "#4b5563",
            textAlign: "center",
            maxWidth: "800px",
            marginBottom: "40px",
          }}
        >
          Go live in 2 minutes. Affordable pricing for unlimited customers.
        </div>

        {/* CTA Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(135deg, #7bc74d 0%, #6ab63d 100%)",
            padding: "16px 32px",
            borderRadius: "50px",
            boxShadow: "0 10px 40px rgba(123, 199, 77, 0.3)",
          }}
        >
          <span style={{ color: "white", fontSize: "24px", fontWeight: "600" }}>
            www.pointnow.io
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
