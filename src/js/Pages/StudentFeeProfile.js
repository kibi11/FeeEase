import React, { useState, useEffect } from "react";

import "./StudentFeeProfile.scss";
import {
  Breadcrumb,
  Calendar,
  Card,
  Flex,
  Button,
  Divider,
  Input,
  Space,
} from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import showStudentList from "./../../sampleData/StudentList.json";

const { Search } = Input;

const StudentFeeProfile = ({ selectedStudent, setSelectedStudent }) => {
  const [selectedStudentDetail, setSelectedStudentDetail] = useState();
  const [loading, setLoading] = useState(true);
  const [primaryDetails, setPrimaryDetails] = useState([]);

  useEffect(() => {
    if (loading) {
      SearchStudentDetails();
    }
    console.log("Inside use", loading);
  }, []);

  async function SearchStudentDetails() {
    console.log("search with ", selectedStudent);

    // sync call to find student details
    const result = await window.electronAPI.find_student(selectedStudent);
    console.log("The result of the selected student", result?.[0]);
    let finalResult = result?.[0];
    setLoading(false);
    setSelectedStudentDetail(finalResult);
    let tempDetails = await Object.entries({
      "Roll No.": finalResult?.rollno,
      Gender: finalResult?.gender,
      //   "D.O.B": finalResult?.dob,
      "Admission No.": finalResult?.admission_no,
    });
    console.log("primary-temp", tempDetails);
    setPrimaryDetails(tempDetails);
  }

  // on Fee Payment

  const onFeePayment = () => {};

  // on Cancel

  const onPaymentCancel = () => {
    setSelectedStudent();
    setSelectedStudentDetail();
  };

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
      <Divider></Divider>
      {/* <div>{selectedStudent?.name}</div> */}
      <div className="student-fee-profile-first">
        {/* left side  */}
        <Card>
          <h2>{selectedStudent?.name}</h2>
          <Divider orientation="right">{`Class ${selectedStudent?.class}`}</Divider>
          <div className="student-fee-profile-details">
            {primaryDetails.map((item, index) => {
              console.log("THis is item", item[0], item[1], index);
              return (
                <div className="student-fee-profile-details-info" key={index}>
                  <div
                    style={{
                      width: "50%",
                      color: "rgba(0, 0, 0, 0.45)",
                    }}
                  >
                    {item[0]} :
                  </div>
                  <div style={{ width: "50%" }}>{item[1]}</div>
                </div>
              );
            })}
          </div>
        </Card>
        {/* Right Side - Calender view */}
        {/* <Divider orientation="vertical"></Divider> */}
        <Card className="calender-container">
          <div className="calender-groups">
            <Card></Card>
            <Card></Card>
            <Card></Card>
          </div>
          <div className="calender-groups">
            <Card></Card>
            <Card></Card>
            <Card></Card>
          </div>
          <div className="calender-groups">
            <Card></Card>
            <Card></Card>
            <Card></Card>
          </div>
          <div className="calender-groups">
            <Card></Card>
            <Card></Card>
            <Card></Card>
          </div>
        </Card>
      </div>
      <div className="student-fee-profile-second">
        <Flex gap="small" align="center" justify="center">
          <Button type="primary" block size="large">
            Pay Fees
          </Button>
          <Button block size="large" onClick={onPaymentCancel}>
            Cancel
          </Button>
        </Flex>
      </div>
    </>
  );
};

export default StudentFeeProfile;
