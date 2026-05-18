import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Gridbox from "../../components/GridBoxs/Gridbox";

import { Background, DEPED } from "../../assets";
import { useAuth } from "../../context/AuthContext";
import TeacherLayout from "../../components/layouts/TeacherLayout";

//teacher ni na dashboard

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: "#2c8aad00",
}));

export default function Dashboard({ children }) {
  return (
    <TeacherLayout>
      {/*This Gridbox is both my lesson plan and submit lesson plan*/}
      <Gridbox />
    </TeacherLayout>
  );
}
