export const getUser = {
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
                type: "object",
                additionalProperties: {
                    type: "integer"
                }
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
    }
};
