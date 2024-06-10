import React, { useEffect, useState } from "react";
import { Avatar, Button, List, Skeleton } from "antd";
import "./studentList.scss";
const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const StudentList = ({ studentDataList, setSelectedStudent }) => {
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    setInitLoading(false);
  }, []);

  const position = "bottom";
  const align = "center";
  const pageSize = 4;
  return (
    <>
      <List
        className="demo-loadmore-list"
        pagination={{ position, align, pageSize }}
        loading={initLoading}
        itemLayout="horizontal"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        // loadMore={loadMore}
        dataSource={studentDataList}
        renderItem={(item) => {
          console.log(item);
          return (
            <>
              <List.Item
                onClick={() => {
                  console.log("hi, item", item);
                  setSelectedStudent(item);
                }}
                actions={[<a key="list-loadmore-edit">Pay</a>]}
                className="student-list-item"
              >
                <Skeleton avatar title={false} loading={item?.loading} active>
                  <List.Item.Meta
                    title={<p>{item?.name}</p>}
                    description={`Studies in Class ${item?.class}, rollNo : ${item?.rollno}`}
                    // onClick={(e, item) => {
                    //   console.log("hi, there", item);
                    //   // setSelectedStudent({});
                    // }}
                  />
                </Skeleton>
              </List.Item>
            </>
          );
        }}
      />
    </>
  );
};

export default StudentList;
