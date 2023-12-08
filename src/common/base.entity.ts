
import { PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from "typeorm"

export abstract class BaseEntity{ 

    @PrimaryGeneratedColumn('uuid')
    public id : string

    @UpdateDateColumn()
    public updatedAt : Date

    @CreateDateColumn()
    public createdAt : Date

}
