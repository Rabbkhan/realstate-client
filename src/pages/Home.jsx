import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    // Fetch all listings in parallel
    const fetchAllListings = async () => {
      try {
        // Fetch offers
        const offerRes = await fetch(
          `${
            import.meta.env.VITE_APP_BACKEND_URL
          }/api/listing/get?offer=true&limit=4`
        );

        // console.log(import.meta.env.VITE_APP_BACKEND_URL);

        const offersData = await offerRes.json();
        setOfferListings(offersData);

        // Fetch rents
        const rentRes = await fetch(
          `${
            import.meta.env.VITE_APP_BACKEND_URL
          }/api/listing/get?type=rent&limit=4`
        );
        const rentsData = await rentRes.json();
        setRentListings(rentsData);

        // Fetch sales
        const saleRes = await fetch(
          `${
            import.meta.env.VITE_APP_BACKEND_URL
          }/api/listing/get?type=sale&limit=4`
        );
        const salesData = await saleRes.json();
        setSaleListings(salesData);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchAllListings();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);

    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <div>
      {/* top  */}
      <div className="relative bg-gradient-to-r from-gray-100 py-48 sm:py-64">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 sm:px-12 text-center">
          <div className="text-black">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-black leading-tight tracking-tight mb-6">
              Discover Your Dream Property
            </h1>
            <p className="text-lg sm:text-xl font-light text-black max-w-2xl mx-auto mb-8">
              Find your perfect home, whether it’s an apartment, villa, or
              commercial space. Explore verified listings with transparent
              pricing and hassle-free navigation.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white rounded-full overflow-hidden shadow-lg border border-gray-300 max-w-4xl mx-auto focus-within:ring-2 focus-within:ring-blue-600"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter city, property type, or keywords"
              className="flex-grow px-6 py-4 text-black bg-transparent outline-none placeholder-gray-500"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg transition duration-300"
            >
              Search
            </button>
          </form>

          <div className="mt-12 text-black">
            <p className="text-md sm:text-lg text-black">
              Begin your journey now.{" "}
              <span className="text-blue-400 font-medium">
                Explore exclusive listings
              </span>{" "}
              in prime locations today.
            </p>
          </div>
        </div>

        {/* Smokey White Overlay (with light opacity for foggy effect) */}
        <div className="absolute inset-0 bg-white opacity-30"></div>

        {/* Soft SVG Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-32 sm:h-40"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0C0,0,350,30,600,50C850,70,1200,20,1200,20V120H0V0Z"
              fill="url(#gradient1)"
            />
            <defs>
              <linearGradient
                id="gradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#F3F4F6", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#E5E7EB", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* swiper */}

      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrl[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[600px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* offers  */}

      <>
        <div className="container mx-auto p-4">
          {/* Rent Heading */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">
              Offer Listings
            </h2>
            {/* Show More Link */}
            <Link
              to="/search?offer=true"
              className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
            >
              Show More Offers
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {offerListings.length === 0 ? (
              <p>No Offer listings available</p>
            ) : (
              offerListings.map((offerlisting, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                >
                  {/* Image Section */}
                  <div className="relative">
                    {/* Update the Link to use the correct dynamic ID */}
                    <Link to={`/listing/${offerlisting._id}`}>
                      <img
                        src={offerlisting.imageUrl}
                        alt="Property"
                        className="w-full h-56 object-cover cursor-pointer"
                      />
                    </Link>
                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow">
                      {offerlisting.type}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                      {offerlisting.name} - ${" "}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2 my-2 line-clamp-3">
                      <FaMapMarkerAlt className="text-green-500" />
                      {offerlisting.address}
                    </p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-3 ">
                      {offerlisting.description}
                    </p>
                    <p className="mt-4 text-lg font-bold text-blue-600">
                      $
                      {offerlisting.offer
                        ? offerlisting.discountPrice.toLocaleString("en-US")
                        : offerlisting.regularPrice.toLocaleString("en-US")}
                      {offerlisting.type === "rent" && " / month"}
                    </p>
                  </div>

                  {/* Details Section */}
                  <div className="flex gap-3 items-center p-4 border-t">
                    <p className="flex items-center gap-2 font-semibold">
                      {offerlisting.bathrooms > 1 && (
                        <FaBath className="text-blue-600" />
                      )}
                      {offerlisting.bathrooms > 1
                        ? ` ${offerlisting.bathrooms} baths `
                        : ` ${offerlisting.bathrooms} bath `}
                    </p>
                    <p className="flex items-center gap-2 font-semibold">
                      {offerlisting.bedrooms > 1 && (
                        <FaBed className="text-blue-600" />
                      )}
                      {offerlisting.bedrooms > 1
                        ? ` ${offerlisting.bedrooms} beds `
                        : ` ${offerlisting.bedrooms} bed `}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </>

      {/* listing results for offer , sale and rent */}

      <>
        <div className="container mx-auto p-4">
          {/* Rent Heading */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">
              Rent Listings
            </h2>
            {/* Show More Link */}
            <Link
              to="/search?type=rent"
              className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
            >
              Show More Offers
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rentListings.length === 0 ? (
              <p>No rent listings available</p>
            ) : (
              rentListings.map((rentlisting, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                >
                  {/* Image Section */}
                  <div className="relative">
                    {/* Update the Link to use the correct dynamic ID */}
                    <Link to={`/listing/${rentlisting._id}`}>
                      <img
                        src={rentlisting.imageUrl}
                        alt="Property"
                        className="w-full h-56 object-cover cursor-pointer"
                      />
                    </Link>
                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow">
                      {rentlisting.type}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                      {rentlisting.name} - ${" "}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2 my-2 line-clamp-3">
                      <FaMapMarkerAlt className="text-green-500" />
                      {rentlisting.address}
                    </p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-3 ">
                      {rentlisting.description}
                    </p>
                    <p className="mt-4 text-lg font-bold text-blue-600">
                      $
                      {rentlisting.offer
                        ? rentlisting.discountPrice.toLocaleString("en-US")
                        : rentlisting.regularPrice.toLocaleString("en-US")}
                      {rentlisting.type === "rent" && " / month"}
                    </p>
                  </div>

                  {/* Details Section */}
                  <div className="flex gap-3 items-center p-4 border-t">
                    <p className="flex items-center gap-2 font-semibold">
                      {rentlisting.bathrooms > 1 && (
                        <FaBath className="text-blue-600" />
                      )}
                      {rentlisting.bathrooms > 1
                        ? ` ${rentlisting.bathrooms} baths `
                        : ` ${rentlisting.bathrooms} bath `}
                    </p>
                    <p className="flex items-center gap-2 font-semibold">
                      {rentlisting.bedrooms > 1 && (
                        <FaBed className="text-blue-600" />
                      )}
                      {rentlisting.bedrooms > 1
                        ? ` ${rentlisting.bedrooms} beds `
                        : ` ${rentlisting.bedrooms} bed `}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </>

      <>
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">
              Sale Listings
            </h2>
            {/* Show More Link */}
            <Link
              to="/search?type=sale"
              className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
            >
              Show More Offers
            </Link>
          </div>
          {/* Rent Heading */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {saleListings.length === 0 ? (
              <p>No Sale listings available</p>
            ) : (
              saleListings.map((saleListing, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                >
                  {/* Image Section */}
                  <div className="relative">
                    <Link to={`/listing/${saleListing._id}`}>
                      <img
                        src={saleListing.imageUrl}
                        alt="Property"
                        className="w-full h-56 object-cover"
                      />
                    </Link>
                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow">
                      {saleListing.type}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                      {saleListing.name} - ${" "}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2 my-2 line-clamp-3">
                      <FaMapMarkerAlt className="text-green-500" />
                      {saleListing.address}
                    </p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-3 ">
                      {saleListing.description}
                    </p>
                    <p className="mt-4 text-lg font-bold text-blue-600">
                      $
                      {saleListing.offer
                        ? saleListing.discountPrice.toLocaleString("en-US")
                        : saleListing.regularPrice.toLocaleString("en-US")}
                      {saleListing.type === "rent" && " / month"}
                    </p>
                  </div>

                  {/* Details Section */}
                  <div className="flex gap-3 items-center p-4 border-t">
                    <p className="flex items-center gap-2 font-semibold">
                      {saleListing.bathrooms > 1 && (
                        <FaBath className="text-blue-600" />
                      )}
                      {saleListing.bathrooms > 1
                        ? ` ${saleListing.bathrooms} baths `
                        : ` ${saleListing.bathrooms} bath `}
                    </p>
                    <p className="flex items-center gap-2 font-semibold">
                      {saleListing.bedrooms > 1 && (
                        <FaBed className="text-blue-600" />
                      )}
                      {saleListing.bedrooms > 1
                        ? ` ${saleListing.bedrooms} beds `
                        : ` ${saleListing.bedrooms} bed `}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </>
    </div>
  );
};

export default Home;
