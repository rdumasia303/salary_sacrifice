import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Trophy,
  Target,
  Sparkles,
  Bike,
  HelpCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ConfettiCelebrator from './ConfettiCelebrator';
import { TAX_DATA } from '../lib/tax';
import clsx from 'clsx';
import { formatCurrency, formatChange, copyToClipboard } from './calculator/utils';
import BasicDetails from './calculator/sections/BasicDetails';
import PensionSalarySacrifice from './calculator/sections/PensionSalarySacrifice';
import EmployerContribution from './calculator/sections/EmployerContribution';
import ElectricVehicle from './calculator/sections/ElectricVehicle';
import CycleToWork from './calculator/sections/CycleToWork';
import StudentLoans from './calculator/sections/StudentLoans';
import ChildrenChildcare from './calculator/sections/ChildrenChildcare';
import AdditionalDetails from './calculator/sections/AdditionalDetails';
import UniversalCredit from './calculator/sections/UniversalCredit';

// New: extracted charts and panels
import BeforeAfterChart from './calculator/charts/BeforeAfterChart';
import PensionPieChart from './calculator/charts/PensionPieChart';
import TotalNetValuePanel from './calculator/panels/TotalNetValuePanel';
import DetailedBreakdownPanel from './calculator/panels/DetailedBreakdownPanel';
import PensionSummaryPanel from './calculator/panels/PensionSummaryPanel';
import EMTRPanel from './calculator/panels/EMTRPanel';
import CelebrationsPanel from './calculator/panels/CelebrationsPanel';
import NudgesPanel from './calculator/panels/NudgesPanel';
import TalesPanel from './calculator/panels/TalesPanel';
import UniversalCreditPanel from './calculator/panels/UniversalCreditPanel';

type Region = 'englandWalesNI' | 'scotland';

type Celebration = { type: 'success'; message: string; icon: React.ReactNode };

type Warning = { type: 'error' | 'warning' | 'info'; message: string };

export default function UKPensionCalculator() {
  // Basic inputs
  const [region, setRegion] = useState<Region>('englandWalesNI');
  const [annualSalary, setAnnualSalary] = useState<string>('50000');
  const [payFrequency, setPayFrequency] = useState<'weekly' | 'monthly' | 'annual'>('monthly');
  const [contractualHours, setContractualHours] = useState<string>('37.5');
  const [ageGroup, setAgeGroup] = useState<'adult' | 'young' | 'apprentice'>('adult');

  // Sacrifice inputs
  const [sacrificeType, setSacrificeType] = useState<'percent' | 'target'>('percent');
  const [sacrificeAmount, setSacrificeAmount] = useState<string>('3000');
  const [sacrificePercent, setSacrificePercent] = useState<string>('6');
  const [targetAmount, setTargetAmount] = useState<string>('6000');
  const [applyToBonus, setApplyToBonus] = useState(false);
  const [bonusAmount, setBonusAmount] = useState<string>('');

  // Employer inputs
  const [employerNIPassthrough, setEmployerNIPassthrough] = useState<number>(100);
  const [employerContribType, setEmployerContribType] = useState<'percent' | 'fixed'>('percent');
  const [employerContribPercent, setEmployerContribPercent] = useState<string>('3');
  const [employerContribFixed, setEmployerContribFixed] = useState<string>('1500');

  // Additional inputs
  const [benefitsInKind, setBenefitsInKind] = useState<string>('');
  // New: additional PAYE income that cannot be salary sacrificed (e.g., RSUs)
  const [additionalPAYEIncome, setAdditionalPAYEIncome] = useState<string>('');
  const [numberOfChildren, setNumberOfChildren] = useState<number>(0);
  const [childrenAtRiskCount, setChildrenAtRiskCount] = useState<number>(0); // children eligible for 30h free childcare that could be lost if ANI > £100k
  const [avgHourlyRate, setAvgHourlyRate] = useState<string>('8.50');
  // Keep legacy childcare fields (not shown in UI) to avoid breaking calculations elsewhere
  const [childcareMode, setChildcareMode] = useState<'none' | 'tfc' | 'uc'>('none');
  const [monthlyChildcareSpend, setMonthlyChildcareSpend] = useState<string>('0');
  const [childrenUsingPaidHours, setChildrenUsingPaidHours] = useState<number>(0);
  const [customChildBenefit, setCustomChildBenefit] = useState<string>('');

  // Universal Credit & household
  const [universalCreditEnabled, setUniversalCreditEnabled] = useState(false);
  const [hasPartner, setHasPartner] = useState(false);
  const [partnerNetSalary, setPartnerNetSalary] = useState<string>('');
  const [wantsHousingElement, setWantsHousingElement] = useState(true);
  const [housingAllowance, setHousingAllowance] = useState<string>('');
  const [householdCapital, setHouseholdCapital] = useState<string>('');

  // Other pensions & limits
  const [otherPensions, setOtherPensions] = useState<string>('');
  const [giftAid, setGiftAid] = useState<string>('');
  const [mpaaTriggered, setMpaaTriggered] = useState(false);
  const [carryForwardAllowance, setCarryForwardAllowance] = useState<string>('');

  // EV & Cycle schemes
  const [evEnabled, setEvEnabled] = useState(false);
  const [evMonthlyCost, setEvMonthlyCost] = useState<string>('0');
  const [evNIPassthrough, setEvNIPassthrough] = useState<number>(50);
  const [cycleEnabled, setCycleEnabled] = useState(false);
  const [cycleAnnualCost, setCycleAnnualCost] = useState<string>('0');
  const [cycleNIPassthrough, setCycleNIPassthrough] = useState<number>(50);

  // Student Loans
  const [studentUGPlan, setStudentUGPlan] = useState<'none' | 'plan1' | 'plan2' | 'plan4'>('none');
  const [hasPGL, setHasPGL] = useState<boolean>(false);
  
  // Calculated values
  const [results, setResults] = useState<any>(null);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);

  const parseNumber = (value: string | number | null | undefined) => {
    if (value === '' || value === null || value === undefined) return 0;
    const parsed = typeof value === 'number' ? value : parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateTargetSacrifice = (targetTotal: number) => {
    const employerBase = employerContribType === 'percent'
      ? parseNumber(annualSalary) * parseNumber(employerContribPercent) / 100
      : parseNumber(employerContribFixed);
    const multiplier = 1 + (TAX_DATA.nic.employerRate * employerNIPassthrough / 100);
    return Math.max(0, (targetTotal - employerBase) / multiplier);
  };

  const calculateSacrificeAmount = () => {
    const totalSalary = parseNumber(annualSalary) + parseNumber(bonusAmount);
    if (sacrificeType === 'target') return calculateTargetSacrifice(parseNumber(targetAmount));
    return sacrificeType === 'percent'
      ? (totalSalary * parseNumber(sacrificePercent) / 100)
      : parseNumber(sacrificeAmount);
  };

  const calculatePersonalAllowance = (ani: number) => {
    if (ani <= 100000) return TAX_DATA.personalAllowance;
    const reduction = Math.min((ani - 100000) / 2, TAX_DATA.personalAllowance);
    return Math.max(0, TAX_DATA.personalAllowance - reduction);
  };

  const calculateTaperedAA = (thresholdIncome: number, adjustedIncome: number) => {
    if (thresholdIncome <= TAX_DATA.pension.thresholdIncome) return TAX_DATA.pension.annualAllowance;
    if (adjustedIncome <= TAX_DATA.pension.adjustedIncome) return TAX_DATA.pension.annualAllowance;
    const reduction = (adjustedIncome - TAX_DATA.pension.adjustedIncome) / 2;
    return Math.max(TAX_DATA.pension.minAA, TAX_DATA.pension.annualAllowance - reduction);
  };

  const getTaxBands = (region: Region) => TAX_DATA.incomeTax[region].map(b => ({ ...b, max: b.max ?? Number.POSITIVE_INFINITY }));

  const calculateIncomeTax = (taxableIncome: number, personalAllowance: number) => {
    const taxBands = region === 'scotland' ? getTaxBands('scotland') : getTaxBands('englandWalesNI');
    const incomeAfterPA = Math.max(0, taxableIncome - personalAllowance);
    let tax = 0;
    for (const band of taxBands) {
      const taxableInBand = Math.min(Math.max(0, incomeAfterPA - band.min), (band.max as number) - band.min);
      tax += taxableInBand * band.rate;
      if (incomeAfterPA <= (band.max as number)) break;
    }
    return tax;
  };

  const calculateEmployeeNIC = (earnings: number) => {
    if (earnings <= TAX_DATA.nic.employeePT) return 0;
    let nic = 0;
    if (earnings <= TAX_DATA.nic.employeeUEL) {
      nic = (earnings - TAX_DATA.nic.employeePT) * TAX_DATA.nic.employeeRate1;
    } else {
      nic = (TAX_DATA.nic.employeeUEL - TAX_DATA.nic.employeePT) * TAX_DATA.nic.employeeRate1;
      nic += (earnings - TAX_DATA.nic.employeeUEL) * TAX_DATA.nic.employeeRate2;
    }
    return nic;
  };

  // Helpers reintroduced
  const checkNMW = (postSacrificeEarningsAnnual: number, weeklyHours: number) => {
    const nmwRate = ageGroup === 'adult' ? TAX_DATA.nmw.adult : ageGroup === 'young' ? TAX_DATA.nmw.young : TAX_DATA.nmw.apprentice;
    const periodsPerYear = payFrequency === 'weekly' ? 52 : payFrequency === 'monthly' ? 12 : 1;
    const hoursPerPeriod = (weeklyHours * 52) / periodsPerYear;
    const earningsPerPeriod = postSacrificeEarningsAnnual / periodsPerYear;
    return earningsPerPeriod / hoursPerPeriod >= nmwRate;
  };

  const computeNetFromGrossWithPassthrough = (gross: number, passthroughPct: number) => {
    if (gross <= 0) return { net: 0, passthrough: 0 };
    const k = TAX_DATA.nic.employerRate * (passthroughPct / 100);
    const net = gross / (1 + k);
    const passthrough = gross - net;
    return { net, passthrough };
  };

  // Student loan repayments (annual) using per‑period rounding-down
  const calculateStudentLoanAnnual = (earningsAnnual: number) => {
    const periodsPerYear = payFrequency === 'weekly' ? 52 : payFrequency === 'monthly' ? 12 : 1;
    const perPeriod = earningsAnnual / periodsPerYear;
    let perPeriodRepay = 0;

    if (studentUGPlan !== 'none') {
      const plan = (TAX_DATA as any).studentLoan?.plans?.[studentUGPlan];
      if (plan) {
        const threshold = payFrequency === 'weekly' ? plan.weekly : payFrequency === 'monthly' ? plan.monthly : plan.annualThreshold;
        perPeriodRepay += Math.floor(Math.max(0, perPeriod - threshold) * plan.rate);
      }
    }
    if (hasPGL) {
      const pgl = (TAX_DATA as any).studentLoan?.plans?.pgl;
      if (pgl) {
        const threshold = payFrequency === 'weekly' ? pgl.weekly : payFrequency === 'monthly' ? pgl.monthly : pgl.annualThreshold;
        perPeriodRepay += Math.floor(Math.max(0, perPeriod - threshold) * pgl.rate);
      }
    }
    return perPeriodRepay * periodsPerYear;
  };

  const calculateChildBenefitAnnual = () => {
    if (customChildBenefit && !isNaN(parseFloat(customChildBenefit))) return parseFloat(customChildBenefit);
    if (numberOfChildren === 0) return 0;
    const weekly = TAX_DATA.childBenefit.eldest + Math.max(0, numberOfChildren - 1) * TAX_DATA.childBenefit.additional;
    return weekly * 52;
  };

  const calculateHICBC = (ani: number, childBenefitAnnual: number) => {
    if (childBenefitAnnual === 0 || ani <= TAX_DATA.hicbc.threshold) return 0;
    if (ani >= TAX_DATA.hicbc.ceiling) return childBenefitAnnual;
    const chargeRate = (ani - TAX_DATA.hicbc.threshold) / (TAX_DATA.hicbc.ceiling - TAX_DATA.hicbc.threshold);
    return childBenefitAnnual * chargeRate;
  };

  const estimateUniversalCredit = (netIncomeAnnual: number, childcareElementMonthly = 0) => {
    if (parseNumber(householdCapital) > 16000) return { award: 0, breakdown: null };
    
    const standardAllowance = hasPartner ? TAX_DATA.universalCredit.standardAllowance.couple : TAX_DATA.universalCredit.standardAllowance.single;
    const childElement = TAX_DATA.universalCredit.childElement;
    let maxAwardMonthly = standardAllowance;
    maxAwardMonthly += numberOfChildren * childElement;
    
    const housingElementMonthly = (wantsHousingElement && parseNumber(housingAllowance) > 0) ? parseNumber(housingAllowance) : 0;
    maxAwardMonthly += housingElementMonthly;
    // Add childcare element when using UC childcare
    maxAwardMonthly += childcareElementMonthly;

    const workAllowanceMonthly = wantsHousingElement ? TAX_DATA.universalCredit.workAllowanceWithHousing : TAX_DATA.universalCredit.workAllowanceNoHousing;

    const totalHouseholdIncomeMonthly = (netIncomeAnnual / 12) + parseNumber(partnerNetSalary);
    const countedEarnings = Math.max(0, totalHouseholdIncomeMonthly - workAllowanceMonthly);
    const reduction = countedEarnings * TAX_DATA.universalCredit.taper;
    const monthlyAward = Math.max(0, maxAwardMonthly - reduction);
    
    return {
      award: monthlyAward * 12,
      breakdown: {
        maxAward: maxAwardMonthly,
        standardAllowance,
        childElement,
        numberOfChildren,
        housingElement: housingElementMonthly,
        childcareElement: childcareElementMonthly,
        workAllowance: workAllowanceMonthly,
        householdNetIncome: totalHouseholdIncomeMonthly,
        countedEarnings,
        taperRate: TAX_DATA.universalCredit.taper,
        reduction,
        finalAward: monthlyAward
      }
    };
  };

  // Helper: childcare support (simplified to only free childcare at £100k cap)
  const computeChildcareSupport = (scenario: any) => {
    const fundedHoursAnnualPerChild = TAX_DATA.childcare?.workingParent?.fundedHoursPerYear ?? 1140; // 30h/wk term-time default
    const hourly = parseNumber(avgHourlyRate);
    const eligible = scenario.ani <= 100000; // user-side cap only, simplified
    const freeChildcareAnnual = eligible ? childrenAtRiskCount * fundedHoursAnnualPerChild * hourly : 0;
    return { freeChildcareAnnual };
  };

  const calculateResults = () => {
    const newWarnings: Warning[] = [];
    const newCelebrations: Celebration[] = [];
    const totalSalary = parseNumber(annualSalary) + parseNumber(bonusAmount);

    // Pension sacrifice
    const pensionSacrifice = calculateSacrificeAmount();

    // Gross up other pensions and gift aid (net payment * 1.25 = gross with basic rate relief)
    const otherPensionsGross = parseNumber(otherPensions) * 1.25;
    const giftAidGross = parseNumber(giftAid) * 1.25;

    // EV & Cycle gross amounts
    const evGross = evEnabled ? parseNumber(evMonthlyCost) * 12 : 0;
    const cycleGross = cycleEnabled ? parseNumber(cycleAnnualCost) : 0;

    // EV & Cycle net salary reduction after employer NI pass-through discount
    const { net: evNet, passthrough: evPassthrough } = computeNetFromGrossWithPassthrough(evGross, evNIPassthrough);
    const { net: cycleNet, passthrough: cyclePassthrough } = computeNetFromGrossWithPassthrough(cycleGross, cycleNIPassthrough);

    // Total salary reduction across schemes
    const totalSalaryReduction = pensionSacrifice + evNet + cycleNet;
    const postSacrificeEarnings = totalSalary - totalSalaryReduction;

    // NMW check (based only on employment pay subject to sacrifice)
    const nmwCompliant = checkNMW(postSacrificeEarnings, parseNumber(contractualHours));
    if (!nmwCompliant) newWarnings.push({ type: 'error', message: 'Salary sacrifice would breach National Minimum Wage requirements' });

    // Employer contributions for pension (base + NI passthrough)
    const employerBase = employerContribType === 'percent'
      ? parseNumber(annualSalary) * parseNumber(employerContribPercent) / 100
      : parseNumber(employerContribFixed);
    const employerNISavingPension = pensionSacrifice * TAX_DATA.nic.employerRate;
    const employerPassthroughPension = employerNISavingPension * employerNIPassthrough / 100;
    const totalEmployerContrib = employerBase + employerPassthroughPension;
    const totalPensionFunding = pensionSacrifice + totalEmployerContrib;

    // Scenarios
    const scenarios = ['before', 'after'].map((scenario) => {
      const isAfter = scenario === 'after';
      const employmentEarnings = isAfter ? postSacrificeEarnings : totalSalary;
      // Include additional non-sacrificeable PAYE income for tax/NI, not for NMW
      const earnings = employmentEarnings + parseNumber(additionalPAYEIncome);
      const totalIncome = earnings + parseNumber(benefitsInKind);
      // Adjusted Net Income is reduced by gross pension contributions and gift aid
      const ani = totalIncome - otherPensionsGross - giftAidGross;
      const personalAllowance = calculatePersonalAllowance(ani);
      const incomeTax = calculateIncomeTax(totalIncome, personalAllowance);
      const employeeNIC = calculateEmployeeNIC(earnings);

      // Student Loan based on NICable earnings (same base as NIC), per‑period rules
      const studentLoan = calculateStudentLoanAnnual(earnings);

      const takeHome = earnings - incomeTax - employeeNIC - studentLoan;

      const childBenefitAnnual = calculateChildBenefitAnnual();
      const hicbc = calculateHICBC(ani, childBenefitAnnual);
      const netChildBenefit = childBenefitAnnual - hicbc;

      const adjustedIncome = totalIncome + (isAfter ? totalEmployerContrib + pensionSacrifice : 0);
      const thresholdIncome = totalIncome;
      const taperedAA = calculateTaperedAA(thresholdIncome, adjustedIncome);

      // UC-specific net: exclude P11D and Additional PAYE from income for UC purposes
      const aniUC = employmentEarnings; // ignore BIK and additional PAYE
      const paUC = calculatePersonalAllowance(aniUC);
      const incomeTaxUC = calculateIncomeTax(aniUC, paUC);
      const employeeNICUC = calculateEmployeeNIC(employmentEarnings);
      const studentLoanUC = calculateStudentLoanAnnual(employmentEarnings);
      const ucTakeHome = employmentEarnings - incomeTaxUC - employeeNICUC - studentLoanUC;

      const finalTakeHome = takeHome + netChildBenefit;
      const finalTakeHomeForUC = ucTakeHome + netChildBenefit; // UC base ignores BIK and non-sac PAYE

      return {
        employmentEarnings,
        earnings,
        cashIncome: earnings - parseNumber(benefitsInKind),
        totalIncome,
        ani,
        personalAllowance,
        incomeTax,
        employeeNIC,
        studentLoan,
        takeHome,
        childBenefit: childBenefitAnnual,
        hicbc,
        netChildBenefit,
        totalTakeHome: finalTakeHome,
        totalTakeHomeForUC: finalTakeHomeForUC,
        taperedAA,
        adjustedIncome,
      };
    });

    // Childcare support per scenario (simplified)
    const childcareBefore = computeChildcareSupport(scenarios[0]);
    const childcareAfter = computeChildcareSupport(scenarios[1]);

    // Universal Credit (explicitly ignore P11D and non‑sac PAYE via totalTakeHomeForUC)
    let ucBefore = 0, ucAfter = 0;
    let ucBreakdownBefore = null, ucBreakdownAfter = null;
    if (universalCreditEnabled && parseNumber(householdCapital) <= 16000) {
      const ucResultBefore = estimateUniversalCredit(scenarios[0].totalTakeHomeForUC);
      const ucResultAfter = estimateUniversalCredit(scenarios[1].totalTakeHomeForUC);
      ucBefore = ucResultBefore.award;
      ucAfter = ucResultAfter.award;
      ucBreakdownBefore = ucResultBefore.breakdown;
      ucBreakdownAfter = ucResultAfter.breakdown;
    }

    // Pension AA (strictly exceed; include epsilon). Include carry-forward
    // Use grossed-up other pensions for allowance check
    const totalPensionContribs = totalPensionFunding + otherPensionsGross;
    const annualAllowance = mpaaTriggered ? TAX_DATA.pension.mpaa : scenarios[1].taperedAA;
    const carryForward = parseNumber(carryForwardAllowance);
    const allowanceWithCarry = annualAllowance + carryForward;
    if (totalPensionContribs > allowanceWithCarry + 0.01) {
      newWarnings.push({ type: 'warning', message: `Total pension contributions (£${totalPensionContribs.toLocaleString()}) exceed total available allowance including carry forward (£${allowanceWithCarry.toLocaleString()})` });
    }

    // Celebrations
    const beforeANI = scenarios[0].ani;
    const afterANI = scenarios[1].ani;
    if (beforeANI > 100000 && afterANI <= 100000) newCelebrations.push({ type: 'success', message: "Brilliant! You've kept your full Personal Allowance by staying under £100k!", icon: <Trophy className="text-yellow-400" size={20} /> });
    if (beforeANI > TAX_DATA.hicbc.threshold && afterANI <= TAX_DATA.hicbc.threshold && numberOfChildren > 0) newCelebrations.push({ type: 'success', message: 'Amazing! You\'ve avoided the High Income Child Benefit Charge completely!', icon: <Target className="text-green-400" size={20} /> });

    if (ucBefore === 0 && ucAfter > 0) newCelebrations.push({ type: 'success', message: 'Your salary sacrifice has made you eligible for Universal Credit!', icon: <Sparkles className="text-purple-400" size={20} /> });

    // New celebrations
    if ((childcareBefore.freeChildcareAnnual || 0) === 0 && (childcareAfter.freeChildcareAnnual || 0) > 0) {
      newCelebrations.push({ type: 'success', message: 'Nice! You’ve secured free childcare by keeping ANI ≤ £100k.', icon: <CheckCircle className="text-success" size={20} /> });
    }
    if (scenarios[0].studentLoan > 0 && scenarios[1].studentLoan === 0) {
      newCelebrations.push({ type: 'success', message: 'Sweet! No student loan repayments with this setup.', icon: <CheckCircle className="text-success" size={20} /> });
    }

    // Cliffs and context (benefits in kind awareness)
    if (afterANI > 95000 && afterANI < 105000) newWarnings.push({ type: 'info', message: 'Close to £100k Personal Allowance taper threshold' });
    if (afterANI > 55000 && afterANI < 65000 && numberOfChildren > 0) newWarnings.push({ type: 'info', message: 'Close to £60k High Income Child Benefit Charge threshold' });
    if (parseNumber(benefitsInKind) > 0) {
      if (scenarios[1].cashIncome <= TAX_DATA.hicbc.threshold && scenarios[1].ani > TAX_DATA.hicbc.threshold && numberOfChildren > 0) {
        newWarnings.push({ type: 'info', message: 'Your cash pay is below the HICBC threshold but P11D benefits push your adjusted net income over it. UC ignores P11D for income tests.' });
      }
      if (scenarios[1].cashIncome <= 100000 && scenarios[1].ani > 100000) {
        newWarnings.push({ type: 'info', message: 'Personal Allowance taper triggered due to P11D benefits increasing adjusted net income.' });
      }
    }

    // New: explicit warnings when losing free childcare or personal allowance
    const lostFreeChildcare = Math.max(0, (childcareBefore.freeChildcareAnnual || 0) - (childcareAfter.freeChildcareAnnual || 0));
    if (childrenAtRiskCount > 0 && lostFreeChildcare > 0) {
      newWarnings.push({ type: 'warning', message: `Crossing £100k loses free childcare worth ${formatCurrency(lostFreeChildcare)} per year` });
    }
    const personalAllowanceLoss = Math.max(0, TAX_DATA.personalAllowance - scenarios[1].personalAllowance);
    if (personalAllowanceLoss > 0 && scenarios[0].personalAllowance === TAX_DATA.personalAllowance) {
      newWarnings.push({ type: 'warning', message: `Personal Allowance reduction applies. You lose ${formatCurrency(personalAllowanceLoss)} of allowance`} );
    }

    // Effective marginal tax rates (include tax, NIC, HICBC, PA taper, UC). Use £100 delta to smooth bands.
    const baselineResources = scenarios[1].totalTakeHome + (universalCreditEnabled ? ucAfter : 0);
    const simulateResources = (deltaSalary: number, deltaNonSacPAYE: number) => {
      const salaryOverride = parseNumber(annualSalary) + deltaSalary;
      const additionalPAYEOverride = parseNumber(additionalPAYEIncome) + deltaNonSacPAYE;
      const totalSalarySim = salaryOverride + parseNumber(bonusAmount);

      let pensionSacrificeSim = 0;
      if (sacrificeType === 'target') {
        const employerBaseSim = employerContribType === 'percent'
          ? salaryOverride * parseNumber(employerContribPercent) / 100
          : parseNumber(employerContribFixed);
        const multiplier = 1 + (TAX_DATA.nic.employerRate * employerNIPassthrough / 100);
        pensionSacrificeSim = Math.max(0, (parseNumber(targetAmount) - employerBaseSim) / multiplier);
      } else if (sacrificeType === 'percent') {
        pensionSacrificeSim = totalSalarySim * parseNumber(sacrificePercent) / 100;
      } else {
        pensionSacrificeSim = parseNumber(sacrificeAmount);
      }

      const totalSalaryReductionSim = pensionSacrificeSim + evNet + cycleNet;
      const postSacEarningsSim = totalSalarySim - totalSalaryReductionSim;

      const earningsSim = postSacEarningsSim + additionalPAYEOverride;
      const totalIncomeSim = earningsSim + parseNumber(benefitsInKind);
      const personalAllowanceSim = calculatePersonalAllowance(totalIncomeSim);
      // Student Loan in simulation
      const studentLoanSim = calculateStudentLoanAnnual(earningsSim);
      // Compute tax and NIC in simulation (missing earlier)
      const incomeTaxSim = calculateIncomeTax(totalIncomeSim, personalAllowanceSim);
      const employeeNICSim = calculateEmployeeNIC(earningsSim);

      const childBenefitAnnual = calculateChildBenefitAnnual();
      const hicbcSim = calculateHICBC(totalIncomeSim, childBenefitAnnual);
      const netChildBenefitSim = childBenefitAnnual - hicbcSim;

      const takeHomeSim = earningsSim - incomeTaxSim - employeeNICSim - studentLoanSim;
      const finalTakeHomeSim = takeHomeSim + netChildBenefitSim;
      const ucSim = universalCreditEnabled ? estimateUniversalCredit(finalTakeHomeSim).award : 0;
      return finalTakeHomeSim + ucSim;
    };

    const delta = 100;
    const resourcesIfSalaryUp = simulateResources(delta, 0);
    const resourcesIfNonSacUp = simulateResources(0, delta);
    const mtrEmployment = 100 * (1 - (resourcesIfSalaryUp - baselineResources) / delta);
    const mtrNonSac = 100 * (1 - (resourcesIfNonSacUp - baselineResources) / delta);

    // Calculate additional relief claimable via self-assessment
    // For higher/additional rate taxpayers, they can claim back extra relief
    // This should be based on the marginal INCOME TAX rate, not the effective MTR
    const getMarginalIncomeTaxRate = (totalIncome: number, personalAllowance: number) => {
      const taxBands = region === 'scotland' ? getTaxBands('scotland') : getTaxBands('englandWalesNI');
      const incomeAfterPA = Math.max(0, totalIncome - personalAllowance);
      
      // Find which band we're in
      for (let i = taxBands.length - 1; i >= 0; i--) {
        const band = taxBands[i];
        if (incomeAfterPA > band.min) {
          return band.rate * 100; // Convert to percentage
        }
      }
      return 0; // Should never reach here
    };
    
    const marginalIncomeTaxRate = getMarginalIncomeTaxRate(scenarios[1].totalIncome, scenarios[1].personalAllowance);
    const additionalReliefRate = Math.max(0, marginalIncomeTaxRate - 20) / 100;
    const additionalReliefPensions = otherPensionsGross * additionalReliefRate;
    const additionalReliefGiftAid = giftAidGross * additionalReliefRate;
    const totalAdditionalRelief = additionalReliefPensions + additionalReliefGiftAid;

    // Net value panel figures
    const beforeCash = scenarios[0].totalTakeHome + (universalCreditEnabled ? ucBefore : 0);
    const afterCash = scenarios[1].totalTakeHome + (universalCreditEnabled ? ucAfter : 0);
    const beforeFreeChildcare = childcareBefore.freeChildcareAnnual || 0;
    const afterFreeChildcare = childcareAfter.freeChildcareAnnual || 0;

    // Pension value includes salary sacrifice + other pensions
    const pensionValueSalarySac = totalPensionFunding;
    const pensionValueOther = otherPensionsGross;
    const pensionValueTotal = pensionValueSalarySac + pensionValueOther;

    const totalBefore = beforeCash + beforeFreeChildcare;
    const totalAfter = afterCash + afterFreeChildcare + pensionValueTotal;

    // New: detailed Total Net Value categories
    const p11dValue = parseNumber(benefitsInKind);
    const totalNetBefore = (scenarios[0].takeHome) /* cash excl CB & UC */
      + 0 /* pension */
      + p11dValue
      + 0 /* ev */
      + 0 /* cycle */
      + scenarios[0].netChildBenefit
      + (ucBefore)
      + beforeFreeChildcare;

    // Pocket resources AFTER = take-home - net paid + additional relief claimable
    const pocketResourcesAfter = scenarios[1].takeHome
      - parseNumber(otherPensions) // net paid for other pensions
      - parseNumber(giftAid) // net donated for gift aid
      + totalAdditionalRelief; // additional relief claimable via SA

    const totalNetAfter = pocketResourcesAfter
      + pensionValueTotal // all pension values (salary sac + other pensions)
      + p11dValue
      + evGross
      + cycleGross
      + scenarios[1].netChildBenefit
      + (ucAfter)
      + afterFreeChildcare
      + parseNumber(giftAid); // charity receives this

    setResults({
      scenarios,
      sacrifice: {
        amount: pensionSacrifice,
        employerBase,
        employerNISaving: employerNISavingPension,
        employerPassthrough: employerPassthroughPension,
        totalEmployerContrib,
        totalPensionFunding,
      },
      otherPensions: {
        net: parseNumber(otherPensions),
        gross: otherPensionsGross,
        additionalRelief: additionalReliefPensions,
      },
      giftAid: {
        net: parseNumber(giftAid),
        gross: giftAidGross,
        additionalRelief: additionalReliefGiftAid,
      },
      schemes: {
        ev: { enabled: evEnabled, gross: evGross, net: evNet, employerPassthrough: evPassthrough },
        cycle: { enabled: cycleEnabled, gross: cycleGross, net: cycleNet, employerPassthrough: cyclePassthrough },
        totals: { gross: evGross + cycleGross, net: evNet + cycleNet, employerPassthrough: evPassthrough + cyclePassthrough }
      },
      changes: {
        takeHome: scenarios[1].totalTakeHome - scenarios[0].totalTakeHome,
        incomeTax: scenarios[1].incomeTax - scenarios[0].incomeTax,
        employeeNIC: scenarios[1].employeeNIC - scenarios[0].employeeNIC,
        hicbc: scenarios[1].hicbc - scenarios[0].hicbc,
        childBenefitSaved: scenarios[0].hicbc - scenarios[1].hicbc,
        ucDelta: ucAfter - ucBefore,
        studentLoan: scenarios[1].studentLoan - scenarios[0].studentLoan,
        freeChildcareDelta: afterFreeChildcare - beforeFreeChildcare,
      },
      pension: {
        totalContribs: totalPensionContribs,
        annualAllowance,
        annualAllowanceWithCarry: allowanceWithCarry,
        remaining: Math.max(0, allowanceWithCarry - totalPensionContribs),
      },
      childcare: {
        before: childcareBefore,
        after: childcareAfter,
      },
      universalCredit: { before: ucBefore, after: ucAfter, breakdownBefore: ucBreakdownBefore, breakdownAfter: ucBreakdownAfter },
      nmwCompliant,
      marginalRates: { employment: mtrEmployment, nonSacPAYE: mtrNonSac },
      // Back-compatible summary
      netValue: {
        before: { cash: beforeCash, freeChildcare: beforeFreeChildcare },
        after: { cash: afterCash, freeChildcare: afterFreeChildcare, pension: pensionValueTotal },
        totals: { before: totalBefore, after: totalAfter, delta: totalAfter - totalBefore },
        // New detailed view
        details: {
          before: {
            cash: scenarios[0].takeHome,
            pension: 0,
            otherPensionsNet: 0,
            otherPensionsGross: 0,
            giftAidNet: 0,
            giftAidGross: 0,
            additionalRelief: 0,
            p11d: p11dValue,
            ev: 0,
            cycle: 0,
            childBenefit: scenarios[0].netChildBenefit,
            freeChildcare: beforeFreeChildcare,
            uc: ucBefore,
          },
          after: {
            cash: pocketResourcesAfter, // This is take-home - net paid + additional relief
            pension: pensionValueSalarySac,
            otherPensionsNet: parseNumber(otherPensions),
            otherPensionsGross: otherPensionsGross,
            giftAidNet: parseNumber(giftAid),
            giftAidGross: giftAidGross,
            additionalRelief: totalAdditionalRelief,
            p11d: p11dValue,
            ev: evGross,
            cycle: cycleGross,
            childBenefit: scenarios[1].netChildBenefit,
            freeChildcare: afterFreeChildcare,
            uc: ucAfter,
          },
          headline: { before: totalNetBefore, after: totalNetAfter, delta: totalNetAfter - totalNetBefore },
        },
      },
    });

    setWarnings(newWarnings);
    setCelebrations(newCelebrations);
  };

  useEffect(() => {
    calculateResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, annualSalary, sacrificeType, sacrificeAmount, sacrificePercent, targetAmount, employerNIPassthrough,
      employerContribType, employerContribPercent, employerContribFixed, benefitsInKind,
      numberOfChildren, customChildBenefit, universalCreditEnabled, hasPartner, partnerNetSalary,
      wantsHousingElement, housingAllowance, householdCapital, otherPensions, giftAid, mpaaTriggered,
      payFrequency, contractualHours, ageGroup, applyToBonus, bonusAmount,
      evEnabled, evMonthlyCost, evNIPassthrough, cycleEnabled, cycleAnnualCost, cycleNIPassthrough,
      additionalPAYEIncome, studentUGPlan, hasPGL,
      childrenAtRiskCount, avgHourlyRate, carryForwardAllowance]);

  // Derived flags restored for P11D-related messaging and HICBC banner
  const p11dCausesPA = useMemo(() => {
    if (!results) return false;
    return parseNumber(benefitsInKind) > 0 && results.scenarios[1].cashIncome <= 100000 && results.scenarios[1].ani > 100000;
  }, [results, benefitsInKind]);

  const p11dCausesHICBC = useMemo(() => {
    if (!results) return false;
    return numberOfChildren > 0 && parseNumber(benefitsInKind) > 0 &&
      results.scenarios[1].cashIncome <= TAX_DATA.hicbc.threshold && results.scenarios[1].ani > TAX_DATA.hicbc.threshold;
  }, [results, benefitsInKind, numberOfChildren]);

  const hitHICBC = useMemo(() => {
    if (!results) return false;
    return numberOfChildren > 0 && results.scenarios[1].hicbc > 0;
  }, [results, numberOfChildren]);

  const getPensionPieData = () => {
    if (!results) return [] as any[];
    const items = [
      { name: 'Your Sacrifice', value: results.sacrifice.amount, color: '#3b82f6' }, // blue
      { name: 'Employer Base', value: results.sacrifice.employerBase, color: '#06b6d4' }, // cyan
      { name: 'NI Passthrough', value: results.sacrifice.employerPassthrough, color: '#10b981' }, // green
    ];

    // Add other pensions to the pie chart (gross amount goes into pension)
    if (results.otherPensions && results.otherPensions.gross > 0) {
      items.push({ name: 'Other Pensions', value: results.otherPensions.gross, color: '#a855f7' }); // purple - more distinct
    }

    return items.filter((i) => i.value > 0);
  };

  const savingsPct = useMemo(() => {
    if (!results) return 0;
    const before = results.scenarios[0].totalTakeHome;
    const after = results.scenarios[1].totalTakeHome;
    if (before <= 0) return 0;
    return Math.max(0, Math.min(100, ((after - before) / before) * 100));
  }, [results]);

  // Derived: percent needed when target is chosen (restored)
  const percentNeededForTarget = useMemo(() => {
    const totalSalary = parseNumber(annualSalary) + parseNumber(bonusAmount);
    if (totalSalary <= 0) return 0;
    if (sacrificeType !== 'target') return 0;
    const sac = calculateTargetSacrifice(parseNumber(targetAmount));
    return Math.max(0, Math.min(99, (sac / totalSalary) * 100));
  }, [annualSalary, bonusAmount, sacrificeType, targetAmount, employerContribPercent, employerContribFixed, employerContribType, employerNIPassthrough]);

  // Optimization score (reworked: measures trade-off between pension value and net resource change)
  const optimizationScore = useMemo(() => {
    if (!results) return 0;
    const beforeResources = results.scenarios[0].totalTakeHome + (results.universalCredit?.before || 0);
    const afterResources = results.scenarios[1].totalTakeHome + (results.universalCredit?.after || 0);
    const resourceDelta = afterResources - beforeResources; // +ve means more cash support this year

    const pensionValue = results.sacrifice.totalPensionFunding; // long-term value added

    let scoreBase = 0;
    if (resourceDelta >= 0) {
      // You gained cash and got pension funding – strong signal
      scoreBase = 85 + Math.min(15, resourceDelta / 500); // +1 per £500, capped
    } else {
      // You traded cash for pension; reward higher conversion ratios
      const cost = Math.max(1, -resourceDelta);
      const ratio = pensionValue / cost; // £ into pension for each £ of spend
      // Map ratio via soft log curve into 0..85
      scoreBase = Math.min(85, 20 + 20 * Math.log2(1 + ratio));
    }

    // Bonuses and penalties
    const beforeANI = results.scenarios[0].ani;
    const afterANI = results.scenarios[1].ani;
    if (beforeANI > 100000 && afterANI <= 100000) scoreBase += 8;
    if (beforeANI > TAX_DATA.hicbc.threshold && afterANI <= TAX_DATA.hicbc.threshold && numberOfChildren > 0) scoreBase += 7;
    if (results.pension.remaining < 0) scoreBase -= 25;
    if (!results.nmwCompliant) scoreBase -= 40;

    return Math.max(0, Math.min(100, Math.round(scoreBase)));
  }, [results, numberOfChildren]);

  // Cheeky suggestions (not advice)
  const suggestions = useMemo(() => {
    const list: { icon: React.ReactNode; text: string }[] = [];
    if (!results) return list;
    // UC suggestion: estimate behind the scenes even if toggle is off
    const ucPotential = estimateUniversalCredit(results.scenarios[1].totalTakeHome).award;
    if (!universalCreditEnabled && ucPotential > 0) {
      list.push({ icon: <HelpCircle className="text-info" size={16} />, text: 'Have you checked if you are eligible for UC based on this? (Not advice)' });
    }
    // Bike suggestion if cycle not enabled and NMW ok
    if (!cycleEnabled && results.nmwCompliant) {
      list.push({ icon: <Bike className="text-accent" size={16} />, text: 'Psst… maybe want a bike? Cycle to Work can be very tax‑efficient. (Not advice)' });
    }
    return list;
  }, [results, universalCreditEnabled, cycleEnabled]);

  // Before/After bar data
  const beforeAfterBar = useMemo(() => {
    if (!results) return [] as any[];

    const otherPensionsNet = results.otherPensions?.net || 0;
    const giftAidNet = results.giftAid?.net || 0;
    const totalAdditionalRelief = (results.otherPensions?.additionalRelief || 0) + (results.giftAid?.additionalRelief || 0);

    return [
      {
        name: 'Before',
        'Income Tax': Math.round(results.scenarios[0].incomeTax),
        'Employee NIC': Math.round(results.scenarios[0].employeeNIC),
        'Student Loan': Math.round(results.scenarios[0].studentLoan || 0),
        'Pension (net)': 0,
        'EV (net)': 0,
        'Cycle (net)': 0,
        'Cash (excl CB/UC)': Math.round(results.scenarios[0].takeHome),
        'Child Benefit': Math.round(results.scenarios[0].netChildBenefit || 0),
        'Universal Credit': Math.round(results.universalCredit?.before || 0),
        'Free childcare': Math.round(results.childcare.before.freeChildcareAnnual || 0),
      },
      {
        name: 'After',
        'Income Tax': Math.round(results.scenarios[1].incomeTax),
        'Employee NIC': Math.round(results.scenarios[1].employeeNIC),
        'Student Loan': Math.round(results.scenarios[1].studentLoan || 0),
        'Pension (net)': Math.round(results.sacrifice.amount + otherPensionsNet + giftAidNet),
        'EV (net)': Math.round(results.schemes?.ev?.enabled ? results.schemes.ev.net : 0),
        'Cycle (net)': Math.round(results.schemes?.cycle?.enabled ? results.schemes.cycle.net : 0),
        'Cash (excl CB/UC)': Math.round(results.scenarios[1].takeHome - otherPensionsNet - giftAidNet + totalAdditionalRelief),
        'Child Benefit': Math.round(results.scenarios[1].netChildBenefit || 0),
        'Universal Credit': Math.round(results.universalCredit?.after || 0),
        'Free childcare': Math.round(results.childcare.after.freeChildcareAnnual || 0),
      },
    ];
  }, [results]);

  // Compose Total Net Value details for panel (VALUE TO YOU ONLY - gift aid shown separately)
  const tnvDetails = useMemo(() => {
    if (!results) return [] as { label: string; before: number; after: number }[];
    const d = results.netValue.details;
    const rows = [
      { label: 'Cash in pocket', before: d.before.cash, after: d.after.cash },
      { label: 'Salary Sacrifice Pension', before: d.before.pension, after: d.after.pension },
    ];

    // Add other pensions gross value (what goes into YOUR pension - value to you)
    if (d.after.otherPensionsGross > 0) {
      rows.push({ label: 'Other Pensions (gross to pension)', before: 0, after: d.after.otherPensionsGross });
    }

    // Do NOT include gift aid gross here - it goes to charity, not to you

    rows.push(
      { label: 'P11D benefits', before: d.before.p11d, after: d.after.p11d },
      { label: 'EV', before: d.before.ev, after: d.after.ev },
      { label: 'Cycle', before: d.before.cycle, after: d.after.cycle },
      { label: 'Child Benefit', before: d.before.childBenefit, after: d.after.childBenefit },
      { label: 'Free childcare', before: d.before.freeChildcare, after: d.after.freeChildcare },
      { label: 'Universal Credit', before: d.before.uc, after: d.after.uc },
    );

    return rows;
  }, [results]);

  // Build rows for Detailed Breakdown panel
  const breakdownRows = useMemo(() => {
    if (!results) return [] as { label: string; before?: number; after?: number; value?: number }[];

    const rows: { label: string; before?: number; after?: number; value?: number }[] = [
      { label: 'Gross Pay', before: results.scenarios[0].earnings, after: results.scenarios[1].earnings },
      { label: 'Additional PAYE Income', value: parseNumber(additionalPAYEIncome) },
      { label: 'Benefits in Kind (P11D)', value: parseNumber(benefitsInKind) },
      { label: 'Income Tax', before: results.scenarios[0].incomeTax, after: results.scenarios[1].incomeTax },
      { label: 'Employee NIC', before: results.scenarios[0].employeeNIC, after: results.scenarios[1].employeeNIC },
      { label: 'Student Loan', before: results.scenarios[0].studentLoan || 0, after: results.scenarios[1].studentLoan || 0 },
      { label: 'Salary Sacrifice Pension', before: 0, after: results.sacrifice.totalPensionFunding },
      { label: '--- Take-Home from PAYE ---', before: results.scenarios[0].takeHome, after: results.scenarios[1].takeHome },
    ];

    // Add other pensions/gift aid deductions if present
    if (results.otherPensions && results.otherPensions.net > 0) {
      rows.push({
        label: 'Other Pensions (net paid from pocket)',
        before: 0,
        after: -results.otherPensions.net  // Negative because it's leaving your pocket
      });
    }

    if (results.giftAid && results.giftAid.net > 0) {
      rows.push({
        label: 'Gift Aid (net donated from pocket)',
        before: 0,
        after: -results.giftAid.net  // Negative because it's leaving your pocket
      });
    }

    // Add additional relief if applicable
    const totalAdditionalRelief = (results.otherPensions?.additionalRelief || 0) + (results.giftAid?.additionalRelief || 0);
    if (totalAdditionalRelief > 0.01) {
      rows.push({
        label: 'Additional relief (claimable via SA)',
        before: 0,
        after: totalAdditionalRelief  // Positive because it comes back to you
      });
    }

    // Add EV and Cycle schemes if enabled
    if (results.schemes?.ev?.enabled && results.schemes.ev.net > 0) {
      rows.push({
        label: 'EV Scheme (net cost)',
        before: 0,
        after: -results.schemes.ev.net  // Negative because it's a salary reduction
      });
    }

    if (results.schemes?.cycle?.enabled && results.schemes.cycle.net > 0) {
      rows.push({
        label: 'Cycle to Work (net cost)',
        before: 0,
        after: -results.schemes.cycle.net  // Negative because it's a salary reduction
      });
    }

    // Calculate net pocket cash
    const netPocketCashBefore = results.scenarios[0].takeHome;
    const netPocketCashAfter = results.scenarios[1].takeHome
      - (results.otherPensions?.net || 0)
      - (results.giftAid?.net || 0)
      + totalAdditionalRelief;

    rows.push({ label: '=== Net Cash in Pocket ===', before: netPocketCashBefore, after: netPocketCashAfter });

    // Add benefits
    rows.push(
      { label: 'Child Benefit', before: results.scenarios[0].netChildBenefit || 0, after: results.scenarios[1].netChildBenefit || 0 },
      { label: 'Universal Credit', before: results.universalCredit?.before || 0, after: results.universalCredit?.after || 0 },
      { label: 'Free childcare (value)', before: results.childcare.before.freeChildcareAnnual || 0, after: results.childcare.after.freeChildcareAnnual || 0 },
    );

    // Total pocket resources
    const pocketResourcesBefore = netPocketCashBefore + (results.scenarios[0].netChildBenefit || 0) + (results.universalCredit?.before || 0) + (results.childcare.before.freeChildcareAnnual || 0);
    const pocketResourcesAfter = netPocketCashAfter + (results.scenarios[1].netChildBenefit || 0) + (results.universalCredit?.after || 0) + (results.childcare.after.freeChildcareAnnual || 0);

    rows.push({ label: '★ TOTAL POCKET RESOURCES ★', before: pocketResourcesBefore, after: pocketResourcesAfter });

    return rows;
  }, [results, additionalPAYEIncome, benefitsInKind]);

  return (
    <div className="relative">
      <ConfettiCelebrator run={celebrations.length > 0} />

      {/* Decorative background (subtle, fixed) */}
      <div className="absolute inset-0 -z-10 pointer-events-none select-none">
        <div className="absolute top-16 left-[8vw] w-[28rem] h-[28rem] bg-primary/25 rounded-full blur-3xl animate-aurora" />
        <div className="absolute -top-10 right-[10vw] w-[32rem] h-[32rem] bg-secondary/25 rounded-full blur-3xl animate-aurora" />
      </div>

      <div className="card overflow-hidden neon-primary animate-glowpulse">
        {/* Container grid simplified to prevent right-column compression on ultrawide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 max-w-[140rem] mx-auto">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Basic Details */}
            <BasicDetails
              region={region}
              setRegion={setRegion}
              ageGroup={ageGroup}
              setAgeGroup={setAgeGroup}
              annualSalary={annualSalary}
              setAnnualSalary={setAnnualSalary}
              contractualHours={contractualHours}
              setContractualHours={setContractualHours}
              applyToBonus={applyToBonus}
              setApplyToBonus={setApplyToBonus}
              bonusAmount={bonusAmount}
              setBonusAmount={setBonusAmount}
            />

            {/* Pension Salary Sacrifice */}
            <PensionSalarySacrifice
              sacrificeType={sacrificeType}
              setSacrificeType={setSacrificeType}
              sacrificePercent={sacrificePercent}
              setSacrificePercent={setSacrificePercent}
              targetAmount={targetAmount}
              setTargetAmount={setTargetAmount}
              carryForwardAllowance={carryForwardAllowance}
              setCarryForwardAllowance={setCarryForwardAllowance}
              percentNeededForTarget={percentNeededForTarget}
            />

            {/* Employer Contribution */}
            <EmployerContribution
              employerContribType={employerContribType}
              setEmployerContribType={setEmployerContribType}
              employerContribPercent={employerContribPercent}
              setEmployerContribPercent={setEmployerContribPercent}
              employerContribFixed={employerContribFixed}
              setEmployerContribFixed={setEmployerContribFixed}
              employerNIPassthrough={employerNIPassthrough}
              setEmployerNIPassthrough={setEmployerNIPassthrough}
            />

            {/* EV Scheme */}
            <ElectricVehicle
              evEnabled={evEnabled}
              setEvEnabled={setEvEnabled}
              evMonthlyCost={evMonthlyCost}
              setEvMonthlyCost={setEvMonthlyCost}
              evNIPassthrough={evNIPassthrough}
              setEvNIPassthrough={setEvNIPassthrough}
              results={results}
            />

            {/* Cycle to Work */}
            <CycleToWork
              cycleEnabled={cycleEnabled}
              setCycleEnabled={setCycleEnabled}
              cycleAnnualCost={cycleAnnualCost}
              setCycleAnnualCost={setCycleAnnualCost}
              cycleNIPassthrough={cycleNIPassthrough}
              setCycleNIPassthrough={setCycleNIPassthrough}
              results={results}
            />

            {/* Student Loans (new visible section) */}
            <StudentLoans
              studentUGPlan={studentUGPlan}
              setStudentUGPlan={setStudentUGPlan}
              hasPGL={hasPGL}
              setHasPGL={setHasPGL}
            />

            {/* Children & Childcare (simplified) */}
            <ChildrenChildcare
              numberOfChildren={numberOfChildren}
              setNumberOfChildren={setNumberOfChildren}
              childrenAtRiskCount={childrenAtRiskCount}
              setChildrenAtRiskCount={setChildrenAtRiskCount}
              avgHourlyRate={avgHourlyRate}
              setAvgHourlyRate={setAvgHourlyRate}
              results={results}
            />

            {/* Additional Details */}
            <AdditionalDetails
              benefitsInKind={benefitsInKind}
              setBenefitsInKind={setBenefitsInKind}
              additionalPAYEIncome={additionalPAYEIncome}
              setAdditionalPAYEIncome={setAdditionalPAYEIncome}
              otherPensions={otherPensions}
              setOtherPensions={setOtherPensions}
              giftAid={giftAid}
              setGiftAid={setGiftAid}
              mpaaTriggered={mpaaTriggered}
              setMpaaTriggered={setMpaaTriggered}
            />

            {/* Universal Credit */}
            <UniversalCredit
              universalCreditEnabled={universalCreditEnabled}
              setUniversalCreditEnabled={setUniversalCreditEnabled}
              hasPartner={hasPartner}
              setHasPartner={setHasPartner}
              partnerNetSalary={partnerNetSalary}
              setPartnerNetSalary={setPartnerNetSalary}
              wantsHousingElement={wantsHousingElement}
              setWantsHousingElement={setWantsHousingElement}
              housingAllowance={housingAllowance}
              setHousingAllowance={setHousingAllowance}
              householdCapital={householdCapital}
              setHouseholdCapital={setHouseholdCapital}
              parseNumber={parseNumber}
            />
          </div>

          {/* Results + Side column */}
          <div className="space-y-6">
            {/* Total Net Value panel */}
            {results && (
              <TotalNetValuePanel
                headlineBefore={results.netValue.details.headline.before}
                headlineAfter={results.netValue.details.headline.after}
                headlineDelta={results.netValue.details.headline.delta}
                details={tnvDetails}
                giftAidToCharity={results.giftAid?.gross || 0}
              />
            )}

            {/* Before vs After chart */}
            {results && <BeforeAfterChart data={beforeAfterBar} />}

            {warnings.length > 0 && (
              <div className="space-y-3">
                {warnings.map((warning, index) => (
                  <div key={index} className={clsx('p-4 rounded-xl flex items-start gap-3 border glass', {
                    'bg-error/20 border-error/30': warning.type === 'error',
                    'bg-warning/20 border-warning/30': warning.type === 'warning',
                    'bg-info/20 border-info/30': warning.type === 'info',
                  })}>
                    {warning.type === 'error' ? <XCircle className="text-error mt-0.5" size={18} /> : warning.type === 'warning' ? <AlertTriangle className="text-warning mt-0.5" size={18} /> : <Info className="text-info mt-0.5" size={18} />}
                    <span className={clsx('text-sm', {
                      'text-error': warning.type === 'error',
                      'text-warning': warning.type === 'warning',
                      'text-info': warning.type === 'info',
                    })}>{warning.message}</span>
                  </div>
                ))}
              </div>
            )}

            {results && (
              <>
                {/* Detailed Breakdown */}
                <DetailedBreakdownPanel rows={breakdownRows} />
                
                {/* Universal Credit Breakdown Panels */}
                {universalCreditEnabled && parseNumber(householdCapital) <= 16000 && results.universalCredit?.breakdownBefore && results.universalCredit?.breakdownAfter && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <UniversalCreditPanel
                      scenario="before"
                      {...results.universalCredit.breakdownBefore}
                    />
                    <UniversalCreditPanel
                      scenario="after"
                      {...results.universalCredit.breakdownAfter}
                    />
                  </div>
                )}
                
                {/* Extra contextual notices previously in the breakdown */}
                {p11dCausesPA && (
                  <div className="p-2 rounded border border-info/20 bg-info/10 text-info text-xs">
                    Personal Allowance reduction is triggered by P11D benefits pushing adjusted income over £100k. UC is based on net income and ignores P11D.
                  </div>
                )}
                {childrenAtRiskCount > 0 && (
                  <div className="p-2 rounded border border-warning/30 bg-warning/10 text-warning text-xs">
                    {results.childcare.before.freeChildcareAnnual > 0 && results.childcare.after.freeChildcareAnnual === 0 ? (
                      <span>You would lose free childcare worth {formatCurrency(results.childcare.before.freeChildcareAnnual)} if your ANI exceeds £100k.</span>
                    ) : results.childcare.before.freeChildcareAnnual === 0 && results.childcare.after.freeChildcareAnnual > 0 ? (
                      <span>You retain free childcare worth {formatCurrency(results.childcare.after.freeChildcareAnnual)} by keeping ANI ≤ £100k.</span>
                    ) : null}
                  </div>
                )}
                {results.giftAid && results.giftAid.net > 0 && (() => {
                  const marginalRate = results.marginalRates?.employment || 0;
                  const additionalReliefRate = Math.max(0, marginalRate - 20);
                  const additionalRelief = results.giftAid.gross * (additionalReliefRate / 100);
                  return additionalRelief > 0.01 ? (
                    <div className="p-3 rounded border border-success/30 bg-success/10 text-success text-xs space-y-1">
                      <div className="font-semibold">Gift Aid Tax Relief:</div>
                      <div>You donated <strong>{formatCurrency(results.giftAid.net)}</strong> (charity received <strong>{formatCurrency(results.giftAid.gross)}</strong> with basic rate relief).</div>
                      <div>As a {marginalRate === 40 ? 'higher' : 'additional'} rate taxpayer, you can claim back <strong>{formatCurrency(additionalRelief)}</strong> ({additionalReliefRate}% of gross) via self-assessment.</div>
                    </div>
                  ) : null;
                })()}

                {/* Pension Summary */}
                <PensionSummaryPanel
                  amount={results.sacrifice.amount}
                  employerBase={results.sacrifice.employerBase}
                  employerPassthrough={results.sacrifice.employerPassthrough}
                  totalFunding={results.sacrifice.totalPensionFunding}
                  otherPensionsNet={results.otherPensions?.net || 0}
                  otherPensionsGross={results.otherPensions?.gross || 0}
                  totalContribs={results.pension.totalContribs}
                  remainingAllowance={results.pension.remaining}
                  marginalRate={results.marginalRates?.employment || 0}
                />

                {/* Effective Marginal Tax Rate */}
                <EMTRPanel employment={results.marginalRates?.employment || 0} nonSacPAYE={results.marginalRates?.nonSacPAYE || 0} />

                {/* HICBC animation if hit (kept here) */}
                {hitHICBC && (
                  <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }} className="glass rounded-xl p-5 border border-warning/40 neon-secondary">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="text-warning" size={18} />
                      <div>
                        <h4 className="font-semibold text-warning">Heads up: High Income Child Benefit Charge applies</h4>
                        <p className="text-sm opacity-80">Your current setup crosses the threshold. Explore sacrifice tweaks to dodge it. Not advice.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Full-width Charts section to avoid compression */}
          {results && (
            <div className="lg:col-span-2 space-y-6">
              {/* Charts grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Pension Pie */}
                <PensionPieChart data={getPensionPieData()} />

                {/* Scheme Impact bar (kept inline for now) */}
                <div className="glass rounded-xl overflow-hidden neon-secondary">
                  <div className="px-5 py-3 border-b border-white/10">
                    <h3 className="font-semibold text-base">Pocket Impact (Annual)</h3>
                  </div>
                  <div className="p-5 pie-stable">
                    {(() => {
                      const items = [
                        { label: 'Pension Sacrifice (net)', value: results.sacrifice.amount, color: 'bg-primary' },
                        ...(results.schemes?.ev?.enabled ? [{ label: 'EV (net)', value: results.schemes.ev.net, color: 'bg-secondary' }] : []),
                        ...(results.schemes?.cycle?.enabled ? [{ label: 'Cycle (net)', value: results.schemes.cycle.net, color: 'bg-accent' }] : []),
                        ...(results.otherPensions && results.otherPensions.net > 0 ? [{ label: 'Other Pensions (net paid)', value: results.otherPensions.net, color: 'bg-warning' }] : []),
                        ...(results.giftAid && results.giftAid.net > 0 ? [{ label: 'Gift Aid (net donated)', value: results.giftAid.net, color: 'bg-info' }] : []),
                      ];
                      const total = items.reduce((s, i) => s + i.value, 0) || 1;
                      return (
                        <div className="space-y-3">
                          <div className="h-3 w-full rounded bg-white/10 overflow-hidden">
                            <div className="flex h-full w-full">
                              {items.map((i) => (
                                <div key={i.label} className={`${i.color} h-full`} style={{ width: `${(i.value / total) * 100}%` }} />
                              ))}
                            </div>
                          </div>
                          {items.map((i) => (
                            <div key={i.label} className="flex justify-between text-sm">
                              <span className="opacity-80">{i.label}</span>
                              <span className="font-medium">£{Math.round(i.value).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Empty third slot for responsive layout or future chart */}
                <div className="hidden xl:block" />
              </div>

              {/* Panels under the graphs */}
              <CelebrationsPanel items={celebrations} />
              <NudgesPanel items={suggestions} />
              <TalesPanel />
            </div>
          )}

          {/* Celebration Banners (kept for legacy placement if needed) */}
          {false && celebrations.length > 0 && (
            <div className="mt-6 space-y-3">
              {celebrations.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="alert glass border-success/30 neon-secondary">
                  <div className="p-2 bg-white/10 rounded-lg">{c.icon}</div>
                  <span className="text-success font-semibold">{c.message}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
