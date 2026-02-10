export interface Post {
  id?: number;
  title: string;
  content: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  author?: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  author?: string;
}
