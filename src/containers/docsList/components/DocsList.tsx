import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import * as moment from 'moment';
import { Button, Modal, message } from 'antd';
import DocsListStore from '../DocsListStore';
import { userAuth } from '../../../utils/util';
const { lanhuLink } = require('../../../system.config');
const lanHuImg = require('./lanhu.png');
import './index.css';

export interface DocsListProps {
    docsList: DocsListStore;
}

export interface DocsListState {
    openDialog: boolean;
}

@inject('docsList')
@observer
class DocsList extends React.Component<DocsListProps & RouteComponentProps<any>, DocsListState> {

    constructor(props: DocsListProps & RouteComponentProps<any>) {
        super(props);
    }


    componentDidMount() {
        const { docsList: { fetchDocsList } } = this.props;
        fetchDocsList();
    }

    handleDocsClick = (e: any) => {
        e.stopPropagation();
        let ele = e.target;
        ele.classList.toggle('active');
    };

    handleUploadButton = () => {
        let { history } = this.props;
        history.push('/upload');
    };

    handleDeleteButton = (docId: string, docsTypeId: string, docsVersionId: string) => {
        const { docsList: { deleteDoc } } = this.props;
        Modal.confirm({
            content: '确认要删除吗？',
            onOk: () => {
                deleteDoc(docId, docsTypeId, docsVersionId).then(
                    (result) => {
                        if (result.success) {
                            message.success('文档删除成功！');
                        }
                    }
                );
            },
            okText: '确认',
            cancelText: '取消',
        })
    };

    // 对文档类型进行排序：产品、交互、设计
    sortDocsTypeList = (arrayList: Array<Object>) => {
        let sortType = ['产品', '交互', '设计'];
        let result: Array<Object> = [];
        arrayList.map((type: any) => {
            let index = sortType.findIndex((item) => item === type.docsTypeName);
            if (index > -1) {
                result[index] = type;
            } else {
                sortType.push(type.docsTypeName);
                result[sortType.length - 1] = type;
            }
        });
        return result;
    };

    render() {
        let {
            authenticate,
            admin
        } = userAuth();
        const { docsList: { docsItemList } } = this.props;
        return (
            <div className='DocsList-container'>
                <a className='Home-lanhuButton' target='_blank' href={lanhuLink}>
                    <img src={lanHuImg} alt="蓝湖传送门" />
                </a>
                {(authenticate && admin && <Button className='Home-uploadButton' onClick={this.handleUploadButton}> 上传文档 </Button>)}
                {
                    docsItemList.map((docs: any) => (
                        <div key={docs._id} className='DocsList-wrapper' onClick={(e) => this.handleDocsClick(e)}>
                            {docs.docsName}
                            <ul>
                                {
                                    this.sortDocsTypeList(docs.docsTypes).map(({ docsTypeId, docsTypeName, versions }: any, index: number) =>
                                        <li key={docsTypeId} className='DocsVersions-wrapper' onClick={(e) => this.handleDocsClick(e)}>
                                            {docsTypeName}
                                            <ul>
                                                {
                                                    versions.map(({ link, version, createInstance, _id: docsVersionId }: any, vindex: number) =>
                                                        <li key={vindex}>
                                                            <a href={link} target='_blank' title={version} className='DocsList-version'> {version} </a>
                                                            <span className='DcosList-dotLine'></span>
                                                            <span className='DocsList-createInstance'>{moment(createInstance).format('YYYY-MM-DD HH:mm')}</span>
                                                            {(authenticate && admin && <span className='DocsList-deleteBtn' onClick={() => this.handleDeleteButton(docs._id, docsTypeId, docsVersionId)}> 删除 </span>)}
                                                        </li>
                                                    )
                                                }
                                            </ul>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    )

                    )
                }
            </div>
        );
    }

}

export default withRouter(DocsList);