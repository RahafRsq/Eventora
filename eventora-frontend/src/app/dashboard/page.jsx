"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
        }
    }, []);

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#0b3d45",
                color: "white",
                padding: "40px",
            }}
        >
            <h1>Dashboard</h1>
            <p>Welcome to Eventora Dashboard</p>
        </main>
    );
}