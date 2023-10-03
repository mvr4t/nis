import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class StudentsCurator extends BaseEntity {
  @PrimaryGeneratedColumn()
  SCid!: number;

  @Column({ length: 12 })
  citizenshipNumber!: string;

  @Column({ length: 50})
  CuratorName!:  string;

  @Column({ length: 3})
  Grade!: string;
}
