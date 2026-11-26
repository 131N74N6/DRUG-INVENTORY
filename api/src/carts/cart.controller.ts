import { TCart } from "./cart.model";
import cartService from "./cart.service";

class CartController {
    async addToCart(props: TCart["addResult"]) {
        await cartService.addToCart(props);
        return { message: "Successfully added drug to cart" }
    }

    async addToTransaction() {
        await cartService.addToTransaction();
        return { message: "Successfully added all drugs in cart to transaction" }
    }

    async changeOneDrugInCart(props: TCart["changeResult"]) {
        await cartService.changeOneDrugInCart(props);
        return { message: "Successfully changed drug in cart" }
    }

    async deleteAllDrugsInCart() {
        await cartService.deleteAllDrugsInCart();
        return { message: "Successfully deleted all drugs from cart" }
    }

    async deleteOneDrugFromCart(id: string) {
        await cartService.deleteOneDrugFromCart(id);
        return { message: "Successfully deleted one drug from cart" }
    }

    async showAllDrugsInCart(props: TCart["pagination"]) {
        const carts = await cartService.showAllDrugsInCart(props);
        return { data: carts }
    }

    async showPriceTotal() {
        const total = await cartService.showPriceTotal();
        return { data: total }
    }
}

const cartController = new CartController();

export default cartController;