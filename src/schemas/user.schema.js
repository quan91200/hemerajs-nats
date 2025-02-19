export const registerSchema = {
    properties: {
        email: { type: "string" },
        password: { type: "string" }
    },
    required: ["email", "password"],
    additionalProperties: false
}

export const loginSchema = {
    properties: {
        email: { type: "string" },
        password: { type: "string" }
    },
    required: ["email", "password"],
    additionalProperties: false
}

export const listUsersSchema = {
    properties: {
        page: { type: "integer", minimum: 1, default: 1 },
        limit: { type: "integer", minimum: 1, default: 10 }
    },
    required: [],
    additionalProperties: false
}

export const logoutSchema = {
    properties: {
        userId: { type: "string" }
    },
    required: ["userId"],
    additionalProperties: false
}
