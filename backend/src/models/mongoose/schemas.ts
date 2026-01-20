import mongoose, { Schema, Document } from "mongoose";

// --- Interfaces ---

export interface IUser extends Document {
    name: string;
    email: string;
    role: "USER" | "RECYCLER" | "ADMIN";
    points: number;
    location: { zipCode: string };
    password?: string;
}

export interface IDisposalRequest extends Document {
    userId: mongoose.Types.ObjectId;
    items: { type: string; quantity: number }[];
    location: { address: string; zipCode: string };
    status: "PENDING" | "SCHEDULED" | "COLLECTED";
    totalIncentive: number;
    scheduledPickupId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

export interface IPickup extends Document {
    recyclerId?: mongoose.Types.ObjectId;
    requestIds: mongoose.Types.ObjectId[];
    zipCode: string;
    status: "PENDING" | "ASSIGNED" | "COMPLETED";
    scheduledDate?: Date;
}

export interface IDropOffPoint extends Document {
    name: string;
    address: string;
    capacity: number;
    currentLoad: number;
    active: boolean;
}

// --- Schemas ---

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["USER", "RECYCLER", "ADMIN"], default: "USER" },
    points: { type: Number, default: 0 },
    location: {
        zipCode: { type: String }
    },
    password: { type: String, required: true }
});

const DisposalRequestSchema = new Schema<IDisposalRequest>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            type: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    location: {
        address: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    status: { type: String, enum: ["PENDING", "SCHEDULED", "COLLECTED"], default: "PENDING" },
    totalIncentive: { type: Number, required: true },
    scheduledPickupId: { type: Schema.Types.ObjectId, ref: "Pickup" },
    createdAt: { type: Date, default: Date.now }
});

const PickupSchema = new Schema<IPickup>({
    recyclerId: { type: Schema.Types.ObjectId, ref: "User" },
    requestIds: [{ type: Schema.Types.ObjectId, ref: "DisposalRequest" }],
    zipCode: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "ASSIGNED", "COMPLETED"], default: "PENDING" },
    scheduledDate: { type: Date }
});

const DropOffPointSchema = new Schema<IDropOffPoint>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    capacity: { type: Number, required: true },
    currentLoad: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
});

// --- Models ---

export const UserModel = mongoose.model<IUser>("User", UserSchema);
export const DisposalRequestModel = mongoose.model<IDisposalRequest>("DisposalRequest", DisposalRequestSchema);
export const PickupModel = mongoose.model<IPickup>("Pickup", PickupSchema);
export const DropOffPointModel = mongoose.model<IDropOffPoint>("DropOffPoint", DropOffPointSchema);
