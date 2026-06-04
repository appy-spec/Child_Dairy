const AdminModel = require("../model/adminSchema");
const bcrypt = require("bcrypt");

module.exports.adminCheckCredentials = async () => {
  try {
    
    let result = await AdminModel.find();

    if (result.length == 0) {
      let userData = {
        email: process.env.ADMIN_EMAIL,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
      };

      let newUser = new AdminModel(userData);
      newUser
        .save()
        .then((res) => {
          console.log("Admin data was inserted");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("User is already register");
    }

    return true;

  } catch {
    (error) => {
      console.log("Error in admin credentilas", error);
    };

    return false;
  }
};
