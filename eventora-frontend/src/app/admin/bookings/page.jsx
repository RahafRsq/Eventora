"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { useRouter } from "next/navigation";
import {
    FaArrowLeft,
    FaCalendarCheck,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaSearch,
    FaCheck,
    FaTimes,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaStar,
} from "react-icons/fa";

import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token) {
            router.push("/login");
            return;
        }

        if (userData) {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.role !== "admin") {
                router.push("/");
                return;
            }
        }

        fetchBookings();
    }, [router]);

    async function fetchBookings() {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setBookings(Array.isArray(data) ? data : data.bookings || []);
        } catch (error) {
            console.log(error);
            setBookings([]);
        }
    }

    async function updateStatus(id, status) {
        try {
            const token = localStorage.getItem("token");
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
            fetchBookings();
        } catch (error) {
            console.log(error);
        }
    }

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const matchesSearch =
                booking.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.eventType?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "All" || booking.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [bookings, searchTerm, statusFilter]);

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
    const confirmedBookings = bookings.filter((b) => b.status === "Confirmed").length;
    const cancelledBookings = bookings.filter((b) => b.status === "Cancelled").length;

    const totalRevenue = bookings
        .filter((b) => b.status === "Confirmed")
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const upcomingEvents = bookings.filter(
        (b) => new Date(b.eventDate) > new Date()
    ).length;

    const eventTypesCount = {};
    bookings.forEach((b) => {
        if (!b.eventType) return;
        eventTypesCount[b.eventType] = (eventTypesCount[b.eventType] || 0) + 1;
    });

    const mostPopularEvent =
        Object.keys(eventTypesCount).length > 0
            ? Object.keys(eventTypesCount).reduce((a, b) =>
                eventTypesCount[a] > eventTypesCount[b] ? a : b
            )
            : "N/A";

    function getStatusClass(status) {
        if (status === "Confirmed") return "approved-pill";
        if (status === "Cancelled") return "rejected-pill";
        return "pending-pill";
    }

    function StatusIcon({ status }) {
        if (status === "Confirmed")
            return <FaCheckCircle style={{ color: "#28a745" }} />;
        if (status === "Cancelled")
            return <FaTimesCircle style={{ color: "#dc3545" }} />;
        return <FaClock style={{ color: "#ffc107" }} />;
    }

    return (
        <main className="booking-page my-bookings-page admin-page">
            <Navbar />

            <Container>
                <Button
                    className="back-booking-btn"
                    onClick={() => router.push("/")}
                >
                    <FaArrowLeft />
                </Button>

                <div className="admin-header">
                    <div>
                        <p>Admin Dashboard</p>
                        <h1>Bookings Management</h1>
                        <span>Review, confirm, and manage all customer reservations.</span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="admin-stats-grid">
                    <Card className="admin-stat-card">
                        <div className="admin-stat-left">
                            <div className="admin-stat-icon">
                                <FaCalendarCheck />
                            </div>
                            <div className="admin-stat-content">
                                <h2>{totalBookings}</h2>
                                <p>Total Bookings</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="admin-stat-card">
                        <div className="admin-stat-left">
                            <div className="admin-stat-icon pending-icon">
                                <FaClock />
                            </div>
                            <div className="admin-stat-content">
                                <h2>{pendingBookings}</h2>
                                <p>Pending</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="admin-stat-card">
                        <div className="admin-stat-left">
                            <div className="admin-stat-icon approved-icon">
                                <FaCheckCircle />
                            </div>
                            <div className="admin-stat-content">
                                <h2>{confirmedBookings}</h2>
                                <p>Confirmed</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="admin-stat-card">
                        <div className="admin-stat-left">
                            <div className="admin-stat-icon rejected-icon">
                                <FaTimesCircle />
                            </div>
                            <div className="admin-stat-content">
                                <h2>{cancelledBookings}</h2>
                                <p>Cancelled</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="admin-table-card">
                    <div className="admin-table-header">
                        <div>
                            <h2>Recent Bookings</h2>
                            <p>Showing {filteredBookings.length} reservation results.</p>
                        </div>

                        { }
                        <Card className="admin-stat-card">
                            <div className="admin-stat-left">
                                <div className="admin-stat-icon approved-icon">
                                    <FaMoneyBillWave />
                                </div>
                                <div className="admin-stat-content">
                                    <h2>{totalRevenue} JD</h2>
                                    <p>Total Revenue</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="admin-stat-card">
                            <div className="admin-stat-left">
                                <div className="admin-stat-icon">
                                    <FaCalendarAlt />
                                </div>
                                <div className="admin-stat-content">
                                    <h2>{upcomingEvents}</h2>
                                    <p>Upcoming Events</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="admin-stat-card">
                            <div className="admin-stat-left">
                                <div className="admin-stat-icon pending-icon">
                                    <FaStar />
                                </div>
                                <div className="admin-stat-content">
                                    <h2>{mostPopularEvent}</h2>
                                    <p>Most Popular Event</p>
                                </div>
                            </div>
                        </Card>

                        <div className="admin-toolbar">
                            <div className="admin-search-box">
                                <FaSearch />
                                <input
                                    type="text"
                                    placeholder="Search customer or event..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <select
                                className="admin-filter-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Package</th>
                                    <th>Event</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Location</th>
                                    <th>Guests</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                    <th>Status</th>

                                </tr>
                            </thead>

                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td>
                                            <strong>{booking.user?.fullName}</strong>
                                            <span>{booking.user?.email}</span>
                                        </td>
                                        <td>{booking.package?.name}</td>
                                        <td>{booking.eventType}</td>
                                        <td>
                                            {booking.eventDate
                                                ? new Date(booking.eventDate).toLocaleDateString()
                                                : ""}
                                        </td>
                                        <td>{booking.eventTime}</td>
                                        <td className="location-cell">{booking.eventLocation}</td>
                                        <td>{booking.guestsCount}</td>
                                        <td>{booking.phoneNumber}</td>

                                        { }
                                        <td>
                                            <div className="table-actions">
                                                <Button
                                                    className="table-approve-btn"
                                                    onClick={() => updateStatus(booking._id, "Confirmed")}
                                                    disabled={booking.status === "Confirmed"}
                                                >
                                                    <FaCheck />
                                                </Button>

                                                <Button
                                                    className="table-reject-btn"
                                                    onClick={() => updateStatus(booking._id, "Cancelled")}
                                                    disabled={booking.status === "Cancelled"}
                                                >
                                                    <FaTimes />
                                                </Button>
                                            </div>
                                        </td>

                                        { }
                                        <td>
                                            <StatusIcon status={booking.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </Container>

            <Footer />
        </main>
    );
}