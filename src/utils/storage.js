import fs from "fs";

const file = "./data.json";

export function saveUser(userId, wallet) {
  let data = {};

  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file));
  }

  if (wallet === null) {
    delete data[userId];
  } else {
    data[userId] = wallet;
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export function getUser(userId) {
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file));
  return data[userId] || null;
}