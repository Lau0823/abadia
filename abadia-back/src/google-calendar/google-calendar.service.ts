import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';

interface ReservationDetails {
  checkIn: string | number | Date;
  checkOut: string | number | Date;
  habitacion?: { titulo?: string };
  cliente?: {
    nombre?: string;
    telefono?: string;
    correo?: string;
  };
  value?: string | number;
}

@Injectable()
export class GoogleCalendarService {
  private oauth2Client: InstanceType<typeof google.auth.OAuth2>;
  private readonly logger = new Logger(GoogleCalendarService.name);

  constructor(
    private configService: ConfigService,
    private settingsService: SettingsService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_REDIRECT_URI') ||
        'http://localhost:3002/google-calendar/auth/callback',
    );
  }

  async loadTokensFromDb() {
    try {
      const accessTokenSetting = await this.settingsService.findPrivateOne(
        'google_access_token',
      );
      const refreshTokenSetting = await this.settingsService.findPrivateOne(
        'google_refresh_token',
      );

      if (accessTokenSetting && accessTokenSetting.value) {
        this.oauth2Client.setCredentials({
          access_token: accessTokenSetting.value,
          refresh_token: refreshTokenSetting?.value || null,
        });
        return true;
      }
    } catch {
      // Configuraciones pueden no existir aún
    }
    return false;
  }

  async saveTokens(accessToken: string, refreshToken: string) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    await this.settingsService.upsertPrivate(
      'google_access_token',
      accessToken,
      'Google Calendar Access Token',
    );
    if (refreshToken) {
      await this.settingsService.upsertPrivate(
        'google_refresh_token',
        refreshToken,
        'Google Calendar Refresh Token',
      );
    }
  }

  async createEvent(reservationDetails: ReservationDetails) {
    const hasTokens = await this.loadTokensFromDb();
    if (!hasTokens) {
      this.logger.warn(
        'Google Calendar no está vinculado (no hay tokens en la BD).',
      );
      return null;
    }

    const calendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client,
    });

    const startDate = new Date(reservationDetails.checkIn);
    const endDate = new Date(reservationDetails.checkOut);

    const event = {
      summary: `Reserva Abadia: ${reservationDetails.habitacion?.titulo || 'Habitación'} - ${reservationDetails.cliente?.nombre || 'Cliente'}`,
      description: `Cliente: ${reservationDetails.cliente?.nombre}\nTeléfono: ${reservationDetails.cliente?.telefono}\nCorreo: ${reservationDetails.cliente?.correo}\nValor: $${reservationDetails.value}`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Bogota',
      },
      colorId: '2',
    };

    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
      return response.data;
    } catch (error) {
      this.logger.error(
        'Error creando evento en Google Calendar',
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async deleteEvent(eventId: string) {
    const hasTokens = await this.loadTokensFromDb();
    if (!hasTokens) {
      this.logger.warn(
        'Google Calendar no está vinculado (no hay tokens en la BD).',
      );
      return false;
    }

    const calendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client,
    });

    try {
      await calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });
      return true;
    } catch (error) {
      this.logger.warn(
        `No se pudo eliminar el evento ${eventId} en Google Calendar: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }
}
