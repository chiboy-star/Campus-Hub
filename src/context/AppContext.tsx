import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Role,
  Resource,
  Booking,
  Fine,
  ReservationQueue,
  AuditLog,
  User,
  BookingStatus,
  ResourceStatus,
  LectureHall,
  LabEquipment,
  StudyRoom,
  EventGrounds
} from '../domain/models';
import {
  initialResources,
  mockUsers,
  initialBookings,
  initialFines,
  initialQueues,
  initialAuditLogs
} from '../data/mockData';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description: string;
  action?: ToastAction;
  duration?: number;
}

interface AppContextType {
  // Authentication & Role
  currentUser: User;
  activeRole: Role;
  users: User[];
  setActiveRole: (role: Role) => void;
  setCurrentUserById: (userId: string) => void;
  sessionTimeLeft: number;
  resetSessionTimer: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Domain State
  resources: Resource[];
  bookings: Booking[];
  fines: Fine[];
  queues: ReservationQueue[];
  auditLogs: AuditLog[];

  // Navigation & UI
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isCookieAccepted: boolean;
  setIsCookieAccepted: (accepted: boolean) => void;

  // Modals & Drawers
  bookingTargetResource: Resource | null;
  setBookingTargetResource: (resource: Resource | null) => void;
  printFineBooking: Booking | null;
  setPrintFineBooking: (booking: Booking | null) => void;

  // Toast / Undo
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => string;
  dismissToast: (id: string) => void;

  // Domain Actions (FR-01 to FR-10 & UC-01 to UC-05)
  createBooking: (
    resourceId: string,
    startDateTime: string,
    endDateTime: string,
    purpose: string,
    supervisingLecturerId?: string
  ) => { success: boolean; error?: string; booking?: Booking };

  cancelBooking: (bookingId: string, reason?: string) => void;
  approveBooking: (bookingId: string, reason?: string) => void;
  rejectBooking: (bookingId: string, reason: string) => void;
  completeBooking: (bookingId: string) => void;
  markBookingOverdue: (bookingId: string, overdueHours: number) => Fine;

  // Resource Management (Facility Manager)
  addResource: (resource: Resource) => void;
  updateResource: (resource: Resource) => void;
  retireResource: (resourceId: string) => void;

  // Queue & 15-Minute Slot Offer (UC-03)
  joinQueue: (resourceId: string, start: string, end: string) => void;
  activeSlotOffer: { entryId: string; resourceId: string; expiresAt: number; resourceName: string } | null;
  acceptSlotOffer: () => void;
  declineOrExpireSlotOffer: () => void;

  // Lab Equipment Maintenance (UC-04)
  inspectAndReturnEquipment: (
    equipmentId: string,
    bookingId: string,
    condition: 'Good' | 'Damaged',
    damageNotes?: string
  ) => void;
  simulateCalibrationExpiry: (equipmentId: string) => void;
  recordNewCalibration: (equipmentId: string, nextCalDate: string, notes: string) => void;

  // Damage Fine Assessment
  assessDamageFine: (bookingId: string, amount: number, notes: string) => Fine;

