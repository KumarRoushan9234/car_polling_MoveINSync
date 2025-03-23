import { useEffect, useRef } from "react";

const LocationSearch = ({ updateFormData, setLocationSelected }) => {
  const placePickerRef = useRef(null);
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const handlePlaceChange = () => {
      const placePicker = placePickerRef.current;
      if (!placePicker || !placePicker.value || !placePicker.value.location)
        return;

      const { location, formattedAddress } = placePicker.value;

      updateFormData({
        pickupLocation: {
          lat: location.lat,
          lon: location.lng,
          address: formattedAddress,
        },
      });

      setLocationSelected(true);
    };

    if (placePickerRef.current) {
      placePickerRef.current.addEventListener(
        "gmpx-placechange",
        handlePlaceChange
      );
    }

    return () => {
      if (placePickerRef.current) {
        placePickerRef.current.removeEventListener(
          "gmpx-placechange",
          handlePlaceChange
        );
      }
    };
  }, [updateFormData, setLocationSelected]);

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-semibold">
        Where will you start your ride?
      </h1>
      <gmpx-api-loader
        key={API_KEY}
        solution-channel="GMP_GE_mapsandplacesautocomplete_v2"
      ></gmpx-api-loader>
      <div className="w-full max-w-md mt-4">
        <gmpx-place-picker
          ref={placePickerRef}
          placeholder="Enter a location"
        ></gmpx-place-picker>
      </div>
    </div>
  );
};

export default LocationSearch;
