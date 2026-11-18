// CampusHub: Smart Campus Facility & Resource Management System (Pan-Atlantic University)
// Domain Models implementing Object-Oriented Analysis & Design (OOAD) Principles

export type Role = 'Student' | 'Lecturer' | 'LabTechnician' | 'FacilityManager';

export type ResourceStatus = 
  | 'Available' 
  | 'Reserved' 
  | 'OnLoan' 
  | 'CalibrationDue' 
  | 'UnderMaintenance' 
  | 'Retired';

export type BookingStatus = 
  | 'Requested' 
  | 'Approved' 
  | 'Active' 
  | 'Completed' 
  | 'Cancelled' 
  | 'Overdue';

export type FineType = 'Overdue' | 'Damage';

export type ResourceType = 'LectureHall' | 'LabEquipment' | 'StudyRoom' | 'EventGrounds';

// ==========================================
// 1. ABSTRACT BASE CLASS: Resource
// ==========================================
export abstract class Resource {
  protected _resourceId: string;
  protected _name: string;
  protected _location: string;
  protected _status: ResourceStatus;
  protected _imageUrl: string;
  protected _blurHash: string;
  protected _type: ResourceType;

  constructor(
    resourceId: string,
    name: string,
    location: string,
    status: ResourceStatus,
    imageUrl: string,
    blurHash: string,
    type: ResourceType
  ) {
    this._resourceId = resourceId;
    this._name = name;
    this._location = location;
    this._status = status;
    this._imageUrl = imageUrl;
    this._blurHash = blurHash;
    this._type = type;
  }

  // Getters & Encapsulation
  public get resourceId(): string { return this._resourceId; }
  public get name(): string { return this._name; }
  public get location(): string { return this._location; }
  public get status(): ResourceStatus { return this._status; }
  public get imageUrl(): string { return this._imageUrl; }
  public get blurHash(): string { return this._blurHash; }
  public get type(): ResourceType { return this._type; }

  public setStatus(newStatus: ResourceStatus): void {
    this._status = newStatus;
  }

