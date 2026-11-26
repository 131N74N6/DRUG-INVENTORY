import { ObjectId } from "mongodb";
import { TCart } from "./cart.model";
import cartRepository from "./cart.repository";
import { DrugStoreApiError } from "../error/error.service";
import { db } from "../mongodb/mongodb.service";

class CartService {
    async addToCart(props: TCart["addResult"]) {
        await cartRepository.addToCart(props);
    }

    async addToTransaction() {
        const session = db().client.startSession();

        try {
            await session.withTransaction(async () => {
                const cartItems = await cartRepository.findAllDrugsInCart(session);

                if (cartItems.length === 0) {
                    throw new DrugStoreApiError(400, "Cart is empty, cannot checkout");
                }

                const drugToUpdate = cartItems.map((drug) => {
                    const drugId = this.checkIdIsValid("Drug", drug.drug_id);
                    return { drug_id: drugId, quantity: drug.quantity }
                });

                await cartRepository.changeDrugsStock(drugToUpdate, session);
                await cartRepository.addToTransaction(cartItems, session);
                await cartRepository.deleteAllDrugsInCart(session);
            });
        } catch (error: any) {
            if (error.message === "INSUFFICIENT_STOCK") {
                throw new DrugStoreApiError(400, "One or more drugs do not have sufficient stock");
            }
        } finally {
            await session.endSession();
        }
    }

    async changeOneDrugInCart(props: TCart["changeResult"]) {
        const productId = this.checkIdIsValid("Drug", props._id);

        if (
            !props.quantity || 
            props.quantity < 0 || 
            props.quantity === 0 || 
            typeof props.quantity !== "number"
        ) {
            throw new DrugStoreApiError(400, "Please input a proper quantity");
        }

        await cartRepository.changeOneDrugInCart({ _id: productId, quantity: props.quantity });
    }

    private checkIdIsValid(field: string, value: unknown) {
        if (!value || value === "" || typeof value !== "string" || !ObjectId.isValid(value)) {
            throw new DrugStoreApiError(400, `${field} is invalid`);
        }
        return value;
    }

    async deleteAllDrugsInCart() {
        await cartRepository.deleteAllDrugsInCart();
    }

    async deleteOneDrugFromCart(id: string) {
        const transactionId = this.checkIdIsValid("Transaction", id);
        await cartRepository.deleteOneDrugFromCart(transactionId);
    }

    async showAllDrugsInCart(props: TCart["pagination"]) {
        return await cartRepository.showAllDrugsInCart(props);
    }

    async showPriceTotal() {
        return await cartRepository.showPriceTotal();
    }
}

const cartService = new CartService();

export default cartService;