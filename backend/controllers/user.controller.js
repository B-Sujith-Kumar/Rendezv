import User from "../models/user.model.js";

export const createUser = async (req, res) => {
    try {
        const { email, name } = req.body;
        const user = await User.create({ email, name });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const updateUserImage = async (req, res) => {
    try {
        const { profileImage, email } = req.body;
        if (!profileImage) {
            return res.status(400).json({ message: "Profile image is required" });
        }
        const user = await User.findOneAndUpdate({ email }, { profileImage }, { new: true });
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}