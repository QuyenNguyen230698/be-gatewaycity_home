const user = require('./user.swagger')
const movie = require('./movie.swagger')

const swaggerDocument = {
    openapi: "3.1.0",
    info: {
        title: "BE GatewayCity Homes",
        version: "1.0.0",
        description: "BE GatewayCity Homes API",
    },
    servers: [
        {
            url: "http://localhost:4000",
            description: "Local server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        ...user,
        ...movie
    },
}

module.exports = swaggerDocument