export const getNameById = {
    params: {
        type: "object",
        properties: {
            id: {
                type: "string"
            }
        }
    },
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object"
                    }
                }
            }
        }
    }
};
