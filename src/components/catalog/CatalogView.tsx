import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Resource,
  ResourceType,
  ResourceStatus,
  LectureHall,
  LabEquipment,
  StudyRoom,
  EventGrounds
} from '../../domain/models';
import {
  Search,
  Filter,
  Plus,
  Users,
  MapPin,
  Clock,
  Sparkles,
  Archive,
  Calendar,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Shield,
  Layers,
  ChevronDown
} from 'lucide-react';
import { formatNaira } from '../../lib/utils';

export const CatalogView: React.FC = () => {
  const {
    resources,
    activeRole,
    setBookingTargetResource,
    retireResource,
    addResource,
    searchQuery,
    setSearchQuery,
    showToast
  } = useApp();

  // Filters
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [showRetired, setShowRetired] = useState<boolean>(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState<boolean>(false);

  // Add Resource Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newType, setNewType] = useState<ResourceType>('LectureHall');
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCapacity, setNewCapacity] = useState(150);
  const [newReplacementValue, setNewReplacementValue] = useState(5000000);
  const [newMaxHours, setNewMaxHours] = useState(3);
  const [newArea, setNewArea] = useState(2500);

  // Simulate Doherty threshold (<400ms) structured skeleton shimmer on category switch
  const handleTypeChange = (type: string) => {
    setIsLoadingSkeleton(true);
    setSelectedType(type);
    setTimeout(() => {
      setIsLoadingSkeleton(false);
    }, 350);
  };

  // Distinct locations for filter dropdown
  const locations = useMemo(() => {
    const locs = Array.from(new Set(resources.map(r => r.location.split(',')[0].trim())));
    return ['All', ...locs];
  }, [resources]);

  // Real-time filtering (<150ms)
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      // Soft-delete filter: Hide retired items unless explicitly toggled (e.g. by Facility Manager for audit)
      if (!showRetired && res.status === 'Retired') {
        return false;
      }

      // Type filter
      if (selectedType !== 'All' && res.type !== selectedType) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && res.status !== selectedStatus) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All' && !res.location.includes(selectedLocation)) {
        return false;
      }

      // Capacity filter (for lecture halls)
      if (minCapacity > 0) {
        if (res instanceof LectureHall && res.seatingCapacity < minCapacity) {
          return false;
        }
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = res.name.toLowerCase().includes(query);
        const matchesId = res.resourceId.toLowerCase().includes(query);
        const matchesLoc = res.location.toLowerCase().includes(query);
        const matchesType = res.type.toLowerCase().includes(query);
        return matchesName || matchesId || matchesLoc || matchesType;
      }

      return true;
    });
  }, [resources, showRetired, selectedType, selectedStatus, selectedLocation, minCapacity, searchQuery]);

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    const idPrefix = newType === 'LectureHall' ? 'LH' : newType === 'LabEquipment' ? 'EQ' : newType === 'StudyRoom' ? 'SR' : 'EG';
    const resourceId = `${idPrefix}-${Math.floor(100 + Math.random() * 900)}`;

    let created: Resource;
    const defaultImg =
      newType === 'LectureHall'
        ? 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80'
        : newType === 'LabEquipment'
        ? 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
        : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';

    if (newType === 'LectureHall') {
      created = new LectureHall(
        resourceId,
        newName,
        newLocation,
        'Available',
        defaultImg,
        'L48qE4_300IU~q-;IU%M00_300Rj',
        Number(newCapacity),
        ['Smart Digital Podium', 'Air Conditioning', 'PA System']
      );
    } else if (newType === 'LabEquipment') {
      created = new LabEquipment(
        resourceId,
        newName,
        newLocation,
        'Available',
        defaultImg,
        'L38w-T~q00%M00IU00IU00_300D%',
        'Valid',
        '2027-10-31',
        Number(newReplacementValue)
      );
    } else if (newType === 'StudyRoom') {
      created = new StudyRoom(
        resourceId,
        newName,
        newLocation,
        'Available',
        defaultImg,
        'L5A9k.~q00%M00IU~q_300D%00_3',
        Number(newMaxHours)
      );
    } else {
      created = new EventGrounds(
        resourceId,
        newName,
        newLocation,
        'Available',
        defaultImg,
        'L69@K%00~qIU00%M00_300M{00IU',
        Number(newArea),
        true
      );
    }

    addResource(created);
    setIsAddModalOpen(false);
    // Reset form
    setNewName('');
    setNewLocation('');
  };

  const getStatusBadge = (status: ResourceStatus) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-subtle dark:bg-emerald-subtle-dark text-emerald dark:text-emerald-light border border-emerald/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            Available
          </span>
        );
      case 'Reserved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-subtle dark:bg-amber-subtle-dark text-amber dark:text-amber-light border border-amber/20">
            Reserved
          </span>
        );
      case 'OnLoan':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            On Loan
          </span>
        );
      case 'CalibrationDue':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-subtle dark:bg-amber-subtle-dark text-amber dark:text-amber-light border border-amber/30">
            Calibration Due
          </span>
        );
      case 'UnderMaintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            Under Maintenance
          </span>
        );
      case 'Retired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-crimson-subtle dark:bg-crimson-subtle-dark text-crimson dark:text-crimson-light border border-crimson/20">
            Retired (Soft-Deleted)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner & Sync Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Campus Resource Catalog
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-oxford/10 dark:bg-slate-800 text-oxford dark:text-slate-300">
              FR-02 &bull; FR-03 &bull; FR-04
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, check slot availability, or reserve lecture theatres, analytical laboratories, and research study pods.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald" />
            <span>Catalog & Availability Synced: Just now (Nov 2026)</span>
          </div>

          {/* Add Resource Button (Facility Manager only) */}
          {activeRole === 'FacilityManager' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-oxford text-white dark:bg-emerald text-xs font-semibold hover:opacity-95 transition-opacity shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource (FR-02)</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Instant Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        {/* Subclass Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-2">
            Subclass:
          </span>
          {[
            { id: 'All', label: 'All Resources' },
            { id: 'LectureHall', label: 'Lecture Halls' },
            { id: 'LabEquipment', label: 'Lab Equipment' },
            { id: 'StudyRoom', label: 'Study Rooms' },
            { id: 'EventGrounds', label: 'Event Grounds' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTypeChange(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedType === tab.id
                  ? 'bg-oxford text-white dark:bg-emerald dark:text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Detailed Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Keyword Search */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Search by Keyword / ID
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. UV-Vis, SST, Pod B2..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-oxford dark:focus:ring-emerald"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Status State
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Reserved">Reserved</option>
              <option value="OnLoan">On Loan</option>
              <option value="CalibrationDue">Calibration Due</option>
              <option value="UnderMaintenance">Under Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Campus Location
            </label>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Capacity Slider / Toggle */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
              <span>Min Seating Capacity</span>
              <span className="font-mono">{minCapacity > 0 ? `${minCapacity}+ seats` : 'Any'}</span>
            </div>
            <input
              type="range"
              min={0}
              max={400}
              step={25}
              value={minCapacity}
              onChange={e => setMinCapacity(Number(e.target.value))}
              className="w-full accent-oxford dark:accent-emerald cursor-pointer"
            />
          </div>
        </div>

        {/* Facility Manager Toggle: Show Retired */}
        {activeRole === 'FacilityManager' && (
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showRetired}
                onChange={e => setShowRetired(e.target.checked)}
                className="rounded border-slate-300 text-oxford focus:ring-oxford dark:focus:ring-emerald"
              />
              <span className="font-medium">Show Soft-Deleted (Retired) Resources in Search</span>
            </label>
            <span className="text-[11px] text-slate-400">
              Retired items remain visible for historical audit and bursary records.
            </span>
          </div>
        )}
      </div>

      {/* 3. Resource Grid */}
      {isLoadingSkeleton ? (
        // Non-looping skeleton shimmer for 350ms
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="h-44 rounded-xl animate-shimmer" />
              <div className="h-4 w-3/4 rounded animate-shimmer" />
              <div className="h-3 w-1/2 rounded animate-shimmer" />
              <div className="h-8 rounded-xl animate-shimmer" />
            </div>
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
          <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No matching campus resources found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Try resetting your search query, adjusting minimum capacity, or clearing status filters.
          </p>
          <button
            onClick={() => {
              setSelectedType('All');
              setSelectedStatus('All');
              setSelectedLocation('All');
              setMinCapacity(0);
              setSearchQuery('');
            }}
            className="mt-4 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-200"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map(resource => {
            const isLectureHall = resource instanceof LectureHall;
            const isLabEquipment = resource instanceof LabEquipment;
            const isStudyRoom = resource instanceof StudyRoom;
            const isEventGrounds = resource instanceof EventGrounds;

            const isBookable =
              resource.status === 'Available' || resource.status === 'Reserved';

            return (
              /* Concentric corner outer container R_outer = R_inner + P */
              <div
                key={resource.resourceId}
                className="group rounded-2xl p-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Photo with BlurHash / CSS blurred low-res placeholder */}
                  <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={resource.imageUrl}
                      alt={resource.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Top Floating Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-md">
                        {resource.type}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      {getStatusBadge(resource.status)}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-oxford dark:group-hover:text-emerald-light transition-colors line-clamp-1">
                        {resource.name}
                      </h3>
                      <span className="font-mono text-[10px] text-slate-400 shrink-0">
                        {resource.resourceId}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>{resource.location}</span>
                    </p>

                    {/* Subclass-specific Key Attributes */}
                    <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      {isLectureHall && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Users className="w-3.5 h-3.5" /> Seating Capacity:
                          </span>
                          <span className="font-semibold font-mono tabular-nums">
                            {(resource as LectureHall).seatingCapacity} seats
                          </span>
                        </div>
                      )}

                      {isLabEquipment && (
                        <>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">Replacement Value:</span>
                            <span className="font-semibold font-mono tabular-nums text-slate-900 dark:text-white">
                              {formatNaira((resource as LabEquipment).replacementValue)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">Calibration State:</span>
                            <span
                              className={`font-semibold font-mono ${
                                (resource as LabEquipment).calibrationState === 'Valid'
                                  ? 'text-emerald'
                                  : 'text-amber'
                              }`}
                            >
                              {(resource as LabEquipment).calibrationState}
                            </span>
                          </div>
                        </>
                      )}

                      {isStudyRoom && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3.5 h-3.5" /> Max Session Limit:
                          </span>
                          <span className="font-semibold font-mono tabular-nums">
                            {(resource as StudyRoom).maxConsecutiveHours} hours max
                          </span>
                        </div>
                      )}

                      {isEventGrounds && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Ground Area:</span>
                          <span className="font-semibold font-mono tabular-nums">
                            {(resource as EventGrounds).groundAreaSqMeters.toLocaleString()} m²
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Polymorphic Fine Rule Hint */}
                    <div className="mt-2 py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                      <span className="font-semibold">Overdue Rule:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 truncate ml-2">
                        {resource.getFineFormulaDescription()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  {/* Facility Manager: Retire (Soft-Delete) button */}
                  {activeRole === 'FacilityManager' && resource.status !== 'Retired' && (
                    <button
                      onClick={() => retireResource(resource.resourceId)}
                      className="p-2 rounded-lg text-slate-400 hover:text-crimson hover:bg-crimson/10 transition-colors"
                      title="Retire (Soft-Delete) Resource from Bookable Catalog"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  )}

                  {/* Primary Book Action */}
                  <div className="flex-1 flex justify-end">
                    {resource.status === 'Retired' ? (
                      <span className="text-xs text-crimson font-medium">Resource Retired</span>
                    ) : resource.status === 'UnderMaintenance' || resource.status === 'CalibrationDue' ? (
                      <button
                        onClick={() => setBookingTargetResource(resource)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 transition-colors text-center"
                      >
                        Check Maintenance Details
                      </button>
                    ) : (
                      <button
                        onClick={() => setBookingTargetResource(resource)}
                        className="w-full py-2 px-3 rounded-xl bg-oxford text-white dark:bg-emerald dark:text-white text-xs font-semibold hover:opacity-90 transition-opacity text-center shadow-sm"
                      >
                        Book Resource
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Add Resource Modal (Facility Manager Only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in no-print">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Add New Resource (FR-02)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Instantiate a new concrete subclass of abstract <code className="font-mono text-oxford">Resource</code>.
            </p>

            <form onSubmit={handleCreateResource} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Resource Subclass</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as ResourceType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                >
                  <option value="LectureHall">LectureHall (₦2,000/hr fine)</option>
                  <option value="LabEquipment">LabEquipment (₦1,500/day fine, replacement capped)</option>
                  <option value="StudyRoom">StudyRoom (Tiered fine ₦500/hr then ₦1,000/hr)</option>
                  <option value="EventGrounds">EventGrounds (₦5,000/hr flat fine)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Resource Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SST Lecture Theatre 3"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Campus Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. School of Science and Technology, Level 2"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Subclass-specific fields */}
              {newType === 'LectureHall' && (
                <div>
                  <label className="block font-semibold mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    required
                    value={newCapacity}
                    onChange={e => setNewCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              )}

              {newType === 'LabEquipment' && (
                <div>
                  <label className="block font-semibold mb-1">Replacement Value (₦)</label>
                  <input
                    type="number"
                    min={100000}
                    required
                    value={newReplacementValue}
                    onChange={e => setNewReplacementValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              )}

              {newType === 'StudyRoom' && (
                <div>
                  <label className="block font-semibold mb-1">Max Consecutive Hours</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={newMaxHours}
                    onChange={e => setNewMaxHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-oxford text-white dark:bg-emerald font-semibold hover:opacity-90"
                >
                  Create & Register Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
