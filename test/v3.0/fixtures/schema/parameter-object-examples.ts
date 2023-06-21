export const index = {
    querystring: {
        type: "object",
        properties: {
            id: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            freeForm: {
                type: "object"
            }
        }
    },
    params: {
        type: "object",
        required: [
            "username"
        ],
        properties: {
            username: {
                type: "string"
            }
        }
    },
    headers: {
        type: "object",
        required: [
            "token"
        ],
        properties: {
            token: {
                type: "array",
                items: {
                    type: "integer",
                    format: "int64"
                }
            }
        }
    },
    response: {
        200: {}
    }
};
