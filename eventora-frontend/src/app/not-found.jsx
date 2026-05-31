"use client";

import { Button, Container } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { FaTriangleExclamation } from "react-icons/fa6";

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <main className="notfound-page">
            <Container>
                <div className="notfound-box">
                    <div className="notfound-icon">
                        <FaTriangleExclamation />
                    </div>

                    <p className="notfound-label">404 Error</p>

                    <h1>Page Not Found</h1>

                    <span>
                        The page you are looking for does not exist or may have been moved.
                    </span>

                    <Button
                        className="notfound-btn"
                        onClick={() => router.push("/")}
                    >
                        Back To Home
                    </Button>
                </div>
            </Container>
        </main>
    );
}