interface PriorityInput {
  caseAgeInDays: number;
  crimeSeverity: number; // 1-5
  isUndertrial: boolean;
  isVictimVulnerable: boolean;
}

export function calculatePriority(input: PriorityInput): number {
  const ageScore = Math.min(input.caseAgeInDays / 365 * 30, 30); // Max 30 points
  const severityScore = input.crimeSeverity * 8; // Max 40 points
  const undertrialBonus = input.isUndertrial ? 20 : 0;
  const vulnerableBonus = input.isVictimVulnerable ? 10 : 0;
  
  const total = ageScore + severityScore + undertrialBonus + vulnerableBonus;
  return Math.round(Math.min(total, 100)); // Cap at 100
}