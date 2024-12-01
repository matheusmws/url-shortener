import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ShortUrlAttributes {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  userId?: string | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ShortUrlCreationAttributes extends Optional<ShortUrlAttributes, 'id' | 'clicks' | 'createdAt' | 'updatedAt'> {}

class ShortUrl extends Model<ShortUrlAttributes, ShortUrlCreationAttributes> implements ShortUrlAttributes {
  public id!: string;
  public originalUrl!: string;
  public shortCode!: string;
  public clicks!: number;
  public userId?: string | null;
  public deletedAt?: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ShortUrl.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  originalUrl: {
    type: DataTypes.STRING(2048),
    allowNull: false
  },
  shortCode: {
    type: DataTypes.STRING(6),
    unique: true,
    allowNull: false
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'ShortUrl',
  timestamps: true
});

export default ShortUrl; 