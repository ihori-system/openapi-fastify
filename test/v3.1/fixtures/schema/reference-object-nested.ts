export const getPet = {
    response: {
        default: {
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
