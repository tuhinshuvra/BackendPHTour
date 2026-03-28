"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const division_route_1 = require("../modules/division/division.route");
const user_routes_1 = require("../modules/user/user.routes");
const tour_routes_1 = require("../modules/tour/tour.routes");
const booking_route_1 = require("../modules/booking/booking.route");
const payment_route_1 = require("../modules/payments/payment.route");
const stats_route_1 = require("../modules/stats/stats.route");
const otp_route_1 = require("../modules/otp/otp.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/division",
        route: division_route_1.DivisionRoutes
    },
    {
        path: "/tour",
        route: tour_routes_1.TourRoutes
    },
    {
        path: "/booking",
        route: booking_route_1.BookingRoutes
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentsRoutes
    },
    {
        path: "/otp",
        route: otp_route_1.OtpRoutes
    },
    {
        path: "/stats",
        route: stats_route_1.StatsRouters
    },
];
moduleRoutes.forEach((route) => { exports.router.use(route.path, route.route); });
