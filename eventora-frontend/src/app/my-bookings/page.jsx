"use client";

import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import {
    FaArrowLeft,
    FaArrowRight,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaCreditCard,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaTimesCircle,
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);

    const [editForm, setEditForm] = useState({
        eventDate: "",
        eventTime: "",
        eventLocation: "",
        guestsCount: "",
        phoneNumber: "",
        notes: "",
    });

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        fetchBookings(token);
    }, [router]);

    async function fetchBookings(token) {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my-bookings`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            setBookings(data.bookings || []);
        } catch {
            setBookings([]);
        } finally {
            setIsLoading(false);
        }
    }

    function getCountdownText(eventDate) {
        const today = new Date();
        const event = new Date(eventDate);

        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);

        const diffTime = event.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "Event date has passed";
        if (diffDays === 0) return "Event is today";
        if (diffDays === 1) return "Event is tomorrow";

        return `Event starts in ${diffDays} days`;
    }

    function openEditModal(booking) {
        setEditingBooking(booking);

        setEditForm({
            eventDate: booking.eventDate ? booking.eventDate.split("T")[0] : "",
            eventTime: booking.eventTime || "",
            eventLocation: booking.eventLocation || "",
            guestsCount: booking.guestsCount || "",
            phoneNumber: booking.phoneNumber || "",
            notes: booking.notes || "",
        });

        setShowEditModal(true);
    }

    function closeEditModal() {
        if (isUpdating) return;

        setShowEditModal(false);
        setEditingBooking(null);
    }

    function handleEditChange(e) {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value,
        });
    }

    async function submitEditBooking(e) {
        e.preventDefault();

        if (!editingBooking) return;

        try {
            setIsUpdating(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/edit/${editingBooking._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        eventDate: editForm.eventDate,
                        eventTime: editForm.eventTime,
                        eventLocation: editForm.eventLocation,
                        guestsCount: Number(editForm.guestsCount),
                        phoneNumber: editForm.phoneNumber,
                        notes: editForm.notes,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            await fetchBookings(token);

            setShowEditModal(false);
            setEditingBooking(null);
        } catch {
            alert("Failed to update booking");
        } finally {
            setIsUpdating(false);
        }
    }

    function cancelBooking(bookingId) {
        setSelectedBookingId(bookingId);
        setShowCancelModal(true);
    }

    async function confirmCancelBooking() {
        try {
            setIsCancelling(selectedBookingId);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/cancel/${selectedBookingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status: "Cancelled",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            await fetchBookings(token);

            setShowCancelModal(false);
            setSelectedBookingId(null);
        } catch {
            alert("Failed to cancel booking");
        } finally {
            setIsCancelling("");
        }
    }

    function closeCancelModal() {
        if (isCancelling) return;

        setShowCancelModal(false);
        setSelectedBookingId(null);
    }

    function getStatusClass(status) {
        if (status === "Confirmed") return "my-approved";
        if (status === "Cancelled") return "my-rejected";
        return "my-pending";
    }

    function getPaymentClass(paymentStatus) {
        if (paymentStatus === "Paid") return "my-approved";
        if (paymentStatus === "Failed") return "my-rejected";
        return "my-pending";
    }

    function getStatusIcon(status) {
        if (status === "Confirmed") return <FaCheckCircle />;
        if (status === "Cancelled") return <FaTimesCircle />;
        return <FaClock />;
    }

    function getPaymentIcon(paymentStatus) {
        if (paymentStatus === "Paid") return <FaCheckCircle />;
        if (paymentStatus === "Failed") return <FaTimesCircle />;
        return <FaClock />;
    }

    return (
        <main className="booking-page my-bookings-page">
            <Navbar />

            <section className="booking-main-section">
                <Container>
                    <Row>
                        <Col lg={11} className="mx-auto">
                            <Button
                                className="back-booking-btn"
                                onClick={() => router.push("/")}
                            >
                                <FaArrowLeft />
                            </Button>

                            <div className="my-bookings-hero">
                                <p>Your Event Journey</p>

                                <h1>My Bookings</h1>

                                <span>
                                    Track every reservation, review your event details, and follow
                                    your booking status in one elegant place.
                                </span>
                            </div>
                        </Col>
                    </Row>

                    {isLoading ? (
                        <Row className="g-4 my-bookings-list">
                            {[1, 2].map((item) => (
                                <Col lg={11} className="mx-auto" key={item}>
                                    <Card className="my-booking-card skeleton-booking-card">
                                        <div className="skeleton-line skeleton-title"></div>
                                        <div className="skeleton-line skeleton-subtitle"></div>
                                        <div className="my-booking-line"></div>

                                        <div className="skeleton-grid">
                                            {[...Array(6)].map((_, i) => (
                                                <div className="skeleton-box" key={i}></div>
                                            ))}
                                        </div>

                                        <div className="skeleton-note"></div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : bookings.length === 0 ? (
                        <Row>
                            <Col lg={11} className="mx-auto">
                                <div className="my-bookings-empty">
                                    <FaCalendarAlt className="empty-booking-icon" />

                                    <h2>No Bookings Yet</h2>

                                    <p>
                                        You have not submitted any event reservation yet. Explore our
                                        packages and start planning your special moment.
                                    </p>

                                    <Button
                                        className="book-btn"
                                        onClick={() => router.push("/#packages")}
                                    >
                                        Browse Packages <FaArrowRight />
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    ) : (
                        <Row className="g-4 my-bookings-list">
                            {bookings
                                .filter((booking) => booking.status !== "Cancelled")
                                .map((booking) => (
                                    <Col lg={11} className="mx-auto" key={booking._id}>
                                        <Card className="my-booking-card">
                                            <div className="my-booking-header-row">
                                                <div>
                                                    <p>Selected Package</p>

                                                    <h2>{booking.package?.name} Package</h2>

                                                    <span>{booking.package?.subtitle}</span>
                                                </div>

                                                <div className="my-booking-statuses">
                                                    <div
                                                        className={`my-status ${getStatusClass(
                                                            booking.status
                                                        )}`}
                                                    >
                                                        {getStatusIcon(booking.status)}
                                                        <span>Booking: {booking.status}</span>
                                                    </div>

                                                    <div
                                                        className={`my-status ${getPaymentClass(
                                                            booking.paymentStatus
                                                        )}`}
                                                    >
                                                        {getPaymentIcon(booking.paymentStatus)}
                                                        <span>
                                                            Payment: {booking.paymentStatus || "Pending"}
                                                        </span>
                                                    </div>

                                                    {booking.status === "Pending" && (
                                                        <div className="booking-action-buttons">
                                                            <Button
                                                                className="edit-booking-btn"
                                                                onClick={() => openEditModal(booking)}
                                                            >
                                                                Edit Booking
                                                            </Button>

                                                            <Button
                                                                className="cancel-booking-btn"
                                                                onClick={() => cancelBooking(booking._id)}
                                                                disabled={isCancelling === booking._id}
                                                            >
                                                                {isCancelling === booking._id
                                                                    ? "Cancelling..."
                                                                    : "Cancel Booking"}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="my-booking-line"></div>

                                            <div className="booking-countdown">
                                                <FaCalendarAlt />

                                                <span>{getCountdownText(booking.eventDate)}</span>
                                            </div>

                                            <div className="my-booking-details">
                                                <div>
                                                    <span>Event Type</span>
                                                    <strong>{booking.eventType}</strong>
                                                </div>

                                                <div>
                                                    <span>Event Date</span>
                                                    <strong>
                                                        {booking.eventDate
                                                            ? new Date(booking.eventDate).toLocaleDateString()
                                                            : ""}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>Event Time</span>
                                                    <strong>{booking.eventTime}</strong>
                                                </div>

                                                <div>
                                                    <span>Guests</span>
                                                    <strong>{booking.guestsCount}</strong>
                                                </div>

                                                <div>
                                                    <span>Phone</span>
                                                    <strong>{booking.phoneNumber}</strong>
                                                </div>

                                                <div>
                                                    <span>Payment</span>
                                                    <strong>
                                                        {booking.paymentMethod === "Cash" ? (
                                                            <FaMoneyBillWave />
                                                        ) : (
                                                            <FaCreditCard />
                                                        )}{" "}
                                                        {booking.paymentMethod || "Cash"}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div className="booking-bottom-row">
                                                <div className="booking-location-box">
                                                    <span>Location</span>

                                                    <strong>
                                                        <FaMapMarkerAlt /> {booking.eventLocation}
                                                    </strong>
                                                </div>

                                                {booking.notes && (
                                                    <div className="my-booking-notes">
                                                        <span>Extra Notes</span>

                                                        <p>{booking.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                        </Row>
                    )}
                </Container>
            </section>

            <Modal
                centered
                show={showEditModal}
                onHide={closeEditModal}
                dialogClassName="eventora-modal edit-booking-modal"
            >
                <Modal.Body className="edit-modal-body">
                    <h3>Edit Booking</h3>

                    <p>
                        You can update your pending booking details before the admin confirms it.
                    </p>

                    <form className="edit-booking-form" onSubmit={submitEditBooking}>
                        <label>Event Date</label>
                        <input
                            type="date"
                            name="eventDate"
                            value={editForm.eventDate}
                            onChange={handleEditChange}
                            required
                        />

                        <label>Event Time</label>
                        <input
                            type="time"
                            name="eventTime"
                            value={editForm.eventTime}
                            onChange={handleEditChange}
                            required
                        />

                        <label>Event Location</label>
                        <input
                            type="text"
                            name="eventLocation"
                            value={editForm.eventLocation}
                            onChange={handleEditChange}
                            required
                        />

                        <label>Guests Count</label>
                        <input
                            type="number"
                            name="guestsCount"
                            min="1"
                            value={editForm.guestsCount}
                            onChange={handleEditChange}
                            required
                        />

                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            pattern="07[0-9]{8}"
                            value={editForm.phoneNumber}
                            onChange={handleEditChange}
                            required
                        />

                        <label>Extra Notes</label>
                        <textarea
                            name="notes"
                            value={editForm.notes}
                            onChange={handleEditChange}
                        ></textarea>

                        <div className="edit-modal-actions">
                            <Button
                                type="button"
                                className="keep-booking-btn"
                                onClick={closeEditModal}
                                disabled={isUpdating}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                className="save-edit-btn"
                                disabled={isUpdating}
                            >
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal
                centered
                show={showCancelModal}
                onHide={closeCancelModal}
                dialogClassName="eventora-modal"
            >
                <Modal.Body className="cancel-modal-body">
                    <h3>Cancel Booking</h3>

                    <p>
                        Are you sure you want to cancel this booking? This action cannot be
                        undone.
                    </p>

                    <div className="cancel-modal-actions">
                        <Button
                            className="keep-booking-btn"
                            onClick={closeCancelModal}
                            disabled={!!isCancelling}
                        >
                            Keep Booking
                        </Button>

                        <Button
                            className="confirm-cancel-btn"
                            onClick={confirmCancelBooking}
                            disabled={!!isCancelling}
                        >
                            {isCancelling ? "Cancelling..." : "Confirm Cancel"}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Footer />
        </main>
    );
}