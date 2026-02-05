export interface UserInterface {
    id: number;    
    name: string;
    email: string;
    image_url: string;
}

export interface TokenInterface { 
    access_token: string
    expires_in: string
    created_at: string
}