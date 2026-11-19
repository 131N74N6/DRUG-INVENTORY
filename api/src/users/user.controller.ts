import { TUser } from "./user.model";
import UserService from "./user.service";

class UserController {
    async addOneUser(props: TUser["addRaw"]) {
        await new UserService().addOneUser(props);
        return { message: "user added successfully" }
    }

    async changeOneUser(props: TUser["changeRaw"]) {
        await new UserService().changeOneUser(props);
        return { message: "user changed successfully" }
    }

    async deleteAllUsers() {
        await new UserService().deleteAllUsers();
        return { message: "all users deleted successfully" }
    }

    async deleteOneUser(id: string) {
        await new UserService().deleteOneUser(id);
        return { message: "one user deleted successfully" }
    }

    async showAllUsers(props: TUser["pagination"]) {
        const users = await new UserService().showAllUsers(props);
        return { data: users, message: "users data retrieved successfully" }
    }

    async showAllUsersTotal() {
        const users = await new UserService().showAllUsersTotal();
        return { data: users, message: "users total retrieved successfully" }
    }

    async showUserById(id: string) {
        const users = await new UserService().showUserById(id);
        return { data: users, message: "user data retrieved successfully" }
    }
}

export default UserController;