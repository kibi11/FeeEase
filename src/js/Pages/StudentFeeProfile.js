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
  Modal,
  Checkbox,
} from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import academicYearDataList from "../../config/academicYear.json";
import academicChargesList from "../../config/academicCharges.json";

const { Search } = Input;
const academicYearData = academicYearDataList?.data;
const sessionName = "session_2024";
const academicCharges = academicChargesList[sessionName];

const monthNames = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

const StudentFeeProfile = ({ selectedStudent, setSelectedStudent }) => {
  const [selectedStudentDetail, setSelectedStudentDetail] = useState();
  const [loading, setLoading] = useState(true);
  const [primaryDetails, setPrimaryDetails] = useState([]);
  const [modalFormDetails, setModalFormDetails] = useState({
    monthIds: [...Array(12)],
    session_fee: false,
    school_fund: false,
    exam_fee: false,
  });
  const [studentTotalAmount, setStudentTotalAmount] = useState(0);
  // temp change
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      SearchStudentDetails();
    }
    console.log("Inside use", loading);
  }, []);

  // Main function to make api call for the selected student
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

  const onFeePayment = () => {
    setIsModalOpen(true);
  };

  // on Cancel

  const onPaymentCancel = () => {
    setSelectedStudent();
    setSelectedStudentDetail();
  };

  // Calender Month View

  const getCalendermonthColor = (month, keyId) => {
    const date = new Date();
    // console.log("THis is the calender", month, keyId);
    // console.log(selectedStudentDetail?.[keyId]);
    // console.log("This is the today's number", (date.getMonth() - 3) % 12);
    // console.log("This is Month's number", monthNames.indexOf(month));

    // if fees given
    if (selectedStudentDetail?.[keyId]) {
      return "calender-item-color-paid";
    }
    // if months have crossed but fess is not given
    else if ((date.getMonth() - 3) % 12 >= monthNames.indexOf(month)) {
      return "calender-item-color-pending";
    }
    // if months have not been reached yet
    else {
      return "calender-item-color-await";
    }
  };

  // Modal functions;

  // Modal Logic
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const onModalFormClick = (type, month, keyId) => {
    console.log("The click happended");
    console.table(type, keyId, month);
    const tempModalFormDetails = { ...modalFormDetails };
    let tempCharges = studentTotalAmount;
    switch (type) {
      case "month":
        tempModalFormDetails.monthIds[monthNames.indexOf(month)] =
          academicCharges.month;
        tempCharges += academicCharges.month;
        break;

      default:
        if (keyId == "session_fee") {
          if (tempModalFormDetails.session_fee) {
            tempCharges -= academicCharges.otherCharges.session_fee;
          } else {
            tempCharges += academicCharges.otherCharges.session_fee;
          }
          tempModalFormDetails.session_fee = !tempModalFormDetails.session_fee;
        } else if (keyId == "school_fund") {
          if (tempModalFormDetails.school_fund) {
            tempCharges -= academicCharges.otherCharges.school_fund;
          } else {
            tempCharges += academicCharges.otherCharges.school_fund;
          }
          tempModalFormDetails.school_fund = !tempModalFormDetails.school_fund;
        } else if (keyId == "exam_fee") {
          if (tempModalFormDetails.session_fee) {
            tempCharges -= academicCharges.otherCharges.exam_fee;
          } else {
            tempCharges += academicCharges.otherCharges.exam_fee;
          }
          tempModalFormDetails.exam_fee = !tempModalFormDetails.exam_fee;
        }
        break;
    }
    setModalFormDetails(tempModalFormDetails);
    setStudentTotalAmount(tempCharges);
    console.log("This is the modal selection", tempModalFormDetails);
  };

  // on Pay Click
  const onModalConfirmClick = async () => {
    let payload = { ...modalFormDetails };

    for (var key in payload) {
      let keyValues = ["session_fee", "school_fund", "exam_fee"];
      if (keyValues.includes(key)) {
        payload[key] = academicCharges.otherCharges[key];
      }
    }

    console.log("The payload", payload);
    // make a api Call
    const result = await window.electronAPI.make_student_payment(payload);

    if (!result) {
      // show payment Failure
    }

    // show payment Success
  };

  // on Reset Click
  const onResetClick = () => {
    setModalFormDetails({
      monthIds: [...Array(12)],
      session_fee: false,
      school_fund: false,
      exam_fee: false,
    });
    setStudentTotalAmount(0);
  };

  // on Cancel Click

  const handleCancel = () => {
    setIsModalOpen(false);
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
            <Card
              className={`calender-item ${getCalendermonthColor(
                academicYearData[0]?.month,
                academicYearData[0]?.keyId
              )}`}
            >
              {academicYearData[0]?.month}
            </Card>
            <Card
              className={`calender-item ${getCalendermonthColor(
                academicYearData[1]?.month,
                academicYearData[1]?.keyId
              )}`}
            >
              {academicYearData[1]?.month}
            </Card>
            <Card
              className={`calender-item ${getCalendermonthColor(
                academicYearData[2]?.month,
                academicYearData[2]?.keyId
              )}`}
            >
              {academicYearData[2]?.month}
            </Card>
          </div>
          <div className="calender-groups">
            <Card
              className={`calender-item ${getCalendermonthColor(
                academicYearData[3]?.month,
                academicYearData[3]?.keyId
              )}`}
            >
              {academicYearData[3]?.month}
            </Card>
            <Card
              className={`calender-item ${getCalendermonthColor(
                academicYearData[4]?.month,
                academicYearData[4]?.keyId
              )}`}
            >
              {academicYearData[4]?.month}
            </Card>
            <Card
              className={`calender-item ${getCalendermonthColor(
                academicYearData[5]?.month,
                academicYearData[5]?.keyId
              )}`}
            >
              {academicYearData[5]?.month}
            </Card>
          </div>
          <div className="calender-groups">
            <Card
              className={`calender-item ${getCalendermonthColor(
                academicYearData[6]?.month,
                academicYearData[6]?.keyId
              )}`}
            >
              {academicYearData[6]?.month}
            </Card>
            <Card
              className={`calender-item ${getCalendermonthColor(
                academicYearData[7]?.month,
                academicYearData[7]?.keyId
              )}`}
            >
              {academicYearData[7]?.month}
            </Card>
            <Card
              className={`calender-item ${getCalendermonthColor(
                academicYearData[8]?.month,
                academicYearData[8]?.keyId
              )}`}
            >
              {academicYearData[8]?.month}
            </Card>
          </div>
          <div className="calender-groups">
            <Card
              className={`calender-item ${getCalendermonthColor(
                academicYearData[9]?.month,
                academicYearData[9]?.keyId
              )}`}
            >
              {academicYearData[9]?.month}
            </Card>
            <Card
              className={`calender-item ${getCalendermonthColor(
                academicYearData[10]?.month,
                academicYearData[10]?.keyId
              )}`}
            >
              {academicYearData[10]?.month}
            </Card>
            <Card
              className={`calender-item ${getCalendermonthColor(
                academicYearData[11]?.month,
                academicYearData[11]?.keyId
              )}`}
            >
              {academicYearData[11]?.month}
            </Card>
          </div>
        </Card>
      </div>
      <div className="student-fee-profile-second">
        <Flex gap="small" align="center" justify="center">
          <Button type="primary" block size="large" onClick={onFeePayment}>
            Pay Fees
          </Button>
          <Button block size="large" onClick={onPaymentCancel}>
            Cancel
          </Button>
        </Flex>
      </div>
      <Modal
        title="Pay Student Fees"
        style={{ height: "40%" }}
        open={isModalOpen}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <Button type="primary" onClick={onModalConfirmClick}>
            Pay
          </Button>,
          <Button onClick={onResetClick}>Reset</Button>,
          <Button onClick={handleCancel}>Cancel</Button>,
        ]}
      >
        <div style={{ overflow: "auto" }}>
          <Divider orientation="left">Monthly Fees</Divider>
          <Card className="calender-container">
            <div className="calender-groups">
              <Card
                onClick={() =>
                  onModalFormClick(
                    "month",
                    academicYearData[0]?.month,
                    academicYearData[0]?.keyId
                  )
                }
                className={`calender-item ${getCalendermonthColor(
                  academicYearData[0]?.month,
                  academicYearData[0]?.keyId
                )} ${
                  modalFormDetails?.monthIds[0]
                    ? "calender-item-mini-selected"
                    : ""
                }`}
              >
                {academicYearData[0]?.month.slice(0, 3)}
              </Card>
              <Card
                onClick={() =>
                  onModalFormClick(
                    "month",
                    academicYearData[1]?.month,
                    academicYearData[1]?.keyId
                  )
                }
                className={`calender-item ${getCalendermonthColor(
                  academicYearData[1]?.month,
                  academicYearData[1]?.keyId
                )} ${
                  modalFormDetails?.monthIds[1]
                    ? "calender-item-mini-selected"
                    : ""
                }`}
              >
                {academicYearData[1]?.month.slice(0, 3)}
              </Card>
              <Card
                onClick={() =>
                  onModalFormClick(
                    "month",
                    academicYearData[2]?.month,
                    academicYearData[2]?.keyId
                  )
                }
                className={`calender-item ${getCalendermonthColor(
                  academicYearData[2]?.month,
                  academicYearData[2]?.keyId
                )} ${
                  modalFormDetails?.monthIds[2]
                    ? "calender-item-mini-selected"
                    : ""
                }`}
              >
                {academicYearData[2]?.month.slice(0, 3)}
              </Card>
            </div>
            <div className="calender-groups">
              <Card
                onClick={() =>
                  onModalFormClick(
                    "month",
                    academicYearData[3]?.month,
                    academicYearData[3]?.keyId
                  )
                }
                className={`calender-item ${getCalendermonthColor(
                  academicYearData[3]?.month,
                  academicYearData[3]?.keyId
                )} ${
                  modalFormDetails?.monthIds[3]
                    ? "calender-item-mini-selected"
                    : ""
                }`}
              >
                {academicYearData[3]?.month.slice(0, 3)}
              </Card>
              <Card
                onClick={() =>
                  onModalFormClick(
                    "month",
                    academicYearData[4]?.month,
                    academicYearData[4]?.keyId
                  )
                }
                className={`calender-item ${getCalendermonthColor(
                  academicYearData[4]?.month,
                  academicYearData[4]?.keyId
                )} ${
                  modalFormDetails?.monthIds[4]
                    ? "calender-item-mini-selected"
                    : ""
                }`}
              >
                {academicYearData[4]?.month.slice(0, 3)}
              </Card>
              <Card
                onClick={() =>
                  onModalFormClick(
                    "month",
                    academicYearData[5]?.month,
                    academicYearData[5]?.keyId
                  )
                }
                className={`calender-item ${getCalendermonthColor(
                  academicYearData[5]?.month,
                  academicYearData[5]?.keyId
                )} ${
                  modalFormDetails?.monthIds[5]
                    ? "calender-item-mini-selected"
                    : ""
                }`}
              >
                {academicYearData[5]?.month.slice(0, 3)}
              </Card>
            </div>
            <div className="calender-groups">
              <Card
                onClick={() =>
                  onModalFormClick(
                    "month",
                    academicYearData[6]?.month,
                    academicYearData[6]?.keyId
                  )
                }
                className={`calender-item ${getCalendermonthColor(
                  academicYearData[6]?.month,
                  academicYearData[6]?.keyId
                )} ${
                  modalFormDetails?.monthIds[6]
                    ? "calender-item-mini-selected"
                    : ""
                }`}
              >
                {academicYearData[6]?.month.slice(0, 3)}
              </Card>
              <Card
                onClick={() =>
                  onModalFormClick(
                    "month",
                    academicYearData[7]?.month,
                    academicYearData[7]?.keyId
                  )
                }
                className={`calender-item ${getCalendermonthColor(
                  academicYearData[7]?.month,
                  academicYearData[7]?.keyId
                )} ${
                  modalFormDetails?.monthIds[7]
                    ? "calender-item-mini-selected"
                    : ""
                }`}
              >
                {academicYearData[7]?.month.slice(0, 3)}
              </Card>
              <Card
                onClick={() =>
                  onModalFormClick(
                    "month",
                    academicYearData[8]?.month,
                    academicYearData[8]?.keyId
                  )
                }
                className={`calender-item ${getCalendermonthColor(
                  academicYearData[8]?.month,
                  academicYearData[8]?.keyId
                )} ${
                  modalFormDetails?.monthIds[8]
                    ? "calender-item-mini-selected"
                    : ""
                }`}
              >
                {academicYearData[8]?.month.slice(0, 3)}
              </Card>
            </div>
            <div className="calender-groups">
              <Card
                onClick={() =>
                  onModalFormClick(
                    "month",
                    academicYearData[9]?.month,
                    academicYearData[9]?.keyId
                  )
                }
                className={`calender-item ${getCalendermonthColor(
                  academicYearData[9]?.month,
                  academicYearData[9]?.keyId
                )} ${
                  modalFormDetails?.monthIds[9]
                    ? "calender-item-mini-selected"
                    : ""
                }`}
              >
                {academicYearData[9]?.month.slice(0, 3)}
              </Card>
              <Card
                onClick={() =>
                  onModalFormClick(
                    "month",
                    academicYearData[10]?.month,
                    academicYearData[10]?.keyId
                  )
                }
                className={`calender-item ${getCalendermonthColor(
                  academicYearData[10]?.month,
                  academicYearData[10]?.keyId
                )} ${
                  modalFormDetails?.monthIds[10]
                    ? "calender-item-mini-selected"
                    : ""
                }`}
              >
                {academicYearData[10]?.month.slice(0, 3)}
              </Card>
              <Card
                onClick={() =>
                  onModalFormClick(
                    "month",
                    academicYearData[11]?.month,
                    academicYearData[11]?.keyId
                  )
                }
                className={`calender-item ${getCalendermonthColor(
                  academicYearData[11]?.month,
                  academicYearData[11]?.keyId
                )} ${
                  modalFormDetails?.monthIds[11]
                    ? "calender-item-mini-selected"
                    : ""
                }`}
              >
                {academicYearData[11]?.month.slice(0, 3)}
              </Card>
            </div>
          </Card>
          <Divider orientation="left">Other Charges</Divider>
          <div className="student-fee-pay-modal-second">
            {Object.entries(academicCharges?.otherCharges).map((item) => {
              return (
                <>
                  <Card
                    className={`student-fee-pay-modal-second-item ${
                      modalFormDetails[item[0]]
                        ? "calender-item-mini-selected"
                        : ""
                    }`}
                  >
                    <div>{item[0]}</div>
                    <Checkbox
                      checked={modalFormDetails[item[0]]}
                      onChange={() => onModalFormClick("", "", item[0])}
                    ></Checkbox>
                  </Card>
                </>
              );
            })}
          </div>
          <Divider orientation="left">Total</Divider>
          <div className="student-fee-total">₹ {studentTotalAmount}</div>
          <Divider></Divider>
        </div>
      </Modal>
    </>
  );
};

export default StudentFeeProfile;
