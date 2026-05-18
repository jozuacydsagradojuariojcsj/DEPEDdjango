import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Background, LessonPlan } from "../../assets";
import Cards from "../cards/Cards";
import Loading from "../Loading";
import { getLessonPlan } from "../../api/lessonPlanApi";
import { useAuth } from "../../context/AuthContext";
import TeacherLayout from "../layouts/TeacherLayout";

const QuarterView = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [lessonPlans, setLessonPlans] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const fetchLessonPlans = async () => {
    try {
      setDataLoading(true);
      console.log("loading true");
      const data = await getLessonPlan();
      setLessonPlans(data);
    } catch (e) {
      console.log("Error boss:", e);
    } finally {
      setDataLoading(false);
      console.log("loading false");
    }
  };

  useEffect(() => {
    fetchLessonPlans();
  }, [loading]);

  const cardData = [
    {
      index: 1,
      title: "Quarter 1",
      subtitle: "View Teacher Lesson Plan for the 1st Quarter",
      image: LessonPlan,
    },
    {
      index: 2,
      title: "Quarter 2",
      subtitle: "View Teacher Lesson Plan for the 2nd Quarter",
      image: LessonPlan,
    },
    {
      index: 3,
      title: "Quarter 3",
      subtitle: "View Teacher Lesson Plan for the 3rd Quarter",
      image: LessonPlan,
    },
    {
      index: 4,
      title: "Quarter 4",
      subtitle: "View Teacher Lesson Plan for the 4th Quarter",
      image: LessonPlan,
    },
  ];

  return (
    <TeacherLayout>
      <div className="grid grid-cols-2 gap-4">
        {cardData.map((card) => (
          <Cards
            key={card.index}
            title={card.title}
            subtitle={card.subtitle}
            image={card.image}
            onClick={() => {
              const filteredPlans = lessonPlans.filter(
                (plan) => plan.quarter == card.index,
              );
              navigate(`/submitlist?q=${card.index}`, {
                state: { submissions: filteredPlans },
              });
            }}
          />
        ))}
      </div>
    </TeacherLayout>
  );
};

export default QuarterView;
