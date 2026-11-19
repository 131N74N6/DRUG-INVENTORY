import { ObjectId } from "mongodb";
import { db } from "../mongodb/mongodb.service";
import { TDrug } from "./drug.model";

class DrugRepository {
    private drugs = db().collection("drugs");

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
        await this.drugs.updateOne({ _id: new ObjectId(props._id) }, {
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
        });
    }

    async deleteAllDrugs() {
        await this.drugs.deleteMany();
    }

    async deleteOneDrug(id: string) {
        await this.drugs.deleteOne({ _id: new ObjectId(id) });
    }

    async findAllDrugs() {
        return await this.drugs.find().toArray();
    }

    async showAllDrugs(props: TDrug["pagination"]) {
        const page = props.page;
        const limit = props.limit;
        const skip = (page - 1) * limit;

        return await this.drugs.find()
        .limit(limit)
        .skip(skip)
        .toArray();
    }

    async showDrugDetail(id: string) {
        return await this.drugs.findOne({ _id: new ObjectId(id) });
    }
}

export default DrugRepository;