export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  fileUrl?: string; // URL string instead of File object
  fileName?: string; // Original file name
  category?: string;
  progress?: number;
  lastRead?: string; // Store as ISO string for JSON serialization
}
