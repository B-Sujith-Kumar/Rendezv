import User from "../models/user.model.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

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
        const user = await User.findOne({ email });
        res.status(200).json(user);
    }
    catch (error) {
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