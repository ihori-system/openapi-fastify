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
                            maxLength: {
                                type: "string",
                                maxLength: 100
                            },
                            maximum: {
                                type: "string",
                                minLength: 1
                            }
                        }
                    }
                }
            }
        }
    }
};
