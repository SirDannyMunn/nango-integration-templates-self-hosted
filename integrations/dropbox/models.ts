import { z } from 'zod';

export const SuccessResponse = z.object({
    success: z.boolean()
});
export type SuccessResponse = z.infer<typeof SuccessResponse>;

export const IdEntity = z.object({
    id: z.string()
});
export type IdEntity = z.infer<typeof IdEntity>;

export const models = {
    SuccessResponse,
    IdEntity
};