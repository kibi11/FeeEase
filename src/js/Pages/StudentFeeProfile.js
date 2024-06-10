import React, { useState, useEffect } from "react";

import "./StudentFeeProfile.scss";
import { Breadcrumb, Input, Space } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import showStudentList from "./../../sampleData/StudentList.json";

const { Search } = Input;

const StudentFeeProfile = ({ selectedStudent, setSelectedStudent }) => {
  const [selectedStudentDetail, setSelectedStudentDetail] = useState();

  useEffect(() => {
    SearchStudentDetails();
  }, []);

  async function SearchStudentDetails() {
    console.log("search with ", selectedStudent);

    // sync call to find student details
    const result = await window.electronAPI.find_student(selectedStudent);
    console.log("The result in the frontend", result);
    setSelectedStudentDetail(result);
  }

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: (
              <a>
                <HomeOutlined />
                <span style={{ marginInlineStart: "8px" }}>Home</span>
              </a>
            ),
            onClick: () => {
              setSelectedStudent();
            },
          },
          {
            title: (
              <>
                {" "}
                <UserOutlined /> <span>Student Details</span>
              </>
            ),
          },
        ]}
      />
      <div>{selectedStudent?.name}</div>
      <div>{selectedStudent?.class}</div>
    </>
  );
};

export default StudentFeeProfile;
