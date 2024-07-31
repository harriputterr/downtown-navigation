import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_IAM_ACCESS_KEY!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_IAM_SECRET_KEY!,
    },
});
