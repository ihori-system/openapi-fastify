export const getUser = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            true: {
                                default: true
                            },
                            false: {
                                default: false
                            }
                        }
                    }
                }
            }
        }
    }
};
