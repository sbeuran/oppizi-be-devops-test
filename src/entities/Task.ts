import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne,
  JoinColumn 
} from "typeorm";
import { Category } from "./Category";

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'timestamp' })
  dueDate: Date;

  @Column({
    type: "enum",
    enum: ["low", "medium", "high"],
    default: "medium"
  })
  priority: TaskPriority;

  @Column({
    type: "enum",
    enum: ["todo", "in_progress", "done"],
    default: "todo"
  })
  status: TaskStatus;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, category => category.tasks, { 
    nullable: true,
    onDelete: 'SET NULL' 
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 