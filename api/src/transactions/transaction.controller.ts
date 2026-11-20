import { TTransaction } from "./transaction.model";
import TransactionService from "./transaction.service";

class TransactionController {
    async deleteAllTransactions() {
        await new TransactionService().deleteAllTransactions();
        return { message: "Successfully deleted all drugs from cart" }
    }

    async deleteOneTransaction(id: string) {
        await new TransactionService().deleteOneTransaction(id);
        return { message: "Successfully deleted one drug from cart" }
    }

    async showAllTransactions(props: TTransaction["pagination"]) {
        const transactions = await new TransactionService().showAllTransactions(props);
        return { data: transactions }
    }

    async showTransactionDetail(id: string) {
        const transaction = await new TransactionService().showTransactionDetail(id);
        return { data: transaction }
    }
}

export default TransactionController;