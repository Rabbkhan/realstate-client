import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { app } from "../../firebase";
import toast from "react-hot-toast";
import { TiDelete } from "react-icons/ti";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: 50,
    discountPrice: 0,
    bathrooms: 1,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
    bedrooms: 1,
    imageUrl: [],
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/listing/get/${listingId}`
      );
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (files.length < 1) {
      return toast.error("You not Select any files");
    }

    if (files.length > 0 && files.length + formData.imageUrl.length < 7) {
      setUploading(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrl: formData.imageUrl.concat(urls),
          });

          toast.success("Image Upload Successfully!");
          setUploading(false);
        })
        .catch((err) => {
          toast.error("Image Upload failed");
          setUploading(false);
        });
    } else {
      toast.error("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrl: formData.imageUrl.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrl.length < 1) {
        return toast.error("You must atleast upload one image");
      }

      if (formData.regularPrice < formData.discountPrice) {
        return toast.error("Discount price must be lower then regular price");
      }

      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      console.log(res);
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      toast.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12">
        <div className="p-8 bg-gray-50 shadow-lg rounded-xl">
          <label className="block text-gray-700 font-semibold mb-2">
            Property Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Property Name"
            className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <div className="flex w-full md:gap-8 flex-col md:flex-row">
            <div className="flex flex-col md:w-1/2">
              <label className="block text-gray-700 font-semibold mb-2">
                Address
              </label>
              <textarea
                name="address"
                placeholder="Property Address"
                className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                onChange={handleChange}
                value={formData.address}
              />
            </div>

            <div className="flex flex-col md:w-1/2">
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Property Description"
                className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                onChange={handleChange}
                value={formData.description}
              />
            </div>
          </div>

          <div className="flex w-full md:gap-8 flex-col md:flex-row">
            <div className="flex flex-col md:w-1/2">
              <label className="block text-gray-800 font-semibold mb-2">
                Transaction Type
              </label>
              <select
                name="type"
                className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                required
                onChange={handleChange}
                value={formData.type}
              >
                <option value="">Select</option>
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            <div className="flex flex-col md:w-1/2">
              <label className="block text-gray-800 font-semibold mb-2">
                Furnished
              </label>
              <select
                name="furnished"
                className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                required
                onChange={handleChange}
                value={formData.furnished}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="flex w-full md:gap-8 gap-4 mb-5 flex-col md:flex-row">
            <div className="flex flex-col md:w-1/2">
              <div>
                <input
                  type="checkbox"
                  name="parking"
                  className="mr-3 h-6 w-6 text-blue-600 focus:ring-blue-500 rounded"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <label className="text-gray-700 font-semibold">
                  Parking Spot Available
                </label>
              </div>
            </div>
            <div className="flex flex-col md:w-1/2">
              <div>
                <input
                  type="checkbox"
                  name="offer"
                  className="mr-3 h-6 w-6 text-blue-600 focus:ring-blue-500 rounded"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <label className="text-gray-700 font-semibold">
                  Special Offer Available
                </label>
              </div>
            </div>
          </div>

          <div className="flex w-full md:gap-8 flex-col md:flex-row">
            <div className="flex flex-col md:w-1/2">
              <label className="block text-gray-700 font-semibold mb-2">
                Beds
              </label>
              <input
                type="text"
                name="bedrooms"
                placeholder="Number of Beds"
                className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
            </div>
            <div className="flex flex-col md:w-1/2">
              <label className="block text-gray-700 font-semibold mb-2">
                Baths
              </label>
              <input
                type="text"
                name="bathrooms"
                placeholder="Number of Baths"
                className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
            </div>
          </div>

          <div className="flex w-full md:gap-8 flex-col md:flex-row">
            <div className="flex flex-col md:w-1/2">
              <label className="block text-gray-700 font-semibold mb-2">
                Regular Price{" "}
                <span className="text-gray-500 font-normal">($ / month)</span>
              </label>
              <input
                type="text"
                name="regularPrice"
                placeholder="Price"
                className="w-full p-4 mb-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                min="50"
                max="500"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
            </div>

            {formData.offer && (
              <div className="flex flex-col md:w-1/2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Discount Price{" "}
                  <span className="text-gray-500 font-normal">($ / month)</span>
                </label>
                <input
                  type="text"
                  name="discountPrice"
                  placeholder="Price"
                  className="w-full p-4 mb-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="50"
                  max="500"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-gray-50 shadow-lg rounded-xl">
          <label className="block text-gray-700 font-semibold mb-4">
            Images:{" "}
            <span className="text-gray-500 font-normal">
              The first image will be cover (max 6)
            </span>
          </label>

          <div className="flex items-center gap-4 mb-6 md:flex-row flex-col">
            <input
              type="file"
              name="images"
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
              multiple
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="px-4 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <div>
            <div className="relative group">
              {formData.imageUrl.length > 0 &&
                formData.imageUrl.map((url, index) => (
                  <div
                    key={url}
                    className="flex justify-between p-3 border items-center"
                  >
                    <img
                      src={url}
                      alt="listing image"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="text-red-900"
                    >
                      <TiDelete size={30} />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <button
            disabled={loading || uploading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-200 disabled:opacity-45"
          >
            {loading ? "Creating..." : "Update Listing"}{" "}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateListing;
