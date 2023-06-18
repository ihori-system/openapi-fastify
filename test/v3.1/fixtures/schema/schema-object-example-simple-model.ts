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
                            name: {
                                type: "string"
                            },
                            address: {
                                type: "string"
                            },
                            age: {
                                type: "integer",
                                format: "int32"
                            }
                        }
                    }
                }
            }
        }
    }
};
