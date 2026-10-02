import { Branch } from '../types/common';

export const MOCK_BRANCHES: Branch[] = [
  // Acme Bank
  {
    id: 'br_admiralty',
    tenantId: 'tenant_001',
    name: 'Lekki Admiralty Branch',
    address: 'Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    liveLoad: 'low',
    waitMin: 6,
    openUntil: '16:00',
  },
  {
    id: 'br_vi_main',
    tenantId: 'tenant_001',
    name: 'Victoria Island Main',
    address: 'Ahmadu Bello Way, VI',
    city: 'Lagos',
    liveLoad: 'moderate',
    waitMin: 14,
    openUntil: '16:00',
  },
  {
    id: 'br_ikeja_hub',
    tenantId: 'tenant_001',
    name: 'Ikeja Commercial Hub',
    address: 'Obafemi Awolowo Way, Ikeja',
    city: 'Lagos',
    liveLoad: 'busy',
    waitMin: 22,
    openUntil: '17:00',
  },

  // City Hospital
  {
    id: 'br_vi_hospital',
    tenantId: 'tenant_002',
    name: 'Main Outpatient Wing',
    address: '174B Corporation Dr, VI',
    city: 'Lagos',
    liveLoad: 'low',
    waitMin: 8,
    openUntil: '20:00',
  },
  {
    id: 'br_ikeja_clinic',
    tenantId: 'tenant_002',
    name: 'Ikeja Diagnostic Center',
    address: 'Allen Avenue, Ikeja',
    city: 'Lagos',
    liveLoad: 'moderate',
    waitMin: 12,
    openUntil: '18:00',
  },

  // Luma Telecom
  {
    id: 'br_westlands',
    tenantId: 'tenant_003',
    name: 'Westlands Flagship Store',
    address: 'Ring Road Parklands, Westlands',
    city: 'Nairobi',
    liveLoad: 'low',
    waitMin: 5,
    openUntil: '19:00',
  },

  // Makerere Uni
  {
    id: 'br_senate',
    tenantId: 'tenant_004',
    name: 'Senate Building Registry',
    address: 'Makerere Hill Rd',
    city: 'Kampala',
    liveLoad: 'low',
    waitMin: 4,
    openUntil: '17:00',
  },

  // National ID
  {
    id: 'br_cbd_abuja',
    tenantId: 'tenant_005',
    name: 'Central Identity Hall',
    address: 'Constitution Ave, CBD',
    city: 'Abuja',
    liveLoad: 'moderate',
    waitMin: 15,
    openUntil: '16:30',
  }
];
