import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_IAM_ACCESS_KEY!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_IAM_SECRET_KEY!,
    },
});

export const deleteObject = async (objectKey: string) => {
    const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: objectKey,
    });

    try {
        await s3Client.send(deleteCommand);
        return { success: true, message: "Object deleted from AWS" };
    } catch (err) {
        return {
            success: false,
            message: "Error while deleting object from AWS",
        };
    }
};
