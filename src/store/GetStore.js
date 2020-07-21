import { decorate, observable, action } from "mobx";

class GetStore {
    // Home
    @observable allAds = [];
    @observable HomeRefresh = false;
    // !Home
    //Tekrar filter için sağ alt buton, filtre iconu, o icon gotoTop yapacak


    // Filter
    @observable filterData = [];
    @observable FilterRefresh = false;
    // !Filter


    // Profile

    @observable historicData = [];
    @observable authUser = []
    @observable ProfileRefresh = false;

    // !Profile
}


export default new GetStore();
