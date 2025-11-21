import { flattenObject } from "src/bot/utils/object";

import countriesData from "../../../../../../shared/data/countries.json";
import statesData from "../../../../../../shared/data/states.json";
import citiesData from "../../../../../../shared/data/cities.json";
import { INTEREST_VALUES } from "../../../../../../shared/constants/interests";
import { map } from "zod";

type DataItem = { value: number; label: string };

const states = statesData as Record<string, DataItem[]>;
const countries = countriesData as Array<DataItem>;
const cities = citiesData as Record<string, DataItem[]>;

export const allLabelCountries = countries.map((item) => item.label);

export const allLabelCities = Object.values(cities)
  .flat()
  .map((item) => item.label);

export const allLabelStates = Object.values(states)
  .flat()
  .map((item) => item.label);

export function buildProfileText(profile: any) {
  const missing = "❓";

  const firstName = profile.first_name || missing;
  const lastName = profile.last_name || missing;
  const age = profile.age !== undefined ? profile.age : missing;
  const gender = profile.gender || missing;
  const career = profile.career || missing;
  const city = profile.city || missing;
  const state = profile.state || missing;
  const country = profile.country || missing;
  const description = profile.description || null;

  const interestsStr = Array.isArray(profile.interests) && profile.interests.length > 0 ? profile.interests.join(", ") : missing;

  let genderSticker = "⚧";
  if (gender.toLowerCase() === "male") genderSticker = "👨";
  else if (gender.toLowerCase() === "female") genderSticker = "👩";

  // Career sticker
  let careerSticker = "💼";
  if (career.toLowerCase().includes("teacher")) careerSticker = "📚";
  else if (career.toLowerCase().includes("developer")) careerSticker = "💻";

  let profileText = `<b>🆔 Username:</b>/username_${profile.username || missing}
${genderSticker} <b>Name:</b> ${firstName} ${lastName}
🎂 <b>Age:</b> ${age}
${careerSticker} <b>Career:</b> ${career}
⭐ <b>Interests:</b> ${interestsStr}
📍 <b>Location:</b> ${city}, ${state}, ${country}`;
  if (description) {
    profileText += `\n<b>💬 Description:</b> <blockquote>${description}"</blockquote>`;
  }

  return profileText;
}

export function getMapInterests(selectedValues: Array<any>) {
  const safeValues = selectedValues ?? [];
  const mapped_interests_values = INTEREST_VALUES.map((interest) => (safeValues.includes(interest) ? `✔️ ${interest}` : interest));
  return mapped_interests_values;
}

export function getCountries() {
  return countries.map((item) => item.label);
}

export function getStates(countryLabel: any) {
  const countryId = getCountryBySource("label", countryLabel);
  return states[countryId].map((item) => item.label) || [];
}

export function getCities(stateId: number) {
  return cities[stateId].map((item) => item.label) || [];
}

export function getCityBySource(source: string, value: string | number) {
  const allCities = flattenObject(cities);
  return findBySource(allCities, source, value);
}

export function getStateBySource(source: string, value: string | number) {
  const allStates = flattenObject(states);
  return findBySource(allStates, source, value);
}

export function getCountryBySource(source: string, value: string | number) {
  const allCountries = countries.flat();
  return findBySource(allCountries, source, value);
}

function findBySource(list: Array<any>, source: string, value: string | number) {
  if (source == "value") {
    return (list.find((item) => item[source] == value) || {}).label || null;
  } else if (source == "label") {
    return (list.find((item) => item[source] == value) || {}).value || null;
  }
}
