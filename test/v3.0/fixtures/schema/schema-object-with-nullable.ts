export const getUser = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                nullable: true
                            }
                        }
                    }
                }
            }
        }
    }
};
