import {
  Controller,
  Get,
  Logger,
  Next,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { hashPassword } from '../../../utils/common';
import { Public } from '../../auth/decorators/auth.decorator';

@Controller('user')
export class UserController {
  logger: Logger;

  constructor(private readonly userService: UserService) {
    this.logger = new Logger();
  }

  @Get()
  async show(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const usersData = await this.userService.findAll();

      if (!(usersData.length > 0)) {
        return res.status(404).send({
          statusCode: 404,
          message: 'Não foi encontrado nenhum registro de usuário!',
        });
      }

      return res.status(200).send(usersData);
    } catch (error) {
      this.logger.error({ message: error });
      return res.status(500).send({
        statusCode: 500,
        message: "Erro interno no servidor",
      });
    }
  }

  @Public()
  @Post()
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const { username, email, password, university_id } = req.body;

      if (!username || !email || !password) {
        return res.status(400).send({
          statusCode: 400,
          message: 'Corpo da requisição incompleto!',
        });
      }

      const userEmailExists = await this.userService.findOneByEmail(email);

      if (userEmailExists) {
        return res.status(400).send({
          statusCode: 400,
          message: 'Este email já se encontra cadastrado!',
        });
      }

      const userUsernameExists = await this.userService.findOneByUsername(username);

      if (userUsernameExists) {
        return res.status(400).send({
          statusCode: 400,
          message: 'Este nome de usuário já se encontra cadastrado!',
        });
      }

      const hashedPassword = await hashPassword(password);

      const userData = await this.userService.create({
        username: username,
        email: email,
        password: hashedPassword,
        university_id: university_id
      });

      return res.status(200).send(userData);
    } catch (error) {
      this.logger.error({ message: error });
      return res.status(500).send({
        statusCode: 500,
        message: "Erro interno no servidor",
      });
    }
  }

  @Put(':id/update')
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Next() nest: NextFunction,
  ) {
    try {
      const userId = req.params.id;

      const userExists = await this.userService.findOneById(userId);

      if (!userExists) {
        return res.status(400).send({
          statusCode: 400,
          message: 'Nenhum usuário com esse id foi encontrado!',
        });
      }

      await this.userService.update(userId, req.body);

      return res.status(200).send({
        statusCode: 200,
        message: 'Usuário atualizado com sucesso!',
      });
    } catch (error) {
      this.logger.error({ message: error });
      return res.status(500).send({
        statusCode: 500,
        message: "Erro interno no servidor",
      });
    }
  }
}
