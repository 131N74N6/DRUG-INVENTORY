import { TUser } from "./user.model";
import userRepository from "./user.repository";
import { DrugStoreApiError } from "../error/error.service";
import { ObjectId } from "mongodb";
import uploadToCloudinary from "../cloudinary/cloudinary.service";
import { v2 } from "cloudinary";

class UserService {
    async changeOneUser(props: TUser["changeRaw"]) {
        const userId = this.checkIdIsValid("user", props._id);

        const user = await userRepository.showUserById(userId);
        if (!user) throw new DrugStoreApiError(404, "user not found");

        const address = (props.address !== undefined || props.address !== "") ? 
        this.checkIsInputAString("address", props.address) : user.address;

        const gender = (props.gender !== undefined || props.gender !== "") ? 
        this.checkIsInputAString("gender", props.gender) : user.gender;

        const name = (props.name !== undefined || props.name !== "") ? 
        this.checkIsInputAString("username", props.name) : user.name;

        const phone = (props.phone !== undefined || props.phone !== "") ? 
        this.checkIsInputAString("phone", props.phone) : user.phone;

        const role = (props.role !== undefined || props.role !== "") ? 
        this.checkIsInputAString("role", props.role) : user.role;

        if (props.image) {
            if (props.image.size > (6 * 1024 * 1024)) {
                throw new DrugStoreApiError(400, "File size is too large");
            }

            if (user.image_resource_type !== "unknown" && user.image !== "unknown") {
                await v2.uploader.destroy(user.image_public_id, {
                    resource_type: user.image_resource_type
                });
            }

            if (!props.image.type.includes("image")) {
                throw new DrugStoreApiError(400, `Unsupported file type: ${props.image.name}`);
            }

            const fileArrayBuffer = await props.image.arrayBuffer();
            const fileBuffer = Buffer.from(fileArrayBuffer);
            
            const uploadedFile = await uploadToCloudinary({
                file_buffer: fileBuffer, 
                foldername: "drugstore_media", 
                mimetype: props.image.type, 
                original_name: props.image.name
            });
            
            await userRepository.changeOneUser({
                _id: userId,
                address: address,
                gender: gender,
                image: uploadedFile.url,
                image_filename: uploadedFile.filename,
                image_filetype: uploadedFile.filetype,
                image_public_id: uploadedFile.public_id,
                image_resource_type: uploadedFile.resource_type,
                name: name,
                role: role ?? "",
                phone: phone
            });
        } else {
            await userRepository.changeOneUser({
                _id: userId,
                address: address,
                gender: gender,
                image: user.image ?? "unknown",
                image_filename: user.image_filename ?? "unknown",
                image_filetype: user.image_filetype ?? "unknown",
                image_public_id: user.image_public_id ?? "unknown",
                image_resource_type: user.image_resource_type ?? "unknown",
                name: name,
                role: role ?? "",
                phone: phone
            });
        }
    }
    
    private checkIdIsValid(field: string, value: unknown) {
        if (!value || value === "" || typeof value !== "string") {
            throw new DrugStoreApiError(400, `invalid ${field}`);
        }
        return value;
    }

    private checkIsInputAString(field: string, value: unknown) {
        if (!value || value === "" || typeof value !== "string" || !ObjectId.isValid(value)) {
            throw new DrugStoreApiError(400, `invalid ${field}`);
        }
        return value;
    }

    async deleteAllUsers() {
        const users = await userRepository.showExistingUsers();

        if (users.length === 0) return;

        const userImages = users.map((user) => {
            v2.uploader.destroy(user.image_public_id, {
                resource_type: user.image_resource_type
            });
        });

        await Promise.all([ ...userImages, userRepository.deleteAllUsers() ]);
    }

    async deleteOneUser(id: string) {
        const userId = this.checkIdIsValid("user", id);
        const userData = await userRepository.showUserById(userId);

        if (!userData) return;

        if (userData.image_public_id !== "unknown" && userData.image_resource_type !== "unknown") {
            await v2.uploader.destroy(userData.image_public_id, { 
                resource_type: userData.image_resource_type 
            });
        }

        await userRepository.deleteOneUser(userId);
    }

    async showAllUsers(props: TUser["pagination"]) {
        return await userRepository.showAllUsers(props);
    }

    async showAllUsersTotal() {
        return await userRepository.showAllUsersTotal();
    }

    async showUserById(id: string) {
        const userId = this.checkIdIsValid("user", id);
        const user = await userRepository.showUserById(userId);

        if (!user) throw new DrugStoreApiError(404, "user not found");
        return user;
    }
}

const userService = new UserService();

export default userService;