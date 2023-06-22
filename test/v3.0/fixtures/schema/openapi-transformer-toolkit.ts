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
export const addPet = {
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
        405: {}
    }
};
export const findPetsByStatus = {
    querystring: {
        type: "object",
        properties: {
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
                        type: "array",
                        items: {
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
            }
        },
        400: {}
    }
};
export const findPetsByTags = {
    querystring: {
        type: "object",
        properties: {
            tags: {
                type: "array",
                items: {
                    type: "string"
                }
            }
        }
    },
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
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
            }
        },
        400: {}
    }
};
export const getPetById = {
    params: {
        type: "object",
        required: [
            "petId"
        ],
        properties: {
            petId: {
                type: "integer",
                format: "int64"
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
        404: {}
    }
};
export const updatePetWithForm = {
    querystring: {
        type: "object",
        properties: {
            name: {
                type: "string"
            },
            status: {
                type: "string"
            }
        }
    },
    params: {
        type: "object",
        required: [
            "petId"
        ],
        properties: {
            petId: {
                type: "integer",
                format: "int64"
            }
        }
    },
    response: {
        405: {}
    }
};
export const deletePet = {
    params: {
        type: "object",
        required: [
            "petId"
        ],
        properties: {
            petId: {
                type: "integer",
                format: "int64"
            }
        }
    },
    headers: {
        type: "object",
        properties: {
            api_key: {
                type: "string"
            }
        }
    },
    response: {
        400: {}
    }
};
export const uploadFile = {
    querystring: {
        type: "object",
        properties: {
            additionalMetadata: {
                type: "string"
            }
        }
    },
    params: {
        type: "object",
        required: [
            "petId"
        ],
        properties: {
            petId: {
                type: "integer",
                format: "int64"
            }
        }
    },
    body: {},
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            code: {
                                type: "integer",
                                format: "int32"
                            },
                            type: {
                                type: "string"
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
export const getInventory = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object"
                    }
                }
            }
        }
    }
};
export const placeOrder = {
    body: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                format: "int64"
            },
            petId: {
                type: "integer",
                format: "int64"
            },
            quantity: {
                type: "integer",
                format: "int32"
            },
            shipDate: {
                type: "string",
                format: "date-time"
            },
            status: {
                enum: [
                    "placed",
                    "approved",
                    "delivered"
                ],
                type: "string"
            },
            complete: {
                type: "boolean"
            }
        }
    },
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "integer",
                                format: "int64"
                            },
                            petId: {
                                type: "integer",
                                format: "int64"
                            },
                            quantity: {
                                type: "integer",
                                format: "int32"
                            },
                            shipDate: {
                                type: "string",
                                format: "date-time"
                            },
                            status: {
                                enum: [
                                    "placed",
                                    "approved",
                                    "delivered"
                                ],
                                type: "string"
                            },
                            complete: {
                                type: "boolean"
                            }
                        }
                    }
                }
            }
        },
        405: {}
    }
};
export const getOrderById = {
    params: {
        type: "object",
        required: [
            "orderId"
        ],
        properties: {
            orderId: {
                type: "integer",
                format: "int64"
            }
        }
    },
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "integer",
                                format: "int64"
                            },
                            petId: {
                                type: "integer",
                                format: "int64"
                            },
                            quantity: {
                                type: "integer",
                                format: "int32"
                            },
                            shipDate: {
                                type: "string",
                                format: "date-time"
                            },
                            status: {
                                enum: [
                                    "placed",
                                    "approved",
                                    "delivered"
                                ],
                                type: "string"
                            },
                            complete: {
                                type: "boolean"
                            }
                        }
                    }
                }
            }
        },
        400: {},
        404: {}
    }
};
export const deleteOrder = {
    params: {
        type: "object",
        required: [
            "orderId"
        ],
        properties: {
            orderId: {
                type: "integer",
                format: "int64"
            }
        }
    },
    response: {
        400: {},
        404: {}
    }
};
export const createUser = {
    body: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                format: "int64"
            },
            username: {
                type: "string"
            },
            firstName: {
                type: "string"
            },
            lastName: {
                type: "string"
            },
            email: {
                type: "string"
            },
            password: {
                type: "string"
            },
            phone: {
                type: "string"
            },
            userStatus: {
                type: "integer",
                format: "int32"
            }
        }
    },
    response: {
        default: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "integer",
                                format: "int64"
                            },
                            username: {
                                type: "string"
                            },
                            firstName: {
                                type: "string"
                            },
                            lastName: {
                                type: "string"
                            },
                            email: {
                                type: "string"
                            },
                            password: {
                                type: "string"
                            },
                            phone: {
                                type: "string"
                            },
                            userStatus: {
                                type: "integer",
                                format: "int32"
                            }
                        }
                    }
                }
            }
        }
    }
};
export const createUsersWithListInput = {
    body: {
        type: "array",
        items: {
            type: "object",
            properties: {
                id: {
                    type: "integer",
                    format: "int64"
                },
                username: {
                    type: "string"
                },
                firstName: {
                    type: "string"
                },
                lastName: {
                    type: "string"
                },
                email: {
                    type: "string"
                },
                password: {
                    type: "string"
                },
                phone: {
                    type: "string"
                },
                userStatus: {
                    type: "integer",
                    format: "int32"
                }
            }
        }
    },
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "integer",
                                format: "int64"
                            },
                            username: {
                                type: "string"
                            },
                            firstName: {
                                type: "string"
                            },
                            lastName: {
                                type: "string"
                            },
                            email: {
                                type: "string"
                            },
                            password: {
                                type: "string"
                            },
                            phone: {
                                type: "string"
                            },
                            userStatus: {
                                type: "integer",
                                format: "int32"
                            }
                        }
                    }
                }
            }
        },
        default: {}
    }
};
export const loginUser = {
    querystring: {
        type: "object",
        properties: {
            username: {
                type: "string"
            },
            password: {
                type: "string"
            }
        }
    },
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "string"
                    }
                }
            }
        },
        400: {}
    }
};
export const logoutUser = {
    response: {
        default: {}
    }
};
export const getUserByName = {
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
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "integer",
                                format: "int64"
                            },
                            username: {
                                type: "string"
                            },
                            firstName: {
                                type: "string"
                            },
                            lastName: {
                                type: "string"
                            },
                            email: {
                                type: "string"
                            },
                            password: {
                                type: "string"
                            },
                            phone: {
                                type: "string"
                            },
                            userStatus: {
                                type: "integer",
                                format: "int32"
                            }
                        }
                    }
                }
            }
        },
        400: {},
        404: {}
    }
};
export const updateUser = {
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
    body: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                format: "int64"
            },
            username: {
                type: "string"
            },
            firstName: {
                type: "string"
            },
            lastName: {
                type: "string"
            },
            email: {
                type: "string"
            },
            password: {
                type: "string"
            },
            phone: {
                type: "string"
            },
            userStatus: {
                type: "integer",
                format: "int32"
            }
        }
    },
    response: {
        default: {}
    }
};
export const deleteUser = {
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
    response: {
        400: {},
        404: {}
    }
};
