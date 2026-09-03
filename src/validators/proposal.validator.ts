import { z } from 'zod';

export const proposeValidator = z.object({
  txXdr: z.string().min(1),
  threshold: z.number().int().positive(),
});