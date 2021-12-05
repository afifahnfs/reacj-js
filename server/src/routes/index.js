const express = require("express");

const router = express.Router();

// import controller
const {
    register,
    login,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getPartners,
} = require("../controllers/user");

const {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    partnerProduct,
    getProductbyPartner,
    myProduct,
} = require("../controllers/product");

const {
    getTransactions,
    getTransaction,
    myTransactions,
    partnerTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
} = require("../controllers/transaction");

const { checkAuth } = require("../controllers/auth");

// import middleware auth
const { auth } = require("../middlewares/auth");

// import middleware uploadFile
const { uploadFile } = require("../middlewares/uploadFile");

// add route
router.post("/register", register);
router.post("/login", login);

router.get("/check-auth", auth, checkAuth);

router.get("/users", getUsers);
router.get("/user", auth, getUser);
router.patch("/user/:id", auth, uploadFile("image"), updateUser);
router.delete("/user/:id", auth, deleteUser);

router.get("/partners", getPartners);

router.get("/products", getProducts);
router.get("/partner-products", auth, partnerProduct);
router.get("/product/:id", getProduct);
router.post("/product", auth, uploadFile("image"), addProduct);
router.patch("/product/:id", uploadFile("image"), auth, updateProduct);
router.delete("/product/:id", auth, deleteProduct);

router.get("/my-product", auth, myProduct);
router.get("/product-partner/:id", getProductbyPartner);

router.get("/transactions", auth, getTransactions);
router.get("/my-transactions", auth, myTransactions);
router.get("/partner-transactions", auth, partnerTransactions);
router.get("/transaction/:id", auth, getTransaction);
router.post("/transaction", auth, addTransaction);
router.patch("/transaction/:id", auth, updateTransaction);
router.delete("/transaction/:id", auth, deleteTransaction);

module.exports = router;
