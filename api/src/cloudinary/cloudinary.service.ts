import { v2 } from "cloudinary";
import { Readable } from "stream";
import { CloudinaryUploadOption, CloudinaryUploadResult } from "./cloudinary.model";

export default async function uploadToCloudinary(props: CloudinaryUploadOption): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
        const publicId = `${Date.now()}-${props.original_name}`;
        const uploadStream = v2.uploader.upload_stream({
            folder: props.foldername.trim(),
            public_id: publicId,
            resource_type: "auto"
        }, (error, result) => {
            if (error) {
                reject("failed to upload to cloudinary");
                return;
            }

            if (!result) {
                reject(new Error("No response returned from cloudinary"));
                return;
            }

            resolve({
                filename: props.original_name.trim(),
                filetype: props.mimetype.trim(),
                public_id: result.public_id,
                resource_type: result.resource_type,
                url: result.url
            });
        });

        const readableStream = new Readable();
        readableStream.push(props.file_buffer);
        readableStream.push(null);
        readableStream.push(uploadStream);
    });
}