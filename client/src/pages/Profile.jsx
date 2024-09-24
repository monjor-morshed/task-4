import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from "../redux/user/userSlice";
import { FaLock, FaUnlock, FaTrash } from "react-icons/fa";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
    }

    fetchUsers();
  }, [currentUser, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/user/get");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUpdateStatus = async (actionType) => {
    const statusMap = {
      block: "blocked",
      unblock: "active",
    };

    const body = { id: checkedUsers, status: statusMap[actionType] };

    try {
      dispatch(updateUserStart());
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!data.success) {
        dispatch(updateUserFailure(data));
        return;
      }

      if (checkedUsers.includes(currentUser.id) && actionType === "block") {
        await fetch("/api/auth/signout");
        dispatch(signOut());
        navigate("/sign-in");
        return;
      }

      dispatch(updateUserSuccess());
      setCheckedUsers([]);
      setSelectAll(false);
      fetchUsers();
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteUsers = async () => {
    const body = { id: checkedUsers };

    try {
      dispatch(deleteUserStart());
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!data.success) {
        dispatch(deleteUserFailure(data));
        return;
      }
      if (checkedUsers.includes(currentUser.id)) {
        await fetch("/api/auth/signout");
        dispatch(signOut());
        navigate("/sign-in");
        return;
      }

      dispatch(deleteUserSuccess());
      setCheckedUsers([]);
      setSelectAll(false);
      fetchUsers();
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedUsers([]);
    } else {
      setCheckedUsers(users.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (userId) => {
    setCheckedUsers((prevChecked) =>
      prevChecked.includes(userId)
        ? prevChecked.filter((id) => id !== userId)
        : [...prevChecked, userId]
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={() => handleUpdateStatus("block")}
          className="flex items-center gap-2 rounded-md bg-red-50 px-5 py-2 shadow-md hover:bg-red-100"
        >
          <FaLock className="text-2xl text-red-600" /> Block
        </button>
        <button
          onClick={() => handleUpdateStatus("unblock")}
          className="flex items-center gap-2 rounded-md bg-green-50 px-5 py-2 shadow-md hover:bg-green-100"
        >
          <FaUnlock className="text-2xl text-green-700" /> Unblock
        </button>
        <button
          onClick={handleDeleteUsers}
          className="flex items-center gap-2 rounded-md bg-red-50 px-5 py-2 shadow-md hover:bg-red-100"
        >
          <FaTrash className="text-2xl text-red-600" /> Delete
        </button>
      </div>

      <div className="h-full w-full rounded-sm border border-gray-300">
        <div className="grid grid-cols-6 items-center divide-x divide-gray-300 border-b text-center">
          <label className="flex items-center justify-center">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={selectAll}
              onChange={handleSelectAll}
            />
          </label>
          <div>
            <h1 className="font-semibold capitalize">Name</h1>
          </div>
          <div className="font-semibold">Email</div>
          <div className="font-semibold">Last Login</div>
          <div className="font-semibold">Registration Time</div>
          <div className="font-semibold">Status</div>
        </div>

        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className={`grid grid-cols-6 items-center divide-x divide-gray-300 border-b ${
                user.status === "blocked" ? "bg-gray-200" : ""
              }`}
            >
              <label className="flex items-center justify-center">
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={checkedUsers.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </label>
              <div>
                <h1
                  className={`${
                    user.id === currentUser.id ? "font-bold" : "font-medium"
                  } capitalize`}
                >
                  {user.userName}
                </h1>
              </div>
              <div>{user.email}</div>
              <div>
                {user.lastLogin ? (
                  <div>{new Date(user.lastLogin).toLocaleString()}</div>
                ) : (
                  <div>No recent login information</div>
                )}
              </div>
              <div>{new Date(user.registrationTime).toLocaleString()}</div>

              <div className="px-3 items-center justify-center">
                <span
                  className={`rounded-md px-2 py capitalize text ${
                    user.status === "active"
                      ? "bg-green-600 text-green-100"
                      : "bg-red-600 text-red-100"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
