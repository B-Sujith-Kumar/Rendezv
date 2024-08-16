import User from "../models/user.model.js";
import { clerkClient } from "@clerk/clerk-sdk-node";
import Event from "../models/event.model.js";

export const createUser = async (req, res) => {
    try {
        const { email, name, clerkId } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ message: "User already exists" });
        }
        const user = await User.create({ email, name, clerkId });
        await clerkClient.users.updateUser(clerkId, {
            publicMetadata: {
                user_id: user._id,
            },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const updateUserImage = async (req, res) => {
    try {
        const { profileImage, email, clerkId } = req.body;
        if (!profileImage) {
            return res.status(400).json({ message: "Profile image is required" });
        }
        const user = await User.findOneAndUpdate({ email }, { profileImage, clerkId }, { new: true });
        await clerkClient.users.updateUser(clerkId, {
            publicMetadata: {
                user_id: user._id,
            },
        });
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const getUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).populate("favorite_events");
        console.log(user);
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const updateLocation = async (req, res) => {
    try {
        const { email, userLocation, city } = req.body;
        const user = await User.findOne({ email });
        user.location = userLocation;
        user.city = city;
        await user.save();
        return res.status(200).json({ data: user });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getCity = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ city: user.city });
    } catch (error) {

    }
}

export const addFavorite = async (req, res) => {
    try {
        const { email, eventId } = req.body;
        const user = await User.findOne({ email });
        const event = await Event.findById(eventId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let removed = false;
        if (user.favorite_events.includes(event._id)) {
            user.favorite_events = user.favorite_events.filter((id) => id.toString() !== eventId.toString());
            removed = true;
        } else {
            user.favorite_events.push(event._id);
            removed = false;
        }
        await user.save();
        return res.status(200).json({ data: user, success: true, removed });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}