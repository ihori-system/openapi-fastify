export const getPet = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object"
                    }
                }
            }
        },
        default: {
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
