import { db } from '@/libs/DB';
import { notificationsSchema } from '@/models/Schema';

export const createNotificationRecordForOrg = async (input: {
  channel: string;
  eventType: string;
  organizationId: string;
  payload?: Record<string, unknown>;
  recipientId: string;
  recipientType: string;
  status: string;
}) => {
  const [notification] = await db
    .insert(notificationsSchema)
    .values({
      channel: input.channel,
      eventType: input.eventType,
      organizationId: input.organizationId,
      payload: input.payload ?? {},
      recipientId: input.recipientId,
      recipientType: input.recipientType,
      status: input.status,
    })
    .returning();

  return notification;
};
