// C:/Users/turco/WebstormProjects/situ/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true, // <--- Add this line
    },
    // Optional: If deploying to a subdirectory like username.github.io/my-repo
    basePath: '/my-repo',
    assetPrefix: '/my-repo/', // Also needed if using basePath
};

export default nextConfig;