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
                        type: "object"
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
                        type: "object"
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
                        type: "object"
                    }
                }
            }
        },
        default: {
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
