import { TTransaction } from "./transaction.model";
import transactionService from "./transaction.service";

class TransactionController {
    async deleteAllTransactions() {
        await transactionService.deleteAllTransactions();
        return { message: "Successfully deleted all drugs from cart" }
    }

    async deleteOneTransaction(id: string) {
        await transactionService.deleteOneTransaction(id);
        return { message: "Successfully deleted one drug from cart" }
    }

    async showAllTransactions(props: TTransaction["pagination"]) {
        const transactions = await transactionService.showAllTransactions(props);
        return { data: transactions }
    }

    async showTransactionDetail(id: string) {
        const transaction = await transactionService.showTransactionDetail(id);
        return { data: transaction }
    }
}

const transactionController = new TransactionController();

export default transactionController;