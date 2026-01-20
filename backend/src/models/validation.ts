import { z } from "zod";

export const disposalSchema = z.object({
    userId: z.string(),
    items: z.array(z.object({
        type: z.enum(["LAPTOP", "MOBILE", "BATTERY", "OTHER"]),
        quantity: z.number().min(1)
    })),
    location: z.object({
        address: z.string(),
        zipCode: z.string().length(5)
    })
});

export const schedulePickupSchema = z.object({
    zipCode: z.string().length(5)
});

export const confirmPickupSchema = z.object({
    pickupId: z.string()
});
