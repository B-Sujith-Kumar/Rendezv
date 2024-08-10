import User from "../models/user.model.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const createUser = async (req, res) => {
    try {
        const { email, name, clerkId } = req.body;
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