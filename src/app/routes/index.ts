import { Router } from "express"
import { AuthRoutes } from "../modules/auth/auth.route"
import { DivisionRoutes } from "../modules/division/division.route"
import { UserRoutes } from "../modules/user/user.routes"
import { TourRoutes } from "../modules/tour/tour.routes"
import { BookingRoutes } from "../modules/booking/booking.route"
import { PaymentsRoutes } from "../modules/payments/payment.route"
import { StatsRouters } from "../modules/stats/stats.route"
import { OtpRoutes } from "../modules/otp/otp.route"

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/division",
        route: DivisionRoutes
    },
    {
        path: "/tour",
        route: TourRoutes
    },
    {
        path: "/booking",
        route: BookingRoutes
    },
    {
        path: "/payment",
        route: PaymentsRoutes

    },
    {
        path: "/otp",
        route: OtpRoutes
    },
    {
        path: "/stats",
        route: StatsRouters
    },
]

moduleRoutes.forEach((route) => { router.use(route.path, route.route) })