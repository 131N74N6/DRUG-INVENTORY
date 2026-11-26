import { ObjectId } from "mongodb";
import { TTransaction } from "./transaction.model";
import TransactionRepository from "./transaction.repository";
import { DrugStoreApiError } from "../error/error.service";

class TransactionService {
    private checkIdIsValid(field: string, value: unknown) {
        if (!value || value === "" || typeof value !== "string" || !ObjectId.isValid(value)) {
            throw new DrugStoreApiError(400, `${field} is invalid`);
        }
        return value;
    }

    async deleteAllTransactions() {
        await new TransactionRepository().deleteAllTransactions();
    }

    async deleteOneTransaction(id: string) {
        const transactionId = this.checkIdIsValid("Transaction", id);
        await new TransactionRepository().deleteOneTransaction(transactionId);
    }

    async showAllTransactions(props: TTransaction["pagination"]) {
        return await new TransactionRepository().showAllTransactions(props);
    }

    async showTransactionDetail(id: string) {
        const transactionId = this.checkIdIsValid("Transaction", id);
        const transaction = await new TransactionRepository().showTransactionDetail(transactionId);
        
        if (!transaction) throw new DrugStoreApiError(404, "Transaction not found");
        return transaction;
    }
}

const transactionService = new TransactionService();

export default transactionService;