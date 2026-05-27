'use server';

import { z } from 'zod';
import { db } from '@/libs/DB';
import { notificationsSchema } from '@/models/Schema';
import { createAuditLog } from '../audit/audit-log';
import { getRecruitmentContext } from '../server-context';

const createNotificationRecordSchema = z.object({
  channel: z.string().trim().min(1),
  eventType: z.string().trim().min(1),
  failedAt: z.coerce.date().optional(),
  failureReason: z.string().trim().optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
  recipientId: z.string().trim().min(1),
  recipientType: z.string().trim().min(1),
  sentAt: z.coerce.date().optional(),
  status: z.string().trim().min(1),
});

export const createNotificationRecord = async (input: unknown) => {
  const { organizationId, userId } = await getRecruitmentContext();
  const payload = createNotificationRecordSchema.parse(input);

  const [notification] = await db
    .insert(notificationsSchema)
    .values({
      ...payload,
      organizationId,
    })
    .returning();

  if (!notification) {
    throw new Error('Failed to create notification record.');
  }

  await createAuditLog({
    action: 'notification.created',
    actorId: userId,
    entityId: notification.id,
    entityType: 'notification',
    metadata: { channel: notification.channel, eventType: notification.eventType },
    organizationId,
  });

  return notification;
};
