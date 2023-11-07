const AppError = require("../utils/appError");
const createDatabaseConnection = require("../services/db");

exports.getAllItems = async (req, res, next) => {
  try {
    const conn = await createDatabaseConnection(); // Create a new connection
    const [rows, fields] = await conn.query("SELECT * FROM freshkart.products");
    // conn.end(); // Close the connection when done

    res.status(200).json({
      status: "success",
      length: rows?.length,
      data: rows,
    });
  } catch (err) {
    return next(new AppError(err, 500));
  }
};

// Get item by ID
exports.getItemById = async (req, res, next) => {
  try {
    const conn = await createDatabaseConnection();
    const [rows, fields] = await conn.query(
      `SELECT * FROM freshkart.products WHERE id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      // No rows found for the given ID, return a "not found" response
      return res.status(404).json({
        status: "error",
        message: "Item not found",
      });
    }
    res.status(200).json({
      status: "success",
      length: rows?.length,
      data: rows,
    });
  } catch (err) {
    return next(new AppError(err, 500));
  }
};

// Get items by type
exports.getItemByType = async (req, res, next) => {
  try {
    const type = req.params.type;
    const conn = await createDatabaseConnection();
    const [rows, fields] = await conn.query(
      "SELECT * FROM freshkart.products WHERE type = ?",
      [type]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No items found for the given type",
      });
    }

    res.status(200).json({
      status: "success",
      length: rows.length,
      data: rows,
    });
  } catch (err) {
    return next(new AppError(err, 500));
  }
};

exports.getAllPopularItems = async (req, res, next) => {
  try {
    const type = req.params.type;
    const popular = req.params.popular;
    const conn = await createDatabaseConnection();

    const [rows, fields] = await conn.query(
      "SELECT * FROM freshkart.products WHERE type = ? AND popular = ?",
      [type, popular]
    );

    res.status(200).json({
      status: "success",
      length: rows?.length,
      data: rows,
    });
  } catch (err) {
    return next(new AppError(err, 500));
  }
};

exports.addNewProducts = async (req, res, next) => {
  try {
    const { id, name, price, was, weight, pic, popular, type } = req.body;

    if (
      !id ||
      !name ||
      !price ||
      !was ||
      !weight ||
      !pic ||
      !popular ||
      !type
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required to add a product.",
      });
    }

    const conn = await createDatabaseConnection();
    const query =
      "INSERT INTO freshkart.products (id, name, price, was, weight, pic, popular, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [id, name, price, was, weight, pic, popular, type];
    await conn.query(query, values);

    res.status(201).json({
      status: "success",
      message: "Product added successfully.",
    });
  } catch (err) {
    return next(new AppError(err, 500)); // Handle errors appropriately
  }
};
exports.deleteProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const conn = await createDatabaseConnection();

    // Check if the product exists
    const [existingProduct] = await conn.query(
      "SELECT * FROM freshkart.products WHERE id = ?",
      [productId]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Delete the product by ID
    await conn.query("DELETE FROM freshkart.products WHERE id = ?", [
      productId,
    ]);

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (err) {
    return next(new AppError(err, 500)); // Handle errors appropriately
  }
};

// Export the functions
module.exports = exports;
