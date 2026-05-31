"use client";

import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";

import Navbar from "@/app/components/layout/Navbar";

export default function AdminPackagesPage() {
    const [packages, setPackages] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPackageId, setSelectedPackageId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        subtitle: "",
        price: "",
        oldPrice: "",
        discount: "",
        image: "",
        features: "",
        isFeatured: false,
    });

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token) {
            router.push("/login");
            return;
        }

        if (userData) {
            const user = JSON.parse(userData);

            if (user.role !== "admin") {
                router.push("/");
                return;
            }
        }

        fetchPackages();
    }, [router]);

    async function fetchPackages() {
        const response = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/packages");
        const data = await response.json();

        setPackages(data);
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const packageData = {
            ...formData,
            price: Number(formData.price),
            oldPrice: Number(formData.oldPrice),
            features: formData.features.split(",").map((item) => item.trim()),
        };

        if (editingId) {
            await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/api/packages/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(packageData),
            });

            setEditingId(null);
        } else {
            await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/packages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(packageData),
            });
        }

        setFormData({
            name: "",
            subtitle: "",
            price: "",
            oldPrice: "",
            discount: "",
            image: "",
            features: "",
            isFeatured: false,
        });

        fetchPackages();
    }

    function openDeleteModal(id) {
        setSelectedPackageId(id);
        setShowDeleteModal(true);
    }

    async function confirmDelete() {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packages/${selectedPackageId}`, {
            method: "DELETE",
        });

        setShowDeleteModal(false);
        setSelectedPackageId(null);

        fetchPackages();
    }

    function handleEdit(packageItem) {
        setEditingId(packageItem._id);

        setFormData({
            name: packageItem.name,
            subtitle: packageItem.subtitle,
            price: packageItem.price,
            oldPrice: packageItem.oldPrice,
            discount: packageItem.discount,
            image: packageItem.image,
            features: packageItem.features.join(", "),
            isFeatured: packageItem.isFeatured,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <main className="booking-page">
            <Navbar />

            <Container>
                <div className="booking-header" data-aos="fade-down">
                    <p>Admin Dashboard</p>

                    <h1>Manage Packages</h1>

                    <span>Add, edit, and delete Eventora packages.</span>
                </div>

                <Card className="booking-card mb-5" data-aos="fade-up">
                    <h2>{editingId ? "Edit Package" : "Add New Package"}</h2>

                    <form className="booking-form" onSubmit={handleSubmit}>
                        <label>Package Name</label>

                        <input
                            name="name"
                            placeholder="Basic"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <label>Subtitle</label>

                        <input
                            name="subtitle"
                            placeholder="Simple & Elegant"
                            value={formData.subtitle}
                            onChange={handleChange}
                        />

                        <label>Price</label>

                        <input
                            name="price"
                            type="number"
                            placeholder="100"
                            value={formData.price}
                            onChange={handleChange}
                        />

                        <label>Old Price</label>

                        <input
                            name="oldPrice"
                            type="number"
                            placeholder="125"
                            value={formData.oldPrice}
                            onChange={handleChange}
                        />

                        <label>Discount</label>

                        <input
                            name="discount"
                            placeholder="20%"
                            value={formData.discount}
                            onChange={handleChange}
                        />

                        <label>Image Path</label>

                        <input
                            name="image"
                            placeholder="/images/wedding.jpg"
                            value={formData.image}
                            onChange={handleChange}
                        />

                        <label>Features</label>

                        <textarea
                            name="features"
                            placeholder="Feature 1, Feature 2, Feature 3"
                            value={formData.features}
                            onChange={handleChange}
                        ></textarea>

                        <label className="featured-check">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                            />
                            Featured Package
                        </label>

                        <Button className="book-btn" type="submit">
                            {editingId ? "Save Changes" : "Add Package"}
                        </Button>
                    </form>
                </Card>

                <Row className="g-4">
                    {packages.map((packageItem, index) => (
                        <Col
                            lg={4}
                            md={6}
                            key={packageItem._id}
                            data-aos={packageItem.isFeatured ? "zoom-in" : "fade-up"}
                            data-aos-delay={index * 120}
                        >
                            <Card className="booking-summary-card">
                                {packageItem.image && (
                                    <img
                                        src={packageItem.image}
                                        alt={packageItem.name}
                                        className="package-image"
                                    />
                                )}

                                <p className="summary-label">{packageItem.discount} OFF</p>

                                <h2>{packageItem.name}</h2>

                                <p className="summary-subtitle">{packageItem.subtitle}</p>

                                <div className="summary-price">
                                    <span>JOD</span>

                                    <strong>{packageItem.price}</strong>

                                    <small>{packageItem.oldPrice}</small>
                                </div>

                                <div className="summary-line"></div>

                                <Button
                                    className="approve-btn"
                                    onClick={() => handleEdit(packageItem)}
                                >
                                    Edit Package
                                </Button>

                                <Button
                                    className="reject-btn mt-3"
                                    onClick={() => openDeleteModal(packageItem._id)}
                                >
                                    Delete Package
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {showDeleteModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal" data-aos="zoom-in">
                        <h2>Delete Package?</h2>

                        <p>
                            This package will be permanently removed from Eventora and cannot
                            be restored.
                        </p>

                        <div className="logout-modal-actions">
                            <Button
                                className="logout-cancel-btn"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </Button>

                            <Button className="logout-confirm-btn" onClick={confirmDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}