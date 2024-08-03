import { binarySearch } from "./binarySearch.js";
import { fetchContacts } from "./fetchContacts.js";

export const validateInfo = async (data) => {
  let valid = true;
  let inValidMessage = "";

  for (let [key, value] of Object.entries(data)) {
    // first name validation
    if (key === "firstName") {
      if (value === null) {
        valid = false;
        inValidMessage = "First name is a mandatory field";
        break;
      }

      if (typeof value !== "string") {
        valid = false;
        inValidMessage = "First name must be a string";
        break;
      }
    }

    // last name validation
    if (key === "lastName") {
      if (value !== null && typeof value !== "string") {
        valid = false;
        inValidMessage = "Last name must be a string";
        break;
      }
    }

    // email validation
    if (key === "email") {
      if (value !== null && typeof value !== "string") {
        valid = false;
        inValidMessage = "Last name must be a string";
        break;
      }
    }

    // phone num validation
    if (key === "phone") {
      if (value === null) {
        valid = false;
        inValidMessage = "Phone number is a mandatory field";
        break;
      }

      if (typeof value !== "number") {
        valid = false;
        inValidMessage = "Phone number must be a number";
        break;
      }

      if (value <= 1000000000 || value >= 10000000000) {
        valid = false;
        inValidMessage = "Phone number must be 10 character in length";
        break;
      }
    }
  }

  if (valid) {
    const contacts = await fetchContacts({ sort: "phone" });
    const numberInDB = binarySearch(contacts, data.phone);

    if (numberInDB.isFound) {
      valid = false;
      inValidMessage = "Phone number already in DB🏬";
    }
  }

  return { valid, inValidMessage };
};
