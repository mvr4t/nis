import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class StudentsFeedback extends BaseEntity {
  @PrimaryGeneratedColumn()
  fbID!: number;

  @Column({ length: 12 })
  citizenshipNumber!: string;

  @Column({ type: "text"})
  content!:  string;

  @Column({ length: 11})
  Date!: string;

  @Column({length:50})
  Lesson!: string;

  @Column({length: 50})
  Address!: string;

}
