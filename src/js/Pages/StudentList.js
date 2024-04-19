import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton } from 'antd';
import './studentList.scss';
const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;


const StudentList = ({studentDataList}) => {
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [list, setList] = useState([]);
    useEffect(() => {
        fetch(fakeDataUrl)
        .then((res) => res.json())
        .then((res) => {
            setInitLoading(false);
            setData(res.results);
            setList(res.results);
        });
    }, []);

    const position = 'bottom';
    const align = 'center';
    return (
        <>
            <List
            className="demo-loadmore-list"
            pagination={{ position , align}}
            loading={initLoading}
            itemLayout="horizontal"
            // loadMore={loadMore}
            dataSource={studentDataList}
            renderItem={(item) => {
                console.log(item)
                return (
                    <>
                    <List.Item
                    actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
                    >
                    <Skeleton avatar title={false} loading={item?.loading} active>
                        <List.Item.Meta
                        // avatar={<Avatar src={} />}
                        title={<p>{item?.name}</p>}
                        description={`Studies in Class ${item?.class}, rollNo : ${item?.rollno}`}
                        />
                        <div>content</div>
                    </Skeleton>
                    </List.Item>
                    </>
                )
            }}
            />
            
        </>
    )
}

export default StudentList;