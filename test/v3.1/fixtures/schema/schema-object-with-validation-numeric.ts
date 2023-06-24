export const getUser = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: [
                            "name"
                        ],
                        properties: {
                            multipleOf: {
                                type: "number",
                                multipleOf: 5
                            },
                            maximum: {
                                type: "number",
                                maximum: 10
                            },
                            exclusiveMaximum: {
                                type: "number",
                                exclusiveMaximum: 15
                            },
                            minimum: {
                                type: "number",
                                minimum: 20
                            },
                            exclusiveMinimum: {
                                type: "number",
                                exclusiveMinimum: 25
                            }
                        }
                    }
                }
            }
        }
    }
};
