import hp from 'hemera-plugin'
import { createdPostSchema, deletedPostSchema } from '../schemas/post.schema.js'
import { createPost, listPosts, deletePost } from '../services/post.service.js'

const postPlugin = hp((hemera, opts, done) => {
    // Hiển thị PID để kiểm tra Load Balancing
    console.log(`User Plugin loaded on PID: ${process.id}`)
    // Tạo bài viết
    hemera.add(
        { topic: 'post', cmd: 'create', schema: createdPostSchema },
        async (req, reply) => {
            try {
                const post = await createPost(req)
                hemera.log.info(`🟢 Tạo bài viết: ${post.title}`)
                return post
            } catch (err) {
                hemera.log.error(`❌ Lỗi khi tạo bài viết:`, err)
                reply({
                    error: 'CREATE_POST_FAILED',
                    message: 'Lỗi khi tạo bài viết. Vui lòng thử lại sau.'
                })
            }
        }
    )
    // Danh sách bài viết
    hemera.add({ topic: 'post', cmd: 'list' }, async (req, reply) => {
        try {
            const posts = await listPosts()
            hemera.log.info(`📋 Danh sách bài viết: ${posts.length} bài viết`)
            return posts
        } catch (err) {
            hemera.log.error(`❌ Lỗi khi lấy danh sách bài viết:`, err)
            reply({
                error: 'LIST_POSTS_FAILED',
                message: 'Lỗi khi lấy danh sách bài viết. Vui lòng thử lại sau.'
            })
        }
    })
    // Danh sách bài viết của người dùng theo userId
    hemera.add(
        { topic: 'post', cmd: 'listByUser' },
        async (req, reply) => {
            try {
                const posts = await listPostsByUser(req.userId)
                hemera.log.info(`📋 Danh sách bài viết của người dùng ID ${req.userId}: ${posts.length} bài viết`)
                return posts
            } catch (err) {
                hemera.log.error(`❌ Lỗi khi lấy danh sách bài viết của người dùng: ${err.message}`, err)
                reply({
                    error: 'LIST_POSTS_BY_USER_FAILED',
                    message: 'Lỗi khi lấy danh sách bài viết của người dùng. Vui lòng thử lại sau.',
                    details: err.message  // Trả lại thông tin lỗi chi tiết
                })
            }
        }
    )
    // Xóa bài viết
    hemera.add(
        { topic: 'post', cmd: 'delete', schema: deletedPostSchema },
        async (req, reply) => {
            try {
                const post = await deletePost(req)
                hemera.log.info(`🗑 Xóa bài viết: ${post.title}`)
                return post
            } catch (err) {
                hemera.log.error(`❌ Lỗi khi xóa bài viết:`, err)
                reply({
                    error: 'DELETE_POST_FAILED',
                    message: 'Lỗi khi xóa bài viết. Vui lòng thử lại sau.'
                })
            }
        }
    )
    done()
})

export default postPlugin