  /**
   * Check if resource is available for the given timeframe considering existing bookings
   */
  public checkAvailability(start: Date, end: Date, existingBookings: Booking[]): boolean {
    if (this._status === 'Retired' || this._status === 'UnderMaintenance' || this._status === 'CalibrationDue') {
      return false;
    }

    const startMs = start.getTime();
    const endMs = end.getTime();

    for (const b of existingBookings) {
      if (b.resourceId === this._resourceId && (b.status === 'Approved' || b.status === 'Active')) {
        const bStartMs = new Date(b.startDateTime).getTime();
        const bEndMs = new Date(b.endDateTime).getTime();

        // Check for time overlap
        if (startMs < bEndMs && endMs > bStartMs) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Polymorphic abstract fine calculation method
   * Must be overridden by concrete subclasses
   */
  public abstract calculateFine(durationHours: number): number;
  public abstract getFineFormulaDescription(): string;
}

// ==========================================
// 2. CONCRETE SUBCLASSES (Polymorphism & Inheritance)
// ==========================================

export class LectureHall extends Resource {
  private _seatingCapacity: number;
  private _avFacilities: string[];

  constructor(
    resourceId: string,
    name: string,
    location: string,
    status: ResourceStatus,
    imageUrl: string,
    blurHash: string,
    seatingCapacity: number,
    avFacilities: string[]
  ) {
    super(resourceId, name, location, status, imageUrl, blurHash, 'LectureHall');
    this._seatingCapacity = seatingCapacity;
    this._avFacilities = avFacilities;
  }

  public get seatingCapacity(): number { return this._seatingCapacity; }
  public get avFacilities(): string[] { return [...this._avFacilities]; }

  /**
   * LectureHall fine policy: ₦2,000 per overdue hour (rounded up)
   */
  public calculateFine(durationHours: number): number {
    if (durationHours <= 0) return 0;
    return 2000 * Math.ceil(durationHours);
  }

  public getFineFormulaDescription(): string {
    return '₦2,000 × ⌈overdue_hours⌉ (₦2,000 per started hour)';
  }
}

export class LabEquipment extends Resource {
  private _calibrationState: 'Valid' | 'CalibrationDue';
  private _nextCalibrationDate: string;
  private _replacementValue: number;
  private _maintenanceHistory: MaintenanceLog[];

  constructor(
    resourceId: string,
    name: string,
    location: string,
    status: ResourceStatus,
    imageUrl: string,
    blurHash: string,
    calibrationState: 'Valid' | 'CalibrationDue',
    nextCalibrationDate: string,
    replacementValue: number,
    maintenanceHistory: MaintenanceLog[] = []
  ) {
    super(resourceId, name, location, status, imageUrl, blurHash, 'LabEquipment');
    this._calibrationState = calibrationState;
    this._nextCalibrationDate = nextCalibrationDate;
    this._replacementValue = replacementValue;
    this._maintenanceHistory = maintenanceHistory;
  }

  public get calibrationState(): 'Valid' | 'CalibrationDue' { return this._calibrationState; }
  public get nextCalibrationDate(): string { return this._nextCalibrationDate; }
  public get replacementValue(): number { return this._replacementValue; }
  public get maintenanceHistory(): MaintenanceLog[] { return [...this._maintenanceHistory]; }

  public setCalibrationState(state: 'Valid' | 'CalibrationDue', nextCalDate?: string): void {
    this._calibrationState = state;
    if (nextCalDate) this._nextCalibrationDate = nextCalDate;
    if (state === 'CalibrationDue' && this._status === 'Available') {
      this._status = 'CalibrationDue';
    } else if (state === 'Valid' && this._status === 'CalibrationDue') {
      this._status = 'Available';
    }
  }

  /**
   * LabEquipment fine policy: ₦1,500 per started overdue day (hours rounded up to whole days), capped at item replacement value
   */
  public calculateFine(durationHours: number): number {
    if (durationHours <= 0) return 0;
    const startedDays = Math.ceil(durationHours / 24);
    const calculatedFine = 1500 * startedDays;
    return Math.min(calculatedFine, this._replacementValue);
  }

  public getFineFormulaDescription(): string {
    return 'min(₦1,500 × ⌈overdue_hours / 24⌉, Replacement_Value) (capped at ₦' + this._replacementValue.toLocaleString() + ')';
  }

  public recordDamage(details: string, techName: string): MaintenanceLog {
    const log = new MaintenanceLog(
      `LOG-${Date.now().toString().slice(-6)}`,
      this._resourceId,
      `Damage Reported: ${details} (Inspected by ${techName})`,
      new Date().toISOString(),
      undefined,
      details
    );
    this._maintenanceHistory.push(log);
    this._status = 'UnderMaintenance';
    return log;
  }

  public recordMaintenance(activity: string, nextCalDate?: string): MaintenanceLog {
    const log = new MaintenanceLog(
      `LOG-${Date.now().toString().slice(-6)}`,
      this._resourceId,
      activity,
      new Date().toISOString(),
      nextCalDate
    );
    this._maintenanceHistory.push(log);
    if (nextCalDate) {
      this._nextCalibrationDate = nextCalDate;
      this._calibrationState = 'Valid';
    }
    this._status = 'Available';
    return log;
  }
}

export class StudyRoom extends Resource {
  private _maxConsecutiveHours: number;

  constructor(
    resourceId: string,
    name: string,
    location: string,
    status: ResourceStatus,
    imageUrl: string,
    blurHash: string,
    maxConsecutiveHours: number = 3
  ) {
    super(resourceId, name, location, status, imageUrl, blurHash, 'StudyRoom');
    this._maxConsecutiveHours = maxConsecutiveHours;
  }

  public get maxConsecutiveHours(): number { return this._maxConsecutiveHours; }

  /**
   * StudyRoom fine policy: First 2 overdue hours at ₦500/hr; each subsequent overdue hour at ₦1,000/hr
   */
  public calculateFine(durationHours: number): number {
    if (durationHours <= 0) return 0;
    const hours = Math.ceil(durationHours);
    if (hours <= 2) {
      return hours * 500;
    }
    return (2 * 500) + ((hours - 2) * 1000);
  }

  public getFineFormulaDescription(): string {
    return 'hours ≤ 2 ? hours × ₦500 : ₦1,000 + (hours - 2) × ₦1,000';
  }
}

export class EventGrounds extends Resource {
  private _groundAreaSqMeters: number;
  private _hasCoveredPavilion: boolean;

  constructor(
    resourceId: string,
    name: string,
    location: string,
    status: ResourceStatus,
    imageUrl: string,
    blurHash: string,
    groundAreaSqMeters: number,
    hasCoveredPavilion: boolean
  ) {
    super(resourceId, name, location, status, imageUrl, blurHash, 'EventGrounds');
    this._groundAreaSqMeters = groundAreaSqMeters;
    this._hasCoveredPavilion = hasCoveredPavilion;
  }

  public get groundAreaSqMeters(): number { return this._groundAreaSqMeters; }
  public get hasCoveredPavilion(): boolean { return this._hasCoveredPavilion; }

  /**
   * EventGrounds fine policy: Flat ₦5,000 per started overdue hour
   */
  public calculateFine(durationHours: number): number {
    if (durationHours <= 0) return 0;
    return 5000 * Math.ceil(durationHours);
  }

  public getFineFormulaDescription(): string {
    return '₦5,000 × ⌈overdue_hours⌉ (₦5,000 per started hour for campus outdoor grounds)';
  }
}

// ==========================================
// 3. SUPPORTING DOMAIN CLASSES
// ==========================================

export class User {
  private _userId: string;
  private _fullName: string;
  private _universityEmail: string;
  private _phone: string;
  private _role: Role;

  constructor(
    userId: string,
    fullName: string,
    universityEmail: string,
    phone: string,
    role: Role
  ) {
    this._userId = userId;
    this._fullName = fullName;
    this._universityEmail = universityEmail;
    this._phone = phone;
    this._role = role;
  }

  public get userId(): string { return this._userId; }
  public get fullName(): string { return this._fullName; }
  public get universityEmail(): string { return this._universityEmail; }
  public get phone(): string { return this._phone; }
  public get role(): Role { return this._role; }

  public signIn(): boolean {
    return true;
  }
}

export class Booking {
  private _bookingId: string;
  private _resourceId: string;
  private _requesterId: string;
  private _supervisingLecturerId?: string;
  private _startDateTime: string;
  private _endDateTime: string;
  private _status: BookingStatus;
  private _purpose: string;
  private _decisionMakerId?: string;
  private _decisionReason?: string;
  private _decisionDateTime?: string;
  private _idempotencyKey: string;

  constructor(
    bookingId: string,
    resourceId: string,
    requesterId: string,
    startDateTime: string,
    endDateTime: string,
    status: BookingStatus,
    purpose: string = 'Academic Study & Research',
    supervisingLecturerId?: string,
    decisionMakerId?: string,
    decisionReason?: string,
    decisionDateTime?: string,
    idempotencyKey?: string
  ) {
    this._bookingId = bookingId;
    this._resourceId = resourceId;
    this._requesterId = requesterId;
    this._startDateTime = startDateTime;
    this._endDateTime = endDateTime;
    this._status = status;
    this._purpose = purpose;
    this._supervisingLecturerId = supervisingLecturerId;
    this._decisionMakerId = decisionMakerId;
    this._decisionReason = decisionReason;
    this._decisionDateTime = decisionDateTime;
    this._idempotencyKey = idempotencyKey || `idem_${Math.random().toString(36).substring(2, 10)}`;
  }

  public get bookingId(): string { return this._bookingId; }
  public get resourceId(): string { return this._resourceId; }
  public get requesterId(): string { return this._requesterId; }
  public get supervisingLecturerId(): string | undefined { return this._supervisingLecturerId; }
  public get startDateTime(): string { return this._startDateTime; }
  public get endDateTime(): string { return this._endDateTime; }
  public get status(): BookingStatus { return this._status; }
  public get purpose(): string { return this._purpose; }
  public get decisionMakerId(): string | undefined { return this._decisionMakerId; }
  public get decisionReason(): string | undefined { return this._decisionReason; }
  public get decisionDateTime(): string | undefined { return this._decisionDateTime; }
  public get idempotencyKey(): string { return this._idempotencyKey; }

  public submit(): void {
    this._status = 'Requested';
  }

  public cancel(reason?: string): void {
    if (this._status === 'Active' || this._status === 'Completed') {
      throw new Error(`Cannot cancel a booking that is currently ${this._status}`);
    }
    this._status = 'Cancelled';
    if (reason) this._decisionReason = reason;
    this._decisionDateTime = new Date().toISOString();
  }

  public changeStatus(newStatus: BookingStatus, actorId?: string, reason?: string): void {
    // Validate State Machine Transitions
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      Requested: ['Approved', 'Cancelled'],
      Approved: ['Active', 'Cancelled'],
      Active: ['Completed', 'Overdue', 'Cancelled'],
      Overdue: ['Completed'],
      Completed: [],
      Cancelled: [],
    };

    if (!validTransitions[this._status].includes(newStatus)) {
      throw new Error(`Illegal state transition from ${this._status} to ${newStatus}`);
    }

    this._status = newStatus;
    if (actorId) this._decisionMakerId = actorId;
    if (reason) this._decisionReason = reason;
    this._decisionDateTime = new Date().toISOString();
  }
}

export class Fine {
  private _fineId: string;
  private _bookingId: string;
  private _amount: number;
  private _overdueHours: number;
  private _fineType: FineType;
  private _assessedAt: string;
  private _status: 'PendingBursaryPayment' | 'Settled' | 'Waived';
  private _notes?: string;

  constructor(
    fineId: string,
    bookingId: string,
    amount: number,
    overdueHours: number,
    fineType: FineType,
    assessedAt: string = new Date().toISOString(),
    status: 'PendingBursaryPayment' | 'Settled' | 'Waived' = 'PendingBursaryPayment',
    notes?: string
  ) {
    this._fineId = fineId;
    this._bookingId = bookingId;
    this._amount = amount;
    this._overdueHours = overdueHours;
    this._fineType = fineType;
    this._assessedAt = assessedAt;
    this._status = status;
    this._notes = notes;
  }

  public get fineId(): string { return this._fineId; }
  public get bookingId(): string { return this._bookingId; }
  public get amount(): number { return this._amount; }
  public get overdueHours(): number { return this._overdueHours; }
  public get fineType(): FineType { return this._fineType; }
  public get assessedAt(): string { return this._assessedAt; }
  public get status(): 'PendingBursaryPayment' | 'Settled' | 'Waived' { return this._status; }
  public get notes(): string | undefined { return this._notes; }

  public calculateAmount(resource: Resource, overdueHours: number): number {
    this._overdueHours = overdueHours;
    this._amount = resource.calculateFine(overdueHours);
    return this._amount;
  }

  public settle(): void {
    this._status = 'Settled';
  }
}

export interface QueueEntryData {
  entryId: string;
  userId: string;
  position: number;
  requestedStart: string;
  requestedEnd: string;
  offerExpiresAt?: number; // timestamp in ms
  status: 'Waiting' | 'Offered' | 'Accepted' | 'Expired';
}

export class ReservationQueue {
  private _queueId: string;
  private _resourceId: string;
  private _entries: QueueEntryData[];

  constructor(queueId: string, resourceId: string, entries: QueueEntryData[] = []) {
    this._queueId = queueId;
    this._resourceId = resourceId;
    this._entries = entries;
  }

  public get queueId(): string { return this._queueId; }
  public get resourceId(): string { return this._resourceId; }
  public get entries(): QueueEntryData[] { return [...this._entries]; }

  public addUser(userId: string, start: string, end: string): QueueEntryData {
    const nextPos = this._entries.filter(e => e.status === 'Waiting' || e.status === 'Offered').length + 1;
    const entry: QueueEntryData = {
      entryId: `QE-${Date.now().toString().slice(-5)}`,
      userId,
      position: nextPos,
      requestedStart: start,
      requestedEnd: end,
      status: 'Waiting',
    };
    this._entries.push(entry);
    return entry;
  }

  /**
   * Offer slot to the next waiting user with 15-minute countdown (UC-03)
   */
  public offerSlotToNextUser(): QueueEntryData | null {
    const nextWaiting = this._entries.find(e => e.status === 'Waiting');
    if (!nextWaiting) return null;

    nextWaiting.status = 'Offered';
    // 15-minute offer expiry timestamp
    nextWaiting.offerExpiresAt = Date.now() + (15 * 60 * 1000);
    return nextWaiting;
  }
}

export class MaintenanceLog {
  private _logId: string;
  private _equipmentId: string;
  private _activity: string;
  private _maintenanceDate: string;
  private _calibrationDate?: string;
  private _damageDetails?: string;

  constructor(
    logId: string,
    equipmentId: string,
    activity: string,
    maintenanceDate: string = new Date().toISOString(),
    calibrationDate?: string,
    damageDetails?: string
  ) {
    this._logId = logId;
    this._equipmentId = equipmentId;
    this._activity = activity;
    this._maintenanceDate = maintenanceDate;
    this._calibrationDate = calibrationDate;
    this._damageDetails = damageDetails;
  }

  public get logId(): string { return this._logId; }
  public get equipmentId(): string { return this._equipmentId; }
  public get activity(): string { return this._activity; }
  public get maintenanceDate(): string { return this._maintenanceDate; }
  public get calibrationDate(): string | undefined { return this._calibrationDate; }
  public get damageDetails(): string | undefined { return this._damageDetails; }

  public recordActivity(activity: string): void {
    this._activity = activity;
    this._maintenanceDate = new Date().toISOString();
  }
}

export class AuditLog {
  private _auditId: string;
  private _userId: string;
  private _action: string;
  private _timestamp: string;
  private _bookingId?: string;
  private _details?: string;

  constructor(
    auditId: string,
    userId: string,
    action: string,
    timestamp: string = new Date().toISOString(),
    bookingId?: string,
    details?: string
  ) {
    this._auditId = auditId;
    this._userId = userId;
    this._action = action;
    this._timestamp = timestamp;
    this._bookingId = bookingId;
    this._details = details;
  }

  public get auditId(): string { return this._auditId; }
  public get userId(): string { return this._userId; }
  public get action(): string { return this._action; }
  public get timestamp(): string { return this._timestamp; }
  public get bookingId(): string | undefined { return this._bookingId; }
  public get details(): string | undefined { return this._details; }

  public static recordEvent(
    userId: string,
    action: string,
    bookingId?: string,
    details?: string
  ): AuditLog {
    return new AuditLog(
      `AUD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
      userId,
      action,
      new Date().toISOString(),
      bookingId,
      details
    );
  }
}
