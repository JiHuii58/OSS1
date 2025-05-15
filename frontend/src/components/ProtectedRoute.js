import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Kiểm tra user đã đăng nhập chưa
  if (!user) {
    // Nếu chưa đăng nhập, chuyển hướng tới trang đăng nhập
    return <Navigate to="/login" />;
  }
  return element;
};

export default ProtectedRoute;
