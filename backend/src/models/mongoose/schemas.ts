import mongoose, { Schema, Document } from "mongoose";

// --- Interfaces ---

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "USER" | "ECENTRE" | "ADMIN";
    points: number;
    location: { 
        address?: string;
        pincode?: string;
        coordinates?: { lat: number; lng: number };
    };
    lastKnownLocation?: {
        lat: number;
        lng: number;
        updatedAt: Date;
    };
    phoneNumber?: string;
    pickupHistory: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IECentre extends Document {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    location: {
        address: string;
        coordinates: { lat: number; lng: number };
    };
    serviceAreas: string[]; // pincodes they service
    verified: boolean;
    licenseNumber: string;
    capacity: number;
    completedPickups: number;
    rating: number;
    operationalStatus: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
    serviceRadius: number; // km
    createdAt: Date;
    updatedAt: Date;
}

export interface IDisposalRequest extends Document {
    userId: mongoose.Types.ObjectId;
    eCentreId?: mongoose.Types.ObjectId; // Assigned E-Centre
    poolId?: mongoose.Types.ObjectId; // Assigned Pool
    items: { 
        type: "PHONE" | "CHARGER" | "BATTERY" | "LAPTOP" | "TABLET" | "MONITOR" | "OTHER";
        quantity: number;
        description?: string;
    }[];
    location: { 
        address: string; 
        pincode: string;
        coordinates?: { lat: number; lng: number };
    };
    imageUrl?: string;
    description?: string;
    status: "PENDING" | "GROUPING" | "ACCEPTED" | "SCHEDULED" | "COLLECTED";
    estimatedIncentive: { min: number; max: number };
    actualIncentive?: number;
    scheduledPickupId?: mongoose.Types.ObjectId;
    groupingProgress?: { current: number; target: number }; // e.g., 3/5
    createdAt: Date;
    updatedAt: Date;
}

