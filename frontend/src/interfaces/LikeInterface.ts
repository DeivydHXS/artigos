import type { UserInterface } from "./UserInterface";

export interface LikeInterface {
    id: number;    
    reaction: string;
    user: UserInterface;
    user_id: number
}