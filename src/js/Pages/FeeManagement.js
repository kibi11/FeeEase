import React, { useState, useEffect } from "react";
import StudentList from "./StudentList";
import { Breadcrumb, Input, Space } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";

import "./FeeManagement.scss";
import showStudentList from "./../../sampleData/StudentList.json";
import StudentFeeProfile from "./StudentFeeProfile";

const { Search } = Input;

const FeeManagement = () => {
  const [studentDataList, setStudentDataList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStudent, setSelectedStudent] = useState();
  // console.log("student list" , studentList);

  useEffect(() => {
    console.log(searchValue);
    onSearch(searchValue);
  }, [searchValue]);

  async function onSearch() {
    console.log("search with ", searchValue);

    // sync call to Search Api
    const result = await window.electronAPI.search(searchValue);
    console.log("The result in the frontend", result);
    setStudentDataList(result);
  }

  return (
    <React.Fragment>
      {selectedStudent ? (
        <>
          <StudentFeeProfile
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />
        </>
      ) : (
        <>
          <Space direction="vertical">
            <Search
              placeholder="Search"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e?.target?.value);
              }}
              onSearch={onSearch}
              enterButton
            />
          </Space>
          <StudentList
            studentDataList={studentDataList}
            setSelectedStudent={setSelectedStudent}
          />
        </>
      )}
    </React.Fragment>
  );
};

export default FeeManagement;
