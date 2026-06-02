"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

import {
  FaArrowRight,
  FaCalendarCheck,
  FaCheckCircle,
  FaGem,
  FaGift,
} from "react-icons/fa";

import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";

export default function Home() {
  const [packages, setPackages] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState("Wedding");
  const router = useRouter();

  const eventTypes = [
    { title: "Wedding", image: "/images/wedding.jpg" },
    { title: "Birthday", image: "/images/birthday.jpg" },
    { title: "Graduation", image: "/images/graduation.jpg" },
    { title: "Corporate", image: "/images/corporate.jpg" },
  ];

  const packagePrices = {
    Wedding: {
      Basic: { oldPrice: 1000, price: 800 },
      Premium: { oldPrice: 2000, price: 1400 },
      Luxury: { oldPrice: 4000, price: 2000 },
    },
    Birthday: {
      Basic: { oldPrice: 125, price: 100 },
      Premium: { oldPrice: 215, price: 150 },
      Luxury: { oldPrice: 500, price: 250 },
    },
    Graduation: {
      Basic: { oldPrice: 250, price: 200 },
      Premium: { oldPrice: 430, price: 300 },
      Luxury: { oldPrice: 1000, price: 500 },
    },
    Corporate: {
      Basic: { oldPrice: 500, price: 400 },
      Premium: { oldPrice: 860, price: 600 },
      Luxury: { oldPrice: 2000, price: 1000 },
    },
  };

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packages`);
        const data = await response.json();

        setPackages(data.packages || []);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPackages();
  }, []);

  function getPackagePrice(packageItem) {
    return packagePrices[selectedEventType]?.[packageItem.name] || {
      oldPrice: packageItem.oldPrice,
      price: packageItem.price,
    };
  }

  function handleBookNow(packageItem) {
    const selectedPrice = getPackagePrice(packageItem);

    const packageWithEventPrice = {
      ...packageItem,
      eventType: selectedEventType,
      oldPrice: selectedPrice.oldPrice,
      price: selectedPrice.price,
      finalPrice: selectedPrice.price,
    };

    localStorage.setItem(
      "selectedPackage",
      JSON.stringify(packageWithEventPrice)
    );

    router.push("/booking");
  }

  function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <main className="landing-page">
      <Navbar />

      <section id="home" className="hero-section">
        <Container>
          <div className="hero-content">
            <p className="hero-label">Elegant Event Booking Platform</p>

            <h1 className="hero-title">
              <span>Make Every</span>

              <span className="word-slider">
                <span className="word-track">
                  <span>Wedding</span>
                  <span>Graduation</span>
                  <span>Birthday</span>
                  <span>Corporate</span>
                </span>
              </span>

              <span>Memory Last Forever</span>
            </h1>

            <p className="hero-description">
              Choose your event type, explore elegant packages, and enjoy our
              services.
            </p>

            <div className="hero-actions">
              <Button
                className="main-btn"
                onClick={() => scrollToSection("packages")}
              >
                Explore Packages <FaArrowRight />
              </Button>

              <Button
                className="outline-btn"
                onClick={() => scrollToSection("services")}
              >
                View Services
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section id="about" className="event-types-section">
        <Container>
          <div className="section-heading">
            <p>Event Types</p>

            <h2>We Plan Every Type Of Celebration</h2>
          </div>

          <Row className="g-4">
            {eventTypes.map((event) => (
              <Col lg={3} md={6} key={event.title}>
                <Card className="event-type-card">
                  <img src={event.image} alt={event.title} />

                  <div className="event-type-overlay">
                    <h3>{event.title}</h3>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section id="services" className="section-area">
        <Container>
          <div className="section-heading">
            <p>Our Services</p>

            <h2>Everything You Need For A Perfect Event</h2>
          </div>

          <Row className="g-4 align-items-stretch">
            <Col md={4} className="d-flex">
              <Card className="service-card">
                <FaGift className="service-icon" />

                <h3>Event Packages</h3>

                <p>
                  Ready-made packages for weddings, birthdays, graduations, and
                  corporate events.
                </p>
              </Card>
            </Col>

            <Col md={4} className="d-flex">
              <Card className="service-card">
                <FaCalendarCheck className="service-icon" />

                <h3>Easy Booking</h3>

                <p>
                  Choose your package, select your date, and enjoy our services.
                </p>
              </Card>
            </Col>

            <Col md={4} className="d-flex">
              <Card className="service-card">
                <FaGem className="service-icon" />

                <h3>Elegant Details</h3>

                <p>
                  Beautiful setups, organized details, and unforgettable event
                  experiences.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="packages" className="packages-preview">
        <Container>
          <div className="section-heading">
            <p>Our Packages</p>

            <h2>{selectedEventType} Packages</h2>

            <span>
              Select your event type to see the prices that match your
              celebration.
            </span>
          </div>

          <div className="event-price-tabs">
            {eventTypes.map((event) => (
              <button
                key={event.title}
                className={
                  selectedEventType === event.title
                    ? "event-price-tab active-event-price-tab"
                    : "event-price-tab"
                }
                onClick={() => setSelectedEventType(event.title)}
              >
                {event.title}
              </button>
            ))}
          </div>

          <Row className="g-4 justify-content-center">
            {packages
              .sort((a, b) => {
                const order = { Basic: 1, Premium: 2, Luxury: 3 };
                return order[a.name] - order[b.name];
              })
              .map((packageItem) => {
                const selectedPrice = getPackagePrice(packageItem);

                return (
                  <Col lg={4} md={6} key={packageItem._id}>
                    <Card
                      className={`package-card ${packageItem.isFeatured ? "featured-package" : ""
                        }`}
                    >
                      {packageItem.isFeatured && (
                        <div className="popular-tag">Most Popular</div>
                      )}

                      <div className="package-title-row">
                        <div>
                          <h3>{packageItem.name}</h3>

                          <p>{packageItem.subtitle}</p>
                        </div>

                        <div className="discount-pill">
                          {packageItem.discount}
                        </div>
                      </div>

                      <div className="price-area">
                        <span className="currency">JOD</span>

                        <span className="new-price">{selectedPrice.price}</span>

                        <span className="old-price">
                          {selectedPrice.oldPrice}
                        </span>
                      </div>

                      <div className="package-line"></div>

                      <ul className="package-features">
                        {packageItem.features.map((feature) => (
                          <li key={feature}>
                            <FaCheckCircle />

                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="book-btn"
                        onClick={() => handleBookNow(packageItem)}
                      >
                        Book Now
                      </Button>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </Container>
      </section>

      <section id="contact" className="how-section">
        <Container>
          <div className="section-heading">
            <p>How It Works</p>

            <h2>Your Event, Planned In Three Elegant Steps</h2>
          </div>

          <div className="luxury-steps">
            <div className="luxury-step">
              <span>01</span>
              <h3>Share Your Vision</h3>
              <p>
                Tell us about your dream wedding, birthday, graduation, or
                corporate event.
              </p>
            </div>

            <div className="luxury-step">
              <span>02</span>
              <h3>Choose Your Package</h3>
              <p>
                Explore elegant packages, compare features, and select what fits
                your event perfectly.
              </p>
            </div>

            <div className="luxury-step">
              <span>03</span>
              <h3>Enjoy Your Moment</h3>
              <p>
                Relax while we organize every detail and create unforgettable
                memories for your special day.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}



