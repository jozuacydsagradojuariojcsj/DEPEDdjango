import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa"; // File icon from react-icons
import PDFDialogTeacher from "../dialog/PDFDialogTeacher";
import { MdDownload } from "../../icons/index.js";
import { getLessonPlan } from "../../api/lessonPlanApi.js";

const QuarterSubmission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const quarterNum = searchParams.get("q");
  const [selectedItem, setSelectedItem] = useState(null);
  const [lessonPlan, setLessonPlans] = useState([]);
  const [loading, setDataLoading] = useState(false);

  const reviewStatusStyles = {
    Pending: "text-yellow-500",
    Approved: "text-green-500",
    Rejected: "text-red-500",
  };

  //might have to transfer this to a provider
  const fetchLessonPlans = async () => {
    try {
      setDataLoading(true);
      const data = await getLessonPlan();
      setLessonPlans(data);
    } catch (e) {
      console.error("Error boss:", e);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonPlans();
  }, []);

  const filteredLessonPlans = useMemo(() => {
    const quarter = searchParams.get("q");

    if (!quarter) return [];

    return lessonPlan.filter((p) => p.quarter === Number(quarter));
  }, [lessonPlan, searchParams]);

  const handleClose = () => {
    setSelectedItem(null);
  };

  useEffect(() => {
    const planIdFromURL = searchParams.get("planId");

    if (planIdFromURL && lessonPlan.length > 0) {
      const foundItem = lessonPlan.find(
        (item) => item.plan_id.toString() === planIdFromURL,
      );

      if (foundItem) {
        setSelectedItem(foundItem);
        navigate(`/submitlist?q=${foundItem.quarter}`, {
          replace: true,
        });
      }
    }
  }, [searchParams, lessonPlan]);
  return (
    <>
      {loading ? (
        <div className=" loading loading-spinner loading-xs md:loading-xl"></div>
      ) : filteredLessonPlans.length === 0 ? (
        <div className="max-w-xl mx-auto mt-24 bg-white bg-opacity-90 rounded-lg p-8 shadow-lg backdrop-blur-sm text-center">
          {/* Title */}
          <h1 className="text-lg font-semibold mb-6 text-black">
            Quarter {quarterNum} Submissions
          </h1>

          {/* Icon */}
          <div className="text-gray-500 mb-4 flex justify-center">
            <FaFileAlt size={40} />
          </div>
          <p className="text-gray-600 text-sm">
            No submissions for Quarter {quarterNum} yet.
          </p>
        </div>
      ) : (
        <div className="w-full min-h-4/5 flex flex-col items-center gap-6 p-4 lg:w-3/4 bg-white rounded-lg shadow-lg backdrop-blur-sm">
          {/* Title */}
          <h1 className="text-lg font-semibold mb-6 text-black">
            Quarter {quarterNum} Submissions
          </h1>
          <div className="w-full grid grid-cols-4 md:grid-cols-5 text-xs text-center text-black">
            <div className="hidden md:block">Date Submitted</div>
            <div>Submitted</div>
            <div>Review Status</div>
            <div>Lesson Plan</div>
            <div>Certificate</div>
          </div>

          {filteredLessonPlans.map((sub) => {
            const hasQR = sub.qr_code !== null;
            const isLate = sub.is_late;
            const lateLabel = isLate ? "Late" : "On Time";
            const reviewClass =
              reviewStatusStyles[sub.status] || "text-gray-500";
            const formattedDate = new Date(sub.created_at).toLocaleString(
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
                key={sub.plan_id}
                className="w-full grid grid-cols-4 md:grid-cols-5 text-xs md:text-sm items-center justify-items-center text-black border border-gray-300 rounded-full h-12"
              >
                <div className="hidden md:block">{formattedDate}</div>
                <div
                  className={`${isLate ? "text-red-500" : "text-green-500"}`}
                >
                  {lateLabel}
                </div>
                <div className={`font-semibold ${reviewClass}`}>
                  {sub.status}
                </div>
                <div
                  className="btn btn-outline text-xs md:text-sm h-6 w-10 md:h-8 md:w-12"
                  onClick={() => {
                    setSelectedItem(sub);
                  }}
                >
                  Open
                </div>
                <a
                  href={sub.qr_code}
                  download={`Certification_Quarter_${quarterNum}_${sub.teacher.last_name}.png`}
                  target="_blank"
                  rel="noopener"
                  className={`text-xs md:text-sm ${hasQR ? "btn btn-outline h-6 w-auto md:h-8" : ""}`}
                >
                  {hasQR ? <MdDownload /> : "None"}
                </a>
              </div>
            );
          })}
        </div>
      )}

      {selectedItem && (
        <PDFDialogTeacher data={selectedItem} onClose={handleClose} />
      )}
    </>
  );
};

export default QuarterSubmission;
