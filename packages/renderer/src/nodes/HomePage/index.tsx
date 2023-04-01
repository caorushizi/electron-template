import { useRequest } from "ahooks";
import React, { FC, useEffect, useState } from "react";
import { Button } from "antd";
import useElectron from "../../hooks/electron";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { increase, selectCount } from "../../store/appSlice";

const HomePage: FC = () => {
  const { index, rendererEvent, removeEventListener } = useElectron();
  const [eventCount, setEventCount] = useState(0);
  const { data } = useRequest(index);
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  const onTestEvent = (e: any, args: string) => {
    console.log("收到主进程的参数： ", args);
    setEventCount((count) => count + 1);
  };

  useEffect(() => {
    rendererEvent("test-event", onTestEvent);

    return () => {
      removeEventListener("test-event", onTestEvent);
    };
  }, []);

  return (
    <div className="home-page">
      <div className="item">
        <i></i>
        <div className="details">
          <h3>可执行文件路径</h3>
          {data?.binPath}
        </div>
      </div>
      <div className="item">
        <i></i>
        <div className="details">
          <h3>数据库文件路径</h3>
          {data?.dbPath}
        </div>
      </div>
      <div className="item">
        <i></i>
        <div className="details">
          <h3>本地存储路径</h3>
          {data?.workspace}
        </div>
      </div>
      <div className="item">
        <i></i>
        <div className="details">
          <h3>当前系统</h3>
          {data?.platform}
        </div>
      </div>
      <div className="item">
        <i></i>
        <div className="details">
          <h3>收到事件</h3>
          event count: {eventCount}
        </div>
      </div>
      <div className="item">
        <i></i>
        <div className="details">
          <h3>conponents</h3>
          <Button
            onClick={() => {
              dispatch(increase());
            }}
          >
            count {count}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
