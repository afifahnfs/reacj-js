"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            product.belongsTo(models.user, {
                as: "partner",
                foreignKey: {
                    name: "user",
                },
            });

            product.hasMany(models.order, {
                as: "product",
                foreignKey: {
                    name: "idProduct",
                },
            });

            // product.belongsToMany(models.transaction, {
            //     as: "product",
            //     through: {
            //         model: "order",
            //     },
            //     foreignKey: "idProduct",
            // });
        }
    }
    product.init(
        {
            title: DataTypes.STRING,
            price: DataTypes.INTEGER,
            image: DataTypes.STRING,
            user: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "product",
        }
    );
    return product;
};
