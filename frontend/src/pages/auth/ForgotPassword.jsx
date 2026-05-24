import React, { useState } from "react";
import { useAlerts } from "../../context/AlertsContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { resetPasswordConfirm } from "../../api/authApi";

const ForgotPassword = () => {
  const { uid, token } = useParams();
  const { setSuccessMessage, setErrorMessage } = useAlerts();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.re_new_password) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPasswordConfirm(
        uid,
        token,
        formData.new_password,
      );
      if (response.status === 204 || response.status === 200) {
        setSuccessMessage(
          "Password Updated Successfully! Will redirect to login. Please wait",
        );
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 4000);
      }
    } catch (e) {
      setLoading(false);
      console.error("Error on Password Change:", e);
      setErrorMessage("Failed to update Password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex bg-gray-600 w-screen h-screen items-center justify-center">
      <form className="rounded-md h-75 w-75 overflow-y-auto md:h-75 md:w-75 bg-gray-200 flex flex-col gap-y-2 items-center">
        <div className="font-bold">Forget Password</div>
        <div>Enter Your new Password</div>
        <input
          className="border border-black rounded-md p-1 m-2 w-12/13"
          placeholder="New Password"
          type={showPassword ? "text" : "password"}
          onChange={(e) =>
            setFormData({ ...formData, new_password: e.target.value })
          }
          required
          value={formData.new_password}
        />
        <input
          className="border border-black rounded-md p-1 m-2 w-12/13"
          placeholder="Confirm New Password"
          type={showPassword ? "text" : "password"}
          onChange={(e) =>
            setFormData({ ...formData, re_new_password: e.target.value })
          }
          required
          value={formData.re_new_password}
        />
        <button
          type="button"
          className="btn btn-outline w-1/2"
          onClick={handleShowPassword}
        >
          {showPassword ? "Hide Passwords" : "Show Passwords"}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-outline w-1/2"
          onClick={handleSubmit}
        >
          {loading ? <div className="loading loading-spinner" /> : "Save"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
