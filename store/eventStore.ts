import { EventStore, IEvent } from "@/types";
import { create } from "zustand";

const useEventStore = create<EventStore>((set) => ({
    events: [],
    popularEvents: [],
    filteredEvents: [],
    setEvents: (events : IEvent[]) => set({ events }),
    clearEvents: () => set({ events: [] }),
    setFilteredEvents: (filteredEvents : IEvent[]) => set({ filteredEvents }),
    clearFilteredEvents: () => set({ filteredEvents: [] }),
}))

export default useEventStore;