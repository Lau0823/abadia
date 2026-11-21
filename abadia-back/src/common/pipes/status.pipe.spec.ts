import { BadRequestException } from '@nestjs/common';
import { StatusPipe } from './status.pipe';
import { ReservationStatus } from '../../reservations/entities/reservation.entity';

describe('StatusPipe', () => {
  const pipe = new StatusPipe(ReservationStatus);

  it.each(Object.values(ReservationStatus))(
    'acepta %s dentro de un objeto',
    (status) => {
      expect(pipe.transform({ status })).toBe(status);
    },
  );

  it.each(Object.values(ReservationStatus))(
    'acepta %s como string crudo',
    (status) => {
      expect(pipe.transform(status)).toBe(status);
    },
  );

  it.each([{}, { status: null }, { status: 'bogus' }, 5, null, undefined])(
    'rechaza el valor inválido %j',
    (value) => {
      expect(() => pipe.transform(value)).toThrow(BadRequestException);
    },
  );
});
