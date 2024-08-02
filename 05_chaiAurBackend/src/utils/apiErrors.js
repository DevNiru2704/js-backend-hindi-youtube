class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong!", 
        error = [], 
        stack = ""
    ) {
        super(message); // Call the parent class constructor with the message
        this.statusCode = statusCode; // Set the statusCode property
        this.data = null; // Initialize data as null
        this.message = message; // Set the message property
        this.success = false; // Indicate failure
        this.error = error; // Set the error property

        // Capture the stack trace if not provided
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
