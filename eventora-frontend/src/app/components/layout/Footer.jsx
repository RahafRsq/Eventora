import { Container } from "react-bootstrap";

import {
    FaFacebookF,
    FaInstagram,
    FaRegGem,
    FaWhatsapp,
    FaEnvelope,
    FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="site-footer">
            <Container className="footer-content">
                <div>
                    <div className="footer-brand">
                        <FaRegGem className="footer-brand-icon" />
                        <span>Eventora</span>
                    </div>

                    <p className="footer-description">
                        Elegant packages for unforgettable events.
                    </p>

                    <div className="social-icons">
                        <span><FaInstagram /></span>
                        <span><FaFacebookF /></span>
                        <span><FaWhatsapp /></span>
                    </div>
                </div>

                <div>
                    <h4>Pages</h4>
                    <a href="/#home">Home</a>
                    <a href="/#about">About</a>
                    <a href="/#services">Services</a>
                    <a href="/#packages">Packages</a>
                </div>

                <div>
                    <h4>Event Types</h4>
                    <a href="/#about">Wedding</a>
                    <a href="/#about">Birthday</a>
                    <a href="/#about">Graduation</a>
                    <a href="/#about">Corporate</a>
                </div>

                <div>
                    <h4>Contact</h4>

                    <a
                        href="https://maps.google.com/?q=Amman,Jordan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                    >
                        <FaMapMarkerAlt />
                        <span>Amman, Jordan</span>
                    </a>

                    <a
                        href="mailto:hello@eventora.com"
                        className="contact-link"
                    >
                        <FaEnvelope />
                        <span>hello@eventora.com</span>
                    </a>
                </div>
            </Container>

            <div className="footer-bottom">
                <p className="copyright">
                    © 2026 Eventora. All rights reserved.
                </p>
            </div>
        </footer>
    );
}