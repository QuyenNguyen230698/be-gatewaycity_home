

class BadRequestException extends Error {
    constructor(message = `BadRequestException` ) {
        super(message);
        this.code = 400;
    }
}

class ForbiddenException extends Error {
    constructor(message = `ForbiddenException` ) {
        super(message);
        this.code = 403;
    }
}

class UnauthorizedException extends Error {
    constructor(message = `UnauthorizedException` ) {
        super(message);
        this.code = 401;
    }
}

module.exports = { BadRequestException, ForbiddenException, UnauthorizedException };