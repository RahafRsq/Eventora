"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaRegGem } from "react-icons/fa";

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error("Please fill all fields");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password/${params.token}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Something went wrong");
                return;
            }

            toast.success("Password reset successfully");

            router.push("/login");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="auth-brand">
                    <FaRegGem className="auth-brand-icon" />
                    <span>Eventora</span>
                </div>

                <p className="auth-label">Create New Password</p>

                <h1>Reset Password</h1>

                <p className="auth-subtitle">
                    Enter your new password below to recover your Eventora
                    account.
                </p>

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>

                <p className="auth-switch-text">
                    Remember your password?
                    <span
                        className="auth-switch-link"
                        onClick={() => router.push("/login")}
                    >
                        {" "}
                        Login
                    </span>
                </p>
            </form>
        </main>
    );
}