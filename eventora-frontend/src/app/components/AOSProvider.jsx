"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function AOSProvider({ children }) {
    useEffect(() => {
        AOS.init({
            duration: 900,
            once: true,
            easing: "ease-out-cubic",
        });
    }, []);

    return children;
}