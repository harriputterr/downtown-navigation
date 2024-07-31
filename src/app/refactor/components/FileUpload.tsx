"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { s3Client } from "@/utils/awsUtils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";
import Image from "next/image";
import { useRef, useState } from "react";
import { MdImage, MdInfoOutline, MdVideoFile } from "react-icons/md";

export function getImageData(file: File) {
    // FileList is immutable, so we need to create a new one
    const dataTransfer = new DataTransfer();

    if (!file) return { displayUrl: "" };
    // Add newly uploaded image
    dataTransfer.items.add(file);

    const displayUrl = URL.createObjectURL(file);

    return { displayUrl };
}

const Preview = ({
    preview,
    previewWidth,
}: {
    preview: string | null;
    previewWidth: number;
}) => {
    if (!preview) {
        return (
            <div className="text-primary/30 bg-black/10 w-full h-full grid place-content-center place-items-center gap-2 py-10 cursor-pointer">
                <MdImage className="text-6xl" />
                <span className="font-bold text-xl">No Image to display</span>
            </div>
        );
    }

    return (
        <Image
            src={preview}
            alt=""
            width={previewWidth}
            height={0} // will be auto as per css
            className="hover:cursor-pointer"
        />
    );
};

const FileUpload = ({
    id,
    label,
    description,
    width,
    fileSource = null,
    saveFileInDbAction,
    objectKey = undefined,
}: {
    id: string;
    width: number;
    label: string;
    description?: string;
    aspectRatio?: number;
    fileSource?: string | null;
    objectKey?: string;

    saveFileInDbAction: (
        url: string
    ) => Promise<{ success: boolean; message: string }>;
}) => {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState(fileSource);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    async function handleFileSave() {
        if (!file) return;

        try {
            toast({
                description: "Generating Signed URL",
            });

            setIsUploading(true);

            // 1. save the url in DB
            // 2. if update in DB is successfull, then add the files to aws
            // appended getTime() in the image url, because we want the next Image not to show us the cached image.
            // The url in DB will be changed, therefore when the page will be revalidated a new image url will be present, Therefore no cached image
            let finalObjectKey = objectKey || randomBytes(32).toString("hex");
            const newFileUrl =
                `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_BUCKET_REGION}.amazonaws.com/${finalObjectKey}` +
                "?" +
                new Date().getTime();

            toast({
                description: "Updating file URL in DB",
            });

            const dbActionRes = await saveFileInDbAction(newFileUrl);

            if (!dbActionRes.success) {
                toast({
                    variant: "destructive",
                    description: dbActionRes.message,
                });
                setIsUploading(false);
                return;
            }

            toast({
                description: "Uploading to S3",
            });

            const command = new PutObjectCommand({
                ContentLength: file.size,
                ContentType: file.type,
                Key: finalObjectKey,
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
                Body: file,
            });

            await s3Client.send(command);

            toast({
                description: "Successfully uploaded to S3",
            });

            setPreview(newFileUrl);
            setFile(null);
        } catch (err) {
            toast({
                variant: "destructive",
                description: "Error while uploading",
            });
            console.log(err);
        }

        setIsUploading(false);
    }

    return (
        <div className="relative space-y-2 w-fit">
            <div className="flex items-center mb-2">
                <div>
                    {!description && <Label htmlFor={id}>{label}</Label>}
                    {description && (
                        <TooltipProvider delayDuration={50}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Label
                                        htmlFor={id}
                                        className="flex gap-1 items-center">
                                        <span>{label}</span>
                                        <MdInfoOutline />
                                    </Label>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{description}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                {/* Undo and save comp */}
                {file && (
                    <div className="ml-auto space-x-3">
                        {!isUploading && (
                            <Button
                                variant={"ghost"}
                                type="button"
                                className="p-0 h-min hover:underline hover:bg-transparent"
                                onClick={() => {
                                    !fileSource
                                        ? setPreview(null)
                                        : setPreview(fileSource);

                                    setFile(null);

                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                }}>
                                Undo
                            </Button>
                        )}

                        <Button
                            type="button"
                            disabled={isUploading}
                            variant={"ghost"}
                            className="p-0 h-min hover:underline hover:bg-transparent"
                            onClick={handleFileSave}>
                            {!isUploading ? "Save" : "Saving..."}
                        </Button>
                    </div>
                )}
            </div>
            <Label htmlFor={id} className="block mx-auto" style={{ width }}>
                <Preview preview={preview} previewWidth={width} />
            </Label>

            <div className="flex gap-2">
                <Input
                    id={id}
                    ref={fileInputRef}
                    type="file"
                    accept={"image/*"}
                    className="hover:bg-muted/40 cursor-pointer"
                    multiple={false}
                    onChange={(e) => {
                        if (!e.target.files) return;

                        const file = e.target.files[0];
                        const { displayUrl } = getImageData(file);

                        setFile(file);
                        setPreview(displayUrl);
                    }}
                />
            </div>
        </div>
    );
};

export default FileUpload;
