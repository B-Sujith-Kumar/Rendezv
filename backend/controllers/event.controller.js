import Event from "../models/event.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js"

export const createEvent = async (req, res) => {
    try {
        const data = req.body;
        const category = [];
        const user = await User.findOne({ email: data.email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }
        if (data.categories) {
            for (const cat of data.categories) {
                const categoryExists = await Category.findOne({ name: cat });
                if (categoryExists) {
                    category.push(categoryExists._id);
                } else {
                    const newCategory = await Category.create({ name: cat });
                    category.push(newCategory._id);
                }
            }
        }
        delete data.email;
        delete data.categories;
        console.log(data);
        const event = await Event.create({ ...data, categories: category, organizer_id: user._id });
        for (const cat of category) {
            await Category.findByIdAndUpdate(cat, { $push: { events: event._id } });
        }
        res.status(201).json({ event, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, success: false });
    }
}

export const getEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate('categories').populate('organizer_id');
        if (!event) {
            return res.status(404).json({ message: "Event not found", success: false });
        }
        res.status(200).json({ event, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message, success: false });
    }
}