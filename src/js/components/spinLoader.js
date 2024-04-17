import { Spin } from "antd";
import React from "react";
import './spinLoader.scss';


const SpinLoader = (props) => {
    return (
        <>
            <div className="spin-loader-container">
             <Spin size={props.size} tip={props.tip}/>
            </div>
        </>
    )
}

export default SpinLoader;