import postService from "../services/post.service.js"
import userService from "../services/user.service.js"
import prisma from "../plugins/prisma.js"
import { faker } from "@faker-js/faker" // Import Faker

describe("Post Service", () => {
    let userId
    console.log(`🆔 PID: ${process.pid}`)

    // Setup: Tạo một người dùng trước khi kiểm thử
    beforeAll(async () => {
        let user = await prisma.user.findFirst()
        if (!user) {
            user = await userService.register({
                email: faker.internet.email(), // Email giả
                password: faker.internet.password(), // Mật khẩu giả
            })
        }
        userId = user.id
        console.log(`👤 User ID: ${userId}`)
    })

    // Test tạo bài đăng
    it("📌 Tạo bài đăng mới", async () => {
        const postData = {
            userId,
            title: faker.lorem.sentence(5), // Tiêu đề giả
            content: faker.lorem.paragraph(3).slice(0, 100), // Nội dung giả
        }

        const post = await postService.createPost(postData)
        console.log("✅ Created Post:", post)

        expect(post).toHaveProperty("id")
        expect(post.title).toBe(postData.title)
        expect(post.content).toBe(postData.content)
    })

    // Test liệt kê các bài đăng của người dùng
    it("📌 Danh sách bài đăng", async () => {
        // Tạo danh sách bài đăng giả
        const postsToCreate = Array.from({ length: 5 }, () => ({
            userId,
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
        }))

        // Đăng nhiều bài
        for (const postData of postsToCreate) {
            await postService.createPost(postData)
        }

        // Lấy danh sách bài đăng
        const posts = await postService.listPostsByUser(userId)
        console.log(`📜 User ${userId} has ${posts.length} posts:`, posts)

        expect(posts.length).toBeGreaterThanOrEqual(5)
        expect(posts[0].userId).toBe(userId)
    })

    // Test xóa bài đăng
    it("📌 Xóa bài đăng", async () => {
        // Tạo một bài đăng giả
        const postData = {
            userId,
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
        }

        const post = await postService.createPost(postData)
        console.log("🗑 Deleting Post:", post)

        // Xóa bài đăng
        const deletedPost = await postService.deletePost({ postId: post.id })
        console.log("✅ Deleted Post:", deletedPost)

        expect(deletedPost.id).toBe(post.id)

        // Kiểm tra bài đăng đã bị xóa khỏi cơ sở dữ liệu
        const postsAfterDelete = await postService.listPostsByUser(userId)
        console.log(`📜 Remaining Posts:`, postsAfterDelete)

        expect(postsAfterDelete.find((p) => p.id === post.id)).toBeUndefined()
    })

    // Xóa dữ liệu test sau khi hoàn tất
    afterAll(async () => {
        console.log(`🧹 Cleaning up test data...`)
        await prisma.post.deleteMany({ where: { userId } })
        await prisma.user.delete({ where: { id: userId } })
        console.log("✅ Cleanup complete!")
    })
})