import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity('administrator')
export class AdministratorEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 150 })
    fullName: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 20, default: 'administrator' })
    role: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    imageURL: string;

    @Column()
    password: string;
}
