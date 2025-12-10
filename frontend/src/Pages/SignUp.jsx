import { useState } from "react";
import { FaEye, FaEyeSlash, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg from "../assets/bgimage.jpg";
// import { useHistory } from "react-router-dom";  previous react-router-dom version 5
import { useNavigate } from "react-router-dom"; // updated for react-router-dom version 6
import axios from "axios";

const SignUp = ({ onToggle }) => {
  const [name, setName] = useState("");
  // const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const history = useHistory();
  const navigate = useNavigate(); // updated for react-router-dom version 6

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log("DEBUG VALUES:");
    // console.log("Name:", `"${name}"`);
    // console.log("Email:", `"${email}"`);
    // console.log("Password:", `"${password}"`);

    setLoading(true);
    // Here you can add your signup logic, e.g., form validation, API calls, etc.
    if (!name || !email || !password || !confirmPassword) {
      toast.warning("Please fill all the fields");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password },
        config
      );
      toast.success("Registration Successful");

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error Occurred!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full  max-w-6xl h-[100vh] flex rounded-xl shadow-2xl overflow-hidden bg-white">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <h3 className="text-3xl text-gray-700 mb-2 font-bold">
              Welcome to ChatApp
            </h3>
            <p className="text-gray-600 mb-6">Sign Up to connect with others</p>

            {/* Social media buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FcGoogle className="text-xl" />
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaFacebookF className="text-blue-600 text-xl" />
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
              {/* First name last name field */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    First Name
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder:text-sm placeholder:text-gray-600"
                    placeholder="Enter Your First Name"
                    type="text"
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Last Name
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder:text-sm placeholder:text-gray-600"
                    placeholder="Enter Your Last Name"
                    type="text"
                    // required
                    // onChange={(e) => setLName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder:text-sm placeholder:text-gray-500"
                  placeholder="Enter Your Email Address"
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder:text-sm placeholder:text-gray-500"
                    placeholder="Enter Your Password"
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password field */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder:text-sm placeholder:text-gray-500"
                    placeholder="Confirm Your Password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Signup button */}
              <button
                // isloading={loading}  for chakra ui
                disabled={loading}
                type="submit"
                className="w-full bg-amber-600 text-white font-bold rounded-lg py-3 hover:bg-amber-700 transition-colors"
              >
                {/* Sign up */}
                {loading ? "Signing up..." : "Sign up"}
              </button>

              <p className="text-sm text-center text-gray-600">
                Already have an account?
                <span
                  onClick={onToggle}
                  className="text-amber-600 hover:underline ml-2 cursor-pointer font-medium"
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>

        {/* Right side - Background Image */}

        <div
          className="flex-1 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="text-center text-white p-8">
            <h2 className="text-4xl font-bold mb-4">"Join Our Community"</h2>
            <p className="text-xl opacity-90 mb-6">
              "Connect with friends and family"
            </p>

            <button
              onClick={onToggle}
              className="px-8 py-3 border-2 border-white rounded-lg font-bold hover:bg-white hover:text-amber-600 transition-all duration-300"
            >
              Already a Member?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
