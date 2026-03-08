// Simple in-memory database for testing without MongoDB
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: "USER" | "RECYCLER" | "ADMIN";
    points: number;
    location: { pincode: string };
}

interface DisposalRequest {
    _id: string;
    userId: string;
    items: { type: string; quantity: number }[];
    location: { address: string; pincode: string };
    status: "PENDING" | "SCHEDULED" | "COLLECTED";
    totalIncentive: number;
    scheduledPickupId?: string;
    createdAt: Date;
}

interface Pickup {
    _id: string;
    recyclerId?: string;
    requestIds: string[];
    pincode: string;
    status: "PENDING" | "ASSIGNED" | "COMPLETED";
    scheduledDate?: Date;
}

// In-memory storage
const users: User[] = [];
const disposalRequests: DisposalRequest[] = [];
const pickups: Pickup[] = [];

export const MockDB = {
    // User operations
    users: {
        create: async (data: Omit<User, "_id">): Promise<User> => {
            const user: User = { _id: uuidv4(), ...data };
            users.push(user);
            return user;
        },
        findOne: async (query: { email?: string; _id?: string }): Promise<User | null> => {
            return users.find(u => 
                (query.email && u.email === query.email) || 
                (query._id && u._id === query._id)
            ) || null;
        },
        findById: async (id: string): Promise<User | null> => {
            return users.find(u => u._id === id) || null;
        },
        updateOne: async (query: { _id: string }, update: Partial<User>): Promise<void> => {
            const index = users.findIndex(u => u._id === query._id);
            if (index !== -1) {
                users[index] = { ...users[index], ...update };
            }
        }
    },

    // Disposal Request operations
    disposalRequests: {
        create: async (data: Omit<DisposalRequest, "_id">): Promise<DisposalRequest> => {
            const request: DisposalRequest = { _id: uuidv4(), ...data };
            disposalRequests.push(request);
            return request;
        },
        find: async (query: { userId?: string; status?: string }): Promise<DisposalRequest[]> => {
            return disposalRequests.filter(r => 
                (!query.userId || r.userId === query.userId) &&
                (!query.status || r.status === query.status)
            );
        },
        findById: async (id: string): Promise<DisposalRequest | null> => {
            return disposalRequests.find(r => r._id === id) || null;
        },
        updateOne: async (query: { _id: string }, update: Partial<DisposalRequest>): Promise<void> => {
            const index = disposalRequests.findIndex(r => r._id === query._id);
            if (index !== -1) {
                disposalRequests[index] = { ...disposalRequests[index], ...update };
            }
        }
    },

    // Pickup operations
    pickups: {
        create: async (data: Omit<Pickup, "_id">): Promise<Pickup> => {
            const pickup: Pickup = { _id: uuidv4(), ...data };
            pickups.push(pickup);
            return pickup;
        },
        find: async (query: { status?: string; pincode?: string }): Promise<Pickup[]> => {
            return pickups.filter(p => 
                (!query.status || p.status === query.status) &&
                (!query.pincode || p.pincode === query.pincode)
            );
        },
        findById: async (id: string): Promise<Pickup | null> => {
            return pickups.find(p => p._id === id) || null;
        },
        updateOne: async (query: { _id: string }, update: Partial<Pickup>): Promise<void> => {
            const index = pickups.findIndex(p => p._id === query._id);
            if (index !== -1) {
                pickups[index] = { ...pickups[index], ...update };
            }
        }
    }
};

// Create a default test user
(async () => {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash("test1234", salt);
    
    await MockDB.users.create({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        role: "USER",
        points: 100,
        location: { pincode: "12345" }
    });

    console.log("✅ Mock database initialized with test user (test@example.com / test1234)");
})();
