import { User, DisposalRequest, Pickup, DropOffPoint } from "./types";

export class DB {
    static users: User[] = [
        { id: "u1", name: "Alice", email: "alice@example.com", role: "USER", points: 100 },
        { id: "r1", name: "Bob Recycler", email: "bob@recycle.com", role: "RECYCLER", points: 0 },
        { id: "a1", name: "Admin", email: "admin@eclear.com", role: "ADMIN", points: 0 }
    ];

    static requests: DisposalRequest[] = [];

    static pickups: Pickup[] = [];

    static dropOffPoints: DropOffPoint[] = [
        { id: "d1", name: "Central Mall", address: "101 Main St", capacity: 100, currentLoad: 45, active: true },
        { id: "d2", name: "City Library", address: "55 Library Ln", capacity: 50, currentLoad: 10, active: true }
    ];
}
