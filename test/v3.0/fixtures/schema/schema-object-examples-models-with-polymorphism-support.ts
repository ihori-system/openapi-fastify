export const getUser = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            email: {
                                type: "string",
                                format: "email"
                            }
                        }
                    }
                }
            }
        }
    }
};
