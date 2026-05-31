"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaRegGem } from "react-icons/fa";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email) {
            toast.error(
                "Please enter your email"
            );
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        email,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                toast.error(
                    data.message ||
                    "Something went wrong"
                );

                return;
            }

            toast.success(
                "Reset link sent to your email"
            );

            setEmail("");
        } catch (error) {
            toast.error(
                "Something went wrong"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="login-page">
            <form
                className="login-form"
                onSubmit={handleSubmit}
            >
                <div className="auth-brand">
                    <FaRegGem className="auth-brand-icon" />

                    <span>Eventora</span>
                </div>

                <p className="auth-label">
                    Password Recovery
                </p>

                <h1>
                    Forgot Your Password?
                </h1>

                <p className="auth-subtitle">
                    Enter your email address
                    and we'll send you a
                    password reset link.
                </p>

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Sending..."
                        : "Send Reset Link"}
                </button>

                <p className="auth-switch-text">
                    Remember your password?
                    <span
                        className="auth-switch-link"
                        onClick={() =>
                            router.push(
                                "/login"
                            )
                        }
                    >
                        {" "}
                        Login
                    </span>
                </p>
            </form>
        </main>
    );
}