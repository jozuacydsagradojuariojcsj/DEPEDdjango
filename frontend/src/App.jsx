import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import Dashboard from "./pages/teacher/Dashboard";
import AuthForm from "./pages/auth/Authform";
import Loading from "./components/Loading";
import ViewAdminLessonPlan from "./pages/admin/ViewAdminLessonPlan";
import SubView from "./components/quatersub/Subview";
import QuarterView from "./components/quaterview/Quaterview";
import ListSubmit from "./components/sectionpages/ViewLessoTeacherPlan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Loading>
              <AuthForm />
            </Loading>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subview" element={<SubView />} />
          <Route path="/quaterview" element={<QuarterView />} />
          <Route path="/view" element={<ViewAdminLessonPlan />} />
          <Route path="/submitlist" element={<ListSubmit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
