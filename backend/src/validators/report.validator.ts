import { z } from "zod";
import { ReportFrequencyEnum } from "../types";

export const reportSettingSchema = z.object({
  isEnabled: z.boolean().default(true),
  frequency: z.nativeEnum(ReportFrequencyEnum).default(ReportFrequencyEnum.WEEKLY),
});

export const updateReportSettingSchema = reportSettingSchema.partial();

export type UpdateReportSettingType = z.infer<typeof updateReportSettingSchema>;
