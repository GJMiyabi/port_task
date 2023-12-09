import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const userServiceMock = {
      getUser: jest.fn(),
    };

    const jwtServiceMock = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('サインインに成功したらユーザー情報を返す', async () => {
    const userEmail = 'test@example.com';
    const userPassword = 'password123';
    const user = {
      id: 25,
      name: 'Test User',
      email: userEmail,
      password: await bcrypt.hash(userPassword, 10),
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    jest.spyOn(userService, 'getUser').mockResolvedValue(user);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    expect(await authService.validateUser(userEmail, userPassword)).toEqual(
      user,
    );
  });

  it('サインインに失敗したらnullを返す', async () => {
    jest.spyOn(userService, 'getUser').mockResolvedValue(null);

    expect(
      await authService.validateUser('invalid@example.com', 'password123'),
    ).toBeNull();
  });

  it('サインインしてJson Payloadを作成', async () => {
    const userEmail = 'test@example.com';
    const userPassword = 'password123';
    const user = {
      id: 25,
      name: 'Test User',
      email: userEmail,
      password: await bcrypt.hash(userPassword, 10),
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };
    const expectedToken = 'some.jwt.token';

    jest.spyOn(jwtService, 'sign').mockReturnValue(expectedToken);

    const result = await authService.signIn(user);

    expect(result).toEqual({ accessToken: expectedToken, user });
  });
});
