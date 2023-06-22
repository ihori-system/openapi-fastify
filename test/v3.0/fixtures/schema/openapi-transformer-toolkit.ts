export const updatePet = {
    body: {
        type: "object",
        required: [
            "name",
            "photoUrls"
        ],
        properties: {
            id: {
                type: "integer",
                format: "int64"
            },
            name: {
                type: "string"
            },
            category: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        format: "int64"
                    },
                    name: {
                        type: "string"
                    }
                }
            },
            photoUrls: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            tags: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            format: "int64"
                        },
                        name: {
                            type: "string"
                        }
                    }
                }
            },
            status: {
                enum: [
                    "available",
                    "pending",
                    "sold"
                ],
                type: "string"
            }
        }
    },
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: [
                            "name",
                            "photoUrls"
                        ],
                        properties: {
                            id: {
                                type: "integer",
                                format: "int64"
                            },
                            name: {
                                type: "string"
                            },
                            category: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "integer",
                                        format: "int64"
                                    },
                                    name: {
                                        type: "string"
                                    }
                                }
                            },
                            photoUrls: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            },
                            tags: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "integer",
                                            format: "int64"
                                        },
                                        name: {
                                            type: "string"
                                        }
                                    }
                                }
                            },
                            status: {
                                enum: [
                                    "available",
                                    "pending",
                                    "sold"
                                ],
                                type: "string"
                            }
                        }
                    }
                }
            }
        },
        400: {},
        404: {},
        405: {}
    }
};
