import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  async find() {
    return this.repo.find();
  }

  async findOne(id: number) {
    if (!id) return null;
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("User with given id don't exist");
    }
    return user;
  }

  findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("User with given id don't exist");
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new Error('User not found.');
    }
    return this.repo.remove(user);
  }

  async makeAdmin(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new Error('User not found.');
    }
    console.log('user who will be admin', user);

    user.admin = true;
    await this.repo.save(user);
    console.log('user after becoming admin', user);

    return `User with id: ${id} has given an admin role.`;
  }
}
