"use client";

import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { FaRegGem, FaBars, FaTimes } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);

        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.classList.toggle("menu-open-body", menuOpen);
        return () => document.body.classList.remove("menu-open-body");
    }, [menuOpen]);

    function closeMenu() {
        setMenuOpen(false);
    }

    function goToLogin() {
        closeMenu();
        router.push("/login");
    }

    function goToRegister() {
        closeMenu();
        router.push("/login?mode=register");
    }

    function confirmLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setShowLogoutModal(false);
        closeMenu();
        toast.success("Logged out successfully");
        router.push("/login");
    }

    return (
        <>
            <header className={`site-navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
                <Container className="navbar-content">
                    <div className="brand" onClick={() => router.push("/")}>
                        <FaRegGem className="brand-icon" />
                        <span>Eventora</span>
                    </div>

                    <nav className="nav-links">
                        <a href="/#home" className={pathname === "/" ? "active-nav" : ""}>
                            Home
                        </a>
                        <a href="/#about">About</a>
                        <a href="/#services">Services</a>
                        <a href="/#packages">Packages</a>
                        <a href="/#contact">Contact</a>

                        {user && (
                            <a
                                href={user.role === "admin" ? "/admin/bookings" : "/my-bookings"}
                                className={
                                    pathname === "/admin/bookings" || pathname === "/my-bookings"
                                        ? "active-nav"
                                        : ""
                                }
                            >
                                {user.role === "admin" ? "Admin Panel" : "My Bookings"}
                            </a>
                        )}
                    </nav>

                    <div className="nav-actions">
                        {user ? (
                            <>
                                {user.role !== "admin" && (
                                    <span className="user-name">Hi, {user.fullName}</span>
                                )}

                                <Button
                                    className="signup-btn"
                                    onClick={() => setShowLogoutModal(true)}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button className="login-btn" onClick={goToLogin}>
                                    Login
                                </Button>

                                <Button className="signup-btn" onClick={goToRegister}>
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>

                    <button className="menu-btn" onClick={() => setMenuOpen(true)}>
                        <FaBars />
                    </button>
                </Container>
            </header>

            <aside className={`side-menu ${menuOpen ? "side-menu-open" : ""}`}>
                <button className="close-menu" onClick={closeMenu}>
                    <FaTimes />
                </button>

                <div className="side-menu-brand">
                    <FaRegGem className="side-menu-icon" />
                    <span>Eventora</span>
                </div>

                <a href="/#home" onClick={closeMenu}>
                    Home
                </a>
                <a href="/#about" onClick={closeMenu}>
                    About
                </a>
                <a href="/#services" onClick={closeMenu}>
                    Services
                </a>
                <a href="/#packages" onClick={closeMenu}>
                    Packages
                </a>
                <a href="/#contact" onClick={closeMenu}>
                    Contact
                </a>

                {user && (
                    <a
                        href={user.role === "admin" ? "/admin/bookings" : "/my-bookings"}
                        onClick={closeMenu}
                    >
                        {user.role === "admin" ? "Admin Panel" : "My Bookings"}
                    </a>
                )}

                <div className="side-menu-actions">
                    {user ? (
                        <Button
                            className="signup-btn"
                            onClick={() => setShowLogoutModal(true)}
                        >
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button className="login-btn side-login-btn" onClick={goToLogin}>
                                Login
                            </Button>

                            <Button className="signup-btn" onClick={goToRegister}>
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </aside>

            {menuOpen && (
                <button className="page-click-area" onClick={closeMenu}></button>
            )}

            {showLogoutModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <h2>Logout from Eventora?</h2>

                        <p>
                            Are you sure you want to end your current session and return to
                            the login page?
                        </p>

                        <div className="logout-modal-actions">
                            <Button
                                className="logout-cancel-btn"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Cancel
                            </Button>

                            <Button className="logout-confirm-btn" onClick={confirmLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}