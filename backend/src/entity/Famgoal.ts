import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { StringLocale } from "yup/lib/locale";

@Entity()
export class Famgoal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name!: string;

  @Column({ type: "text", nullable: true })
  reason!: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  amount!: number;

  @Column({ unique: true})
  Login!: string;

  @Column()
  collected!: number;
}
