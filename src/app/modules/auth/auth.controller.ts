/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";

import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthServices } from "./auth.service";
import { createUserTokens } from "../../utils/userToken";

/* =========================================================
   🔐 LOGIN WITH EMAIL & PASSWORD
========================================================= */
const credentialsLogin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "local",
            async (err: any, user: any, info: any) => {
                /* ---------- ❌ ERROR FROM PASSPORT ---------- */
                if (err) {
                    return next(
                        new AppError(
                            err?.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
                            err?.message || "Internal Server Error"
                        )
                    );
                }

                /* ---------- ❌ AUTH FAILED ---------- */
                if (!user) {
                    return next(
                        new AppError(
                            info?.statusCode || httpStatus.UNAUTHORIZED,
                            info?.message || "Authentication failed"
                        )
                    );
                }

                /* ---------- ✅ SUCCESS ---------- */
                const userTokens = await createUserTokens(user);

                const { password: pass, ...rest } = user.toObject();

                setAuthCookie(res, userTokens);

                sendResponse(res, {
                    success: true,
                    statusCode: httpStatus.OK,
                    message: "User Logged In Successfully",
                    data: {
                        accessToken: userTokens.accessToken,
                        refreshToken: userTokens.refreshToken,
                        user: rest,
                    },
                });
            }
        )(req, res, next);
    }
);

/* =========================================================
   🔁 REFRESH TOKEN
========================================================= */
const getNewAccessToken = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "No refresh token received from cookies"
            );
        }

        const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

        setAuthCookie(res, tokenInfo);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "New Access Token Retrieved Successfully",
            data: tokenInfo,
        });
    }
);

/* =========================================================
   🚪 LOGOUT
========================================================= */
const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    });
});

/* =========================================================
   🔑 CHANGE PASSWORD
========================================================= */
const changePassword = catchAsync(
    async (req: Request, res: Response) => {
        const { newPassword, oldPassword } = req.body;
        const decodedToken = req.user as JwtPayload;

        await AuthServices.changePassword(
            oldPassword,
            newPassword,
            decodedToken
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Password Changed Successfully",
            data: null,
        });
    }
);

/* =========================================================
   🔁 RESET PASSWORD
========================================================= */
const resetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const decodedToken = req.user as JwtPayload;

        await AuthServices.resetPassword(req.body, decodedToken);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Password Changed Successfully",
            data: null,
        });
    }
);

/* =========================================================
   🔐 SET PASSWORD (FOR GOOGLE USERS)
========================================================= */
const setPassword = catchAsync(
    async (req: Request, res: Response) => {
        const decodedToken = req.user as JwtPayload;
        const { password } = req.body;

        await AuthServices.setPassword(decodedToken.userId, password);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Password Set Successfully",
            data: null,
        });
    }
);

/* =========================================================
   📧 FORGOT PASSWORD
========================================================= */
const forgotPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body;

        await AuthServices.forgotPassword(email);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Email Sent Successfully",
            data: null,
        });
    }
);

/* =========================================================
   🌐 GOOGLE CALLBACK
========================================================= */
const googleCallbackController = catchAsync(
    async (req: Request, res: Response) => {
        let redirectTo = (req.query.state as string) || "";

        if (redirectTo.startsWith("/")) {
            redirectTo = redirectTo.slice(1);
        }

        const user = req.user;

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
        }

        const tokenInfo = createUserTokens(user);

        setAuthCookie(res, tokenInfo);

        return res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
    }
);

/* =========================================================
   📦 EXPORTS
========================================================= */
export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    setPassword,
    forgotPassword,
    changePassword,
    resetPassword,
    googleCallbackController,
};