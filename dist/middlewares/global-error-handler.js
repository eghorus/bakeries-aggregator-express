"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = function (err, req, res, next) {
    /* Adjust errors that are not generated by us (generated by other libraries) and are operational */
    if (err.name === "ValidationError") {
        err._statusCode = 400;
        const errors = Object.values(err.errors).join(" ");
        err._message = `Validation failed: ${errors}.`;
        err._isOperational = true;
    }
    if (err.code === 11000) {
        err._statusCode = 400;
        const fieldName = Object.keys(err.keyValue).toString();
        const fieldValue = Object.values(err.keyValue).toString();
        err._message =
            fieldName === "email"
                ? "This email address is already in use. If it is your email, use it to sign in, or please use a different one."
                : `'${fieldValue}' is a duplicate ${fieldName} field.`;
        err._isOperational = true;
    }
    if (err.name === "TokenExpiredError") {
        err._statusCode = 401;
        err._message = "User access token has expired.";
        err._isOperational = true;
    }
    if (err.name === "JsonWebTokenError") {
        err._statusCode = 401;
        err._message = "User authentication failed.";
        err._isOperational = true;
    }
    if (err.name === "CastError") {
        /* We have a param validation middleware to handle cast errors for params only */
        err._statusCode = 400;
        err._message = `Casting failed for ${err.path}: ${err.value}.`;
        err._isOperational = true;
    }
    /* Defaults for statusCode and status */
    err._statusCode = err._statusCode || err.statusCode || 500;
    err._status =
        err._statusCode >= 200 && err._statusCode < 400
            ? "Success"
            : err._statusCode >= 400 && err._statusCode < 500
                ? "Fail"
                : "Error";
    if (!err._isOperational) {
        err._message = "Something went wrong.";
    }
    /* Send response based on node environment */
    if (process.env.NODE_ENV === "production") {
        console.log("🛑 Error:\n", Object.assign(Object.assign({}, err), { stack: err.stack }));
        res.status(err._statusCode).json({
            status: err._status,
            message: err._message,
        });
    }
    else {
        res.status(err._statusCode).json({
            status: err._status,
            message: err._message,
            error: Object.assign(Object.assign({}, err), { stack: err.stack }),
        });
    }
};
exports.default = globalErrorHandler;
