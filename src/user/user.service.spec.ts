import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const prismaServiceMock = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        UserService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  it('ユーザー作成', async () => {
    const createUserInput = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'strongpassword',
    };
    const expectedUser = {
      id: 25,
      name: 'Test User',
      email: 'test@example.com',
      password: 'strongpassword',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    jest
      .spyOn(userService, 'createUser')
      .mockImplementation(async () => expectedUser);

    expect(await resolver.createuser(createUserInput)).toBe(expectedUser);
  });

  it('作成したユーザー参照', async () => {
    const getUserArgs = { email: 'test@example.com' };
    const expectedUser = {
      id: 25,
      name: 'Test User',
      email: 'test@example.com',
      password: 'strongpassword',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    jest
      .spyOn(userService, 'getUser')
      .mockImplementation(async () => expectedUser);

    expect(await resolver.getUser(getUserArgs)).toBe(expectedUser);
  });
});
