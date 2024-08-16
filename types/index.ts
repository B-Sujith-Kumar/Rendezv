import { Schema } from "mongoose";
import { Types } from 'mongoose';

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}


interface ISocialLink {
  name: string;
  url: string;
}

interface ILocation {
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
    categories?: Types.ObjectId[];
    dateField?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }


export interface UserStore {
    user: IUser | null;
    setUser: (newUser: IUser) => void;
}