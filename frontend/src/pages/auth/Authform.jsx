import React, { use, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Background } from "../../assets";
import { loginUser, registerUser, resetPassword } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import ForgotPasswordDialog from "../../components/dialog/ForgotPasswordDialog";
import { useAlerts } from "../../context/AlertsContext";

export default function AuthForm() {
  const { setSuccessMessage, setErrorMessage } = useAlerts();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginLoading, setIsLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [emailForgotPassword, setEmailForgotPassword] = useState();
  const navigate = useNavigate();
  const { login, logout, user, register } = useAuth();
  //Login Form Data
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  //Register Form Data
  const [registerFormData, setRegisterFormData] = useState({
    first_name: "",
    middle_initial: "",
    last_name: "",
    subject: "",
    grade_level: "",
    email: "",
    role: "Teacher",
    password: "",
    re_password: "",
  });

  //Validate Register Form Error
  const validateRegisterForm = () => {
    const {
      first_name,
      last_name,
      subject,
      grade_level,
      email,
      password,
      re_password,
    } = registerFormData;

    if (!first_name.trim()) return "Please enter your first name";
    if (!last_name.trim()) return "Please enter your last name";
    if (!subject.trim()) return "Please enter your subject";
    if (!grade_level.trim()) return "Please enter your grade level";
    if (!email.trim()) return "Please enter your email";
    if (!password) return "Please enter your password";
    if (!re_password) return "Please confirm your password";

    if (password !== re_password)
      return "Password and confirm password do not match";

    return null;
  };
  //Validate Login Form Error
  const validateLoginForm = () => {
    const { email, password } = loginFormData;

    if (!email.trim()) return "Please enter your email";
    if (!password) return "Please enter your password";
  };

  const handleForgotPasswordChange = (e) => {
    setEmailForgotPassword(e.target.value);
    console.log(e.target.value);
  };

  //Handle Login Change Function
  const handleLoginChange = (e) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };

  //Handle Register Change Function
  const handleRegisterChange = (e) => {
    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    });
  };

  //Handle Login Button Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    const validationError = validateLoginForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const userData = await login(loginFormData);
      toast.success("Login Successful");

      const role = await userData.role;
      if (role === "Principal") {
        navigate("/view");
      } else {
        navigate("/dashboard");
      }
    } catch (e) {
      const message = e?.response?.data;
      if (message.detail) {
        toast.error("Email and Password do not match!");
      } else {
        toast.error("Server Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  //Handle Register Button Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    const validationError = validateRegisterForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setRegisterLoading(true);
    try {
      await register(registerFormData);
      toast.success("Register Successful", {
        onClose: () => setIsLogin(true),
      });
      setRegisterFormData({
        first_name: "",
        middle_initial: "",
        last_name: "",
        subject: "",
        grade_level: "",
        email: "",
        role: "Teacher", // Safe to keep default fallback string instead of empty
        password: "",
        re_password: "",
      });
    } catch (e) {
      const message = e?.response?.data;
      if (message.email) {
        toast.error("Email already in use.");
      } else if (message.password && Array.isArray(message.password)) {
        const allPasswordErrors = message.password.join("\n");
        toast.error(allPasswordErrors);
      } else {
        toast.error("Server Error");
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const response = await resetPassword(emailForgotPassword);
      setSuccessMessage(
        "Successfully sent email! Please check your mail or spam",
      );
    } catch {
      setErrorMessage("Failed in sending an email");
    }
  };

  return (
    <>
      <div
        className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <div className="form-container">
          <div className="form-toggle">
            <button
              className={isLogin ? "active" : ""}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => setIsLogin(false)}
            >
              SignUp
            </button>
          </div>
          {isLogin ? (
            <>
              <div className="form overflow-y-auto max-h-[70vh]">
                <h2>Login Form</h2>
                <input
                  type="email"
                  name="email"
                  value={loginFormData.email}
                  onChange={handleLoginChange}
                  placeholder="Email"
                />
                <input
                  type="password"
                  name="password"
                  value={loginFormData.password}
                  onChange={handleLoginChange}
                  placeholder="Password"
                />
                <a
                  className="link link-hover"
                  onClick={() => {
                    setOpenForgotPassword(true);
                  }}
                >
                  Forgot Password
                </a>
                <button
                  type="submit"
                  disabled={loginLoading}
                  onClick={handleLoginSubmit}
                >
                  {registerLoading ? (
                    <div className="loading loading-spinner text-white"></div>
                  ) : (
                    "Login"
                  )}
                </button>
                <div className="text-center">
                  Not a Member?{" "}
                  <span
                    onClick={() => setIsLogin(false)}
                    className="link link-hover text-blue-500"
                  >
                    Sign now
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form overflow-y-auto overflow-x-auto max-h-[70vh]">
                <h2>Sign Up Form</h2>

                <input
                  type="text"
                  name="first_name"
                  value={registerFormData.first_name}
                  onChange={handleRegisterChange}
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="middle_initial"
                  value={registerFormData.middle_initial}
                  onChange={handleRegisterChange}
                  placeholder="Middle Initial"
                />
                <input
                  type="text"
                  name="last_name"
                  value={registerFormData.last_name}
                  onChange={handleRegisterChange}
                  placeholder="Last Name"
                />

                {/*REMINDER FOR DROPDOWN FOR SUBJECT*/}
                <input
                  type="text"
                  name="subject"
                  value={registerFormData.subject}
                  onChange={handleRegisterChange}
                  placeholder="Subject"
                />
                {/*REMINDER FOR DROPDOWN FOR GRADE LEVEL*/}
                <input
                  type="text"
                  name="grade_level"
                  value={registerFormData.grade_level}
                  onChange={handleRegisterChange}
                  placeholder="Grade Level"
                />

                <input
                  type="email"
                  name="email"
                  value={registerFormData.email}
                  onChange={handleRegisterChange}
                  placeholder="Email"
                />

                <input
                  type="password"
                  name="password"
                  value={registerFormData.password}
                  onChange={handleRegisterChange}
                  placeholder="Password"
                />

                <input
                  type="password"
                  name="re_password"
                  value={registerFormData.re_password}
                  onChange={handleRegisterChange}
                  placeholder="Confirm Password"
                />

                <button
                  type="submit"
                  disabled={registerLoading}
                  onClick={handleRegisterSubmit}
                >
                  {registerLoading ? (
                    <div className="loading loading-spinner text-white"></div>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            </>
          )}{" "}
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
      {openForgotPassword && (
        <ForgotPasswordDialog
          onSubmit={handlePasswordChange}
          forgotPassword={emailForgotPassword}
          setForgotPassword={handleForgotPasswordChange}
          isOpen={openForgotPassword}
          onClose={() => {
            setOpenForgotPassword(false);
          }}
        />
      )}
    </>
  );
}

// const handleRegisterSubmit = async (e) => {
//   e.preventDefault();
//   if (isLoading) {
//     return;
//   }

//   const validationError = validateRegisterForm();
//   if (validationError) {
//     toast.error(validationError);
//     return;
//   }

//   setIsLoading2(true);

//   try {
//     const response = await axios.post(
//       `${BASE_URL}/djoser/users/`,
//       registerFormData,
//     );
//     toast.success("Successfully Registered ", {
//       onClose: () => navigate("/dashboard"),
//     });
//     console.log("Success!", response.data);
//     setSuccesMessage2("Registration Successfull!");
//   } catch (error) {
//     toast.error("Invalid email or password");
//     console.log("Error during registration!", error.response?.data);
//     if (error.response && error.response.data) {
//       Object.keys(error.response.data).forEach((field) => {
//         const errorMessages = error.response.data[field];
//         if (errorMessages && errorMessages.length > 0) {
//           setError(errorMessages[0]);
//         }
//       });
//     }
//   } finally {
//     setIsLoading2(false);
//   }
// };

// const handleLoginSubmit = async (e) => {
//   e.preventDefault();
//   if (isLoading) {
//     return;
//   }

//   setIsLoading(true);

//   try {
//     const response = await axios.post(
//       `${BASE_URL}/auth/jwt/create/`,
//       loginFormData,
//       { withCredentials: true },
//     );

//     console.log("Success!", response.data);
//     console.log("Access:", response.data.access);
//     setSuccesMessage("Login Successfull!");
//     localStorage.setItem("accessToken", response.data.access);
//     localStorage.setItem("refreshToken", response.data.refresh);
//     toast.success("Login successful ", {
//       onClose: () => navigate("/dashboard"),
//     });
//   } catch (error) {
//     toast.error(" Invalid email or password");
//     console.log("Error during Login!", error.response?.data);
//     if (error.response && error.response.data) {
//       Object.keys(error.response.data).forEach((field) => {
//         const errorMessages = error.response.data[field];
//         if (errorMessages && errorMessages.length > 0) {
//           setError(errorMessages[0]);
//         }
//       });
//     }
//   } finally {
//     setIsLoading(false);
//   }
// };
