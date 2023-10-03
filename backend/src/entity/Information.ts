import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Information extends BaseEntity {
  @PrimaryGeneratedColumn()
  infoID!: number;

  @Column({ length: 100 })
  candidateName!: string;

  @Column({ type: "text"})
  candidateImage!: string;

  @Column({ type: "text"})
  description!: string;
}
 