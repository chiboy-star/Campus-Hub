import {
  LectureHall,
  LabEquipment,
  StudyRoom,
  EventGrounds,
  User,
  Booking,
  Fine,
  ReservationQueue,
  MaintenanceLog,
  AuditLog,
  Resource
} from '../domain/models';

// High-fidelity architectural & campus facility photography (Lummi/Unsplash warm studio & clean academic aesthetics)
export const initialResources: Resource[] = [
  new LectureHall(
    'LH-101',
    'SST Lecture Theatre 1',
    'School of Science and Technology, Ground Floor',
    'Available',
    'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
    'L48qE4_300IU~q-;IU%M00_300Rj',
    250,
    ['Dual 4K Laser Projectors', 'Ceiling Array Microphones', 'Live Stream Recording Pod', 'Tiered Acoustic Seating', 'High-Speed Wi-Fi 6']
  ),
  new LectureHall(
    'LH-204',
    'SMC Studio Amphitheatre A',
    'School of Media & Communication, 2nd Floor',
    'Available',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    'L58X1j00~q4n00?b%M_300D%00_3',
    120,
    ['Broadcast Audio Console', 'Curved LED Video Wall', 'Motorized Blackout Blinds', 'Lectern Control Touchscreen']
  ),
  new LectureHall(
    'LH-300',
    'Amethyst Auditorium (Main Campus)',
    'PAU Central Administration Complex',
    'Available',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    'L69@K%_300%M~qIU00_300M{00IU',
    400,
    ['Simultaneous Translation Booths', 'Dolby Atmos Acoustics', 'VIP Green Room', 'Dual Presidential Podiums']
  ),
  new LabEquipment(
    'EQ-301',
    'Agilent Cary 60 UV-Vis Spectrometer',
    'SST Advanced Analytical Chemistry Lab (Room 112)',
    'Available',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    'L38w-T~q00%M00IU00IU00_300D%',
    'Valid',
    '2027-04-15',
    18500000,
    [
      new MaintenanceLog('LOG-001', 'EQ-301', 'Annual Xenon Flash Lamp Calibration & Wavelength Accuracy Verification', '2026-04-10', '2027-04-15'),
      new MaintenanceLog('LOG-002', 'EQ-301', 'Firmware upgrade and optical bench cleaning', '2026-08-22')
    ]
  ),
  new LabEquipment(
    'EQ-402',
    'Keysight Infiniium 4-Channel Oscilloscope (1GHz)',
    'Electrical & Electronic Engineering Lab 2B',
    'OnLoan',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    'L49j}u_300%M00IU00_300D%00IU',
    'Valid',
    '2027-02-28',
    6800000,
    [
      new MaintenanceLog('LOG-003', 'EQ-402', 'NIST-traceable 4-channel probe calibration', '2026-02-14', '2027-02-28')
    ]
  ),
  new LabEquipment(
    'EQ-505',
    'Olympus BX53 Fluorescence Microscope',
    'SST Bio-Sciences & Genetics Facility',
    'CalibrationDue',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    'L384yL_300?b00IU~qIU00%M00_3',
    'CalibrationDue',
    '2026-10-31',
    14200000,
    [
      new MaintenanceLog('LOG-004', 'EQ-505', 'Semi-annual objective lens realign', '2026-04-02', '2026-10-31')
    ]
  ),
  new LabEquipment(
    'EQ-609',
    'Stratasys F170 Industrial 3D Printer',
    'MakerSpace & Rapid Prototyping Workshop',
    'UnderMaintenance',
    'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=80',
    'L58qE400~q%M00IU00_300D%00_3',
    'Valid',
    '2027-05-10',
    24000000,
    [
      new MaintenanceLog('LOG-005', 'EQ-609', 'Extruder thermal nozzle replacement following jammed carbon filament', '2026-11-12', undefined, 'Thermal head heater cartridge failure')
    ]
  ),
  new StudyRoom(
    'SR-102',
    'Main Library Collaborative Pod B2',
    'University Library, East Wing 1st Floor',
    'Available',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    'L5A9k.~q00%M00IU~q_300D%00_3',
    3 // 3 max consecutive hours
  ),
  new StudyRoom(
    'SR-205',
    'SMC Graduate Research Suite 4',
    'SMC Media Hub, Level 3',
    'Reserved',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    'L48w-T00~q4n00?b00IU00_300D%',
    4
  ),
  new EventGrounds(
    'EG-01',
    'PAU Central Campus Green & Pavilion',
    'University Central Quadrangle, Main Campus',
    'Available',
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    'L69@K%00~qIU00%M00_300M{00IU',
    3500,
    true
  )
];

export const mockUsers: User[] = [
  new User(
    'USR-STU-01',
    'Chinedu Eze',
    'chinedu.eze@pau.edu.ng',
    '+234 803 123 4567',
    'Student'
  ),
  new User(
    'USR-LEC-01',
    'Dr. Adewale Olusola',
    'a.olusola@pau.edu.ng',
    '+234 802 987 6543',
    'Lecturer'
  ),
  new User(
    'USR-LEC-02',
    'Dr. Fatima Bello',
    'f.bello@pau.edu.ng',
    '+234 805 444 3322',
    'Lecturer'
  ),
  new User(
    'USR-TECH-01',
    'Engr. Emmanuel Nnamdi',
    'e.nnamdi@pau.edu.ng',
    '+234 818 555 7788',
    'LabTechnician'
  ),
  new User(
    'USR-MGR-01',
    'Mrs. Folashade Adeyemi',
    'f.adeyemi@pau.edu.ng',
    '+234 809 111 2233',
    'FacilityManager'
  )
];

