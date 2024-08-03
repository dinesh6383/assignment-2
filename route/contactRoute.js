import express from "express";
const Router = express.Router();

import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
  getContactById,
  searchContact,
} from "../controller/contactController.js";
import { rateLimiter } from "../helpers/rateLimiter.js";

Router.get("/", getContacts);
Router.get("/search", searchContact);
Router.get("/:id", getContactById);
Router.post("/create", rateLimiter, createContact);
Router.patch("/:id", updateContact);
Router.delete("/:id", deleteContact);

export default Router;
