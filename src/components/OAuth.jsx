import React from "react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log(result);

      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        }
      );
      const data = await res.json();
      console.log(data);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("could not sign in with google", error);
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <button
        onClick={handleGoogleClick}
        type="button"
        className="flex items-center px-4 py-2 bg-white border rounded-lg shadow hover:shadow-lg transition duration-300 ease-in-out w-full justify-center"
      >
        <FcGoogle size={30} />

        {/* <span className="text-gray-700 font-medium">Continue with Google</span> */}
      </button>
    </div>
  );
};

export default OAuth;
