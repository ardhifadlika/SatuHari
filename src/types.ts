/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Workspace {
  id: string;
  isDemo: boolean;
  partnerAName: string;
  partnerBName: string;
  weddingDate: string;
  city: string;
  estimatedGuests: number;
  estimatedBudget: number;
  inviteStatus: 'PENDING' | 'ACCEPTED';
  inviteMethod: 'WHATSAPP' | 'EMAIL' | 'LINK' | null;
  createdAt: string;
}

export type TaskOwner = 'PARTNER_A' | 'PARTNER_B' | 'TOGETHER';
export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description: string;
  owner: TaskOwner;
  dueDate: string;
  status: TaskStatus;
  isDeleted: boolean;
  deletedAt: string | null;
  isArchived: boolean;
  attachmentUrl: string | null;
  attachmentName: string | null;
}

export type BudgetCategory = 
  | 'Venue' 
  | 'Catering' 
  | 'Decoration' 
  | 'WO' 
  | 'Documentation' 
  | 'MUA' 
  | 'Attire' 
  | 'Entertainment' 
  | 'Invitation' 
  | 'Souvenir' 
  | 'Transportation' 
  | 'Miscellaneous';

export type BudgetContributor = 'Couple' | 'Bride Family' | 'Groom Family' | 'Other';
export type PaymentStatus = 'Not Paid' | 'DP Paid' | 'Partially Paid' | 'Paid Off';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  vendor: string;
  budgetAmount: number;
  actualCost: number;
  paidAmount: number;
  dueDate: string;
  contributor: BudgetContributor;
  paymentStatus: PaymentStatus;
  notes: string;
  attachmentUrl: string | null;
  attachmentName: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  isArchived: boolean;
}

export type VendorCategory = 
  | 'Venue' 
  | 'Wedding Organizer' 
  | 'Decoration' 
  | 'Catering' 
  | 'Photography' 
  | 'Videography' 
  | 'MUA' 
  | 'Entertainment' 
  | 'Transportation';

export type VendorStatus = 'Researching' | 'Contacted' | 'Negotiating' | 'Booked' | 'Completed';

export interface VendorItem {
  id: string;
  name: string;
  category: VendorCategory;
  contactPerson: string;
  phoneNumber: string;
  quotation: {
    amount: number;
    status: 'Received' | 'None';
    attachmentUrl: string | null;
  };
  contract: {
    status: 'Received' | 'None';
    attachmentUrl: string | null;
  };
  paymentSchedule: string;
  notes: string;
  status: VendorStatus;
  isDeleted: boolean;
  deletedAt: string | null;
  isArchived: boolean;
}

export type GuestCategory = 'Family' | 'Friends' | 'Work' | 'Community' | 'Parents Relation';
export type GuestSide = 'Bride' | 'Groom' | 'Both';
export type RSVPStatus = 'Not Invited' | 'Invited' | 'Confirmed' | 'Declined' | 'Attended';

export interface GuestItem {
  id: string;
  name: string;
  category: GuestCategory;
  side: GuestSide;
  phoneNumber: string;
  address: string;
  pax: number;
  rsvpStatus: RSVPStatus;
  tableNumber: string;
  notes: string;
  isDeleted: boolean;
  deletedAt: string | null;
  isArchived: boolean;
}

export interface RundownItem {
  id: string;
  time: string; // HH:MM
  activity: string;
  personInCharge: string;
  location: string;
  vendorName: string;
  notes: string;
}

export type SeserahanCategory = 'Fashion' | 'Accessories' | 'Beauty' | 'Prayer Items' | 'Food' | 'Custom';

export interface SeserahanItem {
  id: string;
  itemName: string;
  category: SeserahanCategory;
  purchased: boolean;
  packed: boolean;
  delivered: boolean;
  notes: string;
  isDeleted: boolean;
  deletedAt: string | null;
  isArchived: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string; // e.g. "Ami" or "Ardhi"
  action: string; // e.g. "menambahkan 15 tamu"
  avatarStyle: string; // Tailwind bg class for consistent styling
}

export interface SharedAttachment {
  id: string;
  name: string;
  type: 'PDF' | 'Image' | 'Spreadsheet' | 'Document';
  area: 'Budget' | 'Vendor' | 'Checklist' | 'Rundown' | 'Seserahan';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}
