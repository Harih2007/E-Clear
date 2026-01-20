import axios from "axios";

const API_URL = "http://localhost:4000/api";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
    console.log("Starting Backend Verification (MongoDB Mode)...");

    // 1. Create a Test User
    console.log("\n1. Creating Test User...");
    try {
        const userRes = await axios.post(`${API_URL}/users`, {
            name: "Test User",
            email: `test${Date.now()}@example.com`,
            role: "USER",
            zipCode: "12345"
        });
        const userId = userRes.data.data._id;
        console.log(`Created User: ${userId}`);

        // 2. Check Drop-off Points
        console.log("\n2. Checking Drop-off Points...");
        const dropOffs = await axios.get(`${API_URL}/drop-off-points`);
        console.log(`Found ${dropOffs.data.data.length} drop-off points.`);

        // 3. Create Disposal Requests (Micro-pickup test)
        console.log("\n3. Testing Micro-pickup Logic (Creating 5 requests in zip 12345)...");

        const zipCode = "12345";
        const requests = [];

        for (let i = 0; i < 5; i++) {
            const res = await axios.post(`${API_URL}/dispose`, {
                userId: userId,
                items: [{ type: "LAPTOP", quantity: 1 }],
                location: { address: "123 Verified St", zipCode }
            });
            console.log(`Created Request ${i + 1}: Status=${res.data.data.status}`);
            requests.push(res.data.data);
            await sleep(200);
        }

        // 4. Trigger manual check (to ensure logic fired if not auto)
        const userRequests = await axios.get(`${API_URL}/user/${userId}/requests`);
        const latestReq = userRequests.data.data[userRequests.data.data.length - 1];

        // We expect the *earlier* requests to be SCHEDULED. The last one might be PENDING until the batch is full, or if the batch included it.
        // Actually, logic is: if pending >= 5, schedule 5. If we add 5 one by one, the 5th one triggers aggregation.
        // So all 5 should be SCHEDULED.
        console.log(`\nUser Request Final Count: ${userRequests.data.data.length}`);
        console.log(`Checking status of first request: ${userRequests.data.data[0].status}`);

        if (userRequests.data.data[0].status === "SCHEDULED") {
            console.log("✅ SUCCESS: Micro-pickup triggered, status updated to SCHEDULED.");
        } else {
            console.log("❌ FAILURE: Requests not aggregated (Status: " + userRequests.data.data[0].status + ")");
        }

        // 5. Confirm Pickup
        // Get scheduledPickupId from one of the requests
        const pickupId = userRequests.data.data[0].scheduledPickupId;
        if (pickupId) {
            console.log(`\n4. Confirming Pickup ${pickupId}...`);
            const confirm = await axios.patch(`${API_URL}/pickup/confirm`, { pickupId });
            console.log(`Pickup Confirmation: ${confirm.data.message}`);

            const updatedReq = await axios.get(`${API_URL}/user/${userId}/requests`);
            console.log(`User Request Final Status: ${updatedReq.data.data[0].status}`); // Should be COLLECTED
        }
    } catch (err: any) {
        console.error("Verification Failed:", err.response?.data || err.message);
    }

}

main().catch(err => console.error(err));
