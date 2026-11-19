import { TDrug } from "./drug.model";
import DrugService from "./drug.service";

class DrugController {
    async addOneDrug(props: TDrug["addRaw"]) {
        await new DrugService().addOneDrug(props);
        return { message: "Successfully added one drug" }
    }

    async changeOneDrug(props: TDrug["changeRaw"]) {
        await new DrugService().changeOneDrug(props);
        return { message: "Successfully changed one drug" }
    }

    async deleteAllDrugs() {
        await new DrugService().deleteAllDrugs();
        return { message: "Successfully deleted all drugs" }
    }

    async deleteOneDrug(id: string) {
        await new DrugService().deleteOneDrug(id);
        return { message: "Successfully deleted one drug" }
    }

    async showAllDrugs(props: TDrug["pagination"]) {
        const drugs = await new DrugService().showAllDrugs(props);
        return { data: drugs }
    }

    async showDrugDetail(id: string) {
        const drug = await new DrugService().showDrugDetail(id);
        return { data: drug }
    }
}

export default DrugController;