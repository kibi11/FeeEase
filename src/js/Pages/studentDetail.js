import React, {useState , useEffect} from "react";
import "./studentDetail.scss";
import SpinLoader from "../components/spinLoader";
import { Divider } from "antd";
import {Button,
    Cascader,
    Checkbox,
    ColorPicker,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Slider,
    Switch,
    TreeSelect,
    Upload,
} from 'antd';
import TextArea from "antd/es/input/TextArea";
import generalStudentDetails from '../../config/generalStudentConfig.json';
import enrollmentStudentDetails from '../../config/enrollmentStudentConfig.json';
import otherStudentDetails from '../../config/otherStudentConfig.json';




const StudentDetail = () => {

    const [contentLoading, setContentLoading] = useState(true);

    const generalStudentDetailItems = generalStudentDetails?.data;
    const enrollmentStudentDetailItems = enrollmentStudentDetails?.data;
    const OtherStudentDetailItems = otherStudentDetails?.data

    useEffect(() => {

        const setLoadingOff = () => {
            console.log("loading off...");
            setContentLoading(false);
        }
        const myTimeout = setTimeout(setLoadingOff, 500);
        if(!contentLoading){
            clearTimeout(myTimeout);
        }

        
    },)

    const getItemFormatComponent = (item) => {

    switch (item?.type) {
        case 'input':
            return(
                <Form.Item label={item?.label}>
                    <Input/>
                </Form.Item>
            )
        case 'select':
            return(
                <Form.Item label={item?.label}>
                    <Select>
                        {
                            item?.options?.map(options => {
                                return(
                                    <Select.Option value = {options.value}>{options.title}</Select.Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
            )
        case 'date':
            return(
                <Form.Item label={item?.label}>
                    <DatePicker format={'DD/MM/YYYY'}/>
                </Form.Item>
            )
        case 'number':
            return(
                <Form.Item label={item?.label}>
                    <InputNumber/>
                </Form.Item>
            )
        case 'text':
            return(
                <Form.Item label={item?.label}>
                    <TextArea rows={4}/>
                </Form.Item>
            )
        default:
            return null;
            break;
    }

    }

    return (
        <>
            {
                contentLoading ? 
                <SpinLoader size="large"/>:
                <>
                    <div className="student-detail-container">
                    <Form
                        labelCol={{
                        span: 4,
                        }}
                        wrapperCol={{
                        span: 14,
                        }}
                        layout="horizontal"
                        // disabled={componentDisabled}
                        style={{
                        overflow: 'auto'
                        }}
                    >
                        <Divider orientation="left">General Information</Divider>
                        {
                           generalStudentDetailItems.map(studentItem => {
                                return (
                                    <React.Fragment key={studentItem?.key}>
                                    {getItemFormatComponent(studentItem)}
                                    </React.Fragment>
                                )        
                           })
                        }
                        <Divider orientation="left">Enrollment Details</Divider>
                        {
                           enrollmentStudentDetailItems.map(studentItem => {
                                return (
                                    <React.Fragment key={studentItem?.key+100}>
                                    {getItemFormatComponent(studentItem)}
                                    </React.Fragment>
                                )        
                           })
                        }
                        <Divider orientation="left">Other Details</Divider>
                        {
                           OtherStudentDetailItems.map(studentItem => {
                                return (
                                    <React.Fragment key={studentItem?.key+1000}>
                                    {getItemFormatComponent(studentItem)}
                                    </React.Fragment>
                                )        
                           })
                        }
                    </Form>
                    </div>
                </>
            }
        </>
    )
}


export default StudentDetail;