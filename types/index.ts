import { Schema } from "mongoose";
import { Types } from "mongoose";

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

interface ISocialLink {
  name: string;
  url: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IUser {
  clerkId: string;
  email: string;
  name: string;
  profileImage?: string;
  bio?: string;
  social_links?: ISocialLink[];
  friends?: Types.ObjectId[];
  followers?: Types.ObjectId[];
  following?: Types.ObjectId[];
  events?: Types.ObjectId[];
  favorite_categories?: Types.ObjectId[];
  favorite_events?: IEvent[];
  location?: ILocation | null;
  city?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBooking {
  user_id: Types.ObjectId;
  quantity?: number;
}

export interface IEvent {
  _id: Types.ObjectId;
  organizer_id: Types.ObjectId;
  title: string;
  description?: string;
  isPaid?: boolean;
  ticketPrice?: number;
  capacity: number;
  venue?: ILocation;
  is_online?: boolean;
  bookings?: IBooking[];
  meetingLink?: string;
  venueName?: string;
  banner?: string;
  categories?: ICategory[];
  city?: string;
  dateField?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  name: string;
  description?: string;
  events?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserStore {
  user: IUser | null;
  setUser: (newUser: IUser) => void;
  removeUser: () => void;
  updateUser: (newUser: IUser) => void;
  userCity: string | null;
  userLocation: ILocation | null;
  location: ILocation | null;
  city: string | null;
  addFavoriteEvent: (event: IEvent) => void;
  removeFavoriteEvent: (eventId: string) => void;
}

export interface EventStore {
  events: IEvent[];
  setEvents: (events: IEvent[]) => void;
  clearEvents: () => void;
  filteredEvents: IEvent[];
  setFilteredEvents: (filteredEvents: IEvent[]) => void;
  clearFilteredEvents: () => void;
}
