import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { User } from "./user";
import moment from 'moment';
import { MusicPage } from "./musicPage";

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>>{
    declare postId: number;
    declare pageId: number;
    declare userId: string;
    declare display_name: string;
    declare title: string;
    declare message: string;
    declare createdAt?: moment.Moment;
    declare updatedAt?: moment.Moment;
}

export function PostFactory(sequelize: Sequelize) {
    Post.init({
        postId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        pageId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        display_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: moment().format('M/D/YYYY, h:mm:ss a')
        },
        updatedAt: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: moment().format('M/D/YYYY, h:mm:ss a')
        }
    }, {
        freezeTableName: true,
        tableName: 'post',
        sequelize
    });
}

export function AssociateUserPost() {
    User.hasMany(Post, { foreignKey: 'userId' });
    Post.belongsTo(User, { foreignKey: 'userId' });
}

export function AssociateMusicPagePosts() {
    MusicPage.hasMany(Post, { foreignKey: 'pageId' });
    Post.belongsTo(MusicPage, { foreignKey: 'pageId' });
}