import { TTransaction } from "./transaction.model";
import TransactionService from "./transaction.service";

class TransactionController {
    async addToCart(props: TTransaction["addResult"]) {
        await new TransactionService().addToCart(props);
        return { message: "Successfully added drug to cart" }
    }

    async deleteAllTransactions() {
        await new TransactionService().deleteAllTransactions();
        return { message: "Successfully deleted all drugs from cart" }
    }

    async deleteOneTransaction(id: string) {
        await new TransactionService().deleteOneTransaction(id);
        return { message: "Successfully deleted one drug from cart" }
    }

    async showAllTransactions(props: TTransaction["pagination"]) {
        const carts = await new TransactionService().showAllTransactions(props);
        return { data: carts }
    }
}

export default TransactionController;