import React from "react";

import { Route, Routes } from "react-router-dom";
import Profile from "./views/Profile.js";
import Home from "./views/Home.js";

const Router = () =>
{
    return(
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile/:username"  element={<Profile />}  />
        </Routes>
    )
}

export default Router;