export interface IPickupPool extends Document {
    eCentreId: mongoose.Types.ObjectId;
    area: string; // pincode
    requestIds: mongoose.Types.ObjectId[];
    maxCapacity: number; // e.g., 5
    currentCount: number;
    status: "OPEN" | "ACCEPTED" | "SCHEDULED" | "COLLECTED";
    itemsSummary: { type: string; quantity: number }[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IPickup extends Document {
    eCentreId: mongoose.Types.ObjectId;
    requestIds: mongoose.Types.ObjectId[];
    area: {
        pincode: string;
        coordinates: { lat: number; lng: number };
        radius: number; // in km
    };
    status: "PENDING" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
    scheduledDate?: Date;
    scheduledTimeWindow?: { start: string; end: string }; // e.g., "10:00 AM - 12:00 PM"
    vehicleType: "TWO_WHEELER" | "SMALL_VEHICLE";
    itemsSummary: { type: string; quantity: number }[];
    householdCount: number;
    completedAt?: Date;
    createdAt: Date;
}

// --- Schemas ---

const UserSchema = new Schema<IUser>({
    name: { 
        type: String, 
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"]
    },
    email: { 
        type: String, 
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"]
    },
    password: { 
        type: String, 
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]
    },
    role: { 
        type: String, 
        enum: ["USER", "ECENTRE", "ADMIN"], 
        default: "USER" 
    },
    points: { 
        type: Number, 
        default: 0,
        min: [0, "Points cannot be negative"]
    },
    location: {
        address: { type: String, default: "" },
        pincode: { type: String, default: "" },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    lastKnownLocation: {
        lat: { type: Number },
        lng: { type: Number },
        updatedAt: { type: Date }
    },
    phoneNumber: { type: String },
    pickupHistory: [{ type: Schema.Types.ObjectId, ref: "DisposalRequest" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Create indexes for faster queries
UserSchema.index({ role: 1 });

const ECentreSchema = new Schema<IECentre>({
    name: { 
        type: String, 
        required: [true, "Name is required"],
        trim: true
    },
    email: { 
        type: String, 
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"]
    },
    password: { 
        type: String, 
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]
    },
    phoneNumber: { 
        type: String, 
        required: [true, "Phone number is required"]
    },
    location: {
        address: { 
            type: String, 
            required: [true, "Address is required"]
        },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    },
    serviceAreas: [{ type: String }], // pincodes
    verified: { type: Boolean, default: false },
    licenseNumber: { 
        type: String, 
        required: [true, "License number is required"]
    },
    capacity: { type: Number, default: 100 },
    completedPickups: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    operationalStatus: {
        type: String,
        enum: ["ACTIVE", "INACTIVE", "MAINTENANCE"],
        default: "ACTIVE"
    },
    serviceRadius: { type: Number, default: 10 }, // km
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Create indexes
ECentreSchema.index({ verified: 1 });

const DisposalRequestSchema = new Schema<IDisposalRequest>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eCentreId: { type: Schema.Types.ObjectId, ref: "ECentre" },
    poolId: { type: Schema.Types.ObjectId, ref: "PickupPool" },
    items: [
        {
            type: { 
                type: String, 
                enum: ["PHONE", "CHARGER", "BATTERY", "LAPTOP", "TABLET", "MONITOR", "OTHER"],
                required: true 
            },
            quantity: { type: Number, required: true, min: 1 },
            description: { type: String }
        }
    ],
    location: {
        address: { type: String, required: true },
        pincode: { type: String, required: true },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    imageUrl: { type: String },
    description: { type: String },
    status: { 
        type: String, 
        enum: ["PENDING", "GROUPING", "ACCEPTED", "SCHEDULED", "COLLECTED"], 
        default: "PENDING" 
    },
    estimatedIncentive: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    },
    actualIncentive: { type: Number },
    scheduledPickupId: { type: Schema.Types.ObjectId, ref: "Pickup" },
    groupingProgress: {
        current: { type: Number, default: 1 },
        target: { type: Number, default: 5 }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Create indexes
DisposalRequestSchema.index({ userId: 1 });
DisposalRequestSchema.index({ eCentreId: 1 });
DisposalRequestSchema.index({ poolId: 1 });
DisposalRequestSchema.index({ status: 1 });
DisposalRequestSchema.index({ "location.pincode": 1 });

const PickupSchema = new Schema<IPickup>({
    eCentreId: { type: Schema.Types.ObjectId, ref: "ECentre", required: true },
    requestIds: [{ type: Schema.Types.ObjectId, ref: "DisposalRequest" }],
    area: {
        pincode: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        radius: { type: Number, default: 2 } // 2km radius
    },
    status: { 
        type: String, 
        enum: ["PENDING", "SCHEDULED", "IN_PROGRESS", "COMPLETED"], 
        default: "PENDING" 
    },
    scheduledDate: { type: Date },
    scheduledTimeWindow: {
        start: { type: String },
        end: { type: String }
    },
    vehicleType: { 
        type: String, 
        enum: ["TWO_WHEELER", "SMALL_VEHICLE"],
        default: "TWO_WHEELER"
    },
    itemsSummary: [{
        type: { type: String },
        quantity: { type: Number }
    }],
    householdCount: { type: Number, default: 0 },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

// Create indexes
PickupSchema.index({ eCentreId: 1 });
PickupSchema.index({ status: 1 });
PickupSchema.index({ "area.pincode": 1 });

const PickupPoolSchema = new Schema<IPickupPool>({
    eCentreId: { type: Schema.Types.ObjectId, ref: "ECentre", required: true },
    area: { type: String, required: true }, // pincode
    requestIds: [{ type: Schema.Types.ObjectId, ref: "DisposalRequest" }],
    maxCapacity: { type: Number, default: 5 },
    currentCount: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ["OPEN", "ACCEPTED", "SCHEDULED", "COLLECTED"], 
        default: "OPEN" 
    },
    itemsSummary: [{
        type: { type: String },
        quantity: { type: Number }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Create indexes
PickupPoolSchema.index({ eCentreId: 1 });
PickupPoolSchema.index({ area: 1 });
PickupPoolSchema.index({ status: 1 });

// --- Models ---

export const UserModel = mongoose.model<IUser>("User", UserSchema);
export const ECentreModel = mongoose.model<IECentre>("ECentre", ECentreSchema);
export const DisposalRequestModel = mongoose.model<IDisposalRequest>("DisposalRequest", DisposalRequestSchema);
export const PickupModel = mongoose.model<IPickup>("Pickup", PickupSchema);
export const PickupPoolModel = mongoose.model<IPickupPool>("PickupPool", PickupPoolSchema);