  // Bursary Settlement
  settleFine: (fineId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campushub_theme');
      return saved ? saved === 'dark' : false;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('campushub_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('campushub_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Users & Active Role
  const [users] = useState<User[]>(mockUsers);
  const [activeRole, setActiveRoleState] = useState<Role>('Student');
  const [currentUser, setCurrentUser] = useState<User>(() => mockUsers[0]); // Chinedu Eze (Student)

  const setActiveRole = useCallback((role: Role) => {
    setActiveRoleState(role);
    // Find matching default user for this role
    const matchedUser = mockUsers.find(u => u.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);
    }
  }, []);

  const setCurrentUserById = useCallback((userId: string) => {
    const user = mockUsers.find(u => u.userId === userId);
    if (user) {
      setCurrentUser(user);
      setActiveRoleState(user.role);
    }
  }, []);

  // Inactivity session timer (10 minutes = 600 seconds)
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(600);
  const resetSessionTimer = useCallback(() => {
    setSessionTimeLeft(600);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // UI States
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCookieAccepted, setIsCookieAccepted] = useState<boolean>(() => {
    return localStorage.getItem('campushub_ndpa_accepted') === 'true';
  });

  const [bookingTargetResource, setBookingTargetResource] = useState<Resource | null>(null);
  const [printFineBooking, setPrintFineBooking] = useState<Booking | null>(null);

  // Domain Collections
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [fines, setFines] = useState<Fine[]>(initialFines);
  const [queues, setQueues] = useState<ReservationQueue[]>(initialQueues);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    const duration = toast.duration || 5000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // 15-Minute Slot Offer State (UC-03)
  const [activeSlotOffer, setActiveSlotOffer] = useState<{
    entryId: string;
    resourceId: string;
    expiresAt: number;
    resourceName: string;
  } | null>(null);

  // Parse UTM Query Parameters on mount (Requirement #14 & Section 4)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role') as Role | null;
      const urlTab = params.get('tab');
      if (urlRole && ['Student', 'Lecturer', 'LabTechnician', 'FacilityManager'].includes(urlRole)) {
        setActiveRole(urlRole);
      }
      if (urlTab) {
        setActiveTab(urlTab);
      }
    }
  }, [setActiveRole]);

  // Log an audit event
  const logAudit = useCallback((action: string, bookingId?: string, details?: string) => {
    const entry = AuditLog.recordEvent(currentUser.userId, action, bookingId, details);
    setAuditLogs(prev => [entry, ...prev]);
  }, [currentUser]);

  // ==========================================
  // DOMAIN OPERATIONS
  // ==========================================

  // FR-04 & UC-01: Create Booking with Supervising Lecturer Rule & Overlap Detection
  const createBooking = useCallback(
    (
      resourceId: string,
      startDateTime: string,
      endDateTime: string,
      purpose: string,
      supervisingLecturerId?: string
    ) => {
      const targetResource = resources.find(r => r.resourceId === resourceId);
      if (!targetResource) {
        return { success: false, error: 'Resource not found' };
      }

      // Check state availability
      if (targetResource.status === 'Retired') {
        return { success: false, error: 'Resource has been retired from the active campus catalog.' };
      }
      if (targetResource.status === 'UnderMaintenance') {
        return { success: false, error: 'Resource is currently under maintenance.' };
      }
      if (targetResource.status === 'CalibrationDue') {
        return { success: false, error: 'Resource is flagged CalibrationDue and cannot be booked until certified.' };
      }

      // Check schedule overlaps
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      const isFree = targetResource.checkAvailability(start, end, bookings);
      if (!isFree) {
        return {
          success: false,
          error: 'Slot conflict: The requested timeframe overlaps with an existing Approved/Active booking. You may join the waiting queue.'
        };
      }

      // MANDATORY CAMPUS RULE: Student booking LabEquipment requires Supervising Lecturer
      if (currentUser.role === 'Student' && targetResource.type === 'LabEquipment') {
        if (!supervisingLecturerId) {
          return {
            success: false,
            error: 'FR-04 Violation: A Supervising Lecturer must be appointed for all Student LabEquipment bookings.'
          };
        }
      }

      const bookingId = `BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const idempotencyKey = `idem_pau_req_${Math.random().toString(36).substring(2, 9)}`;

      const newBooking = new Booking(
        bookingId,
        resourceId,
        currentUser.userId,
        startDateTime,
        endDateTime,
        'Requested',
        purpose,
        supervisingLecturerId,
        undefined,
        undefined,
        undefined,
        idempotencyKey
      );

      setBookings(prev => [newBooking, ...prev]);

      logAudit(
        `Created Booking Request ${bookingId} for ${targetResource.name}`,
        bookingId,
        `Idempotency-Key: ${idempotencyKey} | Supervising Lecturer: ${supervisingLecturerId || 'N/A'}`
      );

      showToast({
        type: 'success',
        title: 'Booking Request Submitted',
        description: `Request ${bookingId} for ${targetResource.name} is awaiting staff review.`,
      });

      return { success: true, booking: newBooking };
    },
    [resources, bookings, currentUser, logAudit, showToast]
  );

  // FR-05 & FR-06: Cancel Booking with 5-second Undo Toast
  const cancelBooking = useCallback(
    (bookingId: string, reason: string = 'User initiated cancellation') => {
      const target = bookings.find(b => b.bookingId === bookingId);
      if (!target) return;

      const previousStatus = target.status;
      target.cancel(reason);

      // Trigger optimistic update
      setBookings(prev => [...prev]);

      logAudit(`Cancelled Booking ${bookingId}`, bookingId, `Reason: ${reason}`);

      // Check if there is a queue for this resource and offer slot to User #1 (UC-03)
      const queue = queues.find(q => q.resourceId === target.resourceId);
      let offeredEntry: any = null;
      if (queue) {
        offeredEntry = queue.offerSlotToNextUser();
        if (offeredEntry) {
          const res = resources.find(r => r.resourceId === target.resourceId);
          setActiveSlotOffer({
            entryId: offeredEntry.entryId,
            resourceId: target.resourceId,
            expiresAt: offeredEntry.offerExpiresAt!,
            resourceName: res?.name || 'Resource',
          });
          logAudit(
            `15-Minute Slot Offer sent to User ${offeredEntry.userId} (Queue Entry ${offeredEntry.entryId})`,
            bookingId,
            `Slot freed from cancelled ${bookingId}`
          );
        }
      }

      // Show Undo Toast
      showToast({
        type: 'info',
        title: 'Booking Cancelled',
        description: `Booking ${bookingId} was cancelled.`,
        duration: 5000,
        action: {
          label: 'Undo',
          onClick: () => {
            target.changeStatus(previousStatus);
            setBookings(prev => [...prev]);
            logAudit(`Reverted cancellation for Booking ${bookingId}`, bookingId);
            showToast({
              type: 'success',
              title: 'Cancellation Reverted',
              description: `Booking ${bookingId} restored to ${previousStatus}.`,
            });
          },
        },
      });
    },
    [bookings, queues, resources, logAudit, showToast]
  );

  // FR-06 & UC-02: Approve Booking
  const approveBooking = useCallback(
    (bookingId: string, reason: string = 'Schedule and safety requirements confirmed') => {
      const target = bookings.find(b => b.bookingId === bookingId);
      if (!target) return;

      const prevStatus = target.status;
      target.changeStatus('Approved', currentUser.userId, reason);
      setBookings(prev => [...prev]);

      logAudit(
        `Staff Approved Booking ${bookingId}`,
        bookingId,
        `Approved by ${currentUser.fullName} (${currentUser.role}). Notes: ${reason}`
      );

      showToast({
        type: 'success',
        title: 'Booking Approved',
        description: `Booking ${bookingId} is now Approved.`,
        action: {
          label: 'Undo',
          onClick: () => {
            target.changeStatus(prevStatus, currentUser.userId, 'Reverted approval');
            setBookings(prev => [...prev]);
            logAudit(`Reverted approval of ${bookingId}`, bookingId);
          },
        },
      });
    },
    [bookings, currentUser, logAudit, showToast]
  );

  // FR-06 & UC-02: Reject Booking (mandatory rejection reason)
  const rejectBooking = useCallback(
    (bookingId: string, reason: string) => {
      const target = bookings.find(b => b.bookingId === bookingId);
      if (!target) return;

      const prevStatus = target.status;
      target.changeStatus('Cancelled', currentUser.userId, `Rejected: ${reason}`);
      setBookings(prev => [...prev]);

      logAudit(
        `Staff Rejected Booking ${bookingId}`,
        bookingId,
        `Rejected by ${currentUser.fullName} (${currentUser.role}). Mandatory Reason: ${reason}`
      );

      showToast({
        type: 'warning',
        title: 'Booking Request Rejected',
        description: `Booking ${bookingId} was declined: "${reason}"`,
        duration: 6000,
        action: {
          label: 'Undo',
          onClick: () => {
            target.changeStatus(prevStatus, currentUser.userId, 'Reverted rejection');
            setBookings(prev => [...prev]);
            logAudit(`Reverted rejection of ${bookingId}`, bookingId);
          },
        },
      });
    },
    [bookings, currentUser, logAudit, showToast]
  );

  // Complete Booking
  const completeBooking = useCallback(
    (bookingId: string) => {
      const target = bookings.find(b => b.bookingId === bookingId);
      if (!target) return;

      target.changeStatus('Completed', currentUser.userId, 'Facility returned and session ended');
      
      // Update resource status if it was reserved/onloan
      const res = resources.find(r => r.resourceId === target.resourceId);
      if (res && (res.status === 'Reserved' || res.status === 'OnLoan')) {
        res.setStatus('Available');
        setResources(prev => [...prev]);
      }

      setBookings(prev => [...prev]);

      logAudit(`Booking ${bookingId} Completed`, bookingId, 'Facility successfully marked as returned.');
      showToast({
        type: 'success',
        title: 'Booking Completed',
        description: `Booking ${bookingId} session closed successfully.`,
      });
    },
    [bookings, resources, currentUser, logAudit, showToast]
  );

  // FR-07, FR-09 & UC-05: Polymorphic Mark Booking Overdue & Fine Assessment
  const markBookingOverdue = useCallback(
    (bookingId: string, overdueHours: number): Fine => {
      const target = bookings.find(b => b.bookingId === bookingId);
      if (!target) {
        throw new Error('Booking not found');
      }

      const res = resources.find(r => r.resourceId === target.resourceId);
      if (!res) {
        throw new Error('Resource not found');
      }

      // Transition booking state to Overdue
      if (target.status !== 'Overdue') {
        target.changeStatus('Overdue', 'SYSTEM-SCHEDULER', `Overstayed reservation by ${overdueHours} hours`);
        setBookings(prev => [...prev]);
      }

      // Polymorphic calculation
      const fineAmount = res.calculateFine(overdueHours);
      const fineId = `FN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      const newFine = new Fine(
        fineId,
        bookingId,
        fineAmount,
        overdueHours,
        'Overdue',
        new Date().toISOString(),
        'PendingBursaryPayment',
        `Automated overdue fine: ${res.getFineFormulaDescription()}`
      );

      setFines(prev => [newFine, ...prev]);

      logAudit(
        `Polymorphic Overdue Fine Assessed for ${bookingId} (Fine: ${fineId})`,
        bookingId,
        `Resource Subclass: ${res.type} | Duration: ${overdueHours}h | Calculated: ₦${fineAmount.toLocaleString()} | Formula: ${res.getFineFormulaDescription()}`
      );

      showToast({
        type: 'error',
        title: `Overdue Fine Assessed (₦${fineAmount.toLocaleString()})`,
        description: `Booking ${bookingId} is ${overdueHours}h overdue. Fine reference ${fineId} logged for University Bursary.`,
        duration: 7000,
      });

      return newFine;
    },
    [bookings, resources, logAudit, showToast]
  );

  // Assess Damage Fine (Facility Manager)
  const assessDamageFine = useCallback(
    (bookingId: string, amount: number, notes: string): Fine => {
      const fineId = `FN-DMG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const newFine = new Fine(
        fineId,
        bookingId,
        amount,
        0,
        'Damage',
        new Date().toISOString(),
        'PendingBursaryPayment',
        notes
      );

      setFines(prev => [newFine, ...prev]);

      logAudit(
        `Damage Fine Assessed for ${bookingId} (Fine: ${fineId})`,
        bookingId,
        `Assessed by: ${currentUser.fullName} | Amount: ₦${amount.toLocaleString()} | Notes: ${notes}`
      );

      showToast({
        type: 'warning',
        title: `Damage Charge Assessed (₦${amount.toLocaleString()})`,
        description: `Fine ID ${fineId} created for Booking ${bookingId}. Routed to PAU Bursary.`,
      });

      return newFine;
    },
    [currentUser, logAudit, showToast]
  );

  const settleFine = useCallback(
    (fineId: string) => {
      const target = fines.find(f => f.fineId === fineId);
      if (!target) return;
      target.settle();
      setFines(prev => [...prev]);
      logAudit(`Fine ${fineId} Settled`, target.bookingId, 'Bursary payment confirmed.');
      showToast({
        type: 'success',
        title: 'Fine Settled',
        description: `Fine ${fineId} confirmed by University Bursary.`,
      });
    },
    [fines, logAudit, showToast]
  );

  // FR-02: Catalog Management (Facility Manager)
  const addResource = useCallback(
    (resource: Resource) => {
      setResources(prev => [resource, ...prev]);
      logAudit(
        `Added new ${resource.type} resource: ${resource.name} (${resource.resourceId})`,
        undefined,
        `Location: ${resource.location}`
      );
      showToast({
        type: 'success',
        title: 'Resource Catalog Updated',
        description: `${resource.name} added to CampusHub.`,
      });
    },
    [logAudit, showToast]
  );

  const updateResource = useCallback(
    (resource: Resource) => {
      setResources(prev => prev.map(r => (r.resourceId === resource.resourceId ? resource : r)));
      logAudit(`Updated resource ${resource.resourceId} (${resource.name})`);
      showToast({
        type: 'info',
        title: 'Resource Updated',
        description: `${resource.name} attributes saved.`,
      });
    },
    [logAudit, showToast]
  );

  const retireResource = useCallback(
    (resourceId: string) => {
      const target = resources.find(r => r.resourceId === resourceId);
      if (!target) return;

      const prevStatus = target.status;
      target.setStatus('Retired');
      setResources(prev => [...prev]);

      logAudit(`Retired resource ${resourceId} (${target.name}) from active catalog`);

      showToast({
        type: 'warning',
        title: 'Resource Retired',
        description: `${target.name} soft-deleted from bookable search results.`,
        duration: 6000,
        action: {
          label: 'Undo',
          onClick: () => {
            target.setStatus(prevStatus);
            setResources(prev => [...prev]);
            logAudit(`Reverted retirement for ${resourceId}`);
            showToast({
              type: 'success',
              title: 'Retirement Reverted',
              description: `${target.name} restored to ${prevStatus}.`,
            });
          },
        },
      });
    },
    [resources, logAudit, showToast]
  );

  // FR-08 & UC-03: Queue Management & 15-Minute Slot Offer
  const joinQueue = useCallback(
    (resourceId: string, start: string, end: string) => {
      let targetQueue = queues.find(item => item.resourceId === resourceId);
      if (!targetQueue) {
        const newQueue = new ReservationQueue(`Q-${resourceId}`, resourceId, []);
        targetQueue = newQueue;
        setQueues(prev => [...prev, newQueue]);
      }

      const entry = targetQueue.addUser(currentUser.userId, start, end);
      setQueues(prev => [...prev]);

      const res = resources.find(r => r.resourceId === resourceId);
      logAudit(
        `User ${currentUser.fullName} joined queue for ${res?.name || resourceId}`,
        undefined,
        `Queue Position: #${entry.position} (Entry: ${entry.entryId})`
      );

      showToast({
        type: 'info',
        title: `Joined Waiting Queue (#${entry.position})`,
        description: `You are in line for ${res?.name || resourceId}. You will receive a 15-minute slot offer if the current booking cancels.`,
      });
    },
    [queues, currentUser, resources, logAudit, showToast]
  );

  const acceptSlotOffer = useCallback(() => {
    if (!activeSlotOffer) return;

    // Convert to Requested booking
    createBooking(
      activeSlotOffer.resourceId,
      new Date().toISOString(),
      new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      'Waitlist Slot Offer Accepted'
    );

    logAudit(`Accepted 15-Minute Slot Offer for ${activeSlotOffer.resourceName}`, undefined, `Queue Entry: ${activeSlotOffer.entryId}`);
    setActiveSlotOffer(null);

    showToast({
      type: 'success',
      title: 'Slot Offer Accepted',
      description: 'Your booking has been converted to a formal booking request.',
    });
  }, [activeSlotOffer, createBooking, logAudit, showToast]);

  const declineOrExpireSlotOffer = useCallback(() => {
    if (!activeSlotOffer) return;

    logAudit(`Declined/Expired 15-Minute Slot Offer for ${activeSlotOffer.resourceName}`, undefined, `Passing to next waiting user`);
    
    // Check if there is next user in queue
    const queue = queues.find(q => q.resourceId === activeSlotOffer.resourceId);
    let nextOffer: any = null;
    if (queue) {
      nextOffer = queue.offerSlotToNextUser();
      if (nextOffer) {
        setActiveSlotOffer({
          entryId: nextOffer.entryId,
          resourceId: activeSlotOffer.resourceId,
          expiresAt: nextOffer.offerExpiresAt!,
          resourceName: activeSlotOffer.resourceName,
        });
        showToast({
          type: 'warning',
          title: 'Offer Passed to Next Waiter',
          description: `Previous offer lapsed. Slot offer sent to User #${nextOffer.position} in queue.`,
        });
        return;
      }
    }

    setActiveSlotOffer(null);
    showToast({
      type: 'info',
      title: 'Slot Offer Closed',
      description: 'The waitlist offer has ended.',
    });
  }, [activeSlotOffer, queues, logAudit, showToast]);

  // FR-10 & UC-04: Lab Equipment Statechart, Inspection, Maintenance & Calibration
  const inspectAndReturnEquipment = useCallback(
    (
      equipmentId: string,
      bookingId: string,
      condition: 'Good' | 'Damaged',
      damageNotes?: string
    ) => {
      const item = resources.find(r => r.resourceId === equipmentId);
      if (!item || !(item instanceof LabEquipment)) return;

      const booking = bookings.find(b => b.bookingId === bookingId);
      if (booking) {
        booking.changeStatus('Completed', currentUser.userId, `Returned in condition: ${condition}`);
      }

      if (condition === 'Good') {
        item.setStatus('Available');
        logAudit(
          `Technician Inspected & Returned ${item.name} in Good Order`,
          bookingId,
          `Equipment status updated to Available.`
        );
        showToast({
          type: 'success',
          title: 'Equipment Returned in Good Order',
          description: `${item.name} returned to inventory and is ready for booking.`,
        });
      } else {
        const damageLog = item.recordDamage(damageNotes || 'Physical damage identified during post-loan inspection', currentUser.fullName);
        logAudit(
          `«extend» Log Equipment Damage on ${item.name}`,
          bookingId,
          `Damage details: ${damageNotes} | Status transitioned to UnderMaintenance`
        );
        showToast({
          type: 'error',
          title: 'Damage Logged - Item Moved to Maintenance',
          description: `${item.name} transitioned to UnderMaintenance. Facility Manager alerted for damage assessment.`,
          duration: 7000,
        });
      }

      setResources(prev => [...prev]);
      setBookings(prev => [...prev]);
    },
    [resources, bookings, currentUser, logAudit, showToast]
  );

  const simulateCalibrationExpiry = useCallback(
    (equipmentId: string) => {
      const item = resources.find(r => r.resourceId === equipmentId);
      if (!item || !(item instanceof LabEquipment)) return;

      item.setCalibrationState('CalibrationDue', '2026-10-31');
      setResources(prev => [...prev]);

      logAudit(`Simulated Calibration Expiry on ${item.name}`, undefined, `Status set to CalibrationDue. Bookings blocked.`);
      showToast({
        type: 'warning',
        title: 'Calibration Expired',
        description: `${item.name} calibration has lapsed. Bookings are now blocked until re-calibrated.`,
      });
    },
    [resources, logAudit, showToast]
  );

  const recordNewCalibration = useCallback(
    (equipmentId: string, nextCalDate: string, notes: string) => {
      const item = resources.find(r => r.resourceId === equipmentId);
      if (!item || !(item instanceof LabEquipment)) return;

      item.recordMaintenance(`Certified NIST Calibration: ${notes}`, nextCalDate);
      setResources(prev => [...prev]);

      logAudit(
        `Recorded Calibration for ${item.name}`,
        undefined,
        `Next Calibration Date: ${nextCalDate} | Status restored to Available`
      );

      showToast({
        type: 'success',
        title: 'Calibration & Maintenance Recorded',
        description: `${item.name} certification valid until ${nextCalDate}. Equipment Available.`,
      });
    },
    [resources, logAudit, showToast]
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        users,
        setActiveRole,
        setCurrentUserById,
        sessionTimeLeft,
        resetSessionTimer,
        isAuthModalOpen,
        setIsAuthModalOpen,
        resources,
        bookings,
        fines,
        queues,
        auditLogs,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isDarkMode,
        toggleDarkMode,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isCookieAccepted,
        setIsCookieAccepted,
        bookingTargetResource,
        setBookingTargetResource,
        printFineBooking,
        setPrintFineBooking,
        toasts,
        showToast,
        dismissToast,
        createBooking,
        cancelBooking,
        approveBooking,
        rejectBooking,
        completeBooking,
        markBookingOverdue,
        addResource,
        updateResource,
        retireResource,
        joinQueue,
        activeSlotOffer,
        acceptSlotOffer,
        declineOrExpireSlotOffer,
        inspectAndReturnEquipment,
        simulateCalibrationExpiry,
        recordNewCalibration,
        assessDamageFine,
        settleFine,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
