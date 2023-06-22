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
            content: {}
        },
        default: {
            content: {}
        }
    }
};
