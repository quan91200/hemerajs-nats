export default {
    roots: ['<rootDir>/src'],         // Tìm kiếm test trong thư mục src
    testMatch: ['**/__tests__/**/*.test.js'],  // Tìm các file test với đuôi .test.js trong thư mục __tests__
    testEnvironment: 'node',           // Chạy trong môi trường node
    coverageDirectory: './coverage',  // Lưu trữ thông tin coverage
    verbose: true,                      // Hiển thị chi tiết kết quả test
    transformIgnorePatterns: [
        '/node_modules/(?!some-module)/'      // Biến đổi tất cả các mô-đun trong node_modules, ngoại trừ 'some-module'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
}