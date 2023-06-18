export const getPetsById = {
    params: {
        type: "object",
        required: [
            "id"
        ],
        properties: {
            id: {
                type: "array",
                items: {
                    type: "string"
                }
            }
        }
    },
    response: {
        200: {
            content: {
                "*/*": {
                    schema: {
                        type: "array",
                        items: {}
                    }
                }
            }
        },
        default: {
            content: {
                "text/html": {
                    schema: {}
                }
            }
        }
    }
};
