//Importing All Controllers

import { getUsers } from "./get/index.js";
import { registerUser } from "./post/index.js";
import { updateUser, changePassword } from "./update/index.js";
import { deleteUser } from "./delete/index.js";
import { loginUser } from "./login/index.js";
import { logoutUser } from "./logout/index.js";
import { refreshAccessToken } from "./refreshAccessToken/index.js";
import { forgetPassword, resetPassword } from "./forgetPassword/index.js";

//Exporting All Controllers

export {
  getUsers,
  registerUser,
  updateUser,
  deleteUser,
  logoutUser,
  loginUser,
  refreshAccessToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
