import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class StudentsSubject extends BaseEntity {
  @PrimaryGeneratedColumn()
  SSid!: number;

  @Column({ length: 12 })
  citizenshipNumber!: string;

  @Column({ length: 50})
  SubjectName!:  string;

  @Column({ length: 50})
  TeacherName!:  string;
}
