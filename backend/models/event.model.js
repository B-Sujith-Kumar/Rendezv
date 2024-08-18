import { Schema, model } from 'mongoose';

const EventSchema = new Schema({
    organizer_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    ticketPrice: {
        type: Number,
        default: 0,
    },
    capacity: {
        type: Number,
        required: true,
    },
    venue: {
        type: {
            latitude: Number,
            longitude: Number,
        },
    },
    is_online: {
        type: Boolean,
        default: false,
    },
    bookings: [
        {
            user_id: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            quantity: {
                type: Number,
                default: 1,
            },
            default: []
        },
    ],
    meetingLink: {
        type: String,
    },
    venueName: {
        type: String,
    },
    city: {
        type: String,
    },
    banner: {
        type: String,
    },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
    ],
    dateField: {
        type: String
    }
}, { timestamps: true });

const Event = model('Event', EventSchema);
export default Event;