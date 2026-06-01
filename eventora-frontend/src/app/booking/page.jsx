"use client";

import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Container,
    Row,
    Spinner,
} from "react-bootstrap";

import { useRouter } from "next/navigation";

import {
    FaArrowLeft,
    FaCheckCircle,
    FaCreditCard,
    FaMoneyBillWave,
} from "react-icons/fa";

import { toast } from "react-toastify";

import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default function BookingPage() {
    const [selectedPackage, setSelectedPackage] =
        useState(null);

    const [user, setUser] = useState(null);

    const [showSuccess, setShowSuccess] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [formData, setFormData] = useState({
        eventType: "",
        eventDate: "",
        eventTime: "",
        eventLocation: "",
        guestsCount: "",
        phoneNumber: "",
        notes: "",

        paymentMethod: "Cash",

        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    const router = useRouter();

    const today = new Date()
        .toISOString()
        .split("T")[0];

    useEffect(() => {
        const token = localStorage.getItem("token");

        const userData =
            localStorage.getItem("user");

        const packageData =
            localStorage.getItem("selectedPackage");

        if (!token) {
            router.push("/login");
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }

        if (packageData) {
            setSelectedPackage(
                JSON.parse(packageData)
            );
        } else {
            router.push("/");
        }
    }, [router]);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const token =
                localStorage.getItem("token");

            const bookingData = {
                package: selectedPackage?._id,

                eventType: formData.eventType,

                eventDate: formData.eventDate,

                eventTime: formData.eventTime,

                eventLocation:
                    formData.eventLocation,

                guestsCount: Number(
                    formData.guestsCount
                ),

                phoneNumber:
                    formData.phoneNumber,

                notes: formData.notes,

                paymentMethod:
                    formData.paymentMethod,

                totalPrice: selectedPackage.price,
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify(
                        bookingData
                    ),
                }
            );

            const data =
                await response.json();

            if (response.ok) {
                toast.success(
                    "Booking submitted successfully!"
                );

                setShowSuccess(true);

                setFormData({
                    eventType: "",
                    eventDate: "",
                    eventTime: "",
                    eventLocation: "",
                    guestsCount: "",
                    phoneNumber: "",
                    notes: "",

                    paymentMethod: "Cash",

                    cardNumber: "",
                    expiryDate: "",
                    cvv: "",
                });
            } else {
                toast.error(
                    data.message ||
                    "Something went wrong"
                );
            }
        } catch (error) {
            console.log(error);

            toast.error(
                "Something went wrong!"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!selectedPackage) {
        return (
            <main className="booking-page">
                <Navbar />

                <section className="booking-main-section">
                    <Container>
                        <Button
                            className="back-booking-btn"
                            onClick={() =>
                                router.push("/")
                            }
                        >
                            <FaArrowLeft />
                        </Button>

                        <div className="booking-header booking-header-spaced">
                            <p>
                                Complete Your Reservation
                            </p>

                            <h1>
                                Book Your Event
                            </h1>

                            <span>
                                Fill in your event details
                                and submit your booking
                                request.
                            </span>
                        </div>

                        <Row className="g-4 align-items-stretch booking-layout">
                            <Col lg={7}>
                                <Card className="booking-card booking-equal-card">
                                    <h2>Event Details</h2>

                                    <form
                                        className="booking-form"
                                        onSubmit={handleSubmit}
                                    >
                                        <label>
                                            Event Type
                                        </label>

                                        <select
                                            name="eventType"
                                            value={
                                                formData.eventType
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >
                                            <option value="">
                                                Choose event type
                                            </option>

                                            <option value="Wedding">
                                                Wedding
                                            </option>

                                            <option value="Birthday">
                                                Birthday
                                            </option>

                                            <option value="Graduation">
                                                Graduation
                                            </option>

                                            <option value="Corporate">
                                                Corporate
                                            </option>
                                        </select>

                                        <label>
                                            Event Date
                                        </label>

                                        <input
                                            type="date"
                                            name="eventDate"
                                            min={today}
                                            value={
                                                formData.eventDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <label>
                                            Event Time
                                        </label>

                                        <input
                                            type="time"
                                            name="eventTime"
                                            value={
                                                formData.eventTime
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <label>
                                            Event Location
                                        </label>

                                        <input
                                            type="text"
                                            name="eventLocation"
                                            placeholder="Amman, Fairmont Hotel..."
                                            value={
                                                formData.eventLocation
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <label>
                                            Number of Guests
                                        </label>

                                        <input
                                            type="number"
                                            name="guestsCount"
                                            min="1"
                                            placeholder="120"
                                            value={
                                                formData.guestsCount
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <label>
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            pattern="07[0-9]{8}"
                                            title="Please enter a valid Jordanian phone number"
                                            placeholder="07XXXXXXXX"
                                            value={
                                                formData.phoneNumber
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <label>
                                            Payment Method
                                        </label>

                                        <div className="payment-options">
                                            <label className="payment-option">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="Cash"
                                                    checked={
                                                        formData.paymentMethod ===
                                                        "Cash"
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                                <FaMoneyBillWave />

                                                Cash
                                            </label>

                                            <label className="payment-option">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="Credit Card"
                                                    checked={
                                                        formData.paymentMethod ===
                                                        "Credit Card"
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                                <FaCreditCard />

                                                Credit Card
                                            </label>
                                        </div>

                                        {formData.paymentMethod ===
                                            "Credit Card" && (
                                                <>
                                                    <label>
                                                        Card Number
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        placeholder="1234 5678 9012 3456"
                                                        value={
                                                            formData.cardNumber
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    />

                                                    <Row>
                                                        <Col>
                                                            <label>
                                                                Expiry Date
                                                            </label>

                                                            <input
                                                                type="text"
                                                                name="expiryDate"
                                                                placeholder="MM/YY"
                                                                value={
                                                                    formData.expiryDate
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            />
                                                        </Col>

                                                        <Col>
                                                            <label>
                                                                CVV
                                                            </label>

                                                            <input
                                                                type="password"
                                                                name="cvv"
                                                                placeholder="123"
                                                                value={
                                                                    formData.cvv
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            />
                                                        </Col>
                                                    </Row>
                                                </>
                                            )}

                                        <label>
                                            Extra Notes
                                        </label>

                                        <textarea
                                            name="notes"
                                            placeholder="Tell us any special details..."
                                            value={
                                                formData.notes
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        ></textarea>

                                        <Button
                                            className="book-btn"
                                            type="submit"
                                            disabled={
                                                isSubmitting
                                            }
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Spinner
                                                        animation="border"
                                                        size="sm"
                                                        className="me-2"
                                                    />

                                                    Processing...
                                                </>
                                            ) : (
                                                "Confirm Booking"
                                            )}
                                        </Button>
                                    </form>
                                </Card>
                            </Col>

                            <Col lg={5}>
                                <Card className="booking-summary-card booking-equal-card">
                                    <p className="summary-label">
                                        Selected Package
                                    </p>

                                    <h2>
                                        {selectedPackage.name}{" "}
                                        Package
                                    </h2>

                                    <p className="summary-subtitle">
                                        {
                                            selectedPackage.subtitle
                                        }
                                    </p>

                                    <div className="summary-price">
                                        <span>JOD</span>

                                        <strong>
                                            {
                                                selectedPackage.price
                                            }
                                        </strong>

                                        <small>
                                            {
                                                selectedPackage.oldPrice
                                            }
                                        </small>
                                    </div>

                                    <p className="summary-discount">
                                        {
                                            selectedPackage.discount
                                        }{" "}
                                        OFF
                                    </p>

                                    <div className="summary-line"></div>

                                    <ul className="summary-features">
                                        {selectedPackage.features?.map(
                                            (feature) => (
                                                <li key={feature}>
                                                    {feature}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {showSuccess && (
                    <div className="success-overlay">
                        <div className="success-popup">
                            <FaCheckCircle className="success-icon" />

                            <h2>
                                Booking Submitted
                                Successfully
                            </h2>

                            <p>
                                Your reservation has
                                been sent to the admin
                                team.
                            </p>

                            <div className="success-actions">
                                <Button
                                    className="book-btn"
                                    onClick={() =>
                                        router.push(
                                            "/my-bookings"
                                        )
                                    }
                                >
                                    View My Bookings
                                </Button>

                                <Button
                                    className="outline-success-btn"
                                    onClick={() =>
                                        router.push("/")
                                    }
                                >
                                    Back Home
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <Footer />
            </main>
        );
    }
}