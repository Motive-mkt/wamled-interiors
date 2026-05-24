export interface SubService {
  name: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  image: string; // 9:16 vertical / elegant high-res
  filmstripImage: string; // cropped 9:16
  subServices: SubService[];
  solutionStory: {
    heading: string;
    paragraphs: string[];
  };
  processSteps: {
    number: string;
    title: string;
    description: string;
  }[];
}

export interface ReviewItem {
  text: string;
  author: string;
  title: string;
  rating: number;
}

export interface BentoItem {
  id: string;
  title: string;
  category: 'Residential' | 'Exterior' | 'Commercial' | 'Landscaping';
  image: string;
}

export interface PartnerItem {
  name: string;
  logoText: string;
  originalColor: string; // color used on hover reveal
}

export interface CaseStudy {
  id: string;
  title: string;
  location: string;
  projectType: string;
  sqFt: string;
  vision: string;
  textures: string; // comma separated textures
  swatches: string; // comma separated color hexes
  rawMaterials: string; // comma separated raw materials
  challenge: string;
  blueprintUrl: string;
  renderUrl: string;
  finalPhotoUrl: string;
  materialSpotlightDesc: string;
  materialSpotlightUrl: string;
  galleryUrls: string; // comma separated custom photo urls
  galleryAnnotations: string; // comma separated list of annotations matching urls
  testimonial: string;
  testimonialAuthor: string;
  outcome: string;
  createdAt?: string;
}

