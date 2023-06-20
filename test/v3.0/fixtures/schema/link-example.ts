export const getUserByName = {
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
export const getRepositoriesByOwner = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "array"
                    }
                }
            }
        }
    }
};
export const getRepository = {
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
export const getPullRequestsByRepository = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "array"
                    }
                }
            }
        }
    }
};
export const getPullRequestsById = {
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
export const mergePullRequest = {
    response: {
        204: {}
    }
};
