import { TCart } from "./cart.model";
import CartService from "./cart.service";

class CartController {
    async addToCart(props: TCart["addResult"]) {
        await new CartService().addToCart(props);
        return { message: "Successfully added drug to cart" }
    }

    async addToTransaction() {
        await new CartService().addToTransaction();
        return { message: "Successfully added all drugs in cart to transaction" }
    }

    async changeOneDrugInCart(props: TCart["changeResult"]) {
        await new CartService().changeOneDrugInCart(props);
        return { message: "Successfully changed drug in cart" }
    }

    async deleteAllDrugsInCart() {
        await new CartService().deleteAllDrugsInCart();
        return { message: "Successfully deleted all drugs from cart" }
    }

    async deleteOneDrugFromCart(id: string) {
        await new CartService().deleteOneDrugFromCart(id);
        return { message: "Successfully deleted one drug from cart" }
    }

    async showAllDrugsInCart(props: TCart["pagination"]) {
        const carts = await new CartService().showAllDrugsInCart(props);
        return { data: carts }
    }

    async showPriceTotal() {
        const total = await new CartService().showPriceTotal();
        return { data: total }
    }
}

export default CartController;