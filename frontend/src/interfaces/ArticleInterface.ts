import type { CategoryInterface } from "./CategoryInterface";
import type { LikeInterface } from "./LikeInterface";
import type { UserInterface } from "./UserInterface";

export interface SupportFileInterface {
    id: number;
    name: string;
    type: string;
    path: string;
}

export interface ArticleInterface {
    id: number;
    title: string;
    body: string;
    thumbnail_url: string;
    created_at: string;
    updated_at: string;
    author: UserInterface;
    user_id: number;
    categories: CategoryInterface[];
    likes: LikeInterface[];
    count_comments: number;
    count_likes: number;
    is_favorite: boolean;
    user_like: LikeInterface | null;
    support_files: SupportFileInterface[];
}
