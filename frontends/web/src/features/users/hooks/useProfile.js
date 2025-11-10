// features/users/hooks/useProfile.js
import { useEffect, useState, useCallback } from "react";
import { fetchUserProfile, updateUserProfile } from "../services/userService";
import { DEFAULT_PROFILE } from "../constants/defaults.js";
import { PROFILE_FIELDS } from "../constants/fields.js";
import { getStates, getCities, getCountries } from "../services/locationService.js";
import isEqual from "lodash.isequal";

export default function useProfile() {
  const [user, setUser] = useState({ first_name: "", last_name: "" });
  const [originalUser, setOriginalUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [statesOption, setStatesOption] = useState([]);
  const [citiesOption, setCitiesOption] = useState([]);
  const [countriesOption, setCountriesOption] = useState([]);
  const [modal, setModal] = useState(null);

  const closeModal = () => setModal(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUserProfile();
        if (data["country"]) {
          setStatesOption(getStates(data["country"]));
        }
        if (data["state"]) {
          setCitiesOption(getCities(data["state"]));
        }
        setUser(data);
        setOriginalUser(data);
      } catch (err) {
        console.log(err);
        const errorMessage = err.response?.data?.message || "Failed to load profile";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    setCountriesOption(getCountries());
    loadData();
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type } = e.target;
      const parsed = type === "number" ? (value === null ? value : Number(value)) : value;
      setUser((prev) => ({ ...prev, [name]: parsed }));
    },
    [user]
  );

  const handleInterests = useCallback(
    async (e) => {
      const { checked, value: option, type } = e.target;
      handleChange({
        target: {
          name: "interests",
          value: (user.interests || []).concat(checked ? [option] : []).filter((v) => checked || v !== option),
          type,
        },
      });
    },
    [handleChange, user.interests]
  );

  const handleLocation = useCallback(
    async (e) => {
      const { name, value, type } = e.target;

      if (name === "country") {
        const states = getStates(value);
        setStatesOption(states);
        setCitiesOption([]);
        handleChange({ target: { name: "state", value: "", type } });
        handleChange({ target: { name: "city", value: "", type } });
      } else if (name === "state") {
        const cities = getCities(value);
        setCitiesOption(cities);
        handleChange({ target: { name: "city", value: "", type } });
      }
      handleChange({ target: { name, value, type } });
    },
    [handleChange]
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    const changedFields = Object.keys(user).reduce((acc, key) => {
      if (!isEqual(user[key], originalUser[key])) acc[key] = user[key];
      return acc;
    }, {});

    try {
      await updateUserProfile(changedFields);
      setOriginalUser(user);
      setModal({ open: true, message: "Profile saved successfully!", type: "success" });
    } catch {
      setModal({ open: true, message: "Failed to update profile", type: "error" });
    } finally {
      setSaving(false);
    }
  }, [user, originalUser]);

  const handleDiscard = useCallback(() => setUser(originalUser), [originalUser]);

  const isDirty = PROFILE_FIELDS.some((field) => {
    const key = field.name;
    return !isEqual(user[key], originalUser[key]);
  });

  return {
    user,
    loading,
    saving,
    error,
    isDirty,
    modal,
    closeModal,
    handleChange,
    handleSave,
    handleDiscard,
    handleInterests,
    handleLocation,
    statesOption,
    countriesOption,
    citiesOption,
  };
}
