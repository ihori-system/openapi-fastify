export const getUser = {
    headers: {
        type: "object",
        required: [
            "token"
        ],
        properties: {
            "token": {
                type: "array",
                items: {
                    type: "integer",
                    format: "int64"
                }
            }
        }
    }
};
