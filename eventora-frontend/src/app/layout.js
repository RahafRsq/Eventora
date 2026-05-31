import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import "react-toastify/dist/ReactToastify.css";
import "aos/dist/aos.css";

import { ToastContainer } from "react-toastify";
import AOSProvider from "./components/AOSProvider";

export const metadata = {
  title: "Eventora",
  description: "Elegant event packages booking platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AOSProvider>{children}</AOSProvider>

        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}