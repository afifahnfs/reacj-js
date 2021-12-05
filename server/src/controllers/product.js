// import model here
const { product, user } = require("../../models");

exports.getProducts = async (req, res) => {
    try {
        let products = await product.findAll({
            include: {
                model: user,
                as: "partner",
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                        "password",
                        "gender",
                        "role",
                        "image",
                    ],
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "user"],
            },
        });

        // make url image for open public
        data = JSON.parse(JSON.stringify(products));

        dataProduct = data.map((item) => {
            return {
                ...item,
                image: process.env.PATH_FILE + item.image,
            };
        });

        res.send({
            status: "success...",
            data: dataProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const dataProduct = await product.findOne({
            where: {
                id,
            },
            include: {
                model: user,
                as: "partner",
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                        "password",
                        "gender",
                        "role",
                        "image",
                    ],
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "user"],
            },
        });

        data = JSON.parse(JSON.stringify(dataProduct));

        data = {
            ...data,
            image: process.env.PATH_FILE + data.image,
        };

        res.send({
            status: "success",
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.addProduct = async (req, res) => {
    try {
        if (req.user.role === "partner") {
            const data = req.body;

            const newProduct = await product.create({
                ...data,
                // input image for save in db and id from token
                image: req.file.filename,
                user: req.user.id,
            });

            const productData = await product.findOne({
                where: {
                    id: newProduct.id,
                },
                include: [
                    {
                        model: user,
                        as: "partner",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "password",
                                "gender",
                                "role",
                                "image",
                            ],
                        },
                    },
                ],
                attributes: {
                    exclude: ["createdAt", "updatedAt", "user"],
                },
            });

            res.send({
                status: "success...",
                data: productData,
            });
        }
        res.send({
            status: "You are not partner",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        if (req.user.role === "partner") {
            const { id } = req.params;

            const updateData = Object.assign({}, req.body); // Copy req.body in order not to change it
            updateData.image = req.file.filename;

            await product.update(updateData, {
                where: {
                    id,
                },
            });

            const dataProduct = await product.findOne({
                where: {
                    id,
                },
                include: {
                    model: user,
                    as: "partner",
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                            "password",
                            "gender",
                            "role",
                            "image",
                        ],
                    },
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt", "user"],
                },
            });

            res.send({
                status: "success",
                message: `Update product id: ${id} finished`,
                data: dataProduct,
            });
        }
        res.send({
            status: "You are not partner",
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const dataProduct = await product.findOne({
            where: {
                id,
            },
            include: {
                model: user,
                as: "partner",
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                        "password",
                        "gender",
                        "role",
                        "image",
                    ],
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "user"],
            },
        });

        var fs = require("fs");
        var filePath = `./uploads/${dataProduct.image}`;
        fs.unlinkSync(filePath);

        await product.destroy({
            where: {
                id,
            },
        });

        res.send({
            status: "success",
            message: `Delete Product id: ${id} finished`,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.partnerProduct = async (req, res) => {
    try {
        if (req.user.role === "partner") {
            const { id } = req.user;

            let productPartner = await product.findAll({
                where: {
                    user: id,
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt", "user"],
                },
            });

            // make url image for open public
            data = JSON.parse(JSON.stringify(productPartner));

            dataProduct = data.map((item) => {
                return {
                    ...item,
                    image: process.env.PATH_FILE + item.image,
                };
            });

            res.send({
                status: "success...",
                data: dataProduct,
            });
        }
        res.send({
            status: "not accsess",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getProductbyPartner = async (req, res) => {
    try {
        const { id } = req.params;

        let products = await product.findAll({
            where: {
                user: id,
            },

            attributes: {
                exclude: ["createdAt", "updatedAt", "user"],
            },
        });

        // make url image for open public
        data = JSON.parse(JSON.stringify(products));

        dataProduct = data.map((item) => {
            return {
                ...item,
                image: process.env.PATH_FILE + item.image,
            };
        });

        res.send({
            status: "success",
            data: dataProduct,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.myProduct = async (req, res) => {
    try {
        const { id } = req.user;

        let products = await product.findAll({
            where: {
                user: id,
            },

            attributes: {
                exclude: ["createdAt", "updatedAt", "user"],
            },
        });

        // make url image for open public
        data = JSON.parse(JSON.stringify(products));

        dataProduct = data.map((item) => {
            return {
                ...item,
                image: process.env.PATH_FILE + item.image,
            };
        });

        res.send({
            status: "success",
            data: dataProduct,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};
