import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TwoFA } from '../auth/auth.2fa'
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { ValidateDto } from "./dto";

@Injectable()
export class TfaService {
  constructor(private prisma: PrismaService) { }

  async getQRCode(UserId: string, res: any) {
    try {
      const secret = TwoFA.generateSecret();

      const user = await this.prisma.user.update({
        where: {
          userId: UserId,
        },
        data: {
          twofa_code: secret,
          twofa: true,
        },
      });

      const otpauthUrl = speakeasy.otpauthURL({
        secret: secret,
        encoding: "base64",
        label: user.username,
        issuer: 'ft_transcendence',
      });

      const dataURL = await QRCode.toDataURL(otpauthUrl, { errorCorrectionLevel: 'H', encoding: 'base64' });

      const qrData = dataURL

      return res.status(200).json(qrData);
    } catch (error) {
      return res.status(500).json({ error: 'Error generating QR code' });
    }
  }

  async validarCodigoTFA(body: ValidateDto, res: any) {
    try {
      const secret: { twofa_code: string } = await this.prisma.user.findUnique({
        where: {
          userId: body.userid,
        },
        select: {
          twofa_code: true,
        }
      })

      const isValid = speakeasy.totp.verify({
        secret: secret.twofa_code,
        encoding: 'base64',
        token: body.token,
      });

      if (isValid) {
        return res.status(HttpStatus.OK).json({ response: 'Código de autenticación válido' });
      } else {
        return  res.status(HttpStatus.UNAUTHORIZED).json({ response: 'Unauthorized'});
      }
    } catch (error) {
      throw new UnauthorizedException({ response: 'Unauthorized'});
    }
  }

  async   validTFACode(body: ValidateDto, res: any): Promise<Boolean> {
    try {
      const secret: { twofa_code: string } = await this.prisma.user.findUnique({
        where: {
          userId: body.userid,
        },
        select: {
          twofa_code: true,
        }
      })
      const isValid = speakeasy.totp.verify({
        secret: secret.twofa_code,
        encoding: 'base64',
        token: body.token,
      });
      if (!isValid) {
        res.status(HttpStatus.UNAUTHORIZED).json({ response: 'Unauthorized'});
      }
      return isValid;
    } catch (error) {
      throw new UnauthorizedException({ response: 'Unauthorized'});
    }
  }
}
