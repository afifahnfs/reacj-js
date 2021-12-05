const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    // menangkap token
    const authHeader = req.header("Authorization");

    // memisahkan Bearer dengan Token dan yang di ambil hanya token
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send({message: "Access denied!"});
    }

    try {
        // const SECRET_KEY = "IzinMasukWaysFood";

        const verified = jwt.verify(token, process.env.TOKEN_KEY);

        req.user = verified;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Invalid token",
        });
    }
};
