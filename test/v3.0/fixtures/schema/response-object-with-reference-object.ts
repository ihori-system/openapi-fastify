export const getNameById = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
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
