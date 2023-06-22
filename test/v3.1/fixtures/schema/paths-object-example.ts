export const getPets = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            type: "object"
                        }
                    }
                }
            }
        }
    }
};
