import { Repository, MoreThan } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as jwt from 'jsonwebtoken';
import UserResponse from './dto/user-response.dto';
import { UserEntity } from './user.entity';
import Bcrypt from 'src/common/lib/bcrypt';
import CreateUserRequest from './dto/create-user-request.dto';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
  ) {}

  public getUserById(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  public getUserByName(name: string) {
    return this.userRepository.findOne({ where: { name } });
  }

  public createAccessToken(userEntity: UserEntity) {
    const userResponseDTO = new UserResponse(userEntity);

    const accessToken = jwt.sign(
      { data: userResponseDTO, timestamp: Date.now() },
      process.env.JWT_SECRET,
      {
        expiresIn: Number(process.env.JWT_EXPIRATION),
      },
    );

    return accessToken;
  }

  public async checkPassword(user: UserEntity, password: string) {
    const isPasswordCorrect = await Bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      return true;
    }

    return false;
  }

  public async createUser({ name, password }: CreateUserRequest): Promise<UserEntity> {
    const duplicateUser = await this.userRepository.findOne({
      where: {
        name,
      },
    });

    if (duplicateUser) {
      throw new ConflictException(`${name}은 이미 존재하는 회원입니다`);
    }

    const salt = await Bcrypt.createSalt();
    const hashedPassword = await Bcrypt.hash(password, salt);
    const updatedRequest = {
      name,
      salt,
      password: hashedPassword,
      type: 'user',
    };

    const User = this.userRepository.create(updatedRequest);
    await this.userRepository.save(User);
    return User;
  }
}
