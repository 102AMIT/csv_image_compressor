import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
    productName: string;
    inputUrls: string[];
    outputUrls?: string[];
    status: 'pending' | 'completed';
    requestId: string;
    createdAt: Date;
    updatedAt: Date;
}

const ImageSchema: Schema<IImage> = new mongoose.Schema({
    productName: { type: String, required: true },
    inputUrls: { type: [String], required: true },
    outputUrls: { type: [String], default: [] },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    requestId: { type: String, required: true, unique: true, index: true },
}, {
    timestamps: true,
});

export const ImageModel = mongoose.model<IImage>('Image', ImageSchema);
