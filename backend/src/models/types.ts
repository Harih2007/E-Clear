export type UserRole = "USER" | "RECYCLER" | "ADMIN";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    points: number;
}

export interface DisposalRequest {
    id: string;
    userId: string;
    items: DisposalItem[];
    location: {
        address: string;
        zipCode: string;
    };
    status: "PENDING" | "SCHEDULED" | "COLLECTED";
    scheduledPickupId?: string;
    totalIncentive: number;
    createdAt: Date;
}

export interface DisposalItem {
    type: "LAPTOP" | "MOBILE" | "BATTERY" | "OTHER";
    quantity: number;
}

export interface Pickup {
    id: string;
    recyclerId?: string;
    requestIds: string[];
    zipCode: string;
    status: "PENDING" | "ASSIGNED" | "COMPLETED";
    scheduledDate?: Date;
}

export interface DropOffPoint {
    id: string;
    name: string;
    address: string;
    capacity: number;
    currentLoad: number;
    active: boolean;
}
