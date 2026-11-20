import { ObjectId } from "mongodb";
import { db } from "../mongodb/mongodb.service";
import { TTransaction } from "./transaction.model";

class TransactionRepository {
    private transactions = db().collection("transactions");

    async deleteAllTransactions() {
        await this.transactions.deleteMany();
    }

    async deleteOneTransaction(id: string) {
        await this.transactions.deleteOne({ _id: new ObjectId(id) });
    }

    async showAllTransactions(props: TTransaction["pagination"]) {
        const page = props.page;
        const limit = props.limit;
        const skip = (page - 1) * limit;

        return await this.transactions.find()
        .limit(limit)
        .skip(skip)
        .toArray();
    }

    async showTransactionDetail(id: string) {
        return await this.transactions.findOne({ _id: new ObjectId(id) });
    }
}

export default TransactionRepository;