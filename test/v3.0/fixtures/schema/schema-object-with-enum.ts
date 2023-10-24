export const getUser = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            city: {
                                enum: [
                                    "tokyo",
                                    "osaka"
                                ],
                                type: "string"
                            }
                        }
                    }
                }
            }
        }
    }
};
