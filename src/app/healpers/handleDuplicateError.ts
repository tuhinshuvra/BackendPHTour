/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleDuplicateError = (error: any): TGenericErrorResponse => {
    const matchedArray = error?.message?.match(/"([^"]*)"/);

    const value = matchedArray?.[1] || "Duplicate value";

    return {
        statusCode: 400,
        message: `${value} already exists!!`
    }
}