import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ActiveSchoolYearDialog from "../../components/dialog/ActiveSchoolYearDialog.jsx";
import StatusCards from "../../components/cards/StatusCards";
import { styled } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import { Background, DEPED } from "../../assets/index.js";
import {
  TfiWrite,
  MdPerson,
  MdOutlinePendingActions,
  FaCheck,
  FaBell,
} from "../../icons/index.js";
import TabContent from "../../components/tabs/TabContent.jsx";
import { useState, useMemo } from "react";
import { Profile } from "../../assets";
import { getLessonPlan } from "../../api/lessonPlanApi.js";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

import "react-toastify/dist/ReactToastify.css";
import SuccessAlert from "../../components/alerts/SuccessAlert.jsx";
import { statCounts } from "../../api/principalApi.js";
import { useAlerts } from "../../context/AlertsContext.jsx";
import { Link, useSearchParams } from "react-router-dom";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: "#2c8aad98",
}));

const ViewLessonPlan = () => {
  const frontendURL = import.meta.env.VITE_FRONTEND_URL;
  const { user, loading, logout } = useAuth();
  const { modalNotification, markNotificationAsRead, unreadNotification } =
    useAlerts();
  const [queryParams, setQueryParams] = useState("All Teachers");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeSchoolYearDialog, setActiveSchoolYearDialog] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [dropdownOpen, setDropDownOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);
  const [counts, setCounts] = useState({
    teacher_count: 0,
    lesson_plan_count: 0,
    pending_lesson_plan: 0,
    approved_lesson_plan: 0,
  });

  const cardData = [
    {
      index: 1,
      key: "teacher_count",
      title: "Total Teachers",
      icon: <MdPerson className="size-6" />,
      colorClass: "border-blue-500/30 bg-blue-500/30",
    },
    {
      index: 2,
      key: "lesson_plan_count",
      title: "Total Submission",
      icon: <TfiWrite className="size-6" />,
      colorClass: "border-green-500/30 bg-green-500/30",
    },
    {
      index: 3,
      key: "pending_lesson_plan",
      title: "Pending Review",
      icon: <MdOutlinePendingActions className="size-6" />,
      colorClass: "border-orange-500/30 bg-orange-500/30",
    },
    {
      index: 4,
      key: "approved_lesson_plan",
      title: "Approved",
      icon: <FaCheck className="size-6" />,
      colorClass: "border-green-500/30 bg-green-500/30",
    },
  ];
  //not mock data pls don't delete
  const tabsMock = [
    {
      index: 1,
      id: 1,
      label: "Quarter 1",
    },
    {
      index: 2,
      id: 2,
      label: "Quarter 2",
    },
    {
      index: 3,
      id: 3,
      label: "Quarter 3",
    },
    {
      index: 4,
      id: 4,
      label: "Quarter 4",
    },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchStats = async () => {
    try {
      const response = await statCounts();
      setCounts(response.data);
    } catch (e) {
      console.error("Stats Fetch Error:", e);
    }
  };

  const fetchLessonPlans = async () => {
    try {
      setDataLoading(true);
      const data = await getLessonPlan();
      setLessonPlans(data);
    } catch (e) {
      console.error("Fetch Lesson Plan Error:", e);
    } finally {
      setDataLoading(false);
    }
  };

  const readNotifications = async (notification_id, notification) => {
    try {
      await markNotificationAsRead(notification_id, notification);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchLessonPlans();
    fetchStats();
  }, [loading]);

  useEffect(() => {
    const planIdFromURL = searchParams.get("planId");

    if (planIdFromURL && lessonPlans.length > 0) {
      const foundItem = lessonPlans.find(
        (item) => item.plan_id.toString() === planIdFromURL,
      );

      console.log("Found IT:", foundItem);

      if (foundItem) {
        setSelectedItem(foundItem);
        setActiveTab(foundItem.quarter);
      }
    }
  }, [searchParams, lessonPlans]);

  //will probably transfer to provider
  // useEffect(() => {
  //   const unreadNotifications = modalNotification.filter(
  //     (n) => n.is_read === false,
  //   ).length;

  //   setUnreadNotification(unreadNotifications);
  // }, [modalNotification]);

  const filteredData = useMemo(() => {
    return lessonPlans.filter((item) => item.quarter === activeTab);
  }, [lessonPlans, activeTab]);

  return (
    <div className="flex flex-col w-screen h-screen">
      <CssBaseline />
      <span className=" opacity-90 w-full z-10 bg-dashboard drop-shadow-2xl shadow-lg">
        <Toolbar>
          <Box
            component="img"
            src={DEPED}
            sx={{ height: 40, width: "auto", mr: 2 }}
          />
          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>

          <div
            className="btn btn-outline text-xxs w-25 sm:text-xs sm:w-30"
            onClick={() => setActiveSchoolYearDialog(true)}
          >
            Set Active School Year
          </div>
          <div className={"dropdown dropdown-end"}>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost m-1 relative"
            >
              <FaBell className="size-5" />
              {unreadNotification > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-xxs w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {unreadNotification}
                </div>
              )}
            </div>

            <ul className="dropdown-content menu rounded-box z-1 w-50 sm:w-100 p-2 shadow-sm gap-y-3 bg-gray-300">
              {modalNotification.map((notif) => {
                const formattedDate = new Date(notif.created_at).toLocaleString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                );
                return (
                  <li key={notif.notification_id} className={`rounded-lg `}>
                    <Link
                      onClick={() =>
                        readNotifications(notif.notification_id, notif)
                      }
                      to={`${frontendURL}/view/?planId=${notif.link}`}
                      className="flex flex-col items-start relative"
                    >
                      <div
                        className={`${notif.is_read ? "hidden" : "absolute"} top-1 right-1 rounded-full bg-red-500 size-3`}
                      />
                      <div
                        className={`text-xxs sm:text-base ${notif.is_read ? "font-normal" : "font-bold"}`}
                      >
                        {notif.message}
                      </div>
                      <div
                        className={`text-xxs sm:text-base ${notif.is_read ? "font-normal" : "font-bold"}`}
                      >
                        {formattedDate}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            aria-controls={menuOpen ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
          >
            <AccountCircle />
          </IconButton>

          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={logout}>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </span>

      {/*Background*/}
      <div
        className="relative flex flex-1 items-center justify-center bg-cover bg-center bg-fixed flex-col sm:flex-row gap-6 p-2"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <div className="w-full min-h-full flex flex-col items-center gap-6 p-4 lg:w-3/4">
          {/*Status Cards*/}
          <div className="grid grid-cols-2 lg:flex lg:flex-row w-full gap-6">
            {cardData.map((card) => (
              <StatusCards
                key={card.index}
                title={card.title}
                icon={card.icon}
                data={counts[card.key]}
                colorClass={card.colorClass}
              />
            ))}
          </div>

          {/*Quarter View Lesson Plan Section*/}
          <div className="flex flex-col flex-1 border border-white bg-white rounded-md w-full min-h-0 px-4 py-4">
            {/*All Lesson Plan Submissions Text*/}
            <div className="h-15 flex flex-row justify-between items-center">
              <div className="text-xxs sm:text-sm md:text-base">
                <h1 className="font-bold">All Lesson Plan Submissions</h1>
                <div>
                  Review and manage teacher submissions organized by Quarters
                </div>
              </div>
              {/* <select
                value={queryParams}
                onChange={(e) => setQueryParams(e.target.value)}
                className="text-xss sm:text-sm md:text-base bg-gray-300 rounded-md p-1"
              >
                <option>All Lesson Plans</option>
                <option>Status</option>
                <option>Late</option>
              </select> */}
            </div>
            <div className="flex flex-row tabs tabs-box tabs-xs  bg-gray-300 rounded-full justify-between p-1 gap-2 mb-4 w-full">
              {tabsMock.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex flex-1 font-bold text-xxs sm:text-xs md:text-sm rounded-full tab transition-all ${
                    activeTab === tab.id ? "tab-active bg-white" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-md flex flex-1 min-h-0 overflow-y-auto">
              <TabContent
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                data={filteredData}
                refreshLessonPlan={fetchLessonPlans}
                loading={dataLoading}
              />
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      <ActiveSchoolYearDialog
        isOpen={activeSchoolYearDialog}
        onClose={() => setActiveSchoolYearDialog(false)}
      />
    </div>
  );
};

export default ViewLessonPlan;
