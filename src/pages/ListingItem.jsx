import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";

const ListingItem = ({ listings }) => {
  return (
    <>
      {listings.map((listing, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out"
        >
          {/* Image Section */}
          <div className="relative">
            <img
              src={listing.imageUrl}
              alt="Property"
              className="w-full h-56 object-cover"
            />
            <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow">
              {listing.type}
            </span>
          </div>

          {/* Content Section */}
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
            {listing.name} - ${' '}
            </h3>
            <p className="text-gray-600 flex items-center gap-2 my-2 line-clamp-3">
              <FaMapMarkerAlt className="text-green-500" />
              {listing.address}
            </p>
            <p className="text-gray-600 text-sm mt-1 line-clamp-3 ">{listing.description}</p>
            <p className="mt-4 text-lg font-bold text-blue-600">
            ${listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}            </p>
          </div>

          {/* Details Section */}
          <div className="flex  gap-3 items-center p-4 border-t">
            <p className="flex items-center gap-2  font-semibold">
                {listing.bathrooms >1 && <FaBath className="text-blue-600"/>}
            {listing.bathrooms > 1
             ? `  ${listing.bathrooms} baths `
             : ` ${listing.bathrooms} bath `}
            </p>
            <p className="flex items-center gap-2  font-semibold">
            {listing.bedrooms >1 && <FaBed className="text-blue-600"/>}
               {listing.bedrooms > 1
                ? `  ${listing.bedrooms} beds `
                : ` ${listing.bedrooms} bed `}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ListingItem;
