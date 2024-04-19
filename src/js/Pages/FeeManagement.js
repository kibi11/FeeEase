import React , { useState , useEffect} from "react";
import StudentList from "./StudentList";
import { Input , Space} from "antd";
import {Pagination} from "antd";
import "./FeeManagement.scss";
import showStudentList from "./../../sampleData/StudentList.json";

const {Search} = Input;



const FeeManagement = () => {

    const [studentDataList , setStudentDataList] = useState([]);
    const [searchValue , setSearchValue] = useState("");
    // console.log("student list" , studentList);

    
    useEffect(() => {
        console.log(searchValue);
        onSearch(searchValue);
    }, [searchValue])

    async function onSearch () {
            console.log("search with ", searchValue);

            // sync call to Search Api
            const result = await window.electronAPI.search(searchValue);
            console.log("The result in the frontend", result);
            setStudentDataList(result);

        
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
            <StudentList studentDataList={studentDataList}/>
            {/* <div className="footer-section">
            <Pagination defaultCurrent={1} total={50} />
            </div> */}
        </React.Fragment>
    )
}


export default FeeManagement;