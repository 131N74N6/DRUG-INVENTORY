import { ObjectId } from "mongodb";
import { db } from "../mongodb/mongodb.service";
import { TUser } from "./user.model";

class UserRepository {
    private users = db().collection("user");

    async addOneUser(props: TUser["addResult"]) {
        const hashedPassword = await Bun.password.hash(props.password, {
            algorithm: "bcrypt", cost: 10
        });

        await this.users.insertOne({
            address: props.address.trim(),
            email: props.email.trim(),
            gender: props.gender.trim(),
            image: props.image.trim(),
            image_filename: props.image_filename.trim(),
            image_filetype: props.image_filetype.trim(),
            image_public_id: props.image_public_id.trim(),
            image_resource_type: props.image_resource_type.trim(),
            password: hashedPassword,
            phone: props.phone.trim(),
            name: props.name.trim(),
            role: props.role.trim()
        });
    }

    async changeOneUser(props: TUser["changeResult"]) {
        await this.users.updateOne({ _id: new ObjectId(props._id) }, {
            $set: {
                address: props.address.trim(),
                gender: props.gender.trim(),
                image: props.image.trim(),
                image_filename: props.image_filename.trim(),
                image_filetype: props.image_filetype.trim(),
                image_public_id: props.image_public_id.trim(),
                image_resource_type: props.image_resource_type.trim(),
                name: props.name.trim(),
                phone: props.phone.trim(),
                role: props.role.trim(),
                updatedAt: new Date()
            }
        });
    }

    async deleteAllUsers() {
        await this.users.deleteMany();
    }

    async deleteOneUser(id: string) {
        const userId = new ObjectId(id);
        await this.users.deleteOne(userId);
    }

    async showAllUsers(props: TUser["pagination"]) {
        const page = props.page;
        const limit = props.limit;
        const skip = (page - 1) * limit;

        return await this.users.find({ role: { $ne: "admin" } })
        .limit(limit)
        .skip(skip)
        .toArray();
    }

    async showExistingUsers() {
        return await this.users.find({ role: { $ne: "admin" } }).toArray();
    }

    async showAllUsersTotal() {
        const users = await this.users.find({ role: { $ne: "admin" } }).toArray();
        return users.length;
    }

    async showUserById(id: string) {
        const userId = new ObjectId(id);
        return await this.users.findOne({ _id: userId });
    }
}

export default UserRepository;