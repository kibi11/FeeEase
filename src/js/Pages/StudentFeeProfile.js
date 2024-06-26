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
  List,
  Table,
  Result,
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

const columnList = [
  {
    title: "Date",
    key: "date",
    render: (_, record) => {
      let date = record.timestamp.toLocaleDateString();
      return <>{date}</>;
    },
  },
  {
    title: "Amount",
    dataIndex: "total_amount",
    key: "total_amount",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

const StudentFeeProfile = ({ selectedStudent, setSelectedStudent }) => {
  const [selectedStudentDetail, setSelectedStudentDetail] = useState();
  const [loading, setLoading] = useState(true);
  const [primaryDetails, setPrimaryDetails] = useState([]);
  const [studentTransactions, setStudentTransactions] = useState([]);
  const [modalFormDetails, setModalFormDetails] = useState({
    monthIds: [...Array(12)],
    session_fee: false,
    school_fund: false,
    exam_fee: false,
  });
  const [studentTotalAmount, setStudentTotalAmount] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState({ status: null });
  // temp change
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      SearchStudentDetails();
      fetchTransaction();
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

  // Main function to fetch transactions;
  async function fetchTransaction() {
    console.log("heloo", selectedStudent.admission_no);
    let result = await window.electronAPI.fetch_transactions_all({
      admission_no: selectedStudent.admission_no,
    });
    setStudentTransactions(result.slice(0, 3));
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
    let payload = {};
    let result;
    let fee_paid = {
      monthIds: modalFormDetails.monthIds,
      otherCharges: {},
    };
    for (var key in modalFormDetails) {
      let keyValues = ["session_fee", "school_fund", "exam_fee"];
      if (keyValues.includes(key) && modalFormDetails[key]) {
        fee_paid["otherCharges"][key] = academicCharges.otherCharges[key];
      }
    }

    payload["fee_paid"] = fee_paid;
    /// add other details to payload

    const otherPayloadData = ["admission_no", "name"];

    for (let key in otherPayloadData) {
      payload[otherPayloadData[key]] =
        selectedStudentDetail[otherPayloadData[key]];
    }

    // special Case
    payload["class_value"] = selectedStudent.class;

    // add total Amount
    payload["total_amount"] = studentTotalAmount;

    console.log("The payload", payload);
    // make a api Call
    result = await window.electronAPI.make_student_payment(payload);
    console.log("The api returned", result);

    let tempTransaction = transactionStatus;
    if (!Boolean(result?.trans_id)) {
      tempTransaction = {
        status: "error",
        title: `Payment failed for ${selectedStudent?.name}`,
        comment: `Something went wrong. Contact Admin!`,
      };
      // show payment Failure
    } else {
      // show payment Success
      tempTransaction = {
        status: "success",
        title: `Payment completed for ${selectedStudent?.name}`,
        comment: `ID : ${result?.trans_id} completed for Admission No: ${result?.admission_no}`,
      };
    }
    setTransactionStatus(tempTransaction);
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
    setModalFormDetails({
      monthIds: [...Array(12)],
      session_fee: false,
      school_fund: false,
      exam_fee: false,
    });
    setStudentTotalAmount(0);
    setTransactionStatus({ status: null });
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
        <div className="student-fee-profile-first-container">
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
          <Card title={"Last Transactions"}>
            <Table
              columns={columnList}
              dataSource={studentTransactions}
              pagination={{
                position: ["none", "none"],
              }}
            ></Table>
          </Card>
        </div>
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
        footer={
          transactionStatus?.status
            ? [
                <Button type="primary" onClick={handleCancel}>
                  Okay
                </Button>,
              ]
            : [
                <Button type="primary" onClick={onModalConfirmClick}>
                  Pay
                </Button>,
                <Button onClick={onResetClick}>Reset</Button>,
                <Button onClick={handleCancel}>Cancel</Button>,
              ]
        }
      >
        {transactionStatus?.status ? (
          <>
            <Result
              status={transactionStatus?.status}
              title={transactionStatus?.title}
              subTitle={transactionStatus?.comment}
            ></Result>
          </>
        ) : (
          <div style={{ overflow: "auto" }}>
            <Divider orientation="left">Monthly Fees</Divider>
            <Card className="calender-container">
              <div className="calender-groups">
                <Card
                  onClick={
                    !selectedStudent[academicYearData[0]?.keyId] &&
                    (() =>
                      onModalFormClick(
                        "month",
                        academicYearData[0]?.month,
                        academicYearData[0]?.keyId
                      ))
                  }
                  className={`calender-item ${
                    !selectedStudent[academicYearData[0]?.keyId]
                      ? "calender-item-modal"
                      : ""
                  }  ${getCalendermonthColor(
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
                  onClick={
                    !selectedStudent[academicYearData[1]?.keyId] &&
                    (() =>
                      onModalFormClick(
                        "month",
                        academicYearData[1]?.month,
                        academicYearData[1]?.keyId
                      ))
                  }
                  className={`calender-item ${
                    !selectedStudent[academicYearData[1]?.keyId]
                      ? "calender-item-modal"
                      : ""
                  } ${getCalendermonthColor(
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
                  onClick={
                    !selectedStudent[academicYearData[2]?.keyId] &&
                    (() =>
                      onModalFormClick(
                        "month",
                        academicYearData[2]?.month,
                        academicYearData[2]?.keyId
                      ))
                  }
                  className={`calender-item ${
                    !selectedStudent[academicYearData[2]?.keyId]
                      ? "calender-item-modal"
                      : ""
                  } ${getCalendermonthColor(
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
                  onClick={
                    !selectedStudent[academicYearData[3]?.keyId] &&
                    (() =>
                      onModalFormClick(
                        "month",
                        academicYearData[3]?.month,
                        academicYearData[3]?.keyId
                      ))
                  }
                  className={`calender-item ${
                    !selectedStudent[academicYearData[3]?.keyId]
                      ? "calender-item-modal"
                      : ""
                  } ${getCalendermonthColor(
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
                  onClick={
                    !selectedStudent[academicYearData[4]?.keyId] &&
                    (() =>
                      onModalFormClick(
                        "month",
                        academicYearData[4]?.month,
                        academicYearData[4]?.keyId
                      ))
                  }
                  className={`calender-item ${
                    !selectedStudent[academicYearData[4]?.keyId]
                      ? "calender-item-modal"
                      : ""
                  } ${getCalendermonthColor(
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
                  onClick={
                    !selectedStudent[academicYearData[5]?.keyId] &&
                    (() =>
                      onModalFormClick(
                        "month",
                        academicYearData[5]?.month,
                        academicYearData[5]?.keyId
                      ))
                  }
                  className={`calender-item ${
                    !selectedStudent[academicYearData[5]?.keyId]
                      ? "calender-item-modal"
                      : ""
                  } ${getCalendermonthColor(
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
                  onClick={
                    !selectedStudent[academicYearData[6]?.keyId] &&
                    (() =>
                      onModalFormClick(
                        "month",
                        academicYearData[6]?.month,
                        academicYearData[6]?.keyId
                      ))
                  }
                  className={`calender-item ${
                    !selectedStudent[academicYearData[6]?.keyId]
                      ? "calender-item-modal"
                      : ""
                  } ${getCalendermonthColor(
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
                  onClick={
                    !selectedStudent[academicYearData[7]?.keyId] &&
                    (() =>
                      onModalFormClick(
                        "month",
                        academicYearData[7]?.month,
                        academicYearData[7]?.keyId
                      ))
                  }
                  className={`calender-item ${
                    !selectedStudent[academicYearData[7]?.keyId]
                      ? "calender-item-modal"
                      : ""
                  } ${getCalendermonthColor(
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
                  onClick={
                    !selectedStudent[academicYearData[8]?.keyId] &&
                    (() =>
                      onModalFormClick(
                        "month",
                        academicYearData[8]?.month,
                        academicYearData[8]?.keyId
                      ))
                  }
                  className={`calender-item ${
                    !selectedStudent[academicYearData[8]?.keyId]
                      ? "calender-item-modal"
                      : ""
                  } ${getCalendermonthColor(
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
                  onClick={
                    !selectedStudent[academicYearData[9]?.keyId] &&
                    (() =>
                      onModalFormClick(
                        "month",
                        academicYearData[9]?.month,
                        academicYearData[9]?.keyId
                      ))
                  }
                  className={`calender-item ${
                    !selectedStudent[academicYearData[9]?.keyId]
                      ? "calender-item-modal"
                      : ""
                  } ${getCalendermonthColor(
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
                  onClick={
                    !selectedStudent[academicYearData[10]?.keyId] &&
                    (() =>
                      onModalFormClick(
                        "month",
                        academicYearData[10]?.month,
                        academicYearData[10]?.keyId
                      ))
                  }
                  className={`calender-item ${
                    !selectedStudent[academicYearData[10]?.keyId]
                      ? "calender-item-modal"
                      : ""
                  } ${getCalendermonthColor(
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
                  onClick={
                    !selectedStudent[academicYearData[11]?.keyId] &&
                    (() =>
                      onModalFormClick(
                        "month",
                        academicYearData[11]?.month,
                        academicYearData[11]?.keyId
                      ))
                  }
                  className={`calender-item ${
                    !selectedStudent[academicYearData[11]?.keyId]
                      ? "calender-item-modal"
                      : ""
                  } ${getCalendermonthColor(
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
                        !selectedStudent[item[0]] ? "calender-item-modal" : ""
                      } ${
                        modalFormDetails[item[0]]
                          ? "calender-item-mini-selected"
                          : ""
                      }`}
                    >
                      <div>{item[0]}</div>
                      <Checkbox
                        disabled={selectedStudent[item[0]]}
                        checked={
                          selectedStudent[item[0]]
                            ? true
                            : modalFormDetails[item[0]]
                        }
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
        )}
      </Modal>
    </>
  );
};

export default StudentFeeProfile;
