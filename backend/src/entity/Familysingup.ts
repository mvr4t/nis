import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Familysignup extends BaseEntity {
  @PrimaryGeneratedColumn()
  Fam_ID!: number;

  @Column({ unique: true})
  Login!: string;

  @Column({ length: 100 })
  FirstName!: string;

  @Column({ length: 50})
  LastName!:  string;

  @Column({ length: 180 })
  email!: string;

  @Column({ unique: true })
  citizenshipNumber!: string;

  @Column()
  password!: string;

  @Column({length: 50})
  Role!: string;

  @Column({ default: false })
  firstuser!: boolean;

}
