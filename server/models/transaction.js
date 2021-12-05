"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class transaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            transaction.belongsTo(models.user, {
                as: "user",
                foreignKey: {
                    name: "userOrder",
                },
            });

            transaction.belongsTo(models.user, {
                as: "seller",
                foreignKey: {
                    name: "idPartner",
                },
            });

            transaction.hasMany(models.order, {
                as: "order",
                foreignKey: {
                    name: "idTransaction",
                },
            });

            // transaction.belongsToMany(models.product, {
            //     as: "orders",
            //     through: {
            //         model: "order",
            //         as: "bridge",
            //     },
            //     foreignKey: "idTransaction",
            // });
        }
    }
    transaction.init(
        {
            userOrder: DataTypes.INTEGER,
            idPartner: DataTypes.INTEGER,
            status: DataTypes.ENUM(
                "waiting approve",
                "on the way",
                "success",
                "cancel"
            ),
        },
        {
            sequelize,
            modelName: "transaction",
        }
    );
    return transaction;
};
