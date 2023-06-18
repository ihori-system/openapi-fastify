export const updatePetWithForm = {
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
    body: {},
    response: {
        200: {
            content: {
                "application/json": {},
                "application/xml": {}
            }
        },
        405: {
            content: {
                "application/json": {},
                "application/xml": {}
            }
        }
    }
};
