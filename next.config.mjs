/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                hostname: "plus15-local-bucket.s3.us-east-1.amazonaws.com",
            },
            
            {
                hostname: "all360imagesbucket.s3.ca-central-1.amazonaws.com",
            },
        ],
    },
};

export default nextConfig;
