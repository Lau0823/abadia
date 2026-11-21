import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Acepta tanto `{ status: 'confirmed' }` como un string JSON crudo `"confirmed"`,
 * y valida el valor contra el enum correspondiente antes de llegar al service.
 */
@Injectable()
export class StatusPipe implements PipeTransform {
  constructor(private readonly allowed: object) {}

  transform(value: unknown): string {
    const status =
      value !== null && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>).status
        : value;

    const allowedValues = Object.values(this.allowed);
    if (typeof status !== 'string' || !allowedValues.includes(status)) {
      const detail =
        typeof status === 'string' ? status : JSON.stringify(status);
      throw new BadRequestException(
        `Estado inválido${detail && detail !== '{}' ? `: ${detail}` : ''}. Valores permitidos: ${allowedValues.join(', ')}`,
      );
    }

    return status;
  }
}
