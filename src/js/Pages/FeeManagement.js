import React , { useState , useEffect} from "react";
import StudentList from "./StudentList";
import { Input , Space} from "antd";
import {Pagination} from "antd";
import "./FeeManagement.scss";
import showStudentList from "./../../sampleData/StudentList.json";

const {Search} = Input;



const FeeManagement = () => {


    const studentList = showStudentList?.data;
    const [searchValue , setSearchValue] = useState("");
    console.log("student list" , studentList);

    
    useEffect(() => {
        console.log(searchValue);
    }, [searchValue])

    function onSearch () {
        console.log("search with ", searchValue)
        electron.notificationApi.sendNotification('This is my message from the feeManagement');
        
    };

    return (
        <React.Fragment>
            <Space direction="vertical">
                <Search 
                placeholder="Search" 
                value = {searchValue} 
                onChange = {(e) => {setSearchValue(e?.target?.value);}} 
                onSearch={onSearch} 
                enterButton />
            </Space>
            <StudentList studentList={studentList}/>
            <div className="footer-section">
            <Pagination defaultCurrent={1} total={50} />
            </div>
        </React.Fragment>
    )
}


export default FeeManagement;