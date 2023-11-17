import { Controller, Get, Post, Body, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags, ApiBody } from '@nestjs/swagger';
import { GetUser } from "src/auth/decorator";
import { User } from "@prisma/client"
import { JwtGuard } from "src/auth/guard";
import { TfaService } from './tfa.service';
import { ValidateDto } from "./dto";

@Controller('tfa')
@ApiTags('tfa')
export class TfaController {
  constructor(private TfaService: TfaService) { }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('qrcode')
  @ApiOperation({ description: 'Get QR code from user' })
  async getQRCode(@GetUser("id") UserId: string, @Res() res: any) {
    return this.TfaService.getQRCode(UserId, res)
  }


  @Post('validate')
  @ApiOperation({ description: 'Validar código de autenticación de dos factores' })
  @ApiBody({
    type: ValidateDto,
    description: 'Código de autenticación de dos factores y userid',
  })

  async validarCodigoTFA(@Body() body: ValidateDto, @Res() res: any) {
    return this.TfaService.validarCodigoTFA(body, res)
  }

}

