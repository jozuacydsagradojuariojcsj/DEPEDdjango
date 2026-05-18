import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useMemo,
} from "react";
import {
  getQuarterDeadlines,
  getSchoolYears,
  updateQuarterDeadline,
} from "../api/principalApi";
import { useAuth } from "./AuthContext";

const SchoolYearContext = createContext();

export const SchoolYearProvider = ({ children }) => {
  const { user } = useAuth();
  const [schoolYear, setSchoolYear] = useState(null);
  const [yearStart, setYearStart] = useState(null);
  const [yearEnd, setYearEnd] = useState(null);
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchQuarterDeadlines = async (year_id) => {
    const data = await getQuarterDeadlines(year_id);
    setDeadlines(data);
  };

  const handleDeadlineChange = (id, newDate) => {
    setDeadlines((prev) =>
      prev.map((q) => (q.quarter_id === id ? { ...q, deadline: newDate } : q)),
    );
  };

  const handleDeadlineSave = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      setLoading(true);
      await updateQuarterDeadline(deadlines);
      setSuccessMessage("Successfully updated deadlines");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (e) {
      setTimeout(() => {
        setErrorMessage("Failed to update deadlines");
      }, 2000);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolYear = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      setLoading(true);
      const data = await getSchoolYears();
      const activeYear = data.is_active;
      if (activeYear) {
        setSchoolYear(data.school_year);
        setYearStart(data.year_start);
        setYearEnd(data.year_end);
        fetchQuarterDeadlines(data.year_id);
      }
    } catch (e) {
      console.error("School Year", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSchoolYear();
      console.log("School Year Provider ran WTF");
    }
  }, [user]);

  const value = useMemo(
    () => ({
      yearStart,
      yearEnd,
      schoolYear,
      deadlines,
      loading,
      successMessage,
      errorMessage,
      setSuccessMessage,
      setErrorMessage,
      fetchSchoolYear,
      handleDeadlineChange,
      handleDeadlineSave,
    }),
    [
      yearStart,
      yearEnd,
      schoolYear,
      deadlines,
      loading,
      successMessage,
      errorMessage,
    ],
  );

  return (
    <SchoolYearContext.Provider value={value}>
      {children}
    </SchoolYearContext.Provider>
  );
};

export const useSchoolYear = () => useContext(SchoolYearContext);
