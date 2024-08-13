import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    social_links: {
        type: [{
            name: String,
            url: String,
        }],
        default: [],
    },
    friends: {
        type: [Schema.Types.ObjectId, { ref: 'User', default: [] }],
    },
    followers: {
        type: [Schema.Types.ObjectId, { ref: 'User', default: [] }],
    },
    following: {
        type: [Schema.Types.ObjectId, { ref: 'User', default: [] }],
    },
    events: {
        type: [Schema.Types.ObjectId, { ref: 'Event', default: [] }],
    },
    favorite_categories: {
        type: [Schema.Types.ObjectId, { ref: 'Category', default: [] }],
    },
    favorite_events: {
        type: [Schema.Types.ObjectId, { ref: 'Event', default: [] }],
    },
    location: {
        type: {
            latitude: Number,
            longitude: Number,
        },
        default: null,
    },
    city: {
        type: String,
        default: '',
    }
}, { timestamps: true });

const User = model('User', UserSchema);
export default User;