import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default async function Icon() {
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
      </div>
    ),
    {
      ...size,
    }
  );
}

