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
    headers: {
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
    headers: {
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
    params: {
        type: "object",
        required: [
            "username",
            "slug"
        ],
        properties: {
            username: {
                type: "string"
            },
            slug: {
                type: "string"
            }
        }
    },
    headers: {
        type: "object",
        required: [
            "username",
            "slug"
        ],
        properties: {
            username: {
                type: "string"
            },
            slug: {
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
    querystring: {
        type: "object",
        properties: {
            state: {
                type: "string"
            }
        }
    },
    params: {
        type: "object",
        required: [
            "username",
            "slug"
        ],
        properties: {
            username: {
                type: "string"
            },
            slug: {
                type: "string"
            }
        }
    },
    headers: {
        type: "object",
        required: [
            "username",
            "slug"
        ],
        properties: {
            username: {
                type: "string"
            },
            slug: {
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
    params: {
        type: "object",
        required: [
            "username",
            "slug",
            "pid"
        ],
        properties: {
            username: {
                type: "string"
            },
            slug: {
                type: "string"
            },
            pid: {
                type: "string"
            }
        }
    },
    headers: {
        type: "object",
        required: [
            "username",
            "slug",
            "pid"
        ],
        properties: {
            username: {
                type: "string"
            },
            slug: {
                type: "string"
            },
            pid: {
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
    params: {
        type: "object",
        required: [
            "username",
            "slug",
            "pid"
        ],
        properties: {
            username: {
                type: "string"
            },
            slug: {
                type: "string"
            },
            pid: {
                type: "string"
            }
        }
    },
    headers: {
        type: "object",
        required: [
            "username",
            "slug",
            "pid"
        ],
        properties: {
            username: {
                type: "string"
            },
            slug: {
                type: "string"
            },
            pid: {
                type: "string"
            }
        }
    },
    response: {
        204: {}
    }
};
