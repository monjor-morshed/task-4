import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
      navigate("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="font-bold text-xl text-gray-800">Auth-App</h1>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>

          {!currentUser && (
            <>
              <Link to="/sign-up" className="text-gray-600 hover:text-gray-900">
                Sign Up
              </Link>
              <Link to="/sign-in" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
            </>
          )}

          {currentUser && (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
