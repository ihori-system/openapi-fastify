export const index = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            string: {
                                type: "string",
                                maxLength: 100,
                                minLength: 1
                            }
                        }
                    }
                }
            }
        }
    }
};
