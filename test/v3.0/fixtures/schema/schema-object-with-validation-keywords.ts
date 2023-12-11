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
                                minLength: 1
                            }
                        }
                    }
                }
            }
        }
    }
};
