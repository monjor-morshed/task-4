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
  const { currentUser } = useSelector((state) => state.user);
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
    } catch (error) {
      dispatch(updateUserFailure(error));
    } finally {
      setCheckedUsers([]);
      setSelectAll(false);
      await fetchUsers();
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
    } catch (error) {
      dispatch(deleteUserFailure(error));
    } finally {
      setCheckedUsers([]);
      setSelectAll(false);
      await fetchUsers();
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="flex justify-between mb-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleDeleteUsers}
        >
          <FaTrash className="inline mr-2" /> Delete
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => handleUpdateStatus("block")}
        >
          <FaLock className="inline mr-2" /> Block
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => handleUpdateStatus("unblock")}
        >
          <FaUnlock className="inline mr-2" /> Unblock
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Last Login</th>
            <th className="py-2">Registration Time</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2">
                <input
                  type="checkbox"
                  checked={checkedUsers.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </td>
              <td className="py-2">
                {user.id === currentUser.id ? (
                  <b className="font-semibold">{user.userName}</b>
                ) : (
                  user.userName
                )}
              </td>
              <td className="py-2">{user.email}</td>
              <td className="py-2">
                {new Date(user.lastLogin).toLocaleString()}
              </td>
              <td className="py-2">
                {new Date(user.registrationTime).toLocaleString()}
              </td>
              <td className="py-2">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
