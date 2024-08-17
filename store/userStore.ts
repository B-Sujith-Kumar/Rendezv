import { IEvent, IUser, UserStore } from "@/types";
import { create } from "zustand";

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (newUser: IUser) => set((state) => ({ user: newUser })),
  removeUser: () => set((state) => ({ user: null })),
  updateUser: (newUser: IUser) => set((state) => ({ user: newUser })),
  userCity: null,
  userLocation: null,
  location: null,
  city: null,
  addFavoriteEvent: (event: IEvent) =>
    set((state) => {
      if (state.user) {
        const isAlreadyFavorite = state.user.favorite_events?.some(
          (favEvent) => favEvent._id.toString() === event._id.toString()
        );
        if (!isAlreadyFavorite) {
          const updatedFavorites = [...state.user.favorite_events!, event];
          return { user: { ...state.user, favorite_events: updatedFavorites } };
        }
      }
      return state;
    }),
  removeFavoriteEvent: (eventId: string) =>
    set((state) => {
      if (state.user) {
        const updatedFavorites = state.user.favorite_events?.filter(
          (event) => event._id.toString() !== eventId
        );
        return { user: { ...state.user, favorite_events: updatedFavorites } };
      }
      return state;
    }),
}));

export default useUserStore;
