import { TDrug } from "./drug.model";
import drugService from "./drug.service";

class DrugController {
    async addOneDrug(props: TDrug["addRaw"]) {
        await drugService.addOneDrug(props);
        return { message: "Successfully added one drug" }
    }

    async changeOneDrug(props: TDrug["changeRaw"]) {
        await drugService.changeOneDrug(props);
        return { message: "Successfully changed one drug" }
    }

    async deleteAllDrugs() {
        await drugService.deleteAllDrugs();
        return { message: "Successfully deleted all drugs" }
    }

    async deleteOneDrug(id: string) {
        await drugService.deleteOneDrug(id);
        return { message: "Successfully deleted one drug" }
    }

    async showAllDrugs(props: TDrug["pagination"]) {
        const drugs = await drugService.showAllDrugs(props);
        return { data: drugs }
    }

    async showDrugDetail(id: string) {
        const drug = await drugService.showDrugDetail(id);
        return { data: drug }
    }
}

const drugController = new DrugController();

export default drugController;