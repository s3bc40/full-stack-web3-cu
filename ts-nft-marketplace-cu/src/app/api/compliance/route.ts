// src/app/api/circle-compliance/route.ts
import { v4 as uuidv4 } from 'uuid';

const CIRCLE_API_URL = 'https://api.circle.com/v1/w3s/compliance/screening/addresses';
const CIRCLE_API_KEY = process.env.CIRCLE_API_KEY;
const COMPLIANCE_ENABLES = process.env.ENABLE_COMPLIANCE_CHECK;
const HARDCODED_CHAIN = 'ETH-SEPOLIA';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { address } = body;

        if (COMPLIANCE_ENABLES !== 'true') {
            console.log('Compliance checks are disabled.');
            return Response.json({
                success: true, isApproved: true, data: {
                    result: "APPROVED",
                    message: "Compliance checks are disabled.",
                }
            });
        }
        if (!address) {
            return Response.json({ error: 'Missing address parameter', success: false });
        }
        if (!CIRCLE_API_KEY) {
            console.error('CIRCLE_API_KEY environment variable is not set.');
            return Response.json({ error: 'Internal server error', success: false });
        }

        const idempotencyKey = uuidv4();

        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CIRCLE_API_KEY}`,
            },
            body: JSON.stringify({
                idempotencyKey: idempotencyKey,
                address: address,
                chain: HARDCODED_CHAIN,
            }),
        };

        const response = await fetch(CIRCLE_API_URL, options);

        const data = await response.json();

        const isApproved = data?.data?.result === 'APPROVED';
        return Response.json({
            success: true,
            isApproved: isApproved,
            data: data?.data
        });

    } catch (error) {
        console.error('Error calling Circle Compliance API:', error);
        return Response.json({ error: 'Failed to call Circle Compliance API', status: 500, success: false });
    }
}