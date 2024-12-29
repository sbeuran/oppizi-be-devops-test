import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './Category';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING
  })
  status: TaskStatus;

  @ManyToOne(() => Category, category => category.tasks, { nullable: true })
  category?: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 