import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Taskset extends BaseEntity {
  @PrimaryGeneratedColumn()
  TaskID!: number;

  @Column({ type: "varchar", length: 255})
  Task!: string;

  @Column({ type: "int"})
  Reward!: string;

  @Column({ type: "date"})
  Date!: number;

  @Column({ type: "varchar", length: 255})
  Login!: string;

  @Column({ default: "pending" }) 
  status!: string;

  @Column({ type: "json", nullable: true }) 
  DeclinedUsers!: string[] | null;

  @Column({ type: "varchar", length: 255})
  AcceptedUser!: string;

  @Column({ default: false }) 
  Completed!: boolean;
}
