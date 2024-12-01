import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface IUser {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserCreationAttributes extends Optional<IUser, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<IUser, IUserCreationAttributes> implements IUser {
  public id!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  timestamps: true
});

export default User; 