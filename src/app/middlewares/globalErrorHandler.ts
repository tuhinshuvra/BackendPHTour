/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"

export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {

    let statsCode = 500
    let message = `Something Went Wrong!!`

    if (error instanceof AppError) {
        statsCode = error.statusCode
        message = error.message
    } else if (error instanceof Error) {
        statsCode = 500
        message = error.message
    }

    res.status(statsCode).json({
        success: false,
        message,
        error,
        stack: envVars.NODE_ENV === "development" ? error.stack : null
    })
}