export const getUser = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            city: {
                                type: "string",
                                enum: [
                                    "tokyo",
                                    "osaka"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
};
