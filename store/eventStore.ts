import { EventStore, IEvent } from "@/types";
import moment from "moment";
import { create } from "zustand";

const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  popularEvents: [],
  filteredEvents: [],
  online_events: [],

  setEvents: (events: IEvent[]) => set({ events }),
  clearEvents: () => set({ events: [] }),
  setFilteredEvents: (filteredEvents: IEvent[]) => set({ filteredEvents }),
  clearFilteredEvents: () => set({ filteredEvents: [] }),

  selectedDateRange: { startDate: null, endDate: null },
  isOnline: null,
  categoryId: null,
  isPaid: null,

  setDateRange: (startDate: string | null, endDate: string | null) => {
    set({ selectedDateRange: { startDate, endDate } });
    get().applyFilters();
  },
  setIsOnline: (isOnline: boolean | null) => {
    set({ isOnline });
    get().applyFilters();
  },
  setCategoryId: (categoryId: string | null) => {
    set({ categoryId });
    get().applyFilters();
  },
  setIsPaid: (isPaid: boolean | null) => {
    set({ isPaid });
    get().applyFilters();
  },

  applyFilters: () => {
    const { events, selectedDateRange, isOnline, categoryId, isPaid } = get();
    let filteredEvents = events;

    if (selectedDateRange.startDate && selectedDateRange.endDate) {
      filteredEvents = filteredEvents.filter((event) =>
        moment(event.dateField).isBetween(
          selectedDateRange.startDate,
          selectedDateRange.endDate,
          undefined,
          "[]"
        )
      );
    }

    if (isOnline !== null) {
      filteredEvents = filteredEvents.filter(
        (event) => event.is_online === isOnline
      );
    }

    if (categoryId) {
      filteredEvents = filteredEvents.filter((event) =>
        event.categories?.some((category) => category.name === categoryId)
      );
    }

    if (isPaid !== null) {
      filteredEvents = filteredEvents.filter(
        (event) => event.isPaid === isPaid
      );
    }

    set({ filteredEvents });
  },
}));

export default useEventStore;
