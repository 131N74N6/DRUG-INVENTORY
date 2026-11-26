import { TUser } from "./user.model";
import userService from "./user.service";

class UserController {
    async changeOneUser(props: TUser["changeRaw"]) {
        await userService.changeOneUser(props);
        return { message: "user changed successfully" }
    }

    async deleteAllUsers() {
        await userService.deleteAllUsers();
        return { message: "all users deleted successfully" }
    }

    async deleteOneUser(id: string) {
        await userService.deleteOneUser(id);
        return { message: "one user deleted successfully" }
    }

    async showAllUsers(props: TUser["pagination"]) {
        const users = await userService.showAllUsers(props);
        return { data: users, message: "users data retrieved successfully" }
    }

    async showAllUsersTotal() {
        const users = await userService.showAllUsersTotal();
        return { data: users, message: "users total retrieved successfully" }
    }

    async showUserById(id: string) {
        const users = await userService.showUserById(id);
        return { data: users, message: "user data retrieved successfully" }
    }
}

const userController = new UserController();

export default userController;