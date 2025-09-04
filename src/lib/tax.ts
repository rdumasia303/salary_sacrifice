import raw from './taxData.json';

export type TaxBands = Array<{ min: number; max: number | null; rate: number }>;
export type Region = 'englandWalesNI' | 'scotland';

export type TaxData = {
  personalAllowance: number;
  incomeTax: Record<Region, TaxBands>;
  nic: {
    employeePT: number;
    employeeUEL: number;
    employerST: number;
    employeeRate1: number;
    employeeRate2: number;
    employerRate: number;
  };
  nmw: { adult: number; young: number; apprentice: number };
  childBenefit: { eldest: number; additional: number; period: 'weekly' | 'monthly' };
  universalCredit: {
    workAllowanceWithHousing: number;
    workAllowanceNoHousing: number;
    taper: number;
    childElement: number;
    standardAllowance: { single: number; couple: number };
    period: 'monthly';
  };
  pension: {
    annualAllowance: number;
    mpaa: number;
    thresholdIncome: number;
    adjustedIncome: number;
    minAA: number;
  };
  hicbc: { threshold: number; ceiling: number };
  studentLoan?: {
    plans: {
      plan1: { annualThreshold: number; monthly: number; weekly: number; rate: number };
      plan2: { annualThreshold: number; monthly: number; weekly: number; rate: number };
      plan4: { annualThreshold: number; monthly: number; weekly: number; rate: number };
      pgl: { annualThreshold: number; monthly: number; weekly: number; rate: number };
    };
  };
  childcare?: {
    workingParent: {
      fundedHoursPerYear: number;
      minEarnings3m: { adult: number; young: number; apprentice: number };
      incomeCapPerAdult: number;
    };
    universal15h?: { fundedHoursPerYear: number };
    nations: {
      england?: { workingParent30h?: { fundedHoursPerYear: number }; universal3to4?: { fundedHoursPerYear: number } };
      scotland?: { universal3to4?: { fundedHoursPerYear: number } };
      wales?: { workingParent30h?: { fundedHoursPerYear: number }; universal3to4?: { fundedHoursPerYear: number } };
      northernIreland?: { preSchool?: { fundedHoursPerYear: number } };
    };
    tfc?: { topupRate: number; monthlyCapPerChild: number };
    ucChildcare?: { reimbursementRate: number; monthlyCapOneChild: number; monthlyCapTwoPlus: number };
  };
  meta: { taxYear: string; notes?: string };
};

export const TAX_DATA = raw as TaxData;

export async function fetchTaxData(): Promise<TaxData> {
  const res = await fetch('/src/lib/taxData.json');
  if (!res.ok) throw new Error('Failed to load tax rules');
  return (await res.json()) as TaxData;
}
