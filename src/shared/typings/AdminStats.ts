/** Response of GET admin/stats. */
export type AdminStats = {
  users: Record<string, number>;
  credentials: {
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  };
  revocationsLast30Days: number;
  generatedAt: string;
};
