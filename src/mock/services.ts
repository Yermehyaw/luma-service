import { Service } from '../types/common';

export const MOCK_SERVICES: Service[] = [
  // Acme Bank
  { id: 'srv_cash', tenantId: 'tenant_001', name: 'Cash Deposit & Withdrawal', minutes: 8, description: 'Over the counter cash & bulk currency services', active: true },
  { id: 'srv_sme', tenantId: 'tenant_001', name: 'SME Loan & Account Opening', minutes: 15, description: 'Commercial business accounts & trade credit', active: true },
  { id: 'srv_card', tenantId: 'tenant_001', name: 'Instant Card Issuance & PIN', minutes: 5, description: 'Debit & credit card replacement on the spot', active: true },
  { id: 'srv_wealth', tenantId: 'tenant_001', name: 'Wealth & Forex Consultation', minutes: 25, description: 'Private wealth, fixed income & FX window', active: true },

  // City Hospital
  { id: 'srv_triage', tenantId: 'tenant_002', name: 'General GP Consultation Triage', minutes: 12, description: 'Initial vitals, GP consultation & prescription', active: true },
  { id: 'srv_lab', tenantId: 'tenant_002', name: 'Blood & Pathology Lab Test', minutes: 10, description: 'Specimen collection & digital results pre-clearance', active: true },
  { id: 'srv_scan', tenantId: 'tenant_002', name: 'Ultrasound & X-Ray Diagnostics', minutes: 20, description: 'Radiology imaging & specialist review', active: true },

  // Luma Telecom
  { id: 'srv_sim', tenantId: 'tenant_003', name: 'SIM Registration & Biometrics', minutes: 7, description: 'New line registration, eSIM setup & SIM swap', active: true },
  { id: 'srv_fiber', tenantId: 'tenant_003', name: 'Home Fiber Broadband Setup', minutes: 15, description: 'Fiber routing, router pick-up & account billing', active: true },

  // Makerere Uni
  { id: 'srv_transcript', tenantId: 'tenant_004', name: 'Academic Transcript Clearance', minutes: 10, description: 'Certified transcript collection & verification', active: true },
  { id: 'srv_degree', tenantId: 'tenant_004', name: 'Degree Certificate Pick-up', minutes: 5, description: 'Graduation audit & certificate issuance', active: true },

  // National ID
  { id: 'srv_nin', tenantId: 'tenant_005', name: 'National Identity Pre-Enrollment', minutes: 10, description: 'Biometric capture & slip verification', active: true },
  { id: 'srv_passport', tenantId: 'tenant_005', name: 'Passport Clearance & Delivery', minutes: 12, description: 'Document audit & physical booklet pickup', active: true }
];
