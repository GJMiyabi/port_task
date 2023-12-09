import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';

describe('TaskService', () => {
  let service: TaskService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const prismaServiceMock = {
      task: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should get tasks', async () => {
    const userId = 1;
    const mockTasks = [
      {
        id: 1,
        name: 'Task 1',
        dueDate: new Date().toISOString(), // ISO形式の日付文字列
        status: Status.NOT_STARTED,
        description: 'Task description',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
      },
    ];
    jest.spyOn(prismaService.task, 'findMany').mockResolvedValue(mockTasks);

    expect(await service.getTasks(userId)).toEqual(mockTasks);
  });

  it('should create a task', async () => {
    const createTaskInput = {
      name: 'Task',
      dueDate: '2021/12/01',
      description: 'Description',
      userId: 1,
    };
    const mockTask = {
      id: 1,
      ...createTaskInput,
      status: Status.NOT_STARTED,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    jest.spyOn(prismaService.task, 'create').mockResolvedValue(mockTask);
    expect(await service.createTask(createTaskInput)).toEqual(mockTask);
  });

  it('should update a task', async () => {
    const updateTaskInput = {
      id: 1,
      name: 'Updated Task',
      dueDate: '2021/12/01',
      description: 'Updated description',
      status: Status.IN_PROGRESS,
    };

    const updatedTask = {
      ...updateTaskInput,
      id: 1,
      userId: 1,
      status: Status.IN_PROGRESS,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    jest.spyOn(prismaService.task, 'update').mockResolvedValue(updatedTask);
    expect(await service.updateTask(updateTaskInput)).toEqual(updatedTask);
  });

  it('should delete a task', async () => {
    const taskId = 1;
    const deletedTask = {
      id: taskId,
      name: 'Task to delete',
      dueDate: new Date().toISOString(),
      status: Status.COMPLETED,
      description: 'Task description',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prismaService.task, 'delete').mockResolvedValue(deletedTask);
    expect(await service.deleteTask(taskId)).toEqual(deletedTask);
  });
});
