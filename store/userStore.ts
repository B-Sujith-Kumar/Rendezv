import { IUser, UserStore } from "@/types";
import { create } from "zustand";

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (newUser: IUser) => set((state) => ({ user: newUser })),
}));

export default useUserStore;
