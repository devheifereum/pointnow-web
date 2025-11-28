export interface FileUploadResponse {
  message: string;
  status: number;
  data: {
    image_url: string;
  };
}

export const fileApi = {
  upload: async (file: File): Promise<FileUploadResponse> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
    const url = `${API_URL}/file/upload`;

    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", file);

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }

    return response.json();
  },
};

