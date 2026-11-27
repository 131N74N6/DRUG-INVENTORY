import { ObjectId } from "mongodb";
import { DrugStoreApiError } from "../error/error.service";
import { TDrug } from "./drug.model";
import drugRepository from "./drug.repository";
import uploadToCloudinary from "../cloudinary/cloudinary.service";
import { v2 } from "cloudinary";

class DrugService {
    async addOneDrug(props: TDrug["addRaw"]) {
        const name = this.checkIsInputAString("Drug name", props.name);
        const maxFileSize = 8 * 1024 * 1024;

        if (!props.price || props.price < 1000 || typeof props.price !== "number") {
            throw new DrugStoreApiError(400, "Use the proper price");
        }

        if (!props.stock || props.stock < 0 || props.stock === 0 || typeof props.stock !== "number") {
            throw new DrugStoreApiError(400, "Use the proper stock");
        }

        if (!props.image) {
            throw new DrugStoreApiError(400, "Image is required");
        }

        if (!props.image.type.includes("image")) {
            throw new DrugStoreApiError(400, "You should upload an image file type");
        }

        if (props.image.size > maxFileSize) {
            throw new DrugStoreApiError(400, "This file size is too large");
        }

        const fileArrayBuffer = await props.image.arrayBuffer();
        const fileBuffer = Buffer.from(fileArrayBuffer);

        const result = await uploadToCloudinary({
            file_buffer: fileBuffer,
            foldername: "drug_images",
            mimetype: props.image.type,
            original_name: props.image.name
        });

        await drugRepository.addOneDrug({
            image: result.url,
            image_filename: result.filename,
            image_filetype: result.filetype,
            image_public_id: result.public_id,
            image_resource_type: result.resource_type,
            name: name,
            price: props.price,
            stock: props.stock
        })
    }

    async changeOneDrug(props: TDrug["changeRaw"]) {
        const maxFileSize = 8 * 1024 * 1024;
        const drugId = this.checkIsIdValid("Drug", props._id);
        const drugData = await drugRepository.showDrugDetail(drugId);
        if (!drugData) throw new DrugStoreApiError(404, "Drug not found");

        const name = (props.name !== undefined || props.name !== "") ? 
        this.checkIsInputAString("Drug name", props.name) : drugData.name;

        if (props.price < 1000) {
            throw new DrugStoreApiError(400, "Use the proper price");
        }

        if (props.stock < 0) {
            throw new DrugStoreApiError(400, "Use the proper stock");
        }

        const price = (props.price >= 1000 || props.price !== undefined) ? props.price : drugData.price;
        const stock = (props.stock >= 0 || props.stock !== undefined) ? props.stock : drugData.stock;

        if (props.image) {
            if (!props.image.type.includes("image")) {
                throw new DrugStoreApiError(400, "You should upload an image file type");
            }

            if (props.image.size > maxFileSize) {
                throw new DrugStoreApiError(400, "This file size is too large");
            }

            const fileArrayBuffer = await props.image.arrayBuffer();
            const fileBuffer = Buffer.from(fileArrayBuffer);
            
            const result = await uploadToCloudinary({
                file_buffer: fileBuffer,
                foldername: "drug_images",
                mimetype: props.image.type,
                original_name: props.image.name
            });

            await drugRepository.changeOneDrug({
                _id: drugId,
                image: result.url,
                image_filename: result.filename,
                image_filetype: result.filetype,
                image_public_id: result.public_id,
                image_resource_type: result.resource_type,
                name: name,
                price: price,
                stock: stock
            });
        } else {
            await drugRepository.changeOneDrug({
                _id: drugId,
                image: drugData.image,
                image_filename: drugData.image_filename,
                image_filetype: drugData.image_filetype,
                image_public_id: drugData.image_public_id,
                image_resource_type: drugData.image_resource_type,
                name: name,
                price: price,
                stock: stock
            });
        }
    }

    private checkIsIdValid(field: string, value: unknown) {
        if (!value || value === "" || typeof value !== "string" || !ObjectId.isValid(value)) {
            throw new DrugStoreApiError(400, `${field} is invalid`);
        }
        return value;
    }

    private checkIsInputAString(field: string, value: unknown) {
        if (!value || typeof value !== "string" || value === "") {
            throw new DrugStoreApiError(400, `${field} is invalid`);
        }
        return value;
    }

    async deleteAllDrugs() {
        const drugs = await drugRepository.findAllDrugs();
        
        if (drugs.length === 0) return;

        const result = drugs.map((drug) => {
            return v2.uploader.destroy(drug.image_public_id, { 
                resource_type: drug.image_resource_type 
            });
        });

        await Promise.all([
            ...result, drugRepository.deleteAllDrugs()
        ]);
    }

    async deleteOneDrug(id: string) {
        const drugId = this.checkIsIdValid("Drug", id);
        const drug = await drugRepository.showDrugDetail(drugId);
        if (!drug) return;

        await Promise.all([
            v2.uploader.destroy(drug.image_public_id, { resource_type: drug.image_resource_type }),
            drugRepository.deleteOneDrug(drugId)
        ]);
    }

    async showAvailableDrugs(props: TDrug["pagination"]) {
        return await drugRepository.showAvailableDrugs(props);
    }

    async showEmptyDrugs(props: TDrug["pagination"]) {
        return await drugRepository.showEmptyDrugs(props);
    }

    async showDrugDetail(id: string) {
        const drugId = this.checkIsIdValid("Drug", id);
        const drug = await drugRepository.showDrugDetail(drugId);

        if (!drug) throw new DrugStoreApiError(404, "Drug not found");
        return drug;
    }
}

const drugService = new DrugService();

export default drugService;