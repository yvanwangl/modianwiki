import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import * as moment from 'moment';
import UploadDocsStore from '../UploadDocsStore';
import { FormComponentProps } from 'antd/lib/form';
import { Form, Input, Upload, Button, Icon, Select, Modal } from 'antd';
import DocsNameModal from './DocsNameModal';
const { httpServer } = require('../../../system.config');
import './index.css';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const buttonItemLayout = {
    wrapperCol: { span: 16, offset: 8 },
};

// const uploadProps = {
//     action: '//jsonplaceholder.typicode.com/posts/',
//     onChange({ file, fileList }: any) {
//         if (file.status !== 'uploading') {
//             console.log(file, fileList);
//         }
//     },
//     // defaultFileList: [{
//     //     uid: 1,
//     //     name: 'xxx.png',
//     //     status: 'done',
//     //     reponse: 'Server Error 500', // custom error message to show
//     //     url: 'http://www.baidu.com/xxx.png',
//     // }, {
//     //     uid: 2,
//     //     name: 'yyy.png',
//     //     status: 'done',
//     //     url: 'http://www.baidu.com/yyy.png',
//     // }, {
//     //     uid: 3,
//     //     name: 'zzz.png',
//     //     status: 'error',
//     //     reponse: 'Server Error 500', // custom error message to show
//     //     url: 'http://www.baidu.com/zzz.png',
//     // }],
// };

export interface UploadDocsProps {
    uploadDocs: UploadDocsStore;
}

export interface UploadDocsState {
    openDialog: boolean;
}

@inject('uploadDocs')
@observer
class UploadDocs extends React.Component<UploadDocsProps & FormComponentProps & RouteComponentProps<any>, UploadDocsState> {

    constructor(props: UploadDocsProps & FormComponentProps & RouteComponentProps<any>) {
        super(props);
    }

    handleSubmit = (e: any) => {
        let { form, uploadDocs: { doSubmitDocsInfo }, history } = this.props;
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                doSubmitDocsInfo(values).then((result) => {
                    if (result.success) {
                        Modal.success({
                            title: '上传成功',
                            content: '恭喜小主，上传成功啦 😊'
                        });
                        form.resetFields();
                        history.push('/');
                    } else {
                        Modal.error({
                            title: '上传失败',
                            content: result.errorCode
                        });
                    }
                },
                    () => {
                        Modal.error({
                            title: '上传失败',
                            content: '由于外力影响，上传失败啦 😢'
                        });
                    });
            }
        });
    }

    handleCancel = () => {
        let { history } = this.props;
        history.push('/');
    };

    handleAddName = (addType: string) => {
        const { uploadDocs } = this.props;
        uploadDocs.showModal(addType);
    };

    normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    handleUploadChange = (info: any) => {
        let { form } = this.props;
        if (info.file.status === 'done') {
            form.setFieldsValue({
                filename: info.file.response.data.filename
            });
        } else if (info.file.status === 'error') {

        }
    };

    componentWillUpdate(nextProps: UploadDocsProps & FormComponentProps) {
        const { form: { setFieldsValue }, uploadDocs: { newDocsNameId, newDocsTypeId, resetNewDocsId } } = nextProps;
        if (newDocsNameId) {
            setFieldsValue({
                docsNameId: newDocsNameId
            });
            resetNewDocsId('newDocsNameId');
        }
        if (newDocsTypeId) {
            setFieldsValue({
                docsTypeId: newDocsTypeId
            });
            resetNewDocsId('newDocsTypeId');
        }
    }

    componentDidMount() {
        const { uploadDocs: { fetchDocsNameList, fetchDocsTypeList } } = this.props;
        fetchDocsNameList();
        fetchDocsTypeList();
    }

    modalCreator = () => <DocsNameModal />

    versionValidator = (rule: object, value: string, callback: Function) => {
        if (value.indexOf('/') > 0) {
            callback('版本名称中不能包含 /');
        }
        callback();
    }

    render() {
        const { form: { getFieldDecorator }, uploadDocs: { docsNameList, docsTypeList } } = this.props;
        return (
            <div className='UploadDocs-container'>
                <Form onSubmit={this.handleSubmit} className="uploadDocs-form">
                    <FormItem
                        {...formItemLayout}
                        label="文档名称"
                    >
                        {getFieldDecorator('docsNameId', {
                            rules: [{ required: true, message: '请输入文档名称' }],
                        })(
                            <Select
                                showSearch
                                placeholder="请选择文档名称"
                                optionFilterProp="children"
                                filterOption={(input, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {
                                    docsNameList.map(({ _id, name }) =>
                                        <Option value={_id} key={_id}>{name}</Option>
                                    )
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        style={{ textAlign: 'right' }}
                    >
                        <Button onClick={() => this.handleAddName('docsName')}>
                            + 文档名称
                        </Button>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="文档类型"
                    >
                        {getFieldDecorator('docsTypeId', {
                            rules: [{ required: true, message: '请输入文档类型' }],
                        })(
                            <Select
                                showSearch
                                placeholder="请选择文档类型"
                                optionFilterProp="children"
                                filterOption={(input, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {
                                    docsTypeList.map(({ _id, name }) =>
                                        <Option value={_id} key={_id}>{name}</Option>
                                    )
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        style={{ textAlign: 'right' }}
                    >
                        <Button onClick={() => this.handleAddName('docsType')}>
                            + 文档类型
                        </Button>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="版本号"
                    >
                        {getFieldDecorator('docsVersion', {
                            rules: [
                                { required: true, message: '请输入文档版本号' },
                                {
                                    validator: this.versionValidator
                                }
                            ],
                        })(
                            <Input
                                placeholder="文档版本"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="日期"
                    >
                        {getFieldDecorator('createInstance', {
                            initialValue: moment(new Date()).format('YYYY-MM-DD HH:MM:SS'),
                            rules: [{ required: true, message: '请输入日期' }],
                        })(
                            <Input
                                disabled
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上传附件"
                    >
                        {getFieldDecorator('upload', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            rules: [{ required: true, message: '请上传附件' }],
                        })(
                            <Upload
                                name="logo"
                                action={`${httpServer}/api/upload`}
                                style={{ float: 'left' }}
                                withCredentials={true}
                                onChange={this.handleUploadChange}
                            >
                                <Button>
                                    <Icon type="upload" /> 上传附件 😊
                                </Button>
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('filename')(
                            <Input
                                type='hidden'
                            />
                        )}
                    </FormItem>

                    <FormItem
                        {...buttonItemLayout}
                    >
                        <Button type="primary" htmlType="submit" style={{ marginRight: 20 }}>
                            提交
                        </Button>
                        <Button onClick={this.handleCancel}>
                            取消
                        </Button>
                    </FormItem>
                </Form>
                {this.modalCreator()}
            </div>
        );
    }

}

export default withRouter(Form.create()(UploadDocs));