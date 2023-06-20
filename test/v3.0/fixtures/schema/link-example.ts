export const getUserByName = {
    response: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            username: {
                                type: "string"
                            },
                            uuid: {
                                type: "string"
                            }
                        }
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
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                slug: {
                                    type: "string"
                                },
                                owner: {
                                    type: "object",
                                    properties: {
                                        username: {
                                            type: "string"
                                        },
                                        uuid: {
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
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
                        type: "object",
                        properties: {
                            slug: {
                                type: "string"
                            },
                            owner: {
                                type: "object",
                                properties: {
                                    username: {
                                        type: "string"
                                    },
                                    uuid: {
                                        type: "string"
                                    }
                                }
                            }
                        }
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
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "integer"
                                },
                                title: {
                                    type: "string"
                                },
                                repository: {
                                    type: "object",
                                    properties: {
                                        slug: {
                                            type: "string"
                                        },
                                        owner: {
                                            type: "object",
                                            properties: {
                                                username: {
                                                    type: "string"
                                                },
                                                uuid: {
                                                    type: "string"
                                                }
                                            }
                                        }
                                    }
                                },
                                author: {
                                    type: "object",
                                    properties: {
                                        username: {
                                            type: "string"
                                        },
                                        uuid: {
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
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
                        type: "object",
                        properties: {
                            id: {
                                type: "integer"
                            },
                            title: {
                                type: "string"
                            },
                            repository: {
                                type: "object",
                                properties: {
                                    slug: {
                                        type: "string"
                                    },
                                    owner: {
                                        type: "object",
                                        properties: {
                                            username: {
                                                type: "string"
                                            },
                                            uuid: {
                                                type: "string"
                                            }
                                        }
                                    }
                                }
                            },
                            author: {
                                type: "object",
                                properties: {
                                    username: {
                                        type: "string"
                                    },
                                    uuid: {
                                        type: "string"
                                    }
                                }
                            }
                        }
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
