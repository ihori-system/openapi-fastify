export const getUser = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: [
                            "string",
                            "integer",
                            "number",
                            "emptyArray",
                            "stringArray",
                            "integerArray",
                            "numberArray",
                            "arrayArray",
                            "emptyObject",
                            "object",
                            "boolean",
                            "null"
                        ],
                        properties: {
                            string: {
                                type: "string"
                            },
                            integer: {
                                type: "integer"
                            },
                            number: {
                                type: "number"
                            },
                            emptyArray: {
                                type: "array"
                            },
                            stringArray: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            },
                            integerArray: {
                                type: "array",
                                items: {
                                    type: "integer"
                                }
                            },
                            numberArray: {
                                type: "array",
                                items: {
                                    type: "number"
                                }
                            },
                            arrayArray: {
                                type: "array",
                                items: {
                                    type: "array"
                                }
                            },
                            emptyObject: {
                                type: "object"
                            },
                            object: {
                                type: "object",
                                required: [
                                    "string",
                                    "integer",
                                    "array",
                                    "object",
                                    "boolean",
                                    "null"
                                ],
                                properties: {
                                    string: {
                                        type: "string"
                                    },
                                    integer: {
                                        type: "integer"
                                    },
                                    array: {
                                        type: "array"
                                    },
                                    object: {
                                        type: "object"
                                    },
                                    boolean: {
                                        type: "boolean"
                                    },
                                    null: {
                                        type: "null"
                                    }
                                }
                            },
                            boolean: {
                                type: "boolean"
                            },
                            null: {
                                type: "null"
                            }
                        }
                    }
                }
            }
        }
    }
};
