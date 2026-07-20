/** Recommended dimensions and limits shown in admin upload fields. */

export interface ImageUploadSpec {
  recommendedWidth: number
  recommendedHeight: number
  /** When omitted, uploads are not restricted by pixel dimensions. */
  maxWidth?: number
  maxHeight?: number
  maxSizeMB: number
  formats: string
  hint: string
}

export const IMAGE_UPLOAD_PRESETS = {
  /** Full-width inner page heroes (about, services, work, etc.) */
  hero: {
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    maxWidth: 2560,
    maxHeight: 1440,
    maxSizeMB: 3,
    formats: "JPG, WebP or PNG",
    hint: "Wide landscape (16:9). Compress before upload for faster page loads.",
  },
  /** Home carousel slide backgrounds */
  heroCarousel: {
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    maxWidth: 2560,
    maxHeight: 1440,
    maxSizeMB: 3,
    formats: "JPG or WebP",
    hint: "Full-bleed carousel slide. Keep text-safe area centered.",
  },
  /** Browser tab / favicon */
  favicon: {
    recommendedWidth: 512,
    recommendedHeight: 512,
    maxWidth: 512,
    maxHeight: 512,
    maxSizeMB: 1,
    formats: "PNG or ICO",
    hint: "Square icon. 512×512 PNG works for modern browsers and PWA.",
  },
  /** Open Graph / social share */
  og: {
    recommendedWidth: 1200,
    recommendedHeight: 630,
    maxWidth: 2400,
    maxHeight: 1260,
    maxSizeMB: 5,
    formats: "JPG or PNG",
    hint: "Social preview image (1.91:1). Text should stay inside the center safe zone.",
  },
  /** Header / footer logo */
  logo: {
    recommendedWidth: 400,
    recommendedHeight: 120,
    maxSizeMB: 1,
    formats: "PNG with transparency",
    hint: "Horizontal logo. Any resolution is fine — keep the file under 1MB.",
  },
  /** Grid cards, listing thumbnails, insight/work cards */
  card: {
    recommendedWidth: 800,
    recommendedHeight: 600,
    maxWidth: 1600,
    maxHeight: 1200,
    maxSizeMB: 2,
    formats: "JPG or PNG",
    hint: "Listing card image. 4:3 ratio displays well in grids.",
  },
  /** 16:9 featured images */
  cardWide: {
    recommendedWidth: 1200,
    recommendedHeight: 675,
    maxWidth: 2400,
    maxHeight: 1350,
    maxSizeMB: 2,
    formats: "JPG or PNG",
    hint: "16:9 featured image for articles or portfolio items.",
  },
  /** Testimonial / author photos */
  avatar: {
    recommendedWidth: 200,
    recommendedHeight: 200,
    maxWidth: 512,
    maxHeight: 512,
    maxSizeMB: 1,
    formats: "JPG or PNG",
    hint: "Square headshot. Crop to face for best results.",
  },
  /** Benefit icons, small UI graphics */
  icon: {
    recommendedWidth: 256,
    recommendedHeight: 256,
    maxWidth: 512,
    maxHeight: 512,
    maxSizeMB: 1,
    formats: "PNG with transparency",
    hint: "Square icon. Simple flat graphics work best at small sizes.",
  },
  /** Service grid custom icons */
  serviceIcon: {
    recommendedWidth: 512,
    recommendedHeight: 512,
    maxWidth: 512,
    maxHeight: 512,
    maxSizeMB: 1,
    formats: "PNG with transparency",
    hint: "Square service card icon shown at ~48px on the website.",
  },
  /** Case study / detail galleries */
  gallery: {
    recommendedWidth: 1200,
    recommendedHeight: 800,
    maxWidth: 2400,
    maxHeight: 1600,
    maxSizeMB: 2,
    formats: "JPG or PNG",
    hint: "Detail page gallery. 3:2 landscape recommended.",
  },
  /** Sub-service banner / intro image */
  banner: {
    recommendedWidth: 1920,
    recommendedHeight: 720,
    maxWidth: 2560,
    maxHeight: 1080,
    maxSizeMB: 3,
    formats: "JPG or PNG",
    hint: "Wide banner beside service intro content.",
  },
  /** Work detail side panel */
  sideImage: {
    recommendedWidth: 800,
    recommendedHeight: 1000,
    maxWidth: 1600,
    maxHeight: 2000,
    maxSizeMB: 2,
    formats: "JPG or PNG",
    hint: "Portrait side image (4:5) beside project overview.",
  },
  /** Client logos */
  clientLogo: {
    recommendedWidth: 400,
    recommendedHeight: 200,
    maxWidth: 800,
    maxHeight: 400,
    maxSizeMB: 1,
    formats: "PNG with transparency",
    hint: "Client logo on white. Keep padding around the mark.",
  },
  /** Case study hero / featured */
  caseStudy: {
    recommendedWidth: 1200,
    recommendedHeight: 900,
    maxWidth: 2400,
    maxHeight: 1800,
    maxSizeMB: 2,
    formats: "JPG or PNG",
    hint: "Case study cover image (4:3). Used on cards and detail hero.",
  },
  /** About / culture section photos */
  sectionPhoto: {
    recommendedWidth: 1000,
    recommendedHeight: 800,
    maxWidth: 2000,
    maxHeight: 1600,
    maxSizeMB: 2,
    formats: "JPG or PNG",
    hint: "Content section photo beside text (5:4 works well).",
  },
  /** Home stats / service strip icons */
  statIcon: {
    recommendedWidth: 128,
    recommendedHeight: 128,
    maxWidth: 256,
    maxHeight: 256,
    maxSizeMB: 1,
    formats: "PNG or SVG (upload as PNG)",
    hint: "Small stat or list icon. Simple shapes read best.",
  },
  /** Fallback when no preset is set */
  generic: {
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    maxWidth: 4096,
    maxHeight: 4096,
    maxSizeMB: 10,
    formats: "PNG, JPG, WebP or GIF",
    hint: "Match dimensions to where the image appears on the live page.",
  },
} as const satisfies Record<string, ImageUploadSpec>

export type ImageUploadPreset = keyof typeof IMAGE_UPLOAD_PRESETS

export function resolveImageSpec(
  preset?: ImageUploadPreset,
  overrides?: Partial<ImageUploadSpec>,
): ImageUploadSpec {
  const base = preset ? IMAGE_UPLOAD_PRESETS[preset] : IMAGE_UPLOAD_PRESETS.generic
  return { ...base, ...overrides }
}

export function formatImageSpecLine(spec: ImageUploadSpec): string {
  return `Recommended ${spec.recommendedWidth}×${spec.recommendedHeight}px · Max ${spec.maxSizeMB}MB · ${spec.formats}`
}

export interface VideoUploadSpec {
  maxSizeMB: number
  recommendedResolution: string
  formats: string
  hint: string
}

export const VIDEO_UPLOAD_PRESETS = {
  heroBackground: {
    maxSizeMB: 10,
    recommendedResolution: "1920×1080",
    formats: "MP4 (H.264) or WebM",
    hint: "Short loop (5–15s), muted autoplay. Compress to under 5MB when possible.",
  },
} as const satisfies Record<string, VideoUploadSpec>

export type VideoUploadPreset = keyof typeof VIDEO_UPLOAD_PRESETS

export function formatVideoSpecLine(spec: VideoUploadSpec): string {
  return `Recommended ${spec.recommendedResolution} · Max ${spec.maxSizeMB}MB · ${spec.formats}`
}
