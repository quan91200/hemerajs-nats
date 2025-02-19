export const createdPostSchema = {
    properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        userId: { type: 'string' }
    },
    required: ['title', 'content', 'userId'],
    additionalProperties: false
}

export const deletedPostSchema = {
    properties: {
        postId: { type: 'string' }
    },
    required: ['postId'],
    additionalProperties: false
}