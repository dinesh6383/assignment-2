import path from "path";

import { v4 as uuidv4 } from "uuid";
import { createObjectCsvWriter } from "csv-writer";

import { validateInfo } from "../helpers/validateInput.js";
import { fetchContacts } from "../helpers/fetchContacts.js";
import { fuzzySearch } from "../helpers/fuzzySearch.js";

const filePath = path.join(process.cwd(), "data.csv");
const dataStructure = [
  { id: "id", title: "id" },
  { id: "firstName", title: "firstName" },
  { id: "lastName", title: "lastName" },
  { id: "email", title: "email" },
  { id: "phone", title: "phone" },
  { id: "createdAt", title: "createdAt" },
];

const csvWriter = createObjectCsvWriter({
  path: filePath,
  header: dataStructure,
});

export const getContacts = async (req, res, next) => {
  try {
    const allContacts = await fetchContacts(req.query);
    res.json({ success: true, data: allContacts });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const contacts = await fetchContacts();

    const contactIdx = contacts.findIndex((value) => value.id === user_id);
    if (contactIdx >= 0 && contactIdx < contacts.length) {
      res.json({ success: true, data: contacts[contactIdx] });
    } else {
      next({
        status: 404,
        message: "User ID is wrong ❌",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const user_info = {
      id: uuidv4(),
      firstName: req.body.firstName ? req.body.firstName : null,
      lastName: req.body.lastName ? req.body.lastName : null,
      email: req.body.email ? req.body.email : null,
      phone: req.body.phone ? req.body.phone : null,
      createdAt: new Date().getTime(),
    };

    const { valid, inValidMessage } = await validateInfo(user_info);

    if (valid) {
      await csvWriter.writeRecords([user_info]);
      res.json({ success: true, data: user_info });
    } else {
      next({
        status: 400,
        message: inValidMessage,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const { firstName, lastName, email, phone } = req.body;
    const contacts = await fetchContacts();

    const contactIdx = contacts.findIndex((value) => value.id === user_id);

    if (contactIdx >= 0 && contactIdx < contacts.length) {
      contacts[contactIdx].firstName = firstName
        ? firstName
        : contacts[contactIdx].firstName;
      contacts[contactIdx].lastName = lastName
        ? lastName
        : contacts[contactIdx].lastName;
      contacts[contactIdx].email = email ? email : contacts[contactIdx].email;
      contacts[contactIdx].phone = phone ? phone : contacts[contactIdx].phone;

      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: dataStructure,
      });

      await csvWriter.writeRecords(contacts);
      res.json({ success: true, data: "Updated successfully!" });
    } else {
      next({
        status: 404,
        message: "User ID is wrong ❌",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const contacts = await fetchContacts();

    const contactIdx = contacts.findIndex((value) => value.id === user_id);

    if (contactIdx >= 0 && contactIdx < contacts.length) {
      contacts.splice(contactIdx, 1);
    } else {
      next({
        status: 404,
        message: "User ID is wrong ❌",
      });
    }

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: dataStructure,
    });

    await csvWriter.writeRecords(contacts);
    res.json({ success: true, data: "User deleted!" });
  } catch (error) {
    next(error);
  }
};

export const searchContact = async (req, res, next) => {
  try {
    const hint = req.query.uname;
    const contacts = await fetchContacts();

    const result = fuzzySearch(contacts, hint);

    if (result.length !== 0) {
      res.json({ success: true, data: result });
    } else {
      next({
        status: 404,
        message: "No related names found! ☹️",
      });
    }
  } catch (error) {
    next(error);
  }
};
