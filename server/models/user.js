"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            user.hasMany(models.product, {
                as: "products",
                foreignKey: {
                    name: "user",
                },
            });
            user.hasMany(models.transaction, {
                as: "userOrder",
                foreignKey: {
                    name: "userOrder",
                },
            });
            user.hasMany(models.transaction, {
                as: "idPartner",
                foreignKey: {
                    name: "idPartner",
                },
            });
        }
    }
    user.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            fullName: DataTypes.STRING,
            gender: DataTypes.STRING,
            phone: DataTypes.STRING,
            role: DataTypes.ENUM("user", "partner"),
            image: DataTypes.STRING,
            location: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "user",
        }
    );
    return user;
};
