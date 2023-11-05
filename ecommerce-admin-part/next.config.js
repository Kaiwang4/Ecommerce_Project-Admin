// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,

//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           {
//             key: 'Permissions-Policy',
//             value: 'geolocation=()' // 这里只设置了 geolocation，根据您的需求来调整
//           }
//         ]
//       }
//     ];
//   }
// }

// module.exports = nextConfig;

const isProd = process.env.NODE_ENV === 'production';
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // NEXT_PUBLIC_API_BASE_URL: isProd ? 'http://www.danielwang-ecommerce.com:4000/' : 'http://localhost:3001/',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // DEV_NEXT_PUBLIC_BASE_URL: "http://localhost:3001/api/auth/callback/google",
    // DEV_NEXTAUTH_URL: "http://localhost:3001"
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Replace '*' with your source if needed
          { key: 'Access-Control-Allow-Methods', value: 'GET,PUT,POST,DELETE,PATCH' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'geolocation=()' // Continue to set the permissions policy as before
          }
        ]
      }
    ];
  }
}

module.exports = nextConfig;

