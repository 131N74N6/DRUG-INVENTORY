import { ObjectId } from "mongodb";
import { db } from "../mongodb/mongodb.service";
import { TCart } from "./cart.model";

class CartRepository {
    private carts = db().collection("carts");

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
            stock: props.stock,
            updated_at: new Date()
        });
    }

    async changeOneDrugInCart(props: TCart["changeResult"]) {
        await this.carts.updateOne({ _id: new ObjectId(props._id) }, {
            $set: {
                price: props.price,
                stock: props.stock
            }
        });
    }

    async deleteAllDrugsInCart() {
        await this.carts.deleteMany();
    }

    async deleteOneDrugFromCart(id: string) {
        await this.carts.deleteOne({ _id: new ObjectId(id) });
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
}

export default CartRepository;