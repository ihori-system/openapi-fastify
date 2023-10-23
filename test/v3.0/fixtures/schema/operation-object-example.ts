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
    response: {
        200: {
            content: {
                "application/json": {}
            }
        },
        405: {
            content: {
                "application/json": {}
            }
        }
    }
};
