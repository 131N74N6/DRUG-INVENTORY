import { ObjectId } from "mongodb";
import { db } from "../mongodb/mongodb.service";
import { TTransaction } from "./transaction.model";

class TransactionRepository {
    private transactions = db().collection("transactions");

    async addToCart(props: TTransaction["addResult"]) {
        await this.transactions.insertOne({
            created_at: new Date(),
            image: props.image.trim(),
            image_filename: props.image_filename.trim(),
            image_filetype: props.image_filetype.trim(),
            image_public_id: props.image_public_id,
            image_resource_type: props.image_resource_type.trim(),
            name: props.name.trim(),
            price: props.price,
            stock: props.stock,
            updated_at: new Date()
        });
    }

    async changeOneTransaction(props: TTransaction["changeResult"]) {
        await this.transactions.updateOne({ _id: new ObjectId(props._id) }, {
            $set: {
                price: props.price,
                stock: props.stock
            }
        })
    }

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
}

export default TransactionRepository;