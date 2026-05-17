import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Profile } from "../../assets";
import PDFDialog from "../dialog/PDFDialog";
import LessonPlanSkeleton from "../skeleton/LessonPlanSkeleton";
import SuccessAlert from "../alerts/SuccessAlert";
import ErrorAlert from "../alerts/ErrorAlert";

const TabContent = ({ data, refreshLessonPlan, loading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const reviewStatusStyles = {
    Pending: "text-yellow-500",
    Approved: "text-green-500",
    Rejected: "text-red-500",
  };

  useEffect(() => {
    const planIdFromURL = searchParams.get("planId");

    if (planIdFromURL && data.length > 0) {
      const foundItem = data.find(
        (item) => item.plan_id.toString() === planIdFromURL,
      );

      if (foundItem) {
        setSelectedItem(foundItem);
      }
    }
  }, [searchParams, data]);

  const handleClose = () => {
    setSearchParams({}, { replace: true });
    setSelectedItem(null);
  };

  if (loading) {
    return <LessonPlanSkeleton />;
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col w-full gap-y-2 p-2">
        <div className="grid grid-cols-4 md:grid-cols-6 text-xs text-center justify-items-center">
          <div className="hidden md:block">Profile</div>
          <div>Name</div>
          <div className="hidden md:block">Date Submitted</div>
          <div>Submitted</div>
          <div>Review Status</div>
          <div>Lesson Plan</div>
        </div>
        <div className="w-full h-full flex items-center justify-center ">
          No Submissions Found
        </div>
      </div>
    );
  }
  return (
    <>
      {successMessage && (
        <div className="toast toast-top toast-end z-1000">
          <SuccessAlert message={successMessage} />
        </div>
      )}
      {errorMessage && (
        <div className="toast toast-top toast-end z-1000">
          <ErrorAlert message={errorMessage} />
        </div>
      )}
      <div className="flex flex-col w-full gap-y-2 p-2">
        <div className="grid grid-cols-4 md:grid-cols-6 text-xs text-center justify-items-center">
          <div className="hidden md:block">Profile</div>
          <div>Name</div>
          <div className="hidden md:block">Date Submitted</div>
          <div>Submitted</div>
          <div>Review Status</div>
          <div>Lesson Plan</div>
        </div>

        {data.map((item) => {
          const isLate = item.is_late;
          const lateLabel = isLate ? "Late" : "On Time";
          const reviewClass =
            reviewStatusStyles[item.status] || "text-gray-500";
          const formattedDate = new Date(item.created_at).toLocaleString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "2-digit",
              // hour: "2-digit",
              // minute: "2-digit",
            },
          );
          return (
            <div
              key={item.plan_id}
              className="grid grid-cols-4 text-xxs md:text-sm md:grid-cols-6 text-center items-center justify-items-center h-20 border border-gray-300 rounded-md"
            >
              <img
                src={item.teacher.profilepic}
                className="rounded-full size-8 bg-cover border border-black hidden md:block"
              />
              <div className="font-bold">
                {item.teacher.first_name} {item.teacher.middle_initial}{" "}
                {item.teacher.last_name}
              </div>

              <div className="hidden md:block">{formattedDate}</div>

              <span className={`${isLate ? "text-red-500" : "text-green-500"}`}>
                {lateLabel}
              </span>
              <div className={`font-semibold ${reviewClass}`}>
                {item.status}
              </div>

              <button onClick={() => setSelectedItem(item)}>Open</button>
            </div>
          );
        })}

        {selectedItem && (
          <PDFDialog
            data={selectedItem}
            onClose={handleClose}
            refreshLessonPlan={refreshLessonPlan}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>
    </>
  );
};

export default TabContent;
