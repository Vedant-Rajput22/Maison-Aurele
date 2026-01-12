/**
 * Test Email Script
 * Run: npx tsx scripts/test-email.ts your@email.com
 */

import { config } from "dotenv";
config();

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.log("Usage: npx tsx scripts/test-email.ts your@email.com");
        process.exit(1);
    }

    console.log(`📧 Sending test email to ${email}...`);

    try {
        const { data, error } = await resend.emails.send({
            from: "Maison Aurèle <onboarding@resend.dev>", // Use resend.dev for testing
            to: email,
            subject: "Test Email from Maison Aurèle",
            html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px;">
          <h1 style="font-size: 24px; letter-spacing: 0.3em; color: #26180e;">MAISON AURÈLE</h1>
          <p style="color: #8a7a6a; font-size: 10px; letter-spacing: 0.4em;">PARIS · HAUTE COUTURE</p>
          <hr style="border: none; border-top: 1px solid #e8e4df; margin: 24px 0;">
          <p style="color: #5a4a3a; line-height: 1.8;">
            This is a test email to confirm your Resend integration is working correctly.
          </p>
          <p style="color: #5a4a3a; line-height: 1.8;">
            If you're reading this, your email system is configured properly! 🎉
          </p>
          <hr style="border: none; border-top: 1px solid #e8e4df; margin: 24px 0;">
          <p style="color: #b58f6f; font-size: 12px;">— The Maison Aurèle Team</p>
        </div>
      `,
        });

        if (error) {
            console.log("❌ Error:", error.message);
            process.exit(1);
        }

        console.log("✅ Email sent successfully!");
        console.log("   ID:", data?.id);
        console.log("\n📬 Check your inbox (and spam folder)!");
    } catch (err) {
        console.log("❌ Error:", err);
        process.exit(1);
    }
}

main();
