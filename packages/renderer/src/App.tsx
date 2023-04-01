import React, { FC } from "react";
import { Link, Outlet } from "react-router-dom";
import "./App.scss";

const App: FC = () => {
  return (
    <>
      <header>
        <div className="wrapper">
          <div className="greetings">
            <h1 className="green">electron-template</h1>
            <h3>electron template</h3>
          </div>

          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default App;
