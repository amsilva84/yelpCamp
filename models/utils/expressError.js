// custom express error class video 449 handling errors in express apps. 

class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

// export module
module.exports = ExpressError;