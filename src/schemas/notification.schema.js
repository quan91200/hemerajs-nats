export const notificationSchema = {
    type: "object",
    properties: {
        userId: { type: "integer" },           // ID người dùng nhận thông báo
        senderId: { type: "integer", nullable: true }, // ID người gửi (có thể null nếu không có)
        type: { type: "string" },               // Loại thông báo (ví dụ: 'comment', 'like', v.v.)
        message: { type: "string" },            // Nội dung thông báo
        isRead: { type: "boolean", default: false }, // Đánh dấu trạng thái đọc chưa (mặc định là false)
        createdAt: { type: "string", format: "date-time" }, // Thời gian tạo thông báo
        updatedAt: { type: "string", format: "date-time" }, // Thời gian cập nhật thông báo
    },
    required: ["userId", "message", "type", "createdAt"], // Các trường bắt buộc
    additionalProperties: false,   // Không cho phép các trường ngoài những trường đã định nghĩa
}

export const createNotificationSchema = {
    type: "object",
    properties: {
        userId: { type: "integer" },
        senderId: { type: "integer", nullable: true },
        type: { type: "string" },
        message: { type: "string" },
        isRead: { type: "boolean", default: false },
        createdAt: { type: "string", format: "date-time" },
    },
    required: ["userId", "message", "type", "createdAt"],
    additionalProperties: false,
}

export const updateNotificationSchema = {
    type: "object",
    properties: {
        userId: { type: "integer" },
        senderId: { type: "integer", nullable: true },
        type: { type: "string" },
        message: { type: "string" },
        isRead: { type: "boolean" }, // Cập nhật trạng thái đã đọc
        updatedAt: { type: "string", format: "date-time" }, // Thời gian cập nhật
    },
    required: ["userId", "message", "type", "updatedAt"],
    additionalProperties: false,
}