import { User, UserStore } from "@/types";
import { Schema } from "mongoose";
import { create } from "zustand";

const user: User = {
    _id: null,
    clerkId: "",
    email: "",
    name: "",
    profileImage: "",
    bio: "",
    socialLinks: [],
    friends: [],
    followers: [],
    following: [],
    events: [],
    favorite_categories: [],
    favorite_events: [],
};

const useUserStore = create<UserStore>((set) => ({
    user,
    setUser: (newUser: User) => set((state) => ({ ...state, user: newUser })),
    removeUser: () => set((state) => ({ ...state, user : null })),
}));

export default useUserStore;
