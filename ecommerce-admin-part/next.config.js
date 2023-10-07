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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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

