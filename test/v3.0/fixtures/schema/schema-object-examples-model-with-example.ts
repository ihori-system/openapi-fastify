export const getUser = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: [
                            "name"
                        ],
                        properties: {
                            id: {
                                type: "integer",
                                format: "int64"
                            },
                            name: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }
    }
};
