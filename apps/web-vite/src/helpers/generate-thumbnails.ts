/**
 * Generate a single thumbnail from a video at a specific time
 */
const generateThumbnail = async (
  file: File,
  currentTime: number
): Promise<string> => {
  const video = document.createElement("video");
  const canvas = document.createElement("canvas");
  video.playsInline = true;
  video.muted = true;

  const objectUrl = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      video.src = objectUrl;
      video.addEventListener("loadeddata", () => resolve(), { once: true });
      video.addEventListener("error", (e) => reject(e), { once: true });
    });
    await new Promise<void>((resolve) => {
      video.currentTime = currentTime;
      video.addEventListener("seeked", () => resolve(), { once: true });
    });

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx?.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.95);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

/**
 * Generate multiple thumbnails from a video file
 * @param file - The video file
 * @param count - Number of thumbnails to generate
 * @returns Array of thumbnail data URLs
 */
export const generateThumbnailsFromVideo = async (
  file: File,
  count = 1
): Promise<string[]> => {
  if (!file.size) {
    return [];
  }

  try {
    const video = document.createElement("video");
    video.playsInline = true;
    video.muted = true;

    const objectUrl = URL.createObjectURL(file);
    try {
      video.src = objectUrl;
      // Load video metadata first
      await new Promise<void>((resolve) =>
        video.addEventListener("loadedmetadata", () => resolve(), {
          once: true
        })
      );

      const thumbnails: string[] = [];
      const interval = video.duration / Math.max(count, 1);

      // Generate thumbnails at evenly spaced intervals
      for (let i = 0; i < count; i++) {
        const currentTime = interval * i;
        const thumbnail = await generateThumbnail(file, currentTime);
        thumbnails.push(thumbnail);
      }

      return thumbnails;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch (error) {
    console.error("[Error Generate Video Thumbnails]", error);
    return [];
  }
};
