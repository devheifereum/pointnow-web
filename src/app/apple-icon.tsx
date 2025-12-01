import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default async function Icon() {
  // Load the logo image from public folder
  const logoPath = path.join(process.cwd(), "public", "pointnow-logo.png");
  let logoData: string | null = null;
  
  try {
    const logoBuffer = fs.readFileSync(logoPath);
    const base64 = logoBuffer.toString("base64");
    logoData = `data:image/png;base64,${base64}`;
  } catch (error) {
    // Silently fail and use fallback
    console.error("Failed to load logo:", error);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7bc74d 0%, #6ab63d 100%)",
          borderRadius: "40px",
        }}
      >
        {logoData ? (
          <img
            src={logoData}
            alt="PointNow Logo"
            width={140}
            height={140}
            style={{
              objectFit: "contain",
            }}
          />
        ) : (
          <span
            style={{
              color: "white",
              fontSize: "100px",
              fontWeight: "bold",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            P
          </span>
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}



