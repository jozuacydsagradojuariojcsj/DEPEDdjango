import React, { useEffect, useState } from "react";
import { reviewLessonPlan } from "../../api/lessonPlanApi";
import ConfirmDialog from "./ConfirmDialog.jsx";
const PDFDialogTeacher = ({ data, onClose }) => {
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(data.status ?? "");
  const [feedBack, setFeedBack] = useState(data.feedback ?? "");
  const [lessonPlanID, setLessonPlanID] = useState(data.plan_id ?? "");

  if (!data) return null;

  const handleReviewLessonPlan = async (lessonPlanID, status, feedBack) => {
    try {
      setSuccessMessage(null);
      setErrorMessage(null);
      setLoading(true);
      const response = await reviewLessonPlan(lessonPlanID, status, feedBack);

      if (response.status === 200) {
        setSuccessMessage("Successfully reviewed lesson plan");
        handleCloseAll();
        refreshLessonPlan();
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (e) {
      setErrorMessage("Server Error");
      console.err(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAll = () => {
    setConfirmDialog(false);
    onClose();
  };

  useEffect(() => {
    console.log("Data:", data);
  }, []);
  return (
    <>
      <dialog open={data} className="modal ">
        <div className="modal-box flex flex-col w-11/12 max-w-5xl h-[90vh] gap-y-2  text-black">
          <div className="p-4 border-b flex justify-between">
            <h2 className="font-semibold">Submitted Lesson Plan</h2>
            <button onClick={onClose}>✕</button>
          </div>

          <div className="flex flex-row flex-1 items-center">
            <iframe src={`${data.lesson_plan}`} className="w-full h-full" />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default PDFDialogTeacher;
