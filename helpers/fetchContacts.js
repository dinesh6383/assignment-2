import fs from "fs";
import path from "path";
import csv from "csv-parser";

const filePath = path.join(process.cwd(), "data.csv");

export const fetchContacts = (sortBy) => {
  return new Promise((resolve, reject) => {
    let contacts = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        contacts.push(row);
      })
      .on("end", () => {
        if (sortBy && Object.keys(sortBy).length < 1) {
          contacts.sort((a, b) => {
            return a.firstName.localeCompare(b.firstName);
          });
        }

        if (sortBy && sortBy.sort === "lastName") {
          contacts.sort((a, b) => {
            if (a.lastName === "" && b.lastName === "") return 0;
            if (a.lastName === "") return 1;
            if (b.lastName === "") return -1;
            return sortBy.order === "asc"
              ? a.lastName.localeCompare(b.lastName)
              : b.lastName.localeCompare(a.lastName);
          });
        }

        if (sortBy && sortBy.sort === "createdAt") {
          contacts.sort((a, b) => {
            return sortBy.order === "asc"
              ? a.createdAt - b.createdAt
              : b.createdAt - a.createdAt;
          });
        }

        if (sortBy && sortBy.sort === "phone") {
          contacts.sort((a, b) => {
            return a.phone - b.phone;
          });
        }
        resolve(contacts);
      })
      .on("err", (error) => {
        reject(error);
      });
  });
};
