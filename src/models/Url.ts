import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IUrl } from '../types';
import User from './User';

class Url extends Model<IUrl> implements IUrl {
  public id!: number;
  public originalUrl!: string;
  public shortCode!: string;
  public userId!: number;
  public visits!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Url.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    originalUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    shortCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    visits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize: sequelize,
    tableName: 'urls',
  }
);

Url.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Url, { foreignKey: 'userId' });

export default Url; 