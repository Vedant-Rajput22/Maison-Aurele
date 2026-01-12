import type { ReactNode } from "react";

// Auth pages have their own full-screen layout without header/footer
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "var(--parchment)",
                color: "var(--espresso)",
            }}
        >
            {children}
        </div>
    );
}
