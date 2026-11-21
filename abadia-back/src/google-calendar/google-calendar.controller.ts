import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleCalendarService } from './google-calendar.service';
import type { Response } from 'express';

interface GoogleAuthRequest {
  user: {
    accessToken: string;
    refreshToken: string;
  };
}

@Controller('google-calendar')
export class GoogleCalendarController {
  constructor(private readonly googleCalendarService: GoogleCalendarService) {}

  @Get('auth')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirige a la pantalla de consentimiento de Google
  }

  @Get('auth/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: GoogleAuthRequest, @Res() res: Response) {
    // El usuario se autenticó. Guardamos los tokens en el servicio.
    const { user } = req;

    // Aquí podrías vincularlo con tu usuario "Admin" real en la BD.
    void this.googleCalendarService.saveTokens(
      user.accessToken,
      user.refreshToken,
    );

    // Redirigir de vuelta al panel frontend.
    res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin?google=success`,
    );
  }
}
