const AppError = require("../utils/appError");
const createDatabaseConnection = require("../services/db");

//get ALl users
exports.getUsers = async (req, res, next) => {
  try {
    const conn = await createDatabaseConnection();
    const [rows, fields] = await conn.query(`SELECT * FROM freshkart.user`);
    res.status(200).json({
      status: "success",
      length: rows?.length,
      data: rows,
    });
  } catch (err) {
    return next(new AppError(err, 500));
  }
};
exports.getUserbyId = async (req, res, next) => {
  try {
    const conn = await createDatabaseConnection();
    const [rows, fields] = await conn.query(
      `SELECT * FROM freshkart.user WHERE ID = ? `,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(400).json({
        satus: "error",
        message: "User not Found",
      });
    }
    res.status(200).json({
      status: "Success",
      length: rows?.length,
      data: rows,
    });
  } catch (err) {
    return next(new AppError(err, 500));
  }
};

exports.RegisterUser = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, confirmPassword } =
      req.body;

    if (!first_name || !last_name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Passwords do not match",
      });
    }

    const conn = await createDatabaseConnection();
    const query =
      "INSERT INTO freshkart.user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
    const values = [first_name, last_name, email, password];
    await conn.query(query, values);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (err) {
    return next(new AppError(err, 500));
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Missing Required Fields",
      });
    }
    const conn = await createDatabaseConnection();
    const query = `SELECT * FROM freshkart.user WHERE email = ? AND password  = ?  `;
    const values = [email, password];
    const [rows, fields] = await conn.query(query, values);
    if (rows.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Invalid Credentials",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User Logged In successfully",
    });
  } catch (err) {
    return next(new AppError(err, 500));
  }
};
// exports.updateUserPassword = async (req, res, next) => {
//   try {
//     const newPassword = req.body.newPassword;
//     const userId = req.params.id;

//     if (!newPassword) {
//       return res.status(400).json({
//         status: "error",
//         message: "New Password is required",
//       });
//     }

//     const conn = await createDatabaseConnection();
//     const query = `UPDATE freshkart.user SET password = ? WHERE id = ?`;
//     const values = [newPassword, userId];
//     const result = await conn.query(query, values);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         status: "error",
//         message: "User Not Found or no changes Made",
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       message: "User Password updated successfully",
//     });
//   } catch (err) {
//     return next(new AppError(err, 500));
//   }
// };
exports.updateUserPassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const conn = await createDatabaseConnection();

    const updateQuery = `
      UPDATE freshkart.user
      SET password = ?
      WHERE email = ? AND password = ?;
    `;

    const updateValues = [newPassword, email, oldPassword];

    const updateResult = await conn.query(updateQuery, updateValues);

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid old password or no changes made to the password",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User Password updated successfully",
    });
  } catch (err) {
    return next(new AppError(err, 500));
  }
};

exports.deleteUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const conn = await createDatabaseConnection();

    const [existingUser] = await conn.query(
      `SELECT * FROM freshkart.user WHERE id = ? `,
      [userId]
    );
    if (existingUser.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "User Not Found",
      });
    }
    await conn.query(`DELETE FROM freshkart.user WHERE id =? `, [userId]);
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    return next(new AppError(err, 500));
  }
};
module.exports = exports;
