import { db } from '@/libs/DB';
import { auditLogsSchema } from '@/models/Schema';

export const createAuditLog = async (input: {
  action: string;
  actorId: string;
  entityId: string;
  entityType: string;
  metadata?: Record<string, unknown>;
  organizationId: string;
}) => {
  await db.insert(auditLogsSchema).values({
    action: input.action,
    actorId: input.actorId,
    entityId: input.entityId,
    entityType: input.entityType,
    metadata: input.metadata ?? {},
    organizationId: input.organizationId,
  });
};
