import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { app } from "../../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserSuccess,
  signoutUserStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { MdUpdate } from "react-icons/md";
import { IoCreate } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { MdEditSquare } from "react-icons/md";

const Profile = () => {
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, isUpdateuser, isSigningOut } = useSelector(
    (state) => state.user
  );

  const [file, setFile] = useState(undefined);

  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    handleFileUpload(file);
  }, [file]);

  const handleFileUpload = (file) => {
    if (!file) {
      console.error("File is undefined.");
      return;
    }

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;

    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...FormData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/update/${
          currentUser._id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success("Data updated Successfully!");
      navigate("/profile");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/delete/${
          currentUser._id
        }`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handlesignout = async () => {
    try {
      dispatch(signoutUserStart());

      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/signout`
      );
      console.log("Response:", res);

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data.message));
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/listing/${
          currentUser._id
        }`
      );

      const data = await res.json();

      if (userListings.length <= 0) {
        toast.error("You have no Listing!");
      }
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      toast.success("Listing deleted successfully!");
    } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8"
      >
        {/* Header and Avatar */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                ref={fileRef}
                className="hidden"
              />
              <img
                src={formData?.avatar || currentUser.avatar}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow"
              />

              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 13V16H7L16.9921 6.00789L13.9921 3.00789L4 13ZM17.657 2.34305C18.048 1.95205 18.681 1.95205 19.072 2.34305C19.463 2.73405 19.463 3.36705 19.072 3.75805L17.914 4.91605L14.914 1.91605L16.072 0.757051C16.463 -0.252949 17.096 -0.252949 17.487 0.757051L17.657 2.34305Z" />
                </svg>
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Profile
              </h2>
              <p className="text-gray-500">Manage your account information</p>
            </div>
          </div>
        </div>
        <div>
          {fileUploadError ? (
            toast.error("Error Image Upload (image must be less then 2mb)")
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            toast.success("Image Successfully Uploaded! ")
          ) : (
            ""
          )}
        </div>

        {/* Account Information */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              id="username"
              defaultValue={currentUser.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              id="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              id="password"
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-row space-x-4 gap-2 flex-wrap justify-center">
          <button
            disabled={isUpdateuser}
            type="submit"
            className={`flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isUpdateuser ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <MdUpdate size={30} className="mr-2" />
            {isUpdateuser ? "Loading..." : "Update Profile"}
          </button>

          <Link to={"/create-listing"}>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <IoCreate size={30} className="mr-2" />
              Create Listing
            </button>
          </Link>
          <button
            type="button"
            onClick={handleShowListings}
            className="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <CiBoxList size={30} className="mr-2" />
            Show Listings
          </button>

          <button
            type="button"
            onClick={handleDeleteUser}
            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <MdDelete size={30} className="mr-2" />
            Delete Account
          </button>

          <button
            type="button"
            onClick={handlesignout}
            // disabled={isSigningOut}

            className={`flex items-center justify-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              isSigningOut ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <IoMdLogOut size={30} className="mr-2" />

            {isSigningOut ? "Loading..." : "Sign out"}
          </button>
        </div>
      </form>

      <div className="text-2xl font-bold text-gray-800 mb-4 my-32">
        Your Listings
      </div>
      {userListings &&
        userListings.length > 0 &&
        userListings.map((listing) => (
          <div
            key={listing._id}
            className="flex items-center border border-gray-300 rounded-lg shadow-lg p-4 m-4 max-w-4xl w-full lg:w-3/4 cursor-pointer"
          >
            <Link
              to={`/listing/${listing._id}`}
              className="flex-shrink-0 w-24 h-24"
            >
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover rounded-md"
              />
            </Link>

            <div className="flex-grow ml-4">
              <Link to={`/listing/${listing._id}`}>
                <div className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {listing.description}
                </div>
              </Link>
              {/* <p className="text-gray-600 mt-1">Brief description or additional info about the listing...</p> */}
            </div>

            <div className="flex space-x-2 ml-auto">
              <Link to={`/update-listing/${listing._id}`}>
                <button className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
                  <MdEditSquare size={20} />
                </button>
              </Link>
              <button
                onClick={() => handleListingDelete(listing._id)}
                className="px-4 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                <MdDelete size={20} />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Profile;
