import { ClientSession, ObjectId } from "mongodb";
import { db } from "../mongodb/mongodb.service";
import { TCart } from "./cart.model";
import { TDrug } from "../drugs/drug.model";
import { TTransaction } from "../transactions/transaction.model";

class CartRepository {
    private carts = db().collection<TCart["data"]>("carts");
    private drugs = db().collection<TDrug["data"]>("drugs");
    private transactions = db().collection<TTransaction["data"]>("transactions");

    async addToCart(props: TCart["addResult"]) {
        await this.carts.insertOne({
            created_at: new Date(),
            image: props.image.trim(),
            image_filename: props.image_filename.trim(),
            image_filetype: props.image_filetype.trim(),
            image_public_id: props.image_public_id,
            image_resource_type: props.image_resource_type.trim(),
            name: props.name.trim(),
            price: props.price,
            quantity: props.quantity,
            updated_at: new Date(),
            drug_id: new ObjectId(props.drug_id)
        });
    }

    async addToTransaction(collectedDrugs: TCart["drugs"][], session?: ClientSession) {
        await this.transactions.insertOne({
            created_at: new Date(),
            drugs: collectedDrugs,
            price_total: collectedDrugs.reduce((sum, drug) => sum + (drug.price * drug.quantity), 0)
        });
    }

    async changeDrugsStock(props: TCart["changeStock"][], session?: ClientSession) {
        if (props.length === 0) return;

        const bulkOperations = props.map((drug) => {
            return {
                updateOne: {
                    filter: { _id: new ObjectId(drug.drug_id), stock: { $gte: drug.quantity } }, 
                    update: { 
                        $inc: { stock: -drug.quantity }, 
                        $set: { updated_at: new Date() } 
                    }
                }
            }
        });

        const result = await this.drugs.bulkWrite(bulkOperations, { session });

        if (result.modifiedCount !== props.length) throw new Error("INSUFFICIENT_STOCK");
    }

    async changeOneDrugInCart(props: TCart["changeResult"]) {
        await this.carts.updateOne({ _id: new ObjectId(props._id) }, {
            $set: { quantity: props.quantity, updated_at: new Date() }
        });
    }

    async deleteAllDrugsInCart(session?: ClientSession) {
        await this.carts.deleteMany({}, { session });
    }

    async deleteOneDrugFromCart(id: string) {
        await this.carts.deleteOne({ _id: new ObjectId(id) });
    }

    async findAllDrugsInCart(session?: ClientSession) {
        return await this.carts.find({}, { session }).toArray();
    }

    async showAllDrugsInCart(props: TCart["pagination"]) {
        const page = props.page;
        const limit = props.limit;
        const skip = (page - 1) * limit;

        return await this.carts.find()
        .limit(limit)
        .skip(skip)
        .toArray();
    }

    async showPriceTotal() {
        const drugs = await this.carts.find({}).toArray();
        const total = drugs.reduce((sum, drug) => sum + (drug.price * drug.quantity), 0);
        return total;
    }
}

const cartRepository = new CartRepository();

export default cartRepository;