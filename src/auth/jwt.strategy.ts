import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TypedConfigService } from 'src/config/typed-config.service'; // Il tuo servizio di configurazione
import { UserService } from 'src/user/user.service'; // Servizio utenti

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UserService,
    private configService: TypedConfigService,
  ) {
    // Recupera la chiave segreta dalla configurazione
    const jwtSecret = configService.get('APP.jwt');

    // Passa la configurazione direttamente a PassportStrategy
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { userId: number }) {
    // Recupera l'utente dal payload del JWT
    const user = await this.usersService.getUser(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user; // Restituisce l'utente se valido
  }
}
