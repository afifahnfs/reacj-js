// import model here
const {transaction, product, user, order} = require("../../models");
const {getProducts} = require("./product");

exports.getTransactions = async (req, res) => {
    try {
        let transactions = await transaction.findAll({
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                            "password",
                            "gender",
                            "phone",
                            "role",
                            "image",
                        ],
                    },
                },
                {
                    model: order,
                    as: "order",
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                            "idProduct",
                            "idTransaction",
                        ],
                    },
                    include: {
                        model: product,
                        as: "product",
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "user"],
                        },
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "userOrder", "idPartner"],
            },
        });

        // console.log(transactions);

        arrayTransaction = JSON.parse(JSON.stringify(transactions));

        // transaction_id = await arrayTransaction.map((catchIdTransaction) => {
        //     return catchIdTransaction.id;
        // });

        // showOrder = await order.findAll({
        //     where: {
        //         idTransaction: transaction_id,
        //     },
        //     include: {
        //         model: product,
        //         as: "product",
        //     },
        // });

        // productOrder = showOrder.map((detailOrder) => {
        //     return {
        //         idTransaction: detailOrder.id,
        //         id: detailOrder.product.id,
        //         title: detailOrder.product.title,
        //         price: detailOrder.product.price,
        //         image: detailOrder.product.image,
        //         qty: detailOrder.qty,
        //     };
        // });

        // console.log(productOrder.idTransaction);

        showTransaction = await arrayTransaction.map((loopTransaction) => {
            getOrder = async () => {
                carOrder = await order.findAll({
                    where: {
                        idTransaction: loopTransaction.id,
                    },
                    include: {
                        model: product,
                        as: "product",
                    },
                });
            };

            console.log(carOrder);

            return {
                id: loopTransaction.id,
                userOrder: loopTransaction.user,
                status: loopTransaction.status,
                order: [{showOrder}],
            };
        });

        console.log(showTransaction);

        //
        // console.log(transaction_id);

        // showOrder = await order.findAll({
        //     where: {
        //         idTransaction: transaction_id,
        //     },
        //     include: {
        //         model: product,
        //         as: "product",
        //     },
        // });

        // // console.log(showOrder);

        // productOrder = showOrder.map((detailOrder) => {
        //     return {
        //         id: detailOrder.product.id,
        //         title: detailOrder.product.title,
        //         price: detailOrder.product.price,
        //         image: detailOrder.product.image,
        //         qty: detailOrder.qty,
        //     };
        // });

        res.send({
            status: "success...",
            data: transactions,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getTransaction = async (req, res) => {
    try {
        const {id} = req.params;

        const dataTransaction = await transaction.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                            "password",
                            "gender",
                            "phone",
                            "role",
                            "image",
                        ],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "userOrder", "order"],
            },
        });

        let showOrder = await order.findAll({
            where: {
                idTransaction: dataTransaction.id,
            },
            include: {
                model: product,
                as: "product",
            },
        });

        console.log(showOrder);

        productOrder = showOrder.map((detailOrder) => {
            return {
                id: detailOrder.product.id,
                title: detailOrder.product.title,
                price: detailOrder.product.price,
                image: detailOrder.product.image,
                qty: detailOrder.qty,
            };
        });

        res.send({
            status: "success",
            data: {
                transaction: {
                    id: dataTransaction.id,
                    userOrder: dataTransaction.user,
                    status: dataTransaction.status,
                    order: productOrder,
                },
            },
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.addTransaction = async (req, res) => {
    try {
        if (req.user.role === "user") {
            const newProducts = req.body.products;

            // console.log(newProducts);

            // console.log(newProducts[0].id);

            const seller = await product.findOne({
                where: {
                    id: newProducts[0].id,
                },
            });

            const newTransaction = await transaction.create({
                userOrder: req.user.id,
                idPartner: seller.user,
            });

            // console.log(newTransaction);

            const orderProducts = newProducts.map((product) => {
                return {
                    idProduct: `${product.id}`,
                    idTransaction: `${newTransaction.id}`,
                    qty: `${product.qty}`,
                };
            });
            await order.bulkCreate(orderProducts);

            const showTransaction = await transaction.findOne({
                where: {
                    id: newTransaction.id,
                },
                include: [
                    {
                        model: user,
                        as: "user",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "password",
                                "gender",
                                "phone",
                                "role",
                                "image",
                            ],
                        },
                    },
                ],
                exclude: ["createdAt", "updatedAt", "idPartner"],
            });

            console.log(newTransaction.id);

            let showOrder = await order.findAll({
                where: {
                    idTransaction: newTransaction.id,
                },
                include: {
                    model: product,
                    as: "product",
                },
            });

            console.log(showOrder);

            productOrder = showOrder.map((detailOrder) => {
                return {
                    id: detailOrder.product.id,
                    title: detailOrder.product.title,
                    price: detailOrder.product.price,
                    image: detailOrder.product.image,
                    qty: detailOrder.qty,
                };
            });

            res.send({
                status: "success",
                data: {
                    transaction: {
                        id: showTransaction.id,
                        userOrder: showTransaction.user,
                        status: showTransaction.status,
                        order: productOrder,
                    },
                },
            });
        }
        res.send({
            status: "not user",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const {id} = req.params;

        await transaction.update(req.body, {
            where: {
                id,
            },
        });

        const transactionUpdate = await transaction.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                            "password",
                            "gender",
                            "phone",
                            "role",
                            "image",
                        ],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "userOrder", "order"],
            },
        });

        let showOrder = await order.findAll({
            where: {
                idTransaction: transactionUpdate.id,
            },
            include: {
                model: product,
                as: "product",
            },
        });

        productOrder = showOrder.map((detailOrder) => {
            return {
                id: detailOrder.product.id,
                title: detailOrder.product.title,
                price: detailOrder.product.price,
                image: detailOrder.product.image,
                qty: detailOrder.qty,
            };
        });

        res.send({
            status: "success",
            data: {
                transaction: {
                    id: transactionUpdate.id,
                    userOrder: transactionUpdate.user,
                    status: transactionUpdate.status,
                    order: productOrder,
                },
            },
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const {id} = req.params;

        await transaction.destroy({
            where: {
                id,
            },
        });

        res.send({
            status: "success",
            message: `Delete transaction id: ${id} finished`,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.myTransactions = async (req, res) => {
    try {
        if (req.user.role === "user") {
            const transactions = await transaction.findAll({
                where: {
                    userOrder: req.user.id,
                },
                include: [
                    {
                        model: user,
                        as: "user",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "password",
                                "gender",
                                "phone",
                                "role",
                                "image",
                            ],
                        },
                    },
                    {
                        model: order,
                        as: "order",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "idProduct",
                                "idTransaction",
                            ],
                        },
                        include: {
                            model: product,
                            as: "product",
                            attributes: {
                                exclude: ["createdAt", "updatedAt"],
                            },
                        },
                    },
                ],
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                        "userOrder",
                        "idPartner",
                    ],
                },
            });

            res.send({
                status: "success...",
                data: transactions,
            });
        }
        res.send({
            status: "Only user can access",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.partnerTransactions = async (req, res) => {
    try {
        if (req.user.role === "partner") {
            const transactions = await transaction.findAll({
                where: {
                    idPartner: req.user.id,
                },
                include: [
                    {
                        model: user,
                        as: "user",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "password",
                                "gender",
                                "phone",
                                "role",
                                "image",
                            ],
                        },
                    },
                    {
                        model: order,
                        as: "order",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "idProduct",
                                "idTransaction",
                            ],
                        },
                        include: {
                            model: product,
                            as: "product",
                            attributes: {
                                exclude: ["createdAt", "updatedAt"],
                            },
                        },
                    },
                ],
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                        "userOrder",
                        "idPartner",
                    ],
                },
            });

            res.send({
                status: "success...",
                data: transactions,
            });
        }
        res.send({
            status: "Only partner can access",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};
