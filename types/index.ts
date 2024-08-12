import { Schema } from "mongoose";

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

export interface User {
    _id: Schema.Types.ObjectId | null;
    clerkId: string;
    email: string;
    name: string;
    profileImage: string;
    bio?: string;
    socialLinks?: { name: string; url: string }[];
    friends?: User[];
    followers?: User[];
    following?: User[];
    events?: Schema.Types.ObjectId[];
    favorite_categories?: Schema.Types.ObjectId[];
    favorite_events?: Schema.Types.ObjectId[];
}

export interface UserStore {
    user: User | null;
    setUser: (newUser: User) => void;
    removeUser: () => void;
}