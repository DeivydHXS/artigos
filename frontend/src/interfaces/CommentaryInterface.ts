import type { LikeInterface } from "./LikeInterface";
import type { UserInterface } from "./UserInterface";

export interface CommentaryInterface {
    id: number;    
    message: string;
    user_id: number;
    author: UserInterface;
    article_id: number;
    like: LikeInterface;
    is_author: boolean;
}