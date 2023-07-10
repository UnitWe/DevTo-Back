import { HasMany, Column, CreatedAt, DataType, Model, Table, UpdatedAt, PrimaryKey, Default, BelongsTo, ForeignKey } from "sequelize-typescript";
import { University } from "../../../modules/university/model/university.model";

@Table({ freezeTableName: true })
export class User extends Model<User> {

    @Default(DataType.UUIDV4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    id: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    })
    active: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password: string;

    @ForeignKey(() => University)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    university_id: string;


    @CreatedAt
    createdAt?: Date;

    @UpdatedAt
    updatedAt?: Date;

    @BelongsTo(() => University, {foreignKey: "university_id"})
    university: University 
}