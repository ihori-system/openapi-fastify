export const listPets = {
    querystring: {
        type: "object",
        properties: {
            limit: {
                type: "integer",
                format: "int32",
                maximum: 100
            }
        }
    },
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        maxItems: 100,
                        items: {
                            type: "object",
                            required: [
                                "id",
                                "name"
                            ],
                            properties: {
                                id: {
                                    type: "integer",
                                    format: "int64"
                                },
                                name: {
                                    type: "string"
                                },
                                tag: {
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        default: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: [
                            "code",
                            "message"
                        ],
                        properties: {
                            code: {
                                type: "integer",
                                format: "int32"
                            },
                            message: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }
    }
};
export const createPets = {
    querystring: {
        type: "object",
        properties: {
            limit: {
                type: "integer",
                format: "int32",
                maximum: 100
            }
        }
    },
    response: {
        201: {},
        default: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: [
                            "code",
                            "message"
                        ],
                        properties: {
                            code: {
                                type: "integer",
                                format: "int32"
                            },
                            message: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }
    }
};
export const showPetById = {
    params: {
        type: "object",
        required: [
            "petId"
        ],
        properties: {
            petId: {
                type: "string"
            }
        }
    },
    headers: {
        type: "object",
        required: [
            "petId"
        ],
        properties: {
            petId: {
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
                            "id",
                            "name"
                        ],
                        properties: {
                            id: {
                                type: "integer",
                                format: "int64"
                            },
                            name: {
                                type: "string"
                            },
                            tag: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        },
        default: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: [
                            "code",
                            "message"
                        ],
                        properties: {
                            code: {
                                type: "integer",
                                format: "int32"
                            },
                            message: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }
    }
};
