"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaRegGem } from "react-icons/fa";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();


    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Please fill in all required fields");
            toast.error("Please fill in all required fields");
            return;
        }

        if (!isLogin && !formData.fullName) {
            setError("Please enter your full name");
            toast.error("Please enter your full name");
            return;
        }

        if (!isLogin && formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");
            return;
        }

        setIsSubmitting(true);

        const url = isLogin
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`;

        const bodyData = isLogin
            ? { email: formData.email, password: formData.password }
            : {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
            };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Something went wrong");
                toast.error(data.message || "Something went wrong");
                return;
            }

            if (isLogin) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                toast.success("Welcome back to Eventora");
                router.push("/");
            } else {
                toast.success("Account created successfully. Please login.");
                setIsLogin(true);
            }

            setFormData({
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            setError("Something went wrong");
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    function switchMode() {
        setIsLogin(!isLogin);
        setError("");

        setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
    }

    return (
        <main className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="auth-brand">
                    <FaRegGem className="auth-brand-icon" />
                    <span>Eventora</span>
                </div>

                <p className="auth-label">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </p>

                <h1>{isLogin ? "Login to your account" : "Join Eventora"}</h1>

                <p className="auth-subtitle">
                    {isLogin
                        ? "Access your bookings and continue planning your special moments."
                        : "Create an account to book elegant event packages easily."}
                </p>

                {!isLogin && (
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                {isLogin && (
                    <p
                        className="forgot-password-link"
                        onClick={() =>
                            router.push("/forgot-password")
                        }
                    >
                        Forgot Password?
                    </p>
                )}

                {!isLogin && (
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                )}

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Register"}
                </button>

                <p className="auth-switch-text">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span className="auth-switch-link" onClick={switchMode}>
                        {isLogin ? " Register" : " Login"}
                    </span>
                </p>
            </form>
        </main>
    );
}