import { ObjectId } from "mongodb";
import { TCart } from "./cart.model";
import CartRepository from "./cart.repository";
import { DrugStoreApiError } from "../error/error.service";

class CartService {
    async addToCart(props: TCart["addResult"]) {
        await new CartRepository().addToCart(props);
    }

    async changeOneDrugInCart(props: TCart["changeResult"]) {
        await new CartRepository().changeOneDrugInCart(props);
    }

    private checkIdIsValid(field: string, value: unknown) {
        if (!value || value !== "" || typeof value !== "string" || !ObjectId.isValid(value)) {
            throw new DrugStoreApiError(400, `${field} is invalid`);
        }
        return value;
    }

    async deleteAllDrugsInCart() {
        await new CartRepository().deleteAllDrugsInCart();
    }

    async deleteOneDrugFromCart(id: string) {
        const transactionId = this.checkIdIsValid("Transaction", id);
        await new CartRepository().deleteOneDrugFromCart(transactionId);
    }

    async showAllDrugsInCart(props: TCart["pagination"]) {
        return await new CartRepository().showAllDrugsInCart(props);
    }
}

export default CartService;