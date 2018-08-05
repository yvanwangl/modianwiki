import { action, observable } from 'mobx';
import request from '../../utils/request';

export interface DocsItemModel {
    _id: string;
    docsNameId: String,
    docsName: String,
    versions: Array<any>,
    createInstance: Date,
}

class DocsListStore {

    @observable docsItemList: Array<DocsItemModel> = [];

    rootStore: object;

    constructor(initialState: any = {}, rootStore: object) {
        Object.assign(this, initialState);
        this.rootStore = rootStore;
    }

    @action.bound
    async fetchDocsList() {
        let { success, data } = await request('/api/docsList/all');
        if (success) {
            this.docsItemList = data;
        }
        return { success, data };
    }

    @action.bound
    async deleteDoc(docId: string, docsTypeId: string, docsVersionId: string) {
        let { success, data } = await request('/api/submitDocsInfo/delDocsInfo', {
            method: 'post',
            body: JSON.stringify({
                docId,
                docsTypeId,
                docsVersionId,
            })
        });
        if (success) {
            this.fetchDocsList();
        }
        return { success, data };
    }

}

export default DocsListStore;