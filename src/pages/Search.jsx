import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "./ListingItem";

const Search = () => {
  const [sidebardata, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  console.log(listings);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl === "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);

      const searchQuery = urlParams.toString();
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/listing/get?${searchQuery}`
      );
      const data = await res.json();

      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setSidebarData({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 bg-gray-100 min-h-screen">
      {/* Filter Section */}
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Filter Properties
        </h2>

        {/* Search Term */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            id="searchTerm"
            value={sidebardata.searchTerm}
            onChange={handleChange}
            placeholder="Enter search term"
            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type: All/Rent/Sale */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Type
          </label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="all"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
                className="w-5 h-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">All</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
                className="w-5 h-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">Rent</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sale"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
                className="w-5 h-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">Sale</span>
            </label>
          </div>
        </div>

        {/* Furnished: Yes/No */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Furnished
          </label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={sidebardata.furnished}
                className="w-5 h-5 text-green-500 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">Yes</span>
            </label>
          </div>
        </div>

        {/* Offer */}
        <div className="mb-6">
          <label className="inline-flex items-center text-lg font-semibold text-gray-700">
            <input
              type="checkbox"
              id="offer"
              onChange={handleChange}
              checked={sidebardata.offer}
              className="form-checkbox h-6 w-6 text-blue-500"
            />
            <span className="ml-3">Special Offers</span>
          </label>
        </div>

        {/* Parking Spot */}
        <div className="mb-6">
          <label className="inline-flex items-center text-lg font-semibold text-gray-700">
            <input
              type="checkbox"
              id="parking"
              onChange={handleChange}
              checked={sidebardata.parking}
              className="form-checkbox h-6 w-6 text-blue-500"
            />
            <span className="ml-3">Parking Spot Available</span>
          </label>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center text-lg font-semibold text-gray-700">
            Sort
          </label>
          <select
            id="sort_order"
            className="border rounded-lg p-3"
            onChange={handleChange}
            defaultChecked={"created_at_desc"}
          >
            <option value="regularPrice_desc">Price High to Low</option>
            <option value="regularPrice_asc">Price Low to High</option>
            <option value="createdAt_desc">Latest</option>
            <option value="createdAt_asc">Oldest</option>
          </select>
        </div>

        {/* Apply Filters Button */}
        <button className="w-full py-3 my-5 bg-blue-500 text-white text-lg font-semibold rounded-md shadow-lg hover:bg-blue-600">
          Apply Filters
        </button>
      </form>

      {/* Properties Section */}
      <div className="w-full md:w-2/3 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Property Card */}
        {!loading && listings.length === 0 && <p>No listing found</p>}

        <ListingItem listings={listings} />
      </div>
    </div>
  );
};

export default Search;
