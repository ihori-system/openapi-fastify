export const getUser = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: [
                            "null",
                            "boolean",
                            "object",
                            "emptyArray",
                            "stringArray",
                            "integerArray",
                            "numberArray",
                            "arrayArray",
                            "emptyObject",
                            "number",
                            "string",
                            "integer",
                            "multiple"
                        ],
                        properties: {
                            null: {
                                type: "null"
                            },
                            boolean: {
                                type: "boolean"
                            },
                            object: {
                                type: "object",
                                required: [
                                    "null",
                                    "boolean",
                                    "object",
                                    "array",
                                    "string",
                                    "integer"
                                ],
                                properties: {
                                    null: {
                                        type: "null"
                                    },
                                    boolean: {
                                        type: "boolean"
                                    },
                                    object: {
                                        type: "object"
                                    },
                                    array: {
                                        type: "array"
                                    },
                                    string: {
                                        type: "string"
                                    },
                                    integer: {
                                        type: "integer"
                                    }
                                }
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
                            number: {
                                type: "number"
                            },
                            string: {
                                type: "string"
                            },
                            integer: {
                                type: "integer"
                            },
                            multiple: {
                                type: [
                                    "string",
                                    "null"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
};
