import React, { useEffect, useState } from "react";
import { Avatar, Button, Divider, Space, Table } from "antd";
import "./TransactionsHistory.scss";

const TransactionsHistory = () => {
  const [transactionsList, setTransactionsList] = useState([]);
  const position = "bottom";
  const align = "center";
  const pageSize = 4;

  const dateToday = new Date();

  const columns = [
    {
      title: "Date",
      key: "trans_date",
      render: (_, record) => {
        let date = record.timestamp.toLocaleDateString();
        return (
          <>
            <p> {date}</p>
          </>
        );
      },
    },
    {
      title: "Transaction Time",
      key: "trans_time",
      render: (_, record) => {
        let timeValue = record.timestamp.toLocaleTimeString();
        return (
          <>
            <p> {timeValue}</p>
          </>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
    {
      title: "Details",
      key: "details",
      render: (_, record) => (
        <Space size="middle">
          <a>Details</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    // fetch transactions
    transactionFetchAPI();
  }, []);

  const transactionFetchAPI = async () => {
    let result = await window.electronAPI.fetch_transactions_all();
    setTransactionsList(result);

    console.log(typeof result[0].timestamp.toISOString());
  };

  return (
    <>
      <h2>Transaction History</h2>
      <Divider></Divider>
      <Table
        columns={columns}
        dataSource={transactionsList}
        pagination={{
          position: ["none", "bottomCenter"],
        }}
      ></Table>
    </>
  );
};

export default TransactionsHistory;
