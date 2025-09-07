
import { Entity, Column, PrimaryColumn, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity("admin")
export class AdminEntity {
    @PrimaryColumn({type: 'uuid'})
    id: string;

    @Column({ type: 'varchar', length: 20, default: 'admin' })
    role: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 150 })
    fullName: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 20 })
    gender: string;

    @Column({ type: 'varchar', length: 20 })
    phone: string;

    @Column({ type: 'boolean', default: false })
    isActive: boolean;

    @Column()
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    imageURL: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    address: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    city: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    country: string;

    @Column({ type: 'date', nullable: true })
    dateOfBirth: Date;


    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }
}