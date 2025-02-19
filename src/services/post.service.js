import prisma from "../plugins/prisma.js"

export async function createPost({ title, content, userId }) {
    return await prisma.post.create({ data: { title, content, userId } })
}

export async function listPosts() {
    return await prisma.post.findMany()
}

// Liệt kê bài đăng của người dùng cụ thể
export async function listPostsByUser(userId) {
    return await prisma.post.findMany({
        where: { userId }, // Lọc bài đăng theo userId
        orderBy: { createdAt: 'desc' },
    })
}

export async function deletePost({ postId }) {
    return await prisma.post.delete({
        where: { id: postId }
    })
}

const postService = {
    createPost,
    listPosts,
    listPostsByUser,
    deletePost
}

export default postService