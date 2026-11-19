export type CloudinaryUploadResult = {
    filename: string;
    filetype: string;
    public_id: string;
    resource_type: string;
    url: string;
}

export type CloudinaryUploadOption = {
    file_buffer: Buffer;
    foldername: string;
    mimetype: string;
    original_name: string;
}