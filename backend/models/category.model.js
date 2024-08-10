import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event',
        },
    ],
})

const Category = model('Category', CategorySchema);
export default Category;