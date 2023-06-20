export const listPets = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "array"
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
                        ]
                    }
                }
            }
        }
    }
};
export const createPets = {
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
                        ]
                    }
                }
            }
        }
    }
};
export const showPetById = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: [
                            "id",
                            "name"
                        ]
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
                        ]
                    }
                }
            }
        }
    }
};
