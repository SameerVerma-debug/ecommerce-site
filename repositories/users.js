const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);

class usersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Filename is required to store users information");
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(`${this.filename}`, "[]");
    }
  }

  async getAll() {
    //Open File  //Read content  //Parse the content
    const data = JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: "utf-8" })
    );

    //Return the parsed content
    return data;
  }

  async create(attributes) {
    attributes.id = this.randomID();

    //hash + salt(ing) password
    const salt = crypto.randomBytes(8).toString("hex");
    //scrypt takes password and salt and returns hashed buffer
    const hashBuf = await scrypt(attributes.password, salt, 64);
    const data = await this.getAll();

    const record = {
      ...attributes,
      password: `${hashBuf.toString("hex")}.${salt}`,
    };
    data.push(record);
    await this.writeAll(data);
    return record;
  }

  async matchPassword(saved, supplied) {
    const hashAndSalt = saved.split(".");
    const hashed = hashAndSalt[0];
    const salt = hashAndSalt[1];

    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString("hex");
  }

  async writeAll(data) {
    await fs.promises.writeFile(this.filename, JSON.stringify(data, null, 2));
  }

  randomID() {
    //generates random 4 bytes and converts them to a string in hex format
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const data = await this.getAll();
    return data.find((user) => {
      return user.id === id;
    });
  }

  async delete(id) {
    const data = await this.getAll();
    const filteredData = data.filter((record) => {
      return record.id !== id;
    });
    await this.writeAll(filteredData);
  }

  async update(id, attributes) {
    const data = await this.getAll();
    const record = data.find((record) => {
      return record.id === id;
    });
    if (!record) {
      throw new Error(`Can't find a user with given id: ${id}`);
    }
    Object.assign(record, attributes);
    await this.writeAll(data);
  }

  async getOneBy(filters) {
    const data = await this.getAll();
    for (let user of data) {
      let found = true;
      for (let key in filters) {
        if (user[key] !== filters[key]) {
          found = false;
        }
      }
      if (found == true) {
        return user;
      }
    }
  }
}

module.exports = new usersRepository("users.json");
