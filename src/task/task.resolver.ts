import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateTaskInput } from 'src/task/dto/createTask.input';
import { Task as TaskModel } from 'src/task/models/task.model';
import { TaskService } from 'src/task/task.service';
import { Task } from '@prisma/client';
import { UpdateTaskInput } from 'src/task/dto/updateTask.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver()
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query(() => [TaskModel], { nullable: 'items' })
  @UseGuards(JwtAuthGuard)
  async getTasks(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<Task[]> {
    return await this.taskService.getTasks(userId);
  }

  @Mutation(() => TaskModel)
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<Task> {
    return await this.taskService.createTask(createTaskInput);
  }

  @Mutation(() => TaskModel)
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Args('updateTaskInput') updateTaskinput: UpdateTaskInput,
  ): Promise<Task> {
    return await this.taskService.updateTask(updateTaskinput);
  }

  @Mutation(() => TaskModel)
  @UseGuards(JwtAuthGuard)
  async deleteTask(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    return await this.taskService.deleteTask(id);
  }
}
