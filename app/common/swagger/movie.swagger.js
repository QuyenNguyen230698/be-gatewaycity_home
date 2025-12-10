const movie = {
    "/api/movies/": {
        get: {
            tags: ["Landing Page"],
            summary: "Get List Movie",
            description: "Get List Movie",
            responses: {
                "200": {
                    description: "Success",
                },
            }
        },
    },
    "/api/movies/detail": {
        post: {
            tags: ["Landing Page"],
            summary: "Get Detail Movie",
            description: "Get Detail Movie",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                movieCode: {
                                    type: "number",
                                    example: 1000
                                }
                            },
                            required: ["movieCode"]
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Get Detail Movie Successfully",
                },
                "400": {
                    description: "Bad Request",
                },
                "401": {
                    description: "Unauthorized",
                }
            }
        },
    },
}
module.exports = movie