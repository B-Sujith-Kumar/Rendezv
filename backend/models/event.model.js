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
    is_paid: {
        type: Boolean,
        default: false,
    },
    price: {
        type: Number,
        default: 0,
    },
    capacity: {
        type: Number,
        required: true,
    },
    location: {
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
        },
    ],
    meeting_link: {
        type: String,
    },
    venue_name: {
        type: String,
    },
    banner: {
        type: String,
    },

}, { timestamps: true });

const Event = model('Event', EventSchema);
export default Event;