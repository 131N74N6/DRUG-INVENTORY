import { ObjectId } from "mongodb";
import { db } from "../mongodb/mongodb.service";
import { TDrug } from "./drug.model";
import { TCart } from "../carts/cart.model";
import { TTransaction } from "../transactions/transaction.model";

class DrugRepository {
    private carts = db().collection<TCart["data"]>("carts");
    private drugs = db().collection<TDrug["data"]>("drugs");
    private transactions = db().collection<TTransaction["data"]>("transactions");

    async addOneDrug(props: TDrug["addResult"]) {
        await this.drugs.insertOne({
            created_at: new Date(),
            image: props.image.trim(),
            image_filename: props.image_filename.trim(),
            image_filetype: props.image_filetype.trim(),
            image_public_id: props.image_public_id.trim(),
            image_resource_type: props.image_resource_type.trim(),
            name: props.name.trim(),
            price: props.price,
            stock: props.stock,
            updated_at: new Date()
        });
    }

    async changeOneDrug(props: TDrug["changeResult"]) {
        await Promise.all([
            this.transactions.updateMany({ "drugs.$[p].drug_id": new ObjectId(props._id) }, {
                $set: {
                    "drugs.$[p].image": props.image.trim(),
                    "drugs.$[p].image_filename": props.image_filename.trim(),
                    "drugs.$[p].image_filetype": props.image_filetype.trim(),
                    "drugs.$[p].image_public_id": props.image_public_id.trim(),
                    "drugs.$[p].image_resource_type": props.image_resource_type.trim(),
                    "drugs.$[p].name": props.name.trim(),
                    "drugs.$[p].price": props.price,
                    "drugs.$[p].updated_at": new Date()
                }
            }, { arrayFilters: [{ "p.drug_id": new ObjectId(props._id) }] }),
            this.carts.updateMany({ drug_id: new ObjectId(props._id) }, {
                $set: {
                    image: props.image.trim(),
                    image_filename: props.image_filename.trim(),
                    image_filetype: props.image_filetype.trim(),
                    image_public_id: props.image_public_id.trim(),
                    image_resource_type: props.image_resource_type.trim(),
                    name: props.name.trim(),
                    price: props.price,
                    updated_at: new Date()
                }
            }),
            this.drugs.updateOne({ _id: new ObjectId(props._id) }, {
                $set: {
                    image: props.image.trim(),
                    image_filename: props.image_filename.trim(),
                    image_filetype: props.image_filetype.trim(),
                    image_public_id: props.image_public_id.trim(),
                    image_resource_type: props.image_resource_type.trim(),
                    name: props.name.trim(),
                    price: props.price,
                    stock: props.stock,
                    updated_at: new Date()
                }
            }),
        ]);
    }

    async deleteAllDrugs() {
        await Promise.all([
            this.transactions.deleteMany(),
            this.carts.deleteMany(),
            this.drugs.deleteMany()
        ]);
    }

    async deleteOneDrug(id: string) {
        const affectedTransactions = await this.transactions.find({ "drugs.drug_id": new ObjectId(id) })
        .toArray();

        const changeTransactions = affectedTransactions.map((transaction) => {
            let substractedPrice = 0;

            for (const drug of transaction.drugs) {
                if (drug.drug_id.toString() === id) {
                    substractedPrice += drug.price * drug.quantity;
                }
            }

            return this.transactions.updateOne({ _id: transaction._id }, {
                $pull: { drugs: { drug_id: new ObjectId(id) }},
                $inc: { price_total: -substractedPrice }
            });
        });

        await Promise.all([
            ...changeTransactions,
            this.carts.deleteMany({ drug_id: new ObjectId(id) }),
            this.drugs.deleteOne({ _id: new ObjectId(id) })
        ]);
    }

    async findAllDrugs() {
        return await this.drugs.find().toArray();
    }

    async showAvailableDrugs(props: TDrug["pagination"]) {
        const page = props.page;
        const limit = props.limit;
        const skip = (page - 1) * limit;

        return await this.drugs.find({ stock: { $gte: 1 }})
        .limit(limit)
        .skip(skip)
        .toArray();
    }

    async showEmptyDrugs(props: TDrug["pagination"]) {
        const page = props.page;
        const limit = props.limit;
        const skip = (page - 1) * limit;

        return await this.drugs.find({ stock: { $eq: 0 }})
        .limit(limit)
        .skip(skip)
        .toArray();
    }

    async showDrugDetail(id: string) {
        return await this.drugs.findOne({ _id: new ObjectId(id) });
    }
}

const drugRepository = new DrugRepository();

export default drugRepository;