export const getUser = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            true: {
                                type: "boolean",
                                default: true
                            },
                            false: {
                                type: "boolean",
                                default: false
                            }
                        }
                    }
                }
            }
        }
    }
};
