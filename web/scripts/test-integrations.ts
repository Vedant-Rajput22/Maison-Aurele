/**
 * Integration Test Script
 * Run: npx tsx scripts/test-integrations.ts
 */

import { config } from "dotenv";
config();

async function testCloudinary() {
    console.log("\n📷 Testing Cloudinary...");

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        console.log("  ❌ Missing Cloudinary credentials");
        return false;
    }

    try {
        // Test by fetching account info
        const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
            headers: { Authorization: `Basic ${auth}` },
        });

        if (res.ok) {
            const data = await res.json();
            console.log(`  ✅ Cloudinary connected!`);
            console.log(`     Cloud: ${cloudName}`);
            console.log(`     Plan: ${data.plan || "Free"}`);
            return true;
        } else {
            const errorText = await res.text();
            console.log(`  ❌ Cloudinary error: ${res.status}`);
            console.log(`     Cloud Name: "${cloudName}"`);
            console.log(`     API Key: "${apiKey?.substring(0, 5)}..."`);
            console.log(`     Response: ${errorText.substring(0, 100)}`);
            return false;
        }
    } catch (err) {
        console.log(`  ❌ Cloudinary error: ${err}`);
        return false;
    }
}

async function testUpstash() {
    console.log("\n🔒 Testing Upstash Redis...");

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        console.log("  ⚠️  Upstash not configured (optional)");
        return true; // Not required
    }

    try {
        // Test by setting and getting a value
        const setRes = await fetch(`${url}/set/test_key/hello`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!setRes.ok) throw new Error("SET failed");

        const getRes = await fetch(`${url}/get/test_key`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!getRes.ok) throw new Error("GET failed");

        const data = await getRes.json();
        if (data.result === "hello") {
            console.log("  ✅ Upstash Redis connected!");
            console.log(`     URL: ${url.split("@")[1] || url.substring(0, 40)}...`);

            // Clean up test key
            await fetch(`${url}/del/test_key`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return true;
        } else {
            throw new Error("Unexpected response");
        }
    } catch (err) {
        console.log(`  ❌ Upstash error: ${err}`);
        return false;
    }
}

async function testResend() {
    console.log("\n📧 Testing Resend...");

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.log("  ⚠️  Resend not configured (optional for dev)");
        return true;
    }

    try {
        // Test by fetching domains (doesn't send an email)
        const res = await fetch("https://api.resend.com/domains", {
            headers: { Authorization: `Bearer ${apiKey}` },
        });

        if (res.ok) {
            const data = await res.json();
            console.log("  ✅ Resend connected!");
            console.log(`     Domains: ${data.data?.length || 0} configured`);
            return true;
        } else if (res.status === 401) {
            console.log("  ❌ Resend: Invalid API key");
            return false;
        } else {
            console.log(`  ❌ Resend error: ${res.status}`);
            return false;
        }
    } catch (err) {
        console.log(`  ❌ Resend error: ${err}`);
        return false;
    }
}

async function testDatabase() {
    console.log("\n🗄️  Testing Database...");

    const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

    if (!dbUrl) {
        console.log("  ❌ No DATABASE_URL configured");
        return false;
    }

    try {
        // Import prisma dynamically
        const { prisma } = await import("../src/lib/prisma");

        // Test connection with a simple query
        await prisma.$queryRaw`SELECT 1`;

        const userCount = await prisma.user.count();
        const productCount = await prisma.product.count();

        console.log("  ✅ Database connected!");
        console.log(`     Users: ${userCount}`);
        console.log(`     Products: ${productCount}`);

        await prisma.$disconnect();
        return true;
    } catch (err) {
        console.log(`  ❌ Database error: ${err}`);
        return false;
    }
}

async function main() {
    console.log("═══════════════════════════════════════");
    console.log("   Maison Aurèle Integration Tests");
    console.log("═══════════════════════════════════════");

    const results = {
        database: await testDatabase(),
        cloudinary: await testCloudinary(),
        upstash: await testUpstash(),
        resend: await testResend(),
    };

    console.log("\n═══════════════════════════════════════");
    console.log("   Summary");
    console.log("═══════════════════════════════════════");

    for (const [name, passed] of Object.entries(results)) {
        const icon = passed ? "✅" : "❌";
        console.log(`  ${icon} ${name.charAt(0).toUpperCase() + name.slice(1)}`);
    }

    const allPassed = Object.values(results).every(Boolean);
    console.log("\n" + (allPassed ? "🎉 All tests passed!" : "⚠️  Some tests failed"));

    process.exit(allPassed ? 0 : 1);
}

main();
