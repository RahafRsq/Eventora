router.post("/", protect, createBooking);

router.get("/my-bookings", protect, getMyBookings);

router.put("/edit/:id", protect, updateBookingDetails);

router.put("/cancel/:id", protect, updateBookingDetails);

router.get("/", protect, adminOnly, getBookings);

router.put("/:id", protect, adminOnly, updateBookingStatus);