export const initialBookings: Booking[] = [
  new Booking(
    'BK-2026-001',
    'EQ-301', // Agilent UV-Vis Spectrometer
    'USR-STU-01', // Chinedu (Student)
    '2026-11-20T09:00:00Z',
    '2026-11-20T12:00:00Z',
    'Requested',
    'Senior Year Chemical Kinetics Capstone Research',
    'USR-LEC-01', // Dr. Adewale (Supervising Lecturer)
    undefined,
    undefined,
    undefined,
    'idem_pau_req_8921a'
  ),
  new Booking(
    'BK-2026-002',
    'LH-101', // SST Lecture Theatre 1
    'USR-LEC-01', // Dr. Adewale
    '2026-11-21T10:00:00Z',
    '2026-11-21T13:00:00Z',
    'Approved',
    'PHY 201 Electromagnetic Theory Guest Lecture',
    undefined,
    'USR-MGR-01',
    'Academic timetable approved by Dean',
    '2026-11-18T14:20:00Z',
    'idem_pau_req_3312b'
  ),
  new Booking(
    'BK-2026-003',
    'EQ-402', // Keysight Oscilloscope
    'USR-STU-01', // Chinedu
    '2026-11-17T08:00:00Z',
    '2026-11-18T16:00:00Z',
    'Active',
    'Embedded Signal DSP Filter Testing',
    'USR-LEC-02', // Dr. Fatima
    'USR-TECH-01',
    'Laboratory safety briefing completed',
    '2026-11-17T07:45:00Z',
    'idem_pau_req_9901c'
  ),
  new Booking(
    'BK-2026-004',
    'SR-102', // Main Library Pod B2
    'USR-STU-01', // Chinedu
    '2026-11-16T10:00:00Z',
    '2026-11-16T13:00:00Z',
    'Overdue',
    'Group Study for Calculus Midterms',
    undefined,
    'USR-MGR-01',
    'Standard room access granted',
    '2026-11-16T09:50:00Z',
    'idem_pau_req_7721d'
  ),
  new Booking(
    'BK-2026-005',
    'LH-204',
    'USR-LEC-02',
    '2026-11-15T14:00:00Z',
    '2026-11-15T17:00:00Z',
    'Completed',
    'Data Science Seminar Series',
    undefined,
    'USR-MGR-01',
    'Approved',
    '2026-11-14T09:00:00Z',
    'idem_pau_req_4412e'
  )
];

export const initialFines: Fine[] = [
  new Fine(
    'FN-2026-081',
    'BK-2026-004',
    5000, // 6 hours overdue on StudyRoom (2 * 500 + 4 * 1000 = 5000)
    6,
    'Overdue',
    '2026-11-16T19:00:00Z',
    'PendingBursaryPayment',
    'Exceeded max 3-hour library pod session without checkout'
  )
];

export const initialQueues: ReservationQueue[] = [
  new ReservationQueue('Q-LH-101', 'LH-101', [
    {
      entryId: 'QE-101',
      userId: 'USR-LEC-02',
      position: 1,
      requestedStart: '2026-11-21T10:00:00Z',
      requestedEnd: '2026-11-21T13:00:00Z',
      status: 'Waiting'
    },
    {
      entryId: 'QE-102',
      userId: 'USR-STU-01',
      position: 2,
      requestedStart: '2026-11-21T10:00:00Z',
      requestedEnd: '2026-11-21T13:00:00Z',
      status: 'Waiting'
    }
  ]),
  new ReservationQueue('Q-EQ-301', 'EQ-301', [
    {
      entryId: 'QE-201',
      userId: 'USR-STU-01',
      position: 1,
      requestedStart: '2026-11-20T13:00:00Z',
      requestedEnd: '2026-11-20T16:00:00Z',
      status: 'Waiting'
    }
  ])
];

export const initialAuditLogs: AuditLog[] = [
  new AuditLog(
    'AUD-882190-101',
    'USR-STU-01',
    'Submitted Booking Request BK-2026-001 for Agilent UV-Vis Spectrometer (Supervising Lecturer: Dr. Adewale Olusola)',
    '2026-11-18T09:12:30Z',
    'BK-2026-001',
    'Idempotency Key: idem_pau_req_8921a | Supervising Lecturer rule verified.'
  ),
  new AuditLog(
    'AUD-882190-102',
    'USR-MGR-01',
    'Approved Booking BK-2026-002 for SST Lecture Theatre 1',
    '2026-11-18T14:20:00Z',
    'BK-2026-002',
    'Slot verification checked. No schedule conflict.'
  ),
  new AuditLog(
    'AUD-882190-103',
    'USR-TECH-01',
    'Dispatched Equipment Keysight Oscilloscope (BK-2026-003) to Active OnLoan state',
    '2026-11-17T07:45:00Z',
    'BK-2026-003',
    'Pre-loan inspection passed. Calibration certificate valid.'
  ),
  new AuditLog(
    'AUD-882190-104',
    'SYSTEM-SCHEDULER',
    'Automated Overdue Detection triggered for BK-2026-004 (Main Library Pod B2)',
    '2026-11-16T19:00:00Z',
    'BK-2026-004',
    'Polymorphic fine calculated: ₦5,000 for 6 hours overdue. Bursary invoice generated.'
  )
];
