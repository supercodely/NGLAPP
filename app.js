// source/App.jsx
import React, { useState, useMemo, useRef as useRef3, useEffect } from "react";

// source/timeHelpers.js
var PLANT_UTC_OFFSET_HOURS = 2;
function plantHourDecimal(refDate) {
  const now = refDate || /* @__PURE__ */ new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 6e4;
  const plantMs = utcMs + PLANT_UTC_OFFSET_HOURS * 36e5;
  const plantDate = new Date(plantMs);
  return plantDate.getUTCHours() + plantDate.getUTCMinutes() / 60;
}
function inWindow(hour, start, end) {
  if (start === end) return true;
  if (start < end) return hour >= start && hour < end;
  return hour >= start || hour < end;
}
var DUTY_WINDOWS = {
  dayField: [6, 18],
  // مشرف/مشغّل النهار: 6ص - 6م
  nightField: [18, 6],
  // مشرف/مشغّل الليل: 6م - 6ص
  officeRoles: [7, 19]
  // Coordinator / Section Supervisor / Unit Supervisor: 7ص - 7م
};
var OFFICE_ROLES = ["Coordinator", "Section Supervisor", "Unit Supervisor"];
function isWithinDutyHours(person, operatorRoles, hourOverride) {
  if (!person) return false;
  const hour = hourOverride != null ? hourOverride : plantHourDecimal();
  if (OFFICE_ROLES.includes(person.role)) {
    return inWindow(hour, DUTY_WINDOWS.officeRoles[0], DUTY_WINDOWS.officeRoles[1]);
  }
  if (person.role === "Shift Supervisor" || (operatorRoles || []).includes(person.role)) {
    const [ds, de] = person.shift === "night" ? DUTY_WINDOWS.nightField : DUTY_WINDOWS.dayField;
    return inWindow(hour, ds, de);
  }
  return true;
}
function isNightGapWindow(hourOverride) {
  const hour = hourOverride != null ? hourOverride : plantHourDecimal();
  return inWindow(hour, 19, 7);
}

// source/App.jsx
import {
  Plus as Plus3,
  Trash2 as Trash23,
  Pencil as Pencil3,
  Lock as Lock2,
  Globe2 as Globe22,
  ListChecks as ListChecks2,
  MessageSquare as MessageSquare2,
  History as History2,
  ChevronDown as ChevronDown3,
  ChevronUp as ChevronUp5,
  Send as Send3,
  Circle,
  CircleDot,
  CheckCircle2 as CheckCircle24,
  CalendarDays as CalendarDays3,
  Users as Users2,
  AlertTriangle as AlertTriangle4,
  UserPlus as UserPlus2,
  Bell,
  ShieldCheck as ShieldCheck4,
  MapPin as MapPin2,
  Wrench,
  Tag,
  X as X12,
  Check as Check4,
  Languages as Languages2,
  Play as Play3,
  Flame as Flame2,
  Fan as Fan2,
  Droplets as Droplets2,
  Gauge as Gauge2,
  ArrowLeftRight as ArrowLeftRight3,
  List,
  Repeat as Repeat2,
  Clock as Clock2,
  Search as Search5,
  Menu as Menu2,
  BookOpen as BookOpen2,
  Activity as Activity3,
  FileText as FileText5,
  Download as Download5
} from "lucide-react";

// source/constants.js
import { Flame, Fan, Droplets, Gauge, ListChecks, AlertTriangle, FileText, CalendarDays, BookOpen, Activity, Users, History } from "lucide-react";
var DEPT_ICONS = { "Outside": Flame, "Turbine": Fan, "Utilities": Droplets, "Control Panel": Gauge };
var OPERATOR_ROLES = ["Panel Operator", "Outside Operator", "Turbine Operator", "Utility Operator"];
var SUPERVISOR_ROLES = ["Coordinator", "Section Supervisor", "Unit Supervisor", "Shift Supervisor"];
var MENU_ITEM_DEFS = [
  { key: "tasks", labelKey: "tasks", icon: ListChecks },
  { key: "issues", labelKey: "problems", icon: AlertTriangle },
  { key: "reports", labelKey: "reportsMenu", icon: FileText },
  { key: "calendar", labelKey: "calendar", icon: CalendarDays },
  { key: "logbook", labelKey: "logbook", icon: BookOpen },
  { key: "readings", labelKey: "readings", icon: Activity },
  { key: "staff", labelKey: "staff", icon: Users },
  { key: "eventList", labelKey: "eventList", icon: History }
];
var DEFAULT_MENU_PERMISSIONS = {
  "Section Supervisor": ["tasks", "issues", "reports", "calendar", "logbook", "readings", "staff", "eventList"],
  "Shift Supervisor": ["tasks", "issues", "reports", "calendar", "logbook", "readings", "staff", "eventList"],
  "Unit Supervisor": ["issues", "reports", "calendar", "readings", "staff", "eventList"],
  "Coordinator": ["issues", "reports", "staff"],
  "Panel Operator": ["tasks", "issues", "reports", "calendar", "logbook", "readings", "staff", "eventList"],
  "Outside Operator": ["tasks", "issues", "reports", "calendar", "logbook", "readings", "staff", "eventList"],
  "Turbine Operator": ["tasks", "issues", "reports", "calendar", "logbook", "readings", "staff", "eventList"],
  "Utility Operator": ["tasks", "issues", "reports", "calendar", "logbook", "readings", "staff", "eventList"]
};
var DEPT_OPERATOR_ROLE = { "Outside": "Outside Operator", "Turbine": "Turbine Operator", "Utilities": "Utility Operator", "Control Panel": "Panel Operator" };
var OFFICE_ROLES2 = ["Coordinator", "Section Supervisor", "Unit Supervisor"];
var PRIORITY = {
  high: { ar: "\u0639\u0627\u0644\u064A\u0629", en: "High", color: "#C0392B", bg: "#FBE7E4", rank: 0 },
  medium: { ar: "\u0645\u062A\u0648\u0633\u0637\u0629", en: "Medium", color: "#B25E09", bg: "#FBEEDF", rank: 1 },
  low: { ar: "\u0645\u0646\u062E\u0641\u0636\u0629", en: "Low", color: "#2F7D4F", bg: "#E4F3EA", rank: 2 }
};
var LOCATIONS = ["Area AA", "Area AB", "Area AC", "Area AD", "Main Instrument Control Room (MICR)", "Instrument Control Room (ICR)"];
var PROBLEM_CATEGORIES = ["Turbine", "Instrument", "Electric", "HVAC", "Automation", "Mechanical", "General Service"];
var WORK_STATUS = {
  open: { ar: "\u0645\u0634\u0627\u0643\u0644 \u0639\u0627\u0644\u0642\u0629", en: "Open Issues", color: "#C0392B", bg: "#FBE7E4" },
  in_maintenance: { ar: "\u062A\u062D\u062A \u0627\u0644\u0635\u064A\u0627\u0646\u0629", en: "In Maintenance", color: "#B25E09", bg: "#FBEEDF" },
  resolved: { ar: "\u062A\u0645 \u062D\u0644\u0647\u0627", en: "Resolved", color: "#2F7D4F", bg: "#E4F3EA" }
};
var SEVERITY = {
  note: { ar: "\u0645\u0644\u0627\u062D\u0638\u0629", en: "Note", color: "#1F4E79", bg: "#E9F3FB" },
  warning: { ar: "\u062A\u062D\u0630\u064A\u0631", en: "Warning", color: "#B25E09", bg: "#FBEEDF" },
  critical: { ar: "\u062D\u0631\u062C / \u0637\u0648\u0627\u0631\u0626", en: "Critical / Emergency", color: "#C0392B", bg: "#FBE7E4" }
};
var REVIEW_STATUS_META = {
  submitted: { ar: "\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0645\u0631\u0627\u062C\u0639\u0629 \u0645\u0634\u0631\u0641 \u0627\u0644\u0648\u0631\u062F\u064A\u0629", en: "Awaiting Shift Supervisor review", color: "#B25E09", bg: "#FBEEDF" },
  returned_to_shift: { ar: "\u0623\u064F\u0639\u064A\u062F \u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0648\u0631\u062F\u064A\u0629", en: "Returned to Shift Supervisor", color: "#B25E09", bg: "#FBEEDF" },
  approved_by_shift: { ar: "\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0639\u062A\u0645\u0627\u062F \u0645\u0634\u0631\u0641 \u0627\u0644\u0642\u0633\u0645", en: "Awaiting Section Supervisor approval", color: "#1F4E79", bg: "#E9F3FB" },
  approved_final_night: { ar: "\u0645\u0639\u062A\u0645\u062F \u0645\u0624\u0642\u062A\u064B\u0627 (\u0627\u0639\u062A\u0645\u0627\u062F \u0644\u064A\u0644\u064A \u0645\u0632\u062F\u0648\u062C) \u2014 \u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0642\u0633\u0645", en: "Provisionally approved (night dual-approval) \u2014 pending Section confirmation", color: "#8A5A00", bg: "#FFF1DA" },
  returned_to_operator: { ar: "\u0623\u064F\u0639\u064A\u062F \u0644\u0644\u0645\u0634\u063A\u0644 \u0644\u0644\u062A\u0635\u062D\u064A\u062D", en: "Returned to operator for correction", color: "#C0392B", bg: "#FBE7E4" },
  approved_final: { ar: "\u0645\u0639\u062A\u0645\u062F \u0646\u0647\u0627\u0626\u064A\u064B\u0627", en: "Fully approved", color: "#2F7D4F", bg: "#E4F3EA" }
};
var WEEKDAYS_AR = ["\u0627\u0644\u0633\u0628\u062A", "\u0627\u0644\u0623\u062D\u062F", "\u0627\u0644\u0627\u062B\u0646\u064A\u0646", "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621", "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621", "\u0627\u0644\u062E\u0645\u064A\u0633", "\u0627\u0644\u062C\u0645\u0639\u0629"];
var WEEKDAYS_EN = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
var MONTHS_AR = ["\u064A\u0646\u0627\u064A\u0631", "\u0641\u0628\u0631\u0627\u064A\u0631", "\u0645\u0627\u0631\u0633", "\u0623\u0628\u0631\u064A\u0644", "\u0645\u0627\u064A\u0648", "\u064A\u0648\u0646\u064A\u0648", "\u064A\u0648\u0644\u064A\u0648", "\u0623\u063A\u0633\u0637\u0633", "\u0633\u0628\u062A\u0645\u0628\u0631", "\u0623\u0643\u062A\u0648\u0628\u0631", "\u0646\u0648\u0641\u0645\u0628\u0631", "\u062F\u064A\u0633\u0645\u0628\u0631"];
var MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// source/translations.js
var STR = {
  previewAs: { ar: "\u0645\u0639\u0627\u064A\u0646\u0629 \u0643\u062D\u0633\u0627\u0628:", en: "Preview as:" },
  tasks: { ar: "\u0627\u0644\u0645\u0647\u0627\u0645", en: "Tasks" },
  problems: { ar: "\u0627\u0644\u0645\u0634\u0627\u0643\u0644", en: "Problems" },
  addTask: { ar: "\u0645\u0647\u0645\u0629", en: "Task" },
  reports: { ar: "\u0627\u0644\u0628\u0644\u0627\u063A\u0627\u062A", en: "Reports" },
  log: { ar: "\u0627\u0644\u0633\u062C\u0644", en: "Log" },
  calendar: { ar: "\u0627\u0644\u062A\u0642\u0648\u064A\u0645", en: "Calendar" },
  weeklyBtn: { ar: "\u0623\u0633\u0628\u0648\u0639\u064A", en: "Weekly" },
  monthlyBtn: { ar: "\u0634\u0647\u0631\u064A", en: "Monthly" },
  dailyBtn: { ar: "\u064A\u0648\u0645\u064A", en: "Daily" },
  prev: { ar: "\u0627\u0644\u0633\u0627\u0628\u0642 \u2039", en: "\u2039 Prev" },
  next: { ar: "\u0627\u0644\u0642\u0627\u062F\u0645 \u203A", en: "Next \u203A" },
  currentWeek: { ar: "\u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u062D\u0627\u0644\u064A", en: "This Week" },
  currentMonth: { ar: "\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u062D\u0627\u0644\u064A", en: "This Month" },
  noTasksDay: { ar: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0647\u0627\u0645 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645.", en: "No tasks this day." },
  noTasks: { ar: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0647\u0627\u0645", en: "No tasks" },
  today: { ar: "\u0627\u0644\u064A\u0648\u0645", en: "Today" },
  start: { ar: "\u0628\u062F\u0621", en: "Start" },
  markDone: { ar: "\u062A\u0645 \u0627\u0644\u062A\u0646\u0641\u064A\u0630", en: "Mark Done" },
  completed: { ar: "\u0645\u0643\u062A\u0645\u0644\u0629", en: "Completed" },
  reopen: { ar: "\u0625\u0639\u0627\u062F\u0629 \u0641\u062A\u062D", en: "Reopen" },
  myPrivateTasks: { ar: "\u0645\u0647\u0627\u0645 \u062E\u0627\u0635\u0629", en: "Private Tasks" },
  noneHere: { ar: "\u0644\u0627 \u064A\u0648\u062C\u062F", en: "None" },
  notifications: { ar: "\u0627\u0644\u062A\u0646\u0628\u064A\u0647\u0627\u062A", en: "Notifications" },
  noNotifications: { ar: "\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0646\u0628\u064A\u0647\u0627\u062A", en: "No notifications" },
  addBtn: { ar: "\u0625\u0636\u0627\u0641\u0629", en: "Add" },
  save: { ar: "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A", en: "Save Changes" },
  taskTitle: { ar: "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0645\u0647\u0645\u0629", en: "Task Title" },
  descOpt: { ar: "\u0627\u0644\u0648\u0635\u0641", en: "Description" },
  department: { ar: "\u0627\u0644\u0642\u0633\u0645", en: "Department" },
  priority: { ar: "\u0627\u0644\u0623\u0648\u0644\u0648\u064A\u0629", en: "Priority" },
  customize: { ar: "\u062A\u062E\u0635\u064A\u0635", en: "Customize" },
  assignees: { ar: "\u0627\u0644\u0645\u0648\u0643\u0644\u0648\u0646 \u0628\u0627\u0644\u062A\u0646\u0641\u064A\u0630", en: "Assignees" },
  all: { ar: "\u0627\u0644\u0643\u0644", en: "All" },
  public: { ar: "\u0639\u0627\u0645\u0629", en: "Public" },
  private: { ar: "\u062E\u0627\u0635\u0629", en: "Private" },
  visibleOnlyTo: { ar: "\u062A\u0638\u0647\u0631 \u0641\u0642\u0637 \u0644\u0640", en: "Visible only to" },
  pickDates: { ar: "\u0627\u062E\u062A\u0631 \u0627\u0644\u062A\u0627\u0631\u064A\u062E/\u0627\u0644\u062A\u0648\u0627\u0631\u064A\u062E", en: "Pick date(s)" },
  datesSelected: { ar: "\u062A\u0627\u0631\u064A\u062E \u0645\u062D\u062F\u062F", en: "date(s) selected" },
  recurrence: { ar: "\u0627\u0644\u062A\u0643\u0631\u0627\u0631", en: "Recurrence" },
  recNone: { ar: "\u0628\u062F\u0648\u0646 \u062A\u0643\u0631\u0627\u0631", en: "No repeat" },
  recDaily: { ar: "\u064A\u0648\u0645\u064A", en: "Daily" },
  recWeekly: { ar: "\u0623\u0633\u0628\u0648\u0639\u064A", en: "Weekly" },
  recMonthly: { ar: "\u0634\u0647\u0631\u064A", en: "Monthly" },
  newTask: { ar: "\u0645\u0647\u0645\u0629 \u062C\u062F\u064A\u062F\u0629", en: "New Task" },
  editTask: { ar: "\u062A\u0639\u062F\u064A\u0644 \u0645\u0647\u0645\u0629", en: "Edit Task" },
  addTaskBtn: { ar: "\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0647\u0645\u0629", en: "Add Task" },
  newReport: { ar: "\u0628\u0644\u0627\u063A \u0639\u0646 \u0645\u0634\u0643\u0644\u0629", en: "Report a Problem" },
  editReport: { ar: "\u062A\u0639\u062F\u064A\u0644 \u0628\u0644\u0627\u063A", en: "Edit Report" },
  equipmentName: { ar: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u062F\u0629", en: "Equipment Name" },
  tagNumber: { ar: "\u0631\u0642\u0645 \u0627\u0644\u062A\u0627\u0642 (Tag Number)", en: "Tag Number" },
  problemTitle: { ar: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0634\u0643\u0644\u0629", en: "Problem Title" },
  location: { ar: "\u0627\u0644\u0645\u0643\u0627\u0646", en: "Location" },
  maintDept: { ar: "\u0642\u0633\u0645 \u0627\u0644\u0635\u064A\u0627\u0646\u0629 \u0627\u0644\u0645\u0633\u0624\u0648\u0644", en: "Responsible Maint. Dept." },
  descProblem: { ar: "\u0648\u0635\u0641 \u0645\u0641\u0635\u0644 \u0644\u0644\u0645\u0634\u0643\u0644\u0629", en: "Detailed description" },
  sendReport: { ar: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0628\u0644\u0627\u063A", en: "Send Report" },
  saveEdit: { ar: "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644", en: "Save Edit" },
  autoRouteSup: { ar: "\u0633\u064A\u064F\u0636\u0627\u0641 \u0627\u0644\u0628\u0644\u0627\u063A \u0645\u0628\u0627\u0634\u0631\u0629 \u0643\u0645\u0634\u0643\u0644\u0629 \u0645\u0639\u062A\u0645\u062F\u0629.", en: "This report will be added as approved directly." },
  autoRouteOp: { ar: "\u0633\u064A\u064F\u0631\u0633\u0644 \u0627\u0644\u0628\u0644\u0627\u063A \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627 \u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0648\u0631\u062F\u064A\u0629 \u0644\u0644\u0645\u0631\u0627\u062C\u0639\u0629.", en: "This report will be sent to the Shift Supervisor for review." },
  approve: { ar: "\u0627\u0639\u062A\u0645\u0627\u062F \u0648\u0625\u0631\u0633\u0627\u0644 \u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0642\u0633\u0645", en: "Approve & Forward" },
  approveFinal: { ar: "\u0627\u0639\u062A\u0645\u0627\u062F \u0646\u0647\u0627\u0626\u064A", en: "Final Approve" },
  reroute: { ar: "\u0625\u0639\u0627\u062F\u0629 \u062A\u0648\u062C\u064A\u0647", en: "Re-route" },
  rerouteToOperator: { ar: "\u0625\u0639\u0627\u062F\u0629 \u0644\u0644\u0645\u0634\u063A\u0644 \u0645\u0639 \u0645\u0644\u0627\u062D\u0638\u0629", en: "Return to operator with note" },
  rerouteToShift: { ar: "\u0625\u0639\u0627\u062F\u0629 \u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0648\u0631\u062F\u064A\u0629 \u0645\u0639 \u0645\u0644\u0627\u062D\u0638\u0629", en: "Return to Shift Supervisor with note" },
  resubmitted: { ar: "\u0623\u064F\u0639\u064A\u062F \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0628\u0639\u062F \u0627\u0644\u062A\u0635\u062D\u064A\u062D", en: "Resubmitted after correction" },
  resubmitBtn: { ar: "\u062A\u0635\u062D\u064A\u062D \u0648\u0625\u0639\u0627\u062F\u0629 \u0625\u0631\u0633\u0627\u0644", en: "Fix & Resubmit" },
  addCommentBtn: { ar: "\u0625\u0636\u0627\u0641\u0629 \u062A\u0639\u0644\u064A\u0642", en: "Add Comment" },
  rerouteNotePlaceholder: { ar: "\u0627\u0643\u062A\u0628 \u0633\u0628\u0628 \u0627\u0644\u0625\u0639\u0627\u062F\u0629...", en: "Write the reason for returning..." },
  reviewHistory: { ar: "\u0633\u062C\u0644 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629", en: "Review History" },
  labReportTitle: { ar: "\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0645\u0639\u0645\u0644 \u0627\u0644\u064A\u0648\u0645\u064A (Lab Report)", en: "Daily Lab Report" },
  labReportSoon: { ar: "\u0642\u064A\u062F \u0627\u0644\u0631\u0628\u0637 \u0645\u0639 Outlook \u0644\u062C\u0644\u0628 \u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u0645\u064A\u0627\u0647 \u0648\u0627\u0644\u063A\u0627\u0632 \u0648\u0627\u0644\u0632\u064A\u0648\u062A \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627 \u2014 \u0633\u064A\u064F\u0641\u0639\u0651\u0644 \u0644\u0627\u062D\u0642\u064B\u0627.", en: "Pending Outlook integration to auto-fetch water, gas & oil reports \u2014 coming soon." },
  dailyReportsTab: { ar: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u064A\u0648\u0645\u064A\u0629", en: "Daily Reports" },
  periodicReportsTab: { ar: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u062F\u0648\u0631\u064A\u0629", en: "Periodic Reports" },
  dailyProductionReport: { ar: "\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0625\u0646\u062A\u0627\u062C \u0627\u0644\u064A\u0648\u0645\u064A", en: "Daily Production Report" },
  panelOperatorOnlyNote: { ar: "\u0627\u0644\u0625\u062F\u062E\u0627\u0644 \u0645\u062E\u0635\u0635 \u0644\u0645\u0634\u063A\u0644 \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645 \u0641\u0642\u0637.", en: "Entry is restricted to the Panel Operator." },
  generalReportTitle: { ar: "\u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0639\u0627\u0645", en: "General Report" },
  generalReportDesc: { ar: "\u064A\u063A\u0637\u064A \u0627\u0644\u0645\u0631\u0627\u0641\u0642 \u0627\u0644\u062B\u0627\u0646\u0648\u064A\u0629 \u062E\u0627\u0631\u062C \u0646\u0637\u0627\u0642 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0645\u062D\u062F\u062F\u0629 \u2014 \u0625\u062F\u062E\u0627\u0644 \u0645\u0634\u0631\u0641 \u0627\u0644\u0648\u0631\u062F\u064A\u0629 \u0641\u0642\u0637.", en: "Covers secondary facilities outside the defined sections \u2014 Shift Supervisor entry only." },
  shiftSupervisorOnlyNote: { ar: "\u0627\u0644\u0625\u062F\u062E\u0627\u0644 \u0645\u062E\u0635\u0635 \u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0648\u0631\u062F\u064A\u0629 \u0641\u0642\u0637.", en: "Entry is restricted to the Shift Supervisor." },
  sectionReportLabel: { ar: "\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0642\u0633\u0645", en: "Section Report" },
  chooseSectionLbl: { ar: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0642\u0633\u0645", en: "Choose Section" },
  prevReport: { ar: "\u0627\u0644\u0633\u0627\u0628\u0642", en: "Previous" },
  nextReport: { ar: "\u0627\u0644\u062A\u0627\u0644\u064A", en: "Next" },
  noEntryPermission: { ar: "\u0644\u0627 \u062A\u0645\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u0625\u062F\u062E\u0627\u0644 \u0647\u0646\u0627 \u2014 \u0639\u0631\u0636 \u0641\u0642\u0637.", en: "You don't have entry permission here \u2014 view only." },
  pendingIssuesTasksSec: { ar: "\u0627\u0644\u0645\u0634\u0627\u0643\u0644 \u0648\u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u0639\u0627\u0644\u0642\u0629", en: "Pending Issues & Tasks" },
  generalSec: { ar: "\u0639\u0627\u0645", en: "General" },
  logbookAwaitingApproval: { ar: "\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0639\u062A\u0645\u0627\u062F \u0645\u0634\u0631\u0641 \u0627\u0644\u0648\u0631\u062F\u064A\u0629 \u0639\u0644\u0649 \u0633\u062C\u0644 \u0627\u0644\u064A\u0648\u0645.", en: "Awaiting Shift Supervisor approval for today's log." },
  logbookSummaryLbl: { ar: "\u0645\u0644\u062E\u0635 \u0645\u0634\u0631\u0641 \u0627\u0644\u0648\u0631\u062F\u064A\u0629", en: "Shift Supervisor Summary" },
  logbookSummaryPH: { ar: "\u0627\u0643\u062A\u0628 \u0645\u0644\u062E\u0635 \u0627\u0644\u0648\u0631\u062F\u064A\u0629 \u0648\u0623\u0647\u0645 \u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A...", en: "Write the shift summary and key notes..." },
  approveLogbookBtn: { ar: "\u0627\u0639\u062A\u0645\u0627\u062F \u0633\u062C\u0644 \u0627\u0644\u064A\u0648\u0645", en: "Approve Today's Log" },
  logbookApprovedBy: { ar: "\u0627\u0639\u062A\u0645\u062F\u0647", en: "Approved by" },
  logbookDraftBadge: { ar: "\u0645\u0633\u0648\u062F\u0629", en: "Draft" },
  logbookApprovedBadge: { ar: "\u0645\u0639\u062A\u0645\u062F", en: "Approved" },
  saveDraftBtn: { ar: "\u062D\u0641\u0638 \u0643\u0645\u0633\u0648\u062F\u0629", en: "Save Draft" },
  toastTaskDeleted: { ar: "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0647\u0645\u0629", en: "Task deleted" },
  toastTaskCompleted: { ar: "\u0623\u064F\u0646\u062C\u0632\u062A \u0627\u0644\u0645\u0647\u0645\u0629 \u0628\u0646\u062C\u0627\u062D", en: "Task completed" },
  toastTaskPostponed: { ar: "\u062A\u0645 \u062A\u0623\u062C\u064A\u0644 \u0627\u0644\u0645\u0647\u0645\u0629", en: "Task postponed" },
  toastCommentAdded: { ar: "\u0623\u064F\u0636\u064A\u0641 \u0627\u0644\u062A\u0639\u0644\u064A\u0642", en: "Comment added" },
  toastReadingSaved: { ar: "\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0642\u0631\u0627\u0621\u0629", en: "Reading saved" },
  toastReportSaved: { ar: "\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u062A\u0642\u0631\u064A\u0631", en: "Report saved" },
  toastProblemSubmitted: { ar: "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0628\u0644\u0627\u063A", en: "Report submitted" },
  toastProblemUpdated: { ar: "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0628\u0644\u0627\u063A", en: "Report updated" },
  toastApproved: { ar: "\u062A\u0645 \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F", en: "Approved" },
  toastRerouted: { ar: "\u062A\u0645\u062A \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0648\u062C\u064A\u0647", en: "Rerouted" },
  toastResubmitted: { ar: "\u062A\u0645\u062A \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644", en: "Resubmitted" },
  toastLogbookApproved: { ar: "\u062A\u0645 \u0627\u0639\u062A\u0645\u0627\u062F \u0633\u062C\u0644 \u0627\u0644\u0648\u0631\u062F\u064A\u0629", en: "Logbook approved" },
  toastDraftSaved: { ar: "\u062D\u064F\u0641\u0638\u062A \u0627\u0644\u0645\u0633\u0648\u062F\u0629", en: "Draft saved" },
  reportedBy: { ar: "\u0627\u0644\u0645\u0628\u0644\u0651\u063A:", en: "Reported by:" },
  respPerson: { ar: "\u0627\u0644\u0645\u0633\u0624\u0648\u0644:", en: "Responsible:" },
  accounts: { ar: "\u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A", en: "Accounts" },
  name: { ar: "\u0627\u0644\u0627\u0633\u0645", en: "Name" },
  appAdmin: { ar: "\u0645\u062F\u064A\u0631 \u062A\u0637\u0628\u064A\u0642", en: "App Admin" },
  departmentsLabel: { ar: "\u0627\u0644\u0623\u0642\u0633\u0627\u0645", en: "Departments" },
  rolesLabel: { ar: "\u0627\u0644\u0645\u0633\u0645\u064A\u0627\u062A \u0627\u0644\u0648\u0638\u064A\u0641\u064A\u0629", en: "Job Roles" },
  newDeptPH: { ar: "\u0627\u0633\u0645 \u0642\u0633\u0645 \u062C\u062F\u064A\u062F", en: "New department" },
  newRolePH: { ar: "\u0645\u0633\u0645\u0649 \u0648\u0638\u064A\u0641\u064A \u062C\u062F\u064A\u062F", en: "New role" },
  dueSoon: { ar: "\u062D\u0627\u0646 \u0645\u0648\u0639\u062F \u0627\u0633\u062A\u062D\u0642\u0627\u0642", en: "Due:" },
  isDone: { ar: "\u0647\u0644 \u0627\u0646\u062A\u0647\u062A\u061F", en: "Is it done?" },
  yesDone: { ar: "\u0646\u0639\u0645\u060C \u0627\u0643\u062A\u0645\u0644\u062A", en: "Yes, done" },
  postpone: { ar: "\u062A\u0623\u062C\u064A\u0644 / \u062A\u0645\u062F\u064A\u062F", en: "Postpone" },
  postponeReasonReq: { ar: "\u0633\u0628\u0628 \u0627\u0644\u062A\u0623\u062C\u064A\u0644 (\u0625\u0644\u0632\u0627\u0645\u064A)", en: "Reason (required)" },
  confirmPostpone: { ar: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062A\u0623\u062C\u064A\u0644", en: "Confirm" },
  back: { ar: "\u0631\u062C\u0648\u0639", en: "Back" },
  commentPH: { ar: "\u062A\u0639\u0644\u064A\u0642 \u0628\u0627\u0633\u0645", en: "Comment as" },
  createdByLbl: { ar: "\u0623\u0646\u0634\u0623\u0647\u0627:", en: "Created by:" },
  assignedToLbl: { ar: "\u0627\u0644\u0645\u0648\u0643\u0644\u0648\u0646 \u0628\u0647\u0627:", en: "Assigned to:" },
  addTaskForDay: { ar: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0647\u0645\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645", en: "Add task for this day" },
  logForDay: { ar: "\u0633\u062C\u0644 \u0627\u0644\u064A\u0648\u0645", en: "Day Log" },
  noLogEntries: { ar: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u062D\u062F\u0627\u062B \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645.", en: "No activity this day." },
  staff: { ar: "\u0627\u0644\u0641\u0631\u064A\u0642", en: "Staff" },
  allStaff: { ar: "\u0627\u0644\u0643\u0644", en: "All" },
  present: { ar: "\u0627\u0644\u062D\u0627\u0636\u0631\u0648\u0646", en: "Present" },
  onLeave: { ar: "\u0627\u0644\u0625\u062C\u0627\u0632\u0629", en: "On Leave" },
  moveToLeave: { ar: "\u0646\u0642\u0644 \u0625\u0644\u0649 \u0627\u0644\u0625\u062C\u0627\u0632\u0629", en: "Move to Leave" },
  moveToPresent: { ar: "\u0646\u0642\u0644 \u0625\u0644\u0649 \u0627\u0644\u062D\u0627\u0636\u0631\u064A\u0646", en: "Move to Present" },
  vacationShort: { ar: "\u0625\u062C\u0627\u0632\u0629", en: "Vacation" },
  presentShort: { ar: "\u0627\u0644\u062D\u0636\u0648\u0631", en: "Present" },
  todayTaskList: { ar: "\u0642\u0627\u0626\u0645\u0629 \u0645\u0647\u0627\u0645 \u0627\u0644\u064A\u0648\u0645", en: "Today's Task List" },
  inProgressBtn: { ar: "\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630", en: "In Progress" },
  completedBtn: { ar: "\u0645\u0646\u062C\u0632\u0629", en: "Completed" },
  problemsList: { ar: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0634\u0627\u0643\u0644", en: "Problems List" },
  reportProblem: { ar: "\u0628\u0644\u0627\u063A", en: "Report" },
  fullLog: { ar: "\u0633\u062C\u0644 \u0643\u0644 \u0627\u0644\u0628\u0644\u0627\u063A\u0627\u062A", en: "Full Report Log" },
  noProblems: { ar: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0634\u0627\u0643\u0644", en: "No problems" },
  confirmDeleteMsg: { ar: "\u0633\u064A\u062A\u0645 \u062D\u0630\u0641 \u0647\u0630\u0647 \u0627\u0644\u0645\u0647\u0645\u0629 \u0646\u0647\u0627\u0626\u064A\u064B\u0627 \u0648\u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0625\u062C\u0631\u0627\u0621.", en: "This task will be permanently deleted. This cannot be undone." },
  confirmDeleteTitle: { ar: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u0630\u0641", en: "Confirm Deletion" },
  deleteBtn: { ar: "\u062D\u0630\u0641", en: "Delete" },
  searchPlaceholder: { ar: "\u0627\u0628\u062D\u062B \u0628\u0631\u0642\u0645 \u0627\u0644\u062A\u0627\u0642\u060C \u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u062F\u0629\u060C \u0627\u0644\u0642\u0633\u0645 \u0623\u0648 \u0627\u0644\u0645\u0643\u0627\u0646...", en: "Search by tag number, equipment, department, or location..." },
  searchField: { ar: "\u0628\u062D\u062B \u0641\u064A:", en: "Search in:" },
  fieldTag: { ar: "\u0631\u0642\u0645 \u0627\u0644\u062A\u0627\u0642", en: "Tag Number" },
  fieldEquip: { ar: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u062F\u0629", en: "Equipment" },
  fieldDept: { ar: "\u0627\u0644\u0642\u0633\u0645", en: "Department" },
  fieldLoc: { ar: "\u0627\u0644\u0645\u0643\u0627\u0646", en: "Location" },
  recurringBadge: { ar: "\u0645\u062A\u0643\u0631\u0631\u0629", en: "Recurring" },
  allEvents: { ar: "\u0627\u0644\u0643\u0644", en: "All" },
  dayEvents: { ar: "\u0627\u0644\u064A\u0648\u0645", en: "Day" },
  searchTaskPH: { ar: "\u0627\u0628\u062D\u062B \u0628\u0627\u0633\u0645 \u0627\u0644\u0645\u0647\u0645\u0629...", en: "Search by task name..." },
  searchLogPH: { ar: "\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0633\u062C\u0644...", en: "Search the log..." },
  unitName: { ar: "\u0627\u0633\u0645 \u0627\u0644\u0648\u062D\u062F\u0629", en: "Unit Name" },
  dayShift: { ar: "\u0648\u0631\u062F\u064A\u0629 \u0627\u0644\u0646\u0647\u0627\u0631", en: "Day Shift" },
  nightShift: { ar: "\u0648\u0631\u062F\u064A\u0629 \u0627\u0644\u0644\u064A\u0644", en: "Night Shift" },
  officeShift: { ar: "\u0645\u0643\u062A\u0628", en: "Office" },
  renewalReviewTitle: { ar: "\u0645\u0631\u0627\u062C\u0639\u0629 \u062A\u062C\u062F\u064A\u062F \u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u0645\u062A\u0643\u0631\u0631\u0629 \u0644\u0644\u0633\u0646\u0629 \u0627\u0644\u0642\u0627\u062F\u0645\u0629", en: "Review recurring task renewal for next year" },
  renewalReviewDesc: { ar: "\u0647\u0630\u0647 \u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u0645\u062A\u0643\u0631\u0631\u0629 \u062A\u0646\u062A\u0647\u064A \u062F\u0648\u0631\u062A\u0647\u0627 \u0622\u062E\u0631 \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631. \u0623\u0643\u0651\u062F\u0647\u0627 \u0644\u0644\u0633\u0646\u0629 \u0627\u0644\u062C\u0627\u064A\u0629\u060C \u0623\u0648 \u0633\u062A\u062A\u062C\u062F\u062F \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627 \u0628\u0646\u0641\u0633 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0625\u0630\u0627 \u0645\u0627 \u062A\u0645 \u0627\u0644\u062A\u0623\u0643\u064A\u062F.", en: "These recurring tasks end their cycle this month. Confirm them for next year, or they will auto-renew with the same settings if not confirmed." },
  confirmAllBtn: { ar: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0643\u0644", en: "Confirm All" },
  toastRenewalConfirmed: { ar: "\u062A\u0645 \u0627\u0644\u062A\u0623\u0643\u064A\u062F\u060C \u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0639\u062A\u0645\u0627\u062F \u0645\u0634\u0631\u0641 \u0627\u0644\u0642\u0633\u0645", en: "Confirmed \u2014 awaiting Section Supervisor approval" },
  toastAutoRenewed: { ar: "\u062A\u0645 \u062A\u062C\u062F\u064A\u062F \u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u0645\u062A\u0643\u0631\u0631\u0629 \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627 \u0644\u0644\u0633\u0646\u0629 \u0627\u0644\u062C\u062F\u064A\u062F\u0629", en: "Recurring tasks were auto-renewed for the new year" },
  moveToDayShift: { ar: "\u0646\u0642\u0644 \u0644\u0648\u0631\u062F\u064A\u0629 \u0627\u0644\u0646\u0647\u0627\u0631", en: "Move to Day Shift" },
  moveToNightShift: { ar: "\u0646\u0642\u0644 \u0644\u0648\u0631\u062F\u064A\u0629 \u0627\u0644\u0644\u064A\u0644", en: "Move to Night Shift" },
  confirmStaffTitle: { ar: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0625\u062C\u0631\u0627\u0621", en: "Confirm Action" },
  confirmStaffMsg: { ar: "\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062A\u063A\u064A\u064A\u0631 \u062D\u0627\u0644\u0629", en: "Are you sure you want to change the status of" },
  confirmStaffTo: { ar: "\u0625\u0644\u0649", en: "to" },
  confirmBtn: { ar: "\u062A\u0623\u0643\u064A\u062F", en: "Confirm" },
  cancelBtn: { ar: "\u0625\u0644\u063A\u0627\u0621", en: "Cancel" },
  inChargeBadge: { ar: "\u0627\u0644\u0645\u0633\u0624\u0648\u0644", en: "In Charge" },
  requestHandoverBtn: { ar: "\u0637\u0644\u0628 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629", en: "Request Handover" },
  handoverPickerTitle: { ar: "\u0627\u062E\u062A\u0631 \u0645\u0646 \u064A\u0633\u062A\u0644\u0645 \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629", en: "Select who receives responsibility" },
  noEligibleColleagues: { ar: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0632\u0645\u064A\u0644 \u0645\u062A\u0627\u062D \u062D\u0627\u0644\u064A\u064B\u0627 \u0644\u0644\u062A\u0633\u0644\u064A\u0645.", en: "No colleague currently available for handover." },
  sendRequestBtn: { ar: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628", en: "Send Request" },
  handoverRequestSentToast: { ar: "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0625\u0644\u0649", en: "Handover request sent to" },
  handoverRequestTitle: { ar: "\u0637\u0644\u0628 \u062A\u0633\u0644\u064A\u0645 \u0645\u0633\u0624\u0648\u0644\u064A\u0629", en: "Handover Request" },
  handoverRequestMsg: { ar: "\u064A\u0637\u0644\u0628 \u0645\u0646\u0643 \u062A\u0648\u0644\u064A \u0645\u0633\u0624\u0648\u0644\u064A\u0629", en: "wants to transfer responsibility of" },
  handoverAcceptBtn: { ar: "\u0642\u0628\u0648\u0644", en: "Accept" },
  handoverRejectBtn: { ar: "\u0631\u0641\u0636", en: "Reject" },
  handoverAcceptedToast: { ar: "\u062A\u0645 \u0642\u0628\u0648\u0644 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u2014 \u0623\u0646\u062A \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0622\u0646.", en: "Handover accepted \u2014 you are now In Charge." },
  handoverRejectedToast: { ar: "\u062A\u0645 \u0631\u0641\u0636 \u0637\u0644\u0628 \u0627\u0644\u062A\u0633\u0644\u064A\u0645.", en: "Handover request rejected." },
  offDutyNotice: { ar: "\u0623\u0646\u062A \u062E\u0627\u0631\u062C \u0633\u0627\u0639\u0627\u062A \u062F\u0648\u0627\u0645\u0643 \u0627\u0644\u0631\u0633\u0645\u064A\u0629 \u2014 \u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u0645\u0634\u0627\u0647\u062F\u0629 \u0648\u0627\u0644\u062A\u0639\u0644\u064A\u0642 \u0641\u0642\u0637\u060C \u0628\u062F\u0648\u0646 \u0627\u0639\u062A\u0645\u0627\u062F.", en: "You are outside your official duty hours \u2014 you can view and comment only, not approve." },
  nightDualApproveNote: { ar: "\u0627\u0639\u062A\u0645\u0627\u062F \u0644\u064A\u0644\u064A \u0645\u0632\u062F\u0648\u062C (\u0628\u063A\u064A\u0627\u0628 \u0645\u0634\u0631\u0641 \u0627\u0644\u0642\u0633\u0645) \u2014 \u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0642\u0633\u0645 \u0635\u0628\u0627\u062D\u064B\u0627", en: "Night dual-approval (Section unavailable) \u2014 pending Section confirmation" },
  confirmNightNote: { ar: "\u062A\u0645 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F \u0627\u0644\u0644\u064A\u0644\u064A", en: "Night approval confirmed" },
  confirmNightBtn: { ar: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0627\u0639\u062A\u0645\u0627\u062F \u0627\u0644\u0644\u064A\u0644\u064A", en: "Confirm Night Approval" },
  rejectNightBtn: { ar: "\u0631\u0641\u0636 \u0648\u0625\u0631\u062C\u0627\u0639 \u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0648\u0631\u062F\u064A\u0629", en: "Reject & Return to Shift Supervisor" },
  taskResentNote: { ar: "\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0647\u0645\u0629 \u0648\u0625\u0639\u0627\u062F\u0629 \u0625\u0631\u0633\u0627\u0644\u0647\u0627 \u0644\u0644\u0627\u0639\u062A\u0645\u0627\u062F", en: "Task edited and resent for approval" },
  taskPreApprovedNote: { ar: "\u062A\u0645 \u0627\u0639\u062A\u0645\u0627\u062F \u0627\u0644\u0645\u0647\u0645\u0629 \u2014 \u0635\u0627\u0631\u062A \u0645\u062A\u0627\u062D\u0629 \u0644\u0644\u0645\u0634\u063A\u0644\u064A\u0646", en: "Task approved \u2014 now available to operators" },
  taskPreRejectedNote: { ar: "\u0623\u064F\u0639\u064A\u062F\u062A \u0627\u0644\u0645\u0647\u0645\u0629 \u0644\u0644\u062A\u0639\u062F\u064A\u0644", en: "Task returned for revision" },
  taskPendingApprovalTitle: { ar: "\u0645\u0647\u0627\u0645 \u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0639\u062A\u0645\u0627\u062F\u0643 (\u0642\u0628\u0644 \u0627\u0644\u0628\u062F\u0621)", en: "Tasks awaiting your approval (pre-start)" },
  taskApproveBtn: { ar: "\u0627\u0639\u062A\u0645\u0627\u062F", en: "Approve" },
  taskRejectBtn: { ar: "\u0631\u0641\u0636 \u0645\u0639 \u0645\u0644\u0627\u062D\u0638\u0629", en: "Reject with note" },
  taskRejectPlaceholder: { ar: "\u0627\u0643\u062A\u0628 \u0633\u0628\u0628 \u0627\u0644\u0631\u0641\u0636...", en: "Write the rejection reason..." },
  taskReturnedTitle: { ar: "\u0645\u0647\u0627\u0645 \u0623\u064F\u0639\u064A\u062F\u062A \u0644\u0643 \u0644\u0644\u062A\u0639\u062F\u064A\u0644", en: "Tasks returned to you for editing" },
  taskEditResendBtn: { ar: "\u062A\u0639\u062F\u064A\u0644 \u0648\u0625\u0639\u0627\u062F\u0629 \u0625\u0631\u0633\u0627\u0644", en: "Edit & Resend" },
  taskAwaitingApprovalBadge: { ar: "\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0639\u062A\u0645\u0627\u062F \u0627\u0644\u0642\u0633\u0645", en: "Awaiting Section approval" },
  coordinatorTasksTitle: { ar: "\u0645\u0647\u0627\u0645 \u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u0623\u0648\u0644\u0648\u064A\u0629 (\u0645\u0639\u062A\u0645\u062F\u0629 \u0646\u0647\u0627\u0626\u064A\u064B\u0627)", en: "High-priority tasks (finally approved)" },
  cannotLeaveWhileInCharge: { ar: '\u0644\u0627 \u064A\u0645\u0643\u0646 \u0646\u0642\u0644 \u0647\u0630\u0627 \u0627\u0644\u0634\u062E\u0635 \u0644\u0644\u0625\u062C\u0627\u0632\u0629 \u0644\u0623\u0646\u0647 "\u0627\u0644\u0645\u0633\u0624\u0648\u0644" \u0627\u0644\u062D\u0627\u0644\u064A \u2014 \u064A\u062C\u0628 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629 \u0644\u0634\u062E\u0635 \u0622\u062E\u0631 \u0623\u0648\u0644\u0627\u064B.', en: 'This person cannot be moved to leave while they are the current "In Charge" \u2014 the responsibility must be handed over first.' },
  dutyTimeLeft: { ar: "\u0628\u0627\u0642\u064A \u0639\u0644\u0649 \u0646\u0647\u0627\u064A\u0629 \u062F\u0648\u0627\u0645\u0643", en: "Time left in your duty" },
  offDutyLabel: { ar: "\u062E\u0627\u0631\u062C \u0633\u0627\u0639\u0627\u062A \u0627\u0644\u062F\u0648\u0627\u0645", en: "Off duty" },
  whoInChargeTitle: { ar: "\u0645\u0646 \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0622\u0646\u061F", en: "Who's In Charge?" },
  whoInChargeBtn: { ar: "\u{1F4CD} \u0645\u0646 \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0622\u0646\u061F", en: "\u{1F4CD} Who's In Charge?" },
  sectionInChargeLbl: { ar: "\u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0642\u0633\u0645", en: "Section In Charge" },
  shiftDayInChargeLbl: { ar: "\u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0648\u0631\u062F\u064A\u0629 (\u0646\u0647\u0627\u0631)", en: "Shift In Charge (Day)" },
  shiftNightInChargeLbl: { ar: "\u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0648\u0631\u062F\u064A\u0629 (\u0644\u064A\u0644)", en: "Shift In Charge (Night)" },
  noneAssigned: { ar: "\u0644\u0627 \u064A\u0648\u062C\u062F", en: "None assigned" },
  viewHandoverHistoryBtn: { ar: "\u0639\u0631\u0636 \u0633\u062C\u0644 \u0627\u0644\u062A\u0633\u0644\u064A\u0645\u0627\u062A", en: "View Handover History" },
  handoverHistoryTitle: { ar: "\u0633\u062C\u0644 \u0627\u0644\u062A\u0633\u0644\u064A\u0645\u0627\u062A", en: "Handover History" },
  noHandoverHistory: { ar: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0633\u062C\u0644 \u062A\u0633\u0644\u064A\u0645\u0627\u062A \u0628\u0639\u062F.", en: "No handover history yet." },
  adminOverrideBtn: { ar: "\u062A\u0639\u064A\u064A\u0646 \u064A\u062F\u0648\u064A", en: "Manually Assign" },
  adminOverrideToast: { ar: "\u062A\u0645 \u0627\u0644\u062A\u0639\u064A\u064A\u0646 \u0627\u0644\u064A\u062F\u0648\u064A \u0644\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629.", en: "Responsibility manually assigned." },
  methodManual: { ar: "\u0637\u0644\u0628/\u0645\u0648\u0627\u0641\u0642\u0629", en: "Request/Accept" },
  methodAuto: { ar: "\u062A\u0644\u0642\u0627\u0626\u064A (\u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0648\u0631\u062F\u064A\u0629)", en: "Automatic (shift end)" },
  methodAutoEarly: { ar: "\u062A\u0644\u0642\u0627\u0626\u064A (\u0642\u0628\u0648\u0644 \u0645\u0628\u0643\u0631)", en: "Automatic (early accept)" },
  methodEmergency: { ar: "\u062A\u062D\u0648\u064A\u0644 \u0637\u0627\u0631\u0626", en: "Emergency reassignment" },
  methodTempDelegate: { ar: "\u062A\u0641\u0648\u064A\u0636 \u0645\u0624\u0642\u062A", en: "Temporary delegation" },
  methodReclaim: { ar: "\u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629", en: "Reclaimed responsibility" },
  methodAdminOverride: { ar: "\u062A\u0639\u064A\u064A\u0646 \u064A\u062F\u0648\u064A \u0645\u0646 \u0645\u0634\u0631\u0641 \u0627\u0644\u0642\u0633\u0645", en: "Manual assignment by Section Supervisor" },
  autoHandoverTitle: { ar: "\u0646\u0642\u0644 \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A", en: "Automatic Responsibility Handover" },
  autoHandoverNotifyMsg: { ar: "\u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629 \u0633\u062A\u0646\u062A\u0642\u0644 \u0625\u0644\u064A\u0643 \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627 \u0627\u0644\u0633\u0627\u0639\u0629", en: "Responsibility will automatically transfer to you at" },
  autoHandoverDecisionMsg: { ar: "\u062F\u062E\u0644 \u0648\u0642\u062A \u0648\u0631\u062F\u064A\u0629 \u2014 \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629 \u062A\u0646\u062A\u0642\u0644 \u0625\u0644\u064A\u0643 \u0627\u0644\u0622\u0646\u060C \u0623\u0648 \u0627\u062E\u062A\u0631 \u062A\u0645\u062F\u064A\u062F \u0627\u0644\u0648\u0642\u062A", en: "Shift time has started \u2014 responsibility is transferring to you now, or choose to extend" },
  autoHandoverExtendedMsg: { ar: "\u062A\u0645 \u062A\u0645\u062F\u064A\u062F \u0627\u0644\u0648\u0642\u062A \u2014 \u0633\u064A\u062A\u0645 \u0627\u0644\u0646\u0642\u0644 \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627 \u0627\u0644\u0633\u0627\u0639\u0629", en: "Time extended \u2014 will transfer automatically at" },
  acceptNowBtn: { ar: "\u0642\u0628\u0648\u0644 \u0627\u0644\u0622\u0646", en: "Accept Now" },
  extendBtn5: { ar: "\u062A\u0645\u062F\u064A\u062F 5 \u062F", en: "Extend 5m" },
  extendBtn10: { ar: "\u062A\u0645\u062F\u064A\u062F 10 \u062F", en: "Extend 10m" },
  extendBtn15: { ar: "\u062A\u0645\u062F\u064A\u062F 15 \u062F", en: "Extend 15m" },
  cantComeBtn: { ar: "\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u062D\u0636\u0648\u0631 \u2014 \u062A\u062D\u0648\u064A\u0644 \u0644\u0632\u0645\u064A\u0644", en: "Can't come \u2014 reassign to colleague" },
  selectColleagueTitle: { ar: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0632\u0645\u064A\u0644 \u0627\u0644\u0645\u0633\u062A\u0644\u0645", en: "Select receiving colleague" },
  autoHandoverDoneToast: { ar: "\u062A\u0645 \u0646\u0642\u0644 \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629.", en: "Responsibility transferred." },
  autoHandoverExtendedToast: { ar: "\u062A\u0645 \u062A\u0645\u062F\u064A\u062F \u0627\u0644\u0648\u0642\u062A.", en: "Time extended." },
  autoHandoverTempDelegateToast: { ar: "\u062A\u0645 \u0627\u0644\u062A\u0641\u0648\u064A\u0636 \u0627\u0644\u0645\u0624\u0642\u062A.", en: "Temporarily delegated." },
  autoHandoverReclaimedToast: { ar: "\u062A\u0645 \u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629.", en: "Responsibility reclaimed." },
  autoHandoverNoTargetToast: { ar: "\u062A\u0639\u0630\u0651\u0631 \u0646\u0642\u0644 \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629 \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627 \u2014 \u0627\u0644\u0634\u062E\u0635 \u0627\u0644\u0645\u0633\u062A\u0647\u062F\u0641 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D \u0648\u0644\u0627 \u064A\u0648\u062C\u062F \u0628\u062F\u064A\u0644 \u062D\u0627\u0636\u0631. \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u062D\u0627\u0644\u064A \u064A\u0641\u0636\u0644 \u0645\u0633\u0624\u0648\u0644\u0627\u064B \u0644\u062D\u064A\u0646 \u062A\u062F\u062E\u0644 \u064A\u062F\u0648\u064A.", en: "Could not auto-transfer responsibility \u2014 target unavailable and no present substitute. Current holder remains In Charge until manual intervention." },
  cannotDeleteInCharge: { ar: '\u0644\u0627 \u064A\u0645\u0643\u0646 \u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0634\u062E\u0635 \u0644\u0623\u0646\u0647 "\u0627\u0644\u0645\u0633\u0624\u0648\u0644" \u0627\u0644\u062D\u0627\u0644\u064A \u2014 \u064A\u062C\u0628 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629 \u0644\u0634\u062E\u0635 \u0622\u062E\u0631 \u0623\u0648\u0644\u0627\u064B.', en: 'This person cannot be deleted while they are the current "In Charge" \u2014 the responsibility must be handed over first.' },
  reclaimBtn: { ar: "\u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629", en: "Reclaim Responsibility" },
  tempDelegatedNotice: { ar: "\u0627\u0644\u0645\u0633\u0624\u0648\u0644\u064A\u0629 \u0645\u0641\u0648\u0651\u0636\u0629 \u0645\u0624\u0642\u062A\u064B\u0627 \u0644\u0632\u0645\u064A\u0644\u0643 \u2014 \u062A\u0642\u062F\u0631 \u062A\u0633\u062A\u0631\u062F\u0647\u0627 \u0628\u0623\u064A \u0648\u0642\u062A", en: "Responsibility is temporarily delegated to your colleague \u2014 you can reclaim it anytime" },
  searchPendingPlaceholder: { ar: "\u0628\u062D\u062B \u0628\u0627\u0644\u0639\u0646\u0648\u0627\u0646...", en: "Search by title..." },
  allDeptsFilter: { ar: "\u0643\u0644 \u0627\u0644\u0623\u0642\u0633\u0627\u0645", en: "All Departments" },
  inChargeSortBadge: { ar: "\u0645\u0633\u0624\u0648\u0644", en: "In Charge" },
  readingsHistoryTab: { ar: "\u0633\u062C\u0644 \u0627\u0644\u0642\u0631\u0627\u0621\u0627\u062A", en: "Readings History" },
  addReadingTab: { ar: "\u0625\u0636\u0627\u0641\u0629 \u0642\u0631\u0627\u0621\u0629 \u062C\u062F\u064A\u062F\u0629", en: "Add New Reading" },
  timeSlotLbl: { ar: "\u0648\u0642\u062A \u0627\u0644\u0642\u0631\u0627\u0621\u0629", en: "Reading Time" },
  takePhotoBtn: { ar: "\u0627\u0644\u062A\u0642\u0627\u0637 \u0635\u0648\u0631\u0629", en: "Take Photo" },
  uploadFileBtn: { ar: "\u0631\u0641\u0639 \u0645\u0644\u0641", en: "Upload File" },
  latestReportSection: { ar: "\u0622\u062E\u0631 \u062A\u0642\u0631\u064A\u0631", en: "Latest Report" },
  addReportSection: { ar: "\u0625\u0636\u0627\u0641\u0629 \u062A\u0642\u0631\u064A\u0631", en: "Add Report" },
  noReadingsForSlot: { ar: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0642\u0631\u0627\u0621\u0627\u062A \u0628\u0647\u0630\u0627 \u0627\u0644\u0648\u0642\u062A", en: "No readings for this time" },
  jumpToDateLbl: { ar: "\u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0644\u062A\u0627\u0631\u064A\u062E \u0645\u062D\u062F\u062F", en: "Jump to date" },
  recordVoiceBtn: { ar: "\u062A\u0633\u062C\u064A\u0644 \u0635\u0648\u062A\u064A", en: "Record Voice" },
  stopRecordingBtn: { ar: "\u0625\u064A\u0642\u0627\u0641", en: "Stop" },
  micNotSupported: { ar: "\u0627\u0644\u0645\u062A\u0635\u0641\u062D \u0644\u0627 \u064A\u062F\u0639\u0645 \u0627\u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0635\u0648\u062A\u064A.", en: "Browser doesn't support voice recording." },
  micPermissionDenied: { ar: "\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u0648\u0635\u0648\u0644 \u0644\u0644\u0645\u0627\u064A\u0643\u0631\u0648\u0641\u0648\u0646.", en: "Couldn't access the microphone." },
  voiceNoteLbl: { ar: "\u0645\u0644\u0627\u062D\u0638\u0629 \u0635\u0648\u062A\u064A\u0629", en: "Voice note" },
  attachMediaLbl: { ar: "\u0625\u0631\u0641\u0627\u0642 \u0648\u0633\u0627\u0626\u0637", en: "Attach Media" },
  equipmentTagOptLbl: { ar: "\u0627\u0644\u0645\u0639\u062F\u0629 \u0648\u0631\u0642\u0645 \u0627\u0644\u062A\u0627\u063A (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)", en: "Equipment & Tag Number (optional)" },
  searchByTaskTab: { ar: "\u0627\u0644\u0645\u0647\u0645\u0629", en: "Task" },
  searchByTagTab: { ar: "\u0631\u0642\u0645 \u0627\u0644\u062A\u0627\u063A", en: "Tag Number" },
  searchByDateTab: { ar: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E", en: "Date" },
  searchByEquipmentTab: { ar: "\u0627\u0644\u0645\u0639\u062F\u0629", en: "Equipment" },
  menu: { ar: "\u0627\u0644\u0642\u0627\u0626\u0645\u0629", en: "Menu" },
  eventList: { ar: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0623\u062D\u062F\u0627\u062B", en: "Event List" },
  logbook: { ar: "\u0633\u062C\u0644 \u0627\u0644\u0648\u0631\u062F\u064A\u0629", en: "Logbook" },
  readings: { ar: "\u0627\u0644\u0642\u0631\u0627\u0621\u0627\u062A", en: "Readings" },
  reportsMenu: { ar: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631", en: "Reports" },
  logbookDesc: { ar: "\u0627\u0644\u0628\u0644\u0627\u063A\u0627\u062A \u0627\u0644\u0639\u0627\u0644\u0642\u0629 \u0648\u062A\u062D\u062A \u0627\u0644\u0635\u064A\u0627\u0646\u0629 \u0644\u0647\u0630\u0647 \u0627\u0644\u0648\u0631\u062F\u064A\u0629\u060C \u0645\u0639 \u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0633\u062C\u0644.", en: "Open & in-maintenance reports for this shift, with export." },
  exportPdf: { ar: "\u062A\u0635\u062F\u064A\u0631 PDF", en: "Export PDF" },
  exportWord: { ar: "\u062A\u0635\u062F\u064A\u0631 Word", en: "Export Word" },
  readingsSoon: { ar: "\u0633\u062C\u0644 \u0627\u0644\u0642\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u062A\u0634\u063A\u064A\u0644\u064A\u0629 \u2014 \u0633\u064A\u064F\u0641\u0639\u0651\u0644 \u0641\u064A \u0645\u0631\u062D\u0644\u0629 \u0644\u0627\u062D\u0642\u0629.", en: "Operational readings log \u2014 coming in a later phase." },
  newReading: { ar: "\u0642\u0631\u0627\u0621\u0629 \u062C\u062F\u064A\u062F\u0629", en: "New Reading" },
  attachReadingFile: { ar: "\u0631\u0641\u0639 \u0645\u0644\u0641 \u0627\u0644\u0642\u0631\u0627\u0621\u0627\u062A", en: "Upload Readings File" },
  takePhoto: { ar: "\u0627\u0644\u062A\u0642\u0627\u0637 \u0635\u0648\u0631\u0629", en: "Take Photo" },
  removeFile: { ar: "\u0625\u0632\u0627\u0644\u0629", en: "Remove" },
  notesSectionTitle: { ar: "\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A", en: "Notes" },
  addNoteBtn: { ar: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0644\u0627\u062D\u0638\u0629", en: "Add Note" },
  addedNotes: { ar: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0645\u0636\u0627\u0641\u0629", en: "Added Notes" },
  severityLabel: { ar: "\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062E\u0637\u0648\u0631\u0629", en: "Severity" },
  saveReadingBtn: { ar: "\u062D\u0641\u0638 \u0627\u0644\u0642\u0631\u0627\u0621\u0629", en: "Save Reading" },
  noReadingsYet: { ar: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0642\u0631\u0627\u0621\u0627\u062A \u0645\u0633\u062C\u0651\u0644\u0629 \u0628\u0639\u062F", en: "No readings recorded yet" },
  previousReadings: { ar: "\u0627\u0644\u0642\u0631\u0627\u0621\u0627\u062A \u0627\u0644\u0633\u0627\u0628\u0642\u0629", en: "Previous Readings" },
  enteredByLbl: { ar: "\u0623\u062F\u062E\u0644\u0647\u0627:", en: "Entered by:" },
  attachmentLbl: { ar: "\u0627\u0644\u0645\u0631\u0641\u0642:", en: "Attachment:" },
  unitNameLbl: { ar: "\u0627\u0633\u0645 \u0627\u0644\u0648\u062D\u062F\u0629", en: "Unit Name" },
  tagNumberLbl: { ar: "\u062A\u0627\u063A \u0646\u0645\u0628\u0631", en: "Tag Number" },
  cancel: { ar: "\u0625\u0644\u063A\u0627\u0621", en: "Cancel" },
  prevDay: { ar: "\u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u0633\u0627\u0628\u0642", en: "Previous Day" },
  nextDay: { ar: "\u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u062A\u0627\u0644\u064A", en: "Next Day" },
  todayLbl: { ar: "\u0627\u0644\u064A\u0648\u0645", en: "Today" },
  newReportEntry: { ar: "\u062A\u0642\u0631\u064A\u0631 \u062C\u062F\u064A\u062F", en: "New Report" },
  attachReportFile: { ar: "\u0631\u0641\u0639 \u0645\u0644\u0641 \u0627\u0644\u062A\u0642\u0631\u064A\u0631", en: "Upload Report File" },
  previousReports: { ar: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u0633\u0627\u0628\u0642\u0629", en: "Previous Reports" },
  noReportsYet: { ar: "\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0642\u0627\u0631\u064A\u0631 \u0645\u0633\u062C\u0651\u0644\u0629 \u0628\u0639\u062F", en: "No reports recorded yet" },
  completedTasksSec: { ar: "\u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u0645\u0646\u062C\u0632\u0629", en: "Completed Tasks" },
  inProgressTasksSec: { ar: "\u0627\u0644\u0645\u0647\u0627\u0645 \u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630", en: "In Progress Tasks" },
  postponedTasksSec: { ar: "\u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u0645\u0624\u062C\u0644\u0629", en: "Postponed Tasks" },
  newIssuesSec: { ar: "\u0628\u0644\u0627\u063A\u0627\u062A \u062C\u062F\u064A\u062F\u0629 \u0627\u0644\u064A\u0648\u0645", en: "New Issues Today" },
  logbookEmpty: { ar: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0646\u0634\u0627\u0637 \u0645\u0633\u062C\u0651\u0644 \u0644\u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645", en: "No activity recorded for this day" },
  menuPermissionsTitle: { ar: "\u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0629", en: "Sidebar Menu Permissions" },
  menuPermissionsDesc: { ar: "\u062D\u062F\u0651\u062F \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u0638\u0627\u0647\u0631\u0629 \u0644\u0643\u0644 \u062F\u0648\u0631 \u0641\u064A \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0629.", en: "Choose which sidebar items are visible per role." },
  reportsSoon: { ar: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u062F\u0648\u0631\u064A\u0629 \u2014 \u0633\u062A\u064F\u0641\u0639\u0651\u0644 \u0641\u064A \u0645\u0631\u062D\u0644\u0629 \u0644\u0627\u062D\u0642\u0629.", en: "Periodic reports \u2014 coming in a later phase." },
  criticalOnly: { ar: "\u0628\u0644\u0627\u063A\u0627\u062A \u062D\u0631\u062C\u0629/\u0639\u0627\u0644\u064A\u0629 \u0641\u0642\u0637", en: "High / Critical reports only" },
  advisoryNote: { ar: "\u062F\u0648\u0631 \u0627\u0633\u062A\u0634\u0627\u0631\u064A: \u0639\u0631\u0636 \u0648\u062A\u0639\u0644\u064A\u0642 \u0641\u0642\u0637\u060C \u0628\u062F\u0648\u0646 \u062A\u0639\u062F\u064A\u0644 \u0645\u0628\u0627\u0634\u0631.", en: "Advisory role: view & comment only, no direct edits." },
  coordinatorNote: { ar: "\u0623\u0639\u0644\u0649 \u062F\u0631\u062C\u0629 \u0648\u0638\u064A\u0641\u064A\u0629: \u062A\u064F\u0639\u0631\u0636 \u0627\u0644\u0628\u0644\u0627\u063A\u0627\u062A \u0627\u0644\u062D\u0631\u062C\u0629/\u0627\u0644\u0639\u0627\u0644\u064A\u0629 \u0641\u0642\u0637.", en: "Top of hierarchy: high/critical reports only." },
  commentsLabel: { ar: "\u0627\u0644\u062A\u0639\u0644\u064A\u0642\u0627\u062A \u0648\u0627\u0644\u062A\u0648\u0635\u064A\u0627\u062A", en: "Comments & Recommendations" },
  addRecommendation: { ar: "\u0623\u0636\u0641 \u062A\u0648\u0635\u064A\u0629 \u0628\u0627\u0633\u0645", en: "Add recommendation as" },
  noReportsHere: { ar: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u0644\u0627\u063A\u0627\u062A \u062D\u0631\u062C\u0629 \u062D\u0627\u0644\u064A\u064B\u0627", en: "No critical reports right now" },
  storageNearFullWarning: { ar: "\u0645\u0633\u0627\u062D\u0629 \u0627\u0644\u062D\u0641\u0638 \u0627\u0644\u0645\u062D\u0644\u064A \u0628\u0627\u0644\u062C\u0647\u0627\u0632 \u0642\u0631\u0628\u062A \u062A\u0645\u062A\u0644\u0626 \u2014 \u064A\u064F\u0641\u0636\u0651\u0644 \u062A\u0635\u062F\u064A\u0631/\u062A\u0641\u0631\u064A\u063A \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0642\u062F\u064A\u0645\u0629 \u0642\u0631\u064A\u0628\u064B\u0627.", en: "Local device storage is getting full \u2014 consider exporting or clearing old data soon." },
  storageSaveFailedWarning: { ar: "\u062A\u0639\u0630\u0651\u0631 \u062D\u0641\u0638 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0645\u062D\u0644\u064A\u064B\u0627 \u0628\u0647\u0630\u0627 \u0627\u0644\u062C\u0647\u0627\u0632 (\u0627\u0644\u0645\u0633\u0627\u062D\u0629 \u0645\u0645\u062A\u0644\u0626\u0629 \u0623\u0648 \u0627\u0644\u0645\u062A\u0635\u0641\u062D \u064A\u0645\u0646\u0639 \u0627\u0644\u062D\u0641\u0638). \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0645\u0639\u0631\u0648\u0636\u0629 \u062D\u0627\u0644\u064A\u064B\u0627 \u0644\u0643\u0646\u0647\u0627 \u0642\u062F \u062A\u064F\u0641\u0642\u062F \u0639\u0646\u062F \u0627\u0644\u0625\u063A\u0644\u0627\u0642.", en: "Couldn't save data locally on this device (storage full or blocked by browser). Data is showing now but may be lost on close." }
};

// source/reviewEngine.js
function isShiftTurn(status) {
  return status === "submitted" || status === "returned_to_shift";
}
function isSectionTurn(status) {
  return status === "approved_by_shift" || status === "approved_final_night";
}
function sectionCanSee(status) {
  return status === "approved_by_shift" || status === "approved_final_night" || status === "approved_final";
}
function isNightPendingConfirmation(status) {
  return status === "approved_final_night";
}
function computeApproveNextStatus(currentStatus, context) {
  const { isShiftSupervisor, inCharge, onDuty, isNightGap, priority } = context;
  if (isShiftTurn(currentStatus)) {
    const nightShortcut = !!isShiftSupervisor && !!inCharge && !!onDuty && !!isNightGap && priority !== "high";
    return { status: nightShortcut ? "approved_final_night" : "approved_by_shift", nightShortcut };
  }
  if (isSectionTurn(currentStatus)) {
    return { status: "approved_final", nightShortcut: false, wasNightPending: currentStatus === "approved_final_night" };
  }
  return { status: currentStatus, nightShortcut: false };
}
function computeRerouteNextStatus(currentStatus) {
  if (isShiftTurn(currentStatus)) return "returned_to_operator";
  if (isSectionTurn(currentStatus)) return "returned_to_shift";
  return currentStatus;
}
function isTaskHiddenFromOperators(reviewStatus) {
  return reviewStatus === "pending_pre_approval" || reviewStatus === "returned_pre";
}
function isPreApprovalSectionTurn(reviewStatus) {
  return reviewStatus === "pending_pre_approval";
}
function isPreApprovalShiftTurn(reviewStatus) {
  return reviewStatus === "returned_pre";
}
function computeTaskEntryStatus(creatorRole, isNightGap) {
  if (creatorRole === "Shift Supervisor" && !isNightGap) return "pending_pre_approval";
  return "approved_to_start";
}
var PHASE_C_STATUSES = ["submitted", "approved_by_shift", "approved_final_night", "approved_final", "returned_to_shift", "returned_to_operator"];
function isPhaseCStatus(status) {
  return PHASE_C_STATUSES.includes(status);
}

// source/dateHelpers.js
function nowStamp(lang) {
  return (/* @__PURE__ */ new Date()).toLocaleString(lang === "en" ? "en-GB" : "ar", { calendar: "gregory", dateStyle: "medium", timeStyle: "short" });
}
function toISODate(d) {
  return d.toISOString().slice(0, 10);
}
function addDays(d, n) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
}
function weekKeyOf(iso) {
  const d = /* @__PURE__ */ new Date(iso + "T00:00:00");
  const start = addDays(d, -d.getDay());
  return toISODate(start);
}
function monthKeyOf(iso) {
  return iso.slice(0, 7);
}
function shiftWeekKey(key, n) {
  return toISODate(addDays(/* @__PURE__ */ new Date(key + "T00:00:00"), n * 7));
}
function shiftMonthKey(key, n) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function weekLabel(key, lang) {
  const start = key;
  const end = toISODate(addDays(/* @__PURE__ */ new Date(key + "T00:00:00"), 6));
  return lang === "ar" ? `\u0623\u0633\u0628\u0648\u0639 ${start} \u2192 ${end}` : `Week ${start} \u2192 ${end}`;
}
function monthLabel(key, lang) {
  const [y, m] = key.split("-").map(Number);
  const names = lang === "ar" ? ["\u064A\u0646\u0627\u064A\u0631", "\u0641\u0628\u0631\u0627\u064A\u0631", "\u0645\u0627\u0631\u0633", "\u0623\u0628\u0631\u064A\u0644", "\u0645\u0627\u064A\u0648", "\u064A\u0648\u0646\u064A\u0648", "\u064A\u0648\u0644\u064A\u0648", "\u0623\u063A\u0633\u0637\u0633", "\u0633\u0628\u062A\u0645\u0628\u0631", "\u0623\u0643\u062A\u0648\u0628\u0631", "\u0646\u0648\u0641\u0645\u0628\u0631", "\u062F\u064A\u0633\u0645\u0628\u0631"] : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${names[m - 1]} ${y}`;
}
function startOfWeek(d) {
  const day = d.getDay();
  const diff = (day + 1) % 7;
  return addDays(d, -diff);
}
var today = toISODate(/* @__PURE__ */ new Date());
function getTodayISO() {
  return toISODate(/* @__PURE__ */ new Date());
}
var tomorrow = toISODate(addDays(/* @__PURE__ */ new Date(), 1));
var in2days = toISODate(addDays(/* @__PURE__ */ new Date(), 2));
var in3days = toISODate(addDays(/* @__PURE__ */ new Date(), 3));
var nowTs = Date.now();

// source/seedData.js
var empNum = 4e3;
function nextEmpId() {
  return String(empNum++);
}
var NAME_POOL = ["Ahmed", "Khalid", "Fahad", "Saud", "Turki", "Bandar", "Majed", "Nawaf", "Abdulaziz", "Sultan", "Faisal", "Mishal", "Yousef", "Ibrahim", "Omar", "Ziad", "Waleed", "Nasser", "Saleh", "Hamad", "Rashed", "Talal", "Badr", "Mansour", "Hazza", "Salem", "Naif", "Fawaz", "Rakan", "Meshal", "Sami", "Adel", "Anas", "Karim", "Hassan", "Yasser", "Osama", "Marwan", "Riyad", "Adnan", "Jaber", "Suhail", "Amer"];
var pid = 1;
var DEPARTMENTS_SEED = ["Outside", "Turbine", "Utilities", "Control Panel"];
var seedPeople = [];
function addSeed(name, dept, role, admin) {
  const daynightRoles = ["Shift Supervisor", ...Object.values(DEPT_OPERATOR_ROLE)];
  const shift = daynightRoles.includes(role) ? pid % 2 === 0 ? "night" : "day" : "day";
  seedPeople.push({ id: pid++, name, employeeId: nextEmpId(), department: dept, role, isAdmin: !!admin, onLeave: false, shift, inCharge: false });
}
addSeed("Abdullah", "Control Panel", "App Admin", true);
var ni = 0;
var nm = () => NAME_POOL[ni++ % NAME_POOL.length];
DEPARTMENTS_SEED.forEach((d) => {
  for (let i = 0; i < 6; i++) addSeed(nm(), d, DEPT_OPERATOR_ROLE[d]);
});
DEPARTMENTS_SEED.forEach((d) => addSeed(nm(), d, "Section Supervisor"));
DEPARTMENTS_SEED.forEach((d) => addSeed(nm(), d, "Unit Supervisor"));
DEPARTMENTS_SEED.forEach((d) => {
  for (let i = 0; i < 2; i++) addSeed(nm(), d, "Shift Supervisor");
});
addSeed(nm(), "Control Panel", "Coordinator");
addSeed(nm(), "Outside", "Coordinator");
seedPeople[3].onLeave = true;
seedPeople[10].onLeave = true;
seedPeople[17].onLeave = true;
var sectionSups = seedPeople.filter((p) => p.role === "Section Supervisor");
if (sectionSups[0]) sectionSups[0].inCharge = true;
var shiftSupsDay = seedPeople.filter((p) => p.role === "Shift Supervisor" && p.shift === "day");
var shiftSupsNight = seedPeople.filter((p) => p.role === "Shift Supervisor" && p.shift === "night");
if (shiftSupsDay[0]) shiftSupsDay[0].inCharge = true;
if (shiftSupsNight[0]) shiftSupsNight[0].inCharge = true;
var nextPersonId = pid;
function opOf(dept, idx) {
  return seedPeople.filter((p) => p.department === dept && p.role === DEPT_OPERATOR_ROLE[dept])[idx];
}
function coordId() {
  return seedPeople.find((p) => p.role === "Coordinator").id;
}
var seedTasks = [
  {
    id: 1,
    title: "LNG Storage Tank Pressure Check",
    description: "Verify pressure readings on Tank-2 against SOP limits.",
    type: "public",
    privateTo: null,
    assignees: [opOf("Utilities", 0).id, opOf("Utilities", 1).id],
    department: "Utilities",
    priority: "high",
    createdBy: coordId(),
    createdAt: nowStamp("en"),
    status: "in_progress",
    completedAt: null,
    reviewStatus: "approved_to_start",
    dates: [today, tomorrow, in2days],
    startDate: today,
    endDate: in2days,
    startTime: "08:00",
    endTime: "",
    recurrence: { type: "none", weekdays: [], monthDays: [] },
    comments: [{ id: 1, author: opOf("Utilities", 0).name, text: "Readings within range, continuing monitoring.", at: nowStamp("en") }]
  },
  {
    id: 2,
    title: "Flare Stack Visual Inspection",
    description: "Daily visual check of flare tip and pilot flame.",
    type: "public",
    privateTo: null,
    assignees: [opOf("Outside", 0).id, opOf("Outside", 1).id, opOf("Outside", 2).id],
    department: "Outside",
    priority: "high",
    createdBy: coordId(),
    createdAt: nowStamp("en"),
    status: "not_started",
    completedAt: null,
    reviewStatus: "approved_to_start",
    dates: [today],
    startDate: today,
    endDate: today,
    startTime: "",
    endTime: "",
    recurrence: { type: "daily", weekdays: [], monthDays: [] },
    comments: []
  },
  {
    id: 3,
    title: "Turbine Vibration Monitoring",
    description: "Log vibration sensor data for GT-1 and compare to baseline.",
    type: "private",
    privateTo: opOf("Turbine", 0).id,
    assignees: [opOf("Turbine", 0).id],
    department: "Turbine",
    priority: "medium",
    createdBy: coordId(),
    createdAt: nowStamp("en"),
    status: "not_started",
    completedAt: null,
    reviewStatus: "approved_to_start",
    dates: [today],
    startDate: today,
    endDate: today,
    startTime: "",
    endTime: "",
    recurrence: { type: "none", weekdays: [], monthDays: [] },
    comments: []
  },
  {
    id: 4,
    title: "DCS Alarm Log Review",
    description: "Review overnight DCS alarms and close out nuisance alarms.",
    type: "public",
    privateTo: null,
    assignees: [opOf("Control Panel", 0).id],
    department: "Control Panel",
    priority: "medium",
    createdBy: coordId(),
    createdAt: nowStamp("en"),
    status: "completed",
    completedAt: today,
    reviewStatus: "approved_final",
    dates: [today],
    startDate: today,
    endDate: today,
    startTime: "",
    endTime: "",
    recurrence: { type: "none", weekdays: [], monthDays: [] },
    comments: []
  },
  {
    id: 5,
    title: "Emergency Generator Load Test",
    description: "Monthly load test for backup generator per maintenance calendar.",
    type: "public",
    privateTo: null,
    assignees: [opOf("Turbine", 1).id, opOf("Turbine", 2).id],
    department: "Turbine",
    priority: "high",
    createdBy: coordId(),
    createdAt: nowStamp("en"),
    status: "not_started",
    completedAt: null,
    reviewStatus: "approved_to_start",
    dates: [tomorrow],
    startDate: tomorrow,
    endDate: tomorrow,
    startTime: "",
    endTime: "",
    recurrence: { type: "monthly", weekdays: [], monthDays: [1] },
    comments: []
  },
  {
    id: 6,
    title: "Cooling Water Chlorine Dosing Check",
    description: "Verify chlorine dosing pump rate for cooling water system.",
    type: "public",
    privateTo: null,
    assignees: [opOf("Utilities", 2).id],
    department: "Utilities",
    priority: "low",
    createdBy: coordId(),
    createdAt: nowStamp("en"),
    status: "not_started",
    completedAt: null,
    reviewStatus: "approved_to_start",
    dates: [today],
    startDate: today,
    endDate: today,
    startTime: "",
    endTime: "",
    recurrence: { type: "weekly", weekdays: ["Sat", "Tue"], monthDays: [] },
    comments: []
  },
  {
    id: 7,
    title: "Jetty Loading Arm Inspection",
    description: "Inspect loading arm seals prior to next LNG carrier berthing.",
    type: "public",
    privateTo: null,
    assignees: [opOf("Outside", 3).id, opOf("Outside", 4).id],
    department: "Outside",
    priority: "high",
    createdBy: coordId(),
    createdAt: nowStamp("en"),
    status: "in_progress",
    completedAt: null,
    reviewStatus: "approved_to_start",
    dates: [today, tomorrow],
    startDate: today,
    endDate: tomorrow,
    startTime: "",
    endTime: "",
    recurrence: { type: "none", weekdays: [], monthDays: [] },
    comments: []
  },
  {
    id: 8,
    title: "Control Panel HMI Backup",
    description: "Weekly backup of HMI configuration to redundant server.",
    type: "public",
    privateTo: null,
    assignees: [opOf("Control Panel", 1).id],
    department: "Control Panel",
    priority: "low",
    createdBy: coordId(),
    createdAt: nowStamp("en"),
    status: "completed",
    completedAt: today,
    reviewStatus: "approved_final",
    dates: [today],
    startDate: today,
    endDate: today,
    startTime: "",
    endTime: "",
    recurrence: { type: "weekly", weekdays: ["Sun"], monthDays: [] },
    comments: []
  }
];
var seedProblems = [
  {
    id: 1,
    title: "Oil Leak at Turbine Base",
    reportedBy: opOf("Turbine", 3).id,
    department: "Turbine",
    location: "Area AB",
    categories: ["Turbine", "Mechanical"],
    equipmentName: "Gas Turbine GT-2",
    tagNumber: "301-HC-01A",
    priority: "high",
    description: "Visible oil leak under GT-2, needs urgent inspection.",
    createdAt: nowStamp("en"),
    dateISO: today,
    ts: nowTs - 1e3,
    reviewStatus: "submitted",
    workStatus: "open",
    editedNote: "",
    editedAt: "",
    comments: []
  },
  {
    id: 2,
    title: "Pressure Transmitter Fault",
    reportedBy: opOf("Control Panel", 2).id,
    department: "Control Panel",
    location: "Main Instrument Control Room (MICR)",
    categories: ["Instrument"],
    equipmentName: "PT-1042",
    tagNumber: "104-PT-42A",
    priority: "medium",
    description: "Erratic readings from pressure transmitter, suspected calibration drift.",
    createdAt: nowStamp("en"),
    dateISO: today,
    ts: nowTs - 9e5,
    reviewStatus: "approved_by_shift",
    workStatus: "in_maintenance",
    editedNote: "",
    editedAt: "",
    comments: []
  },
  {
    id: 3,
    title: "HVAC Unit Not Cooling",
    reportedBy: opOf("Utilities", 3).id,
    department: "Utilities",
    location: "Instrument Control Room (ICR)",
    categories: ["HVAC"],
    equipmentName: "AHU-3",
    tagNumber: "205-AH-03B",
    priority: "low",
    description: "Control room AHU-3 blowing warm air, filters checked and clear.",
    createdAt: nowStamp("en"),
    dateISO: today,
    ts: nowTs - 2e6,
    reviewStatus: "submitted",
    workStatus: "open",
    editedNote: "",
    editedAt: "",
    comments: []
  },
  {
    id: 4,
    title: "Flare Ignitor Intermittent Failure",
    reportedBy: opOf("Outside", 5).id,
    department: "Outside",
    location: "Area AD",
    categories: ["Automation", "General Service"],
    equipmentName: "Flare Ignitor FI-1",
    tagNumber: "410-FI-01",
    priority: "high",
    description: "Pilot ignitor failing to relight automatically, manual relight required twice this shift.",
    createdAt: nowStamp("en"),
    dateISO: today,
    ts: nowTs - 5e4,
    reviewStatus: "approved_final",
    workStatus: "resolved",
    editedNote: "",
    editedAt: "",
    comments: [{ id: 1, author: "Unit Supervisor", text: "Recommend checking ignitor spark gap during next shutdown.", at: nowStamp("en") }]
  }
];
var seedActivityLog = [
  { id: 1, taskTitle: "DCS Alarm Log Review", by: opOf("Control Panel", 0).name, at: nowStamp("en"), dateISO: today, ts: nowTs - 5e3 },
  { id: 2, taskTitle: "Control Panel HMI Backup", by: opOf("Control Panel", 1).name, at: nowStamp("en"), dateISO: today, ts: nowTs - 15e3 }
];
var nextLogIdCounter = 3;
var nextId = 9;
var nextCommentId = 2;
var nextProblemId = 5;
var nextReadingId = 1;
var nextReadingNoteId = 1;
var nextProblemMediaId = 1;
var nextVoiceNoteId = 1;
function getNextLogId() {
  return nextLogIdCounter++;
}
function getNextTaskId() {
  return nextId++;
}
function getNextCommentId() {
  return nextCommentId++;
}
function getNextProblemId() {
  return nextProblemId++;
}
function getNextReadingId() {
  return nextReadingId++;
}
function getNextReadingNoteId() {
  return nextReadingNoteId++;
}
function getNextProblemMediaId() {
  return nextProblemMediaId++;
}
function getNextVoiceNoteId() {
  return nextVoiceNoteId++;
}
function getNextPersonId() {
  return nextPersonId++;
}
function getNextEmpId() {
  return nextEmpId();
}
function syncCountersFromSnapshot(snap) {
  if (!snap) return;
  const maxOf = (arr, key = "id") => (Array.isArray(arr) ? arr : []).reduce((m, x) => Math.max(m, Number(x && x[key]) || 0), 0);
  const allComments = [
    ...snap.tasks || [],
    ...snap.problems || [],
    ...snap.readingsLog || [],
    ...snap.reportsLog || []
  ].flatMap((x) => x.comments || []);
  const allNotes = (snap.readingsLog || []).flatMap((r) => r.notes || []);
  const allMedia = (snap.problems || []).flatMap((p) => p.mediaFiles || []);
  const allVoice = (snap.problems || []).flatMap((p) => p.voiceNotes || []);
  nextId = Math.max(nextId, maxOf(snap.tasks) + 1);
  nextProblemId = Math.max(nextProblemId, maxOf(snap.problems) + 1);
  nextReadingId = Math.max(nextReadingId, maxOf(snap.readingsLog) + 1, maxOf(snap.reportsLog) + 1);
  nextLogIdCounter = Math.max(nextLogIdCounter, maxOf(snap.activityLog) + 1);
  nextPersonId = Math.max(nextPersonId, maxOf(snap.people) + 1);
  nextCommentId = Math.max(nextCommentId, maxOf(allComments) + 1);
  nextReadingNoteId = Math.max(nextReadingNoteId, maxOf(allNotes) + 1);
  nextProblemMediaId = Math.max(nextProblemMediaId, maxOf(allMedia) + 1);
  nextVoiceNoteId = Math.max(nextVoiceNoteId, maxOf(allVoice) + 1);
  const maxEmp = (snap.people || []).reduce((m, p) => Math.max(m, Number(p && p.employeeId) || 0), 0);
  if (maxEmp >= empNum) empNum = maxEmp + 1;
}

// source/persistence.js
var STORAGE_KEY = "ngl_taskmanager_data_v1";
var WARN_BYTES = 4 * 1024 * 1024;
function loadSnapshot() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (e) {
    return null;
  }
}
function saveSnapshot(data) {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, json);
    return { ok: true, warn: json.length > WARN_BYTES, sizeBytes: json.length };
  } catch (e) {
    return { ok: false, warn: true, error: e && e.name || "unknown" };
  }
}

// source/components/shared.jsx
import { Component } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Avatar(ctx, dept, size) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  const Icon = deptIcon(dept);
  const c = deptColor(dept);
  return /* @__PURE__ */ jsx("div", { style: { width: size, height: size, borderRadius: 10, border: "2px solid " + c.text, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: /* @__PURE__ */ jsx(Icon, { size: Math.round(size * 0.45), color: c.text }) });
}
function BtnContent(ctx, key, label) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  if (busyAction !== key) return label;
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center justify-center gap-2", children: [
    /* @__PURE__ */ jsx("span", { style: { width: 14, height: 14, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "ntmSpin 700ms linear infinite" } }),
    label
  ] });
}
function ConfirmDialog(ctx) {
  const { pendingConfirm, cancelConfirmDialog, runConfirmDialog, t } = ctx;
  if (!pendingConfirm) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(22,34,46,0.45)" }, onClick: cancelConfirmDialog, children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-xs rounded-xl p-4", style: { background: "#FFFFFF" }, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx("h3", { className: "text-base font-black mb-2", style: { color: "#16222E" }, children: pendingConfirm.title }),
    /* @__PURE__ */ jsx("p", { className: "text-sm mb-4", style: { color: "#5B6B79" }, children: pendingConfirm.message }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: cancelConfirmDialog, className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: "#F4F6F8", color: "#5B6B79", border: "1px solid #E2E8ED" }, children: pendingConfirm.cancelLabel || t("cancelBtn") }),
      /* @__PURE__ */ jsx("button", { onClick: runConfirmDialog, className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: pendingConfirm.danger ? "#C0392B" : "#1F4E79", color: "white" }, children: pendingConfirm.confirmLabel || t("confirmBtn") })
    ] })
  ] }) });
}
var ErrorBoundary = class extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
  }
  handleReload() {
    window.location.reload();
  }
  handleResetData() {
    try {
      localStorage.removeItem("ngl_taskmanager_data_v1");
    } catch (e) {
    }
    window.location.reload();
  }
  render() {
    if (!this.state.error) return this.props.children;
    const err = this.state.error;
    return /* @__PURE__ */ jsx("div", { dir: "rtl", style: { minHeight: "100vh", background: "#F4F6F8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Tajawal', sans-serif" }, children: /* @__PURE__ */ jsxs("div", { style: { width: "100%", maxWidth: 420, background: "#FFFFFF", borderRadius: 16, padding: 20, border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsx("h2", { style: { fontSize: 18, fontWeight: 900, color: "#C0392B", marginBottom: 8 }, children: "\u062D\u062F\u062B \u062E\u0637\u0623 \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639" }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "#5B6B79", marginBottom: 16 }, children: "\u0635\u0627\u0631 \u062E\u0637\u0623 \u0628\u0631\u0645\u062C\u064A \u0645\u0646\u0639 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0645\u0646 \u0627\u0644\u0627\u0633\u062A\u0645\u0631\u0627\u0631. \u0635\u0648\u0651\u0631 \u0647\u0630\u064A \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0648\u0623\u0631\u0633\u0644\u0647\u0627 \u0644\u0644\u0645\u0637\u0648\u0651\u0631 \u0639\u0634\u0627\u0646 \u0646\u0635\u0644\u062D\u0647\u0627 \u0628\u0633\u0631\u0639\u0629." }),
      /* @__PURE__ */ jsx("div", { style: { background: "#F4F6F8", borderRadius: 10, padding: 10, marginBottom: 16, maxHeight: 220, overflow: "auto" }, children: /* @__PURE__ */ jsxs("p", { style: { fontSize: 11, fontFamily: "monospace", color: "#16222E", whiteSpace: "pre-wrap", direction: "ltr", textAlign: "left" }, children: [
        String(err && err.message || err),
        "\n\n",
        err && err.stack ? String(err.stack).split("\n").slice(0, 8).join("\n") : ""
      ] }) }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsx("button", { onClick: () => this.handleReload(), style: { flex: 1, fontSize: 13, fontWeight: 700, padding: "10px 0", borderRadius: 10, background: "#1F4E79", color: "white", border: "none" }, children: "\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629" }),
        /* @__PURE__ */ jsx("button", { onClick: () => this.handleResetData(), style: { flex: 1, fontSize: 13, fontWeight: 700, padding: "10px 0", borderRadius: 10, background: "#FBE7E4", color: "#C0392B", border: "none" }, children: "\u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062D\u0644\u064A\u0629" })
      ] }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 10, color: "#8A97A3", marginTop: 10 }, children: '\u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062D\u0644\u064A\u0629 \u064A\u0645\u0633\u062D \u0643\u0644 \u0634\u064A \u0645\u062D\u0641\u0648\u0638 \u0628\u0647\u0630\u0627 \u0627\u0644\u062C\u0647\u0627\u0632 \u0648\u064A\u0631\u062C\u0651\u0639 \u0628\u064A\u0627\u0646\u0627\u062A \u062A\u062C\u0631\u064A\u0628\u064A\u0629. \u0627\u0633\u062A\u062E\u062F\u0645\u0647 \u0628\u0633 \u0644\u0648 "\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629" \u0645\u0627 \u0646\u0641\u0639\u062A.' })
    ] }) });
  }
};

// source/components/TaskComponents.jsx
import { Trash2, Pencil, Lock, Globe2, ChevronDown, ChevronUp, Send as Send2, CheckCircle2, CalendarDays as CalendarDays2, AlertTriangle as AlertTriangle2, X, Play, Repeat, Check as Check2 } from "lucide-react";

// source/components/ReviewBlock.jsx
import { Send, Check } from "lucide-react";
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function ReviewBlock(ctx, item, reviewFn, ownerId) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    viewerOnDuty,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  const status = item.reviewStatus;
  const meta = REVIEW_STATUS_META[status] || REVIEW_STATUS_META.submitted;
  const myTurnRole = isShiftSupervisor && isShiftTurn(status) || isSectionSupervisor && isSectionTurn(status);
  const myTurn = myTurnRole && !!viewer.inCharge && !!viewerOnDuty;
  const offDutyBlocked = myTurnRole && !!viewer.inCharge && !viewerOnDuty;
  const canResubmit = status === "returned_to_operator" && viewerRole === "operator" && (Array.isArray(ownerId) ? ownerId.includes(currentUserId) : ownerId === currentUserId);
  const draft = entryCommentDraft.id === item.id ? entryCommentDraft.text : "";
  const setDraft = (v) => setEntryCommentDraft({ id: item.id, text: v });
  const clearDraft = () => setEntryCommentDraft({ id: null, text: "" });
  return /* @__PURE__ */ jsxs2("div", { className: "mt-2 pt-2 flex flex-col gap-2", style: { borderTop: "1px solid #EEF1F4" }, children: [
    /* @__PURE__ */ jsx2("span", { className: "text-[11px] font-black px-2 py-1 rounded-full self-start", style: { background: meta.bg, color: meta.color }, children: meta[lang] || meta.ar }),
    (item.comments || []).length > 0 && /* @__PURE__ */ jsx2("div", { className: "flex flex-col gap-1.5", children: item.comments.map((c) => /* @__PURE__ */ jsxs2("div", { className: "rounded-lg px-3 py-2 text-xs", style: { background: "#F4F6F8" }, children: [
      /* @__PURE__ */ jsxs2("div", { className: "flex justify-between mb-0.5", children: [
        /* @__PURE__ */ jsx2("b", { style: { color: "#16222E" }, children: c.author }),
        /* @__PURE__ */ jsx2("span", { style: { color: "#8A97A3" }, children: c.at })
      ] }),
      /* @__PURE__ */ jsx2("p", { style: { color: "#5B6B79" }, children: c.text })
    ] }, c.id)) }),
    canResubmit && /* @__PURE__ */ jsx2("button", { onClick: () => runWithBusy("resubmit_" + item.id, () => {
      reviewFn(item.id, "resubmit");
      clearDraft();
    }), className: "text-xs font-bold py-2 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: BtnContent(ctx, "resubmit_" + item.id, t("resubmitBtn")) }),
    /* @__PURE__ */ jsxs2("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx2("input", { value: draft, onChange: (e) => setDraft(e.target.value), placeholder: myTurn ? t("rerouteNotePlaceholder") : t("addCommentBtn"), className: "flex-1 text-xs outline-none", style: { ...inputStyle, padding: "8px 10px" } }),
      /* @__PURE__ */ jsx2("button", { onClick: () => {
        if (draft.trim()) {
          reviewFn(item.id, "comment", draft);
          clearDraft();
        }
      }, className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0", style: { background: "#1F4E79" }, children: /* @__PURE__ */ jsx2(Send, { size: 13, color: "white" }) })
    ] }),
    myTurn && /* @__PURE__ */ jsxs2("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx2("button", { onClick: () => runWithBusy("approve_" + item.id, () => {
        reviewFn(item.id, "approve");
        clearDraft();
      }), className: "flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg", style: { background: "#2F7D4F", color: "white" }, children: busyAction === "approve_" + item.id ? BtnContent(ctx, "approve_" + item.id, isShiftTurn(status) ? t("approve") : isNightPendingConfirmation(status) ? t("confirmNightBtn") : t("approveFinal")) : /* @__PURE__ */ jsxs2(Fragment, { children: [
        /* @__PURE__ */ jsx2(Check, { size: 14 }),
        " ",
        isShiftTurn(status) ? t("approve") : isNightPendingConfirmation(status) ? t("confirmNightBtn") : t("approveFinal")
      ] }) }),
      /* @__PURE__ */ jsx2("button", { onClick: () => runWithBusy("reroute_" + item.id, () => {
        reviewFn(item.id, "reroute", draft);
        clearDraft();
      }), className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: "#C0392B", color: "white" }, children: BtnContent(ctx, "reroute_" + item.id, isNightPendingConfirmation(status) ? t("rejectNightBtn") : t("reroute")) })
    ] }),
    offDutyBlocked && /* @__PURE__ */ jsx2("p", { className: "text-[11px] rounded-lg px-2.5 py-2", style: { background: "#FFF6EB", color: "#B25E09" }, children: t("offDutyNotice") })
  ] });
}

// source/components/TaskComponents.jsx
import { useRef } from "react";
import { Fragment as Fragment2, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function TaskPreApprovalBlock(ctx) {
  const { tasksPendingPreApproval, approveTaskPre, rejectTaskPre, deptColor, personLabel, t, inputStyle, entryCommentDraft, setEntryCommentDraft, runWithBusy, busyAction, pendingSearch, setPendingSearch, pendingFilterDept, setPendingFilterDept, departments } = ctx;
  if (!tasksPendingPreApproval || tasksPendingPreApproval.length === 0) return null;
  const q = (pendingSearch || "").trim().toLowerCase();
  const list = tasksPendingPreApproval.filter(
    (tk) => (pendingFilterDept === "all" || tk.department === pendingFilterDept) && (!q || tk.title.toLowerCase().includes(q))
  );
  return /* @__PURE__ */ jsxs3("div", { className: "flex flex-col gap-2.5 mb-4", children: [
    /* @__PURE__ */ jsx3("h3", { className: "text-sm font-black px-1", style: { color: "#B25E09" }, children: t("taskPendingApprovalTitle") }),
    tasksPendingPreApproval.length > 2 && /* @__PURE__ */ jsxs3("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx3("input", { value: pendingSearch, onChange: (e) => setPendingSearch(e.target.value), placeholder: t("searchPendingPlaceholder"), className: "flex-1 text-xs outline-none", style: { ...inputStyle, padding: "8px 10px" } }),
      /* @__PURE__ */ jsxs3("select", { value: pendingFilterDept, onChange: (e) => setPendingFilterDept(e.target.value), className: "text-xs outline-none rounded-lg px-2", style: { ...inputStyle, padding: "8px 6px" }, children: [
        /* @__PURE__ */ jsx3("option", { value: "all", children: t("allDeptsFilter") }),
        (departments || []).map((d) => /* @__PURE__ */ jsx3("option", { value: d, children: d }, d))
      ] })
    ] }),
    list.length === 0 && /* @__PURE__ */ jsx3("p", { className: "text-xs text-center py-3", style: { color: "#8A97A3" }, children: "\u2014" }),
    list.map((tk) => {
      const draft = entryCommentDraft.id === "pre_" + tk.id ? entryCommentDraft.text : "";
      const setDraft = (v) => setEntryCommentDraft({ id: "pre_" + tk.id, text: v });
      return /* @__PURE__ */ jsxs3("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #F0C57A" }, children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
          /* @__PURE__ */ jsx3("h4", { className: "text-sm font-black", style: { color: "#16222E" }, children: tk.title }),
          /* @__PURE__ */ jsx3("span", { className: "text-[11px] font-bold px-2 py-0.5 rounded-full", style: { background: deptColor(tk.department).bg, color: deptColor(tk.department).text }, children: tk.department })
        ] }),
        /* @__PURE__ */ jsx3("p", { className: "text-xs mb-2", style: { color: "#5B6B79" }, children: tk.description }),
        /* @__PURE__ */ jsxs3("p", { className: "text-[11px] mb-3", style: { color: "#8A97A3" }, children: [
          t("createdByLbl"),
          " ",
          personLabel(tk.createdBy)
        ] }),
        /* @__PURE__ */ jsx3("div", { className: "flex gap-2 mb-2", children: /* @__PURE__ */ jsx3("input", { value: draft, onChange: (e) => setDraft(e.target.value), placeholder: t("taskRejectPlaceholder"), className: "flex-1 text-xs outline-none", style: { ...inputStyle, padding: "8px 10px" } }) }),
        /* @__PURE__ */ jsxs3("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs3("button", { onClick: () => runWithBusy("taskpre_approve_" + tk.id, () => approveTaskPre(tk.id)), className: "flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg", style: { background: "#2F7D4F", color: "white" }, children: [
            /* @__PURE__ */ jsx3(Check2, { size: 14 }),
            " ",
            t("taskApproveBtn")
          ] }),
          /* @__PURE__ */ jsx3("button", { onClick: () => {
            rejectTaskPre(tk.id, draft);
            setDraft("");
          }, className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: "#C0392B", color: "white" }, children: t("taskRejectBtn") })
        ] })
      ] }, tk.id);
    })
  ] });
}
function TaskReturnedPreBlock(ctx) {
  const { tasksReturnedPre, deptColor, t, startEditTask } = ctx;
  if (!tasksReturnedPre || tasksReturnedPre.length === 0) return null;
  return /* @__PURE__ */ jsxs3("div", { className: "flex flex-col gap-2.5 mb-4", children: [
    /* @__PURE__ */ jsx3("h3", { className: "text-sm font-black px-1", style: { color: "#C0392B" }, children: t("taskReturnedTitle") }),
    tasksReturnedPre.map((tk) => {
      const lastComment = tk.comments && tk.comments.length > 0 ? tk.comments[tk.comments.length - 1] : null;
      return /* @__PURE__ */ jsxs3("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #F3B5AC" }, children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
          /* @__PURE__ */ jsx3("h4", { className: "text-sm font-black", style: { color: "#16222E" }, children: tk.title }),
          /* @__PURE__ */ jsx3("span", { className: "text-[11px] font-bold px-2 py-0.5 rounded-full", style: { background: deptColor(tk.department).bg, color: deptColor(tk.department).text }, children: tk.department })
        ] }),
        lastComment && /* @__PURE__ */ jsxs3("div", { className: "rounded-lg px-3 py-2 mb-2 text-xs", style: { background: "#FBE7E4" }, children: [
          /* @__PURE__ */ jsxs3("b", { style: { color: "#16222E" }, children: [
            lastComment.author,
            ":"
          ] }),
          " ",
          /* @__PURE__ */ jsx3("span", { style: { color: "#5B6B79" }, children: lastComment.text })
        ] }),
        /* @__PURE__ */ jsx3("button", { onClick: () => startEditTask(tk), className: "text-xs font-bold py-2 px-4 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: t("taskEditResendBtn") })
      ] }, tk.id);
    })
  ] });
}
function StatusControl(ctx, task) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  if (task.status === "not_started") return /* @__PURE__ */ jsxs3("button", { onClick: () => setStatus(task.id, "in_progress"), className: "flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: [
    /* @__PURE__ */ jsx3(Play, { size: 11 }),
    " ",
    t("start")
  ] });
  if (task.status === "in_progress") return /* @__PURE__ */ jsxs3("button", { onClick: () => setStatus(task.id, "completed"), className: "flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: "#2F7D4F", color: "white" }, children: [
    /* @__PURE__ */ jsx3(CheckCircle2, { size: 11 }),
    " ",
    t("markDone")
  ] });
  return /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxs3("span", { className: "flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: "#E4F3EA", color: "#2F7D4F" }, children: [
      /* @__PURE__ */ jsx3(CheckCircle2, { size: 11 }),
      " ",
      t("completed")
    ] }),
    /* @__PURE__ */ jsx3("button", { onClick: () => setStatus(task.id, "in_progress"), className: "text-[11px] underline", style: { color: "#8A97A3" }, children: t("reopen") })
  ] });
}
function TaskCard(ctx, task, showDept, numberIdx) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart,
    reviewTask
  } = ctx;
  const isExpanded = expandedId === task.id;
  const pr = PRIORITY[task.priority] || PRIORITY.medium;
  const inReview = isPhaseCStatus(task.reviewStatus);
  const reviewMeta = inReview ? REVIEW_STATUS_META[task.reviewStatus] || REVIEW_STATUS_META.submitted : null;
  return /* @__PURE__ */ jsxs3("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
    /* @__PURE__ */ jsxs3("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
          numberIdx != null && /* @__PURE__ */ jsxs3("span", { className: "text-xs font-black", style: { color: "#8A97A3" }, children: [
            numberIdx,
            "."
          ] }),
          /* @__PURE__ */ jsx3("h3", { className: "text-base font-black", style: { color: "#16222E" }, children: task.title }),
          /* @__PURE__ */ jsx3("span", { className: "text-[11px] font-bold px-2 py-0.5 rounded-full", style: { background: pr.bg, color: pr.color }, children: pr[lang] || pr.ar }),
          showDept && /* @__PURE__ */ jsx3("span", { className: "text-[11px] font-bold px-2 py-0.5 rounded-full", style: { background: deptColor(task.department).bg, color: deptColor(task.department).text }, children: task.department }),
          task.type === "private" && /* @__PURE__ */ jsxs3("span", { className: "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full", style: { background: "#FBEEDF", color: "#B25E09" }, children: [
            /* @__PURE__ */ jsx3(Lock, { size: 11 }),
            " ",
            t("private")
          ] }),
          task.recurrenceGroupId && /* @__PURE__ */ jsxs3("span", { className: "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full", style: { background: "#E9F3FB", color: "#0E7490" }, children: [
            /* @__PURE__ */ jsx3(Repeat, { size: 11 }),
            " ",
            t("recurringBadge")
          ] }),
          reviewMeta && /* @__PURE__ */ jsx3("span", { className: "text-[11px] font-bold px-2 py-0.5 rounded-full", style: { background: reviewMeta.bg, color: reviewMeta.color }, children: reviewMeta[lang] || reviewMeta.ar })
        ] }),
        /* @__PURE__ */ jsx3("p", { className: "text-xs", style: { color: "#5B6B79" }, children: (task.dates || []).join(", ") || `${task.startDate} \u2192 ${task.endDate}` })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-1 shrink-0", children: [
        canManage && /* @__PURE__ */ jsxs3(Fragment2, { children: [
          /* @__PURE__ */ jsx3("button", { onClick: () => startEditTask(task), className: "w-7 h-7 rounded-md flex items-center justify-center", style: { color: "#5B6B79" }, children: /* @__PURE__ */ jsx3(Pencil, { size: 14 }) }),
          /* @__PURE__ */ jsx3("button", { onClick: () => deleteTask(task.id), className: "w-7 h-7 rounded-md flex items-center justify-center", style: { color: "#C0392B" }, children: /* @__PURE__ */ jsx3(Trash2, { size: 14 }) })
        ] }),
        /* @__PURE__ */ jsx3("button", { onClick: () => setExpandedId(isExpanded ? null : task.id), className: "w-7 h-7 rounded-md flex items-center justify-center", style: { color: "#1F4E79" }, children: isExpanded ? /* @__PURE__ */ jsx3(ChevronUp, { size: 16 }) : /* @__PURE__ */ jsx3(ChevronDown, { size: 16 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx3("div", { className: "mt-3 pt-3 flex items-center gap-2", style: { borderTop: "1px solid #EEF1F4" }, children: StatusControl(ctx, task) }),
    isExpanded && /* @__PURE__ */ jsxs3("div", { className: "mt-3 pt-3 flex flex-col gap-2 text-xs", style: { borderTop: "1px solid #EEF1F4", color: "#5B6B79" }, children: [
      task.description && /* @__PURE__ */ jsx3("p", { children: task.description }),
      /* @__PURE__ */ jsxs3("p", { children: [
        t("createdByLbl"),
        " ",
        /* @__PURE__ */ jsx3("b", { style: { color: "#16222E" }, children: personLabel(task.createdBy) }),
        " \u2014 ",
        task.createdAt
      ] }),
      /* @__PURE__ */ jsxs3("p", { children: [
        t("assignedToLbl"),
        " ",
        /* @__PURE__ */ jsx3("b", { style: { color: "#16222E" }, children: task.assignees.map((id) => personLabel(id)).join(", ") || "\u2014" })
      ] }),
      task.recurrence && task.recurrence.type !== "none" && /* @__PURE__ */ jsxs3("p", { children: [
        t("recurrence"),
        ": ",
        /* @__PURE__ */ jsx3("b", { style: { color: "#16222E" }, children: task.recurrence.type === "daily" ? t("recDaily") : task.recurrence.type === "weekly" ? task.recurrence.weekdays.join(", ") : task.recurrence.monthDays.join(", ") })
      ] }),
      inReview ? ReviewBlock(ctx, task, reviewTask, task.assignees) : /* @__PURE__ */ jsxs3("div", { className: "mt-2 flex flex-col gap-2", children: [
        task.comments.map((c) => /* @__PURE__ */ jsxs3("div", { className: "rounded-lg px-3 py-2", style: { background: "#F4F6F8" }, children: [
          /* @__PURE__ */ jsxs3("div", { className: "flex justify-between mb-0.5", children: [
            /* @__PURE__ */ jsx3("b", { style: { color: "#16222E" }, children: c.author }),
            /* @__PURE__ */ jsx3("span", { style: { color: "#8A97A3" }, children: c.at })
          ] }),
          /* @__PURE__ */ jsx3("p", { children: c.text })
        ] }, c.id)),
        /* @__PURE__ */ jsxs3("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx3("input", { value: commentDraft, onChange: (e) => setCommentDraft(e.target.value), onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addComment(task.id);
            }
          }, placeholder: `${t("commentPH")} ${actingAs}...`, className: "flex-1 text-xs outline-none", style: { ...inputStyle, padding: "8px 10px" } }),
          /* @__PURE__ */ jsx3("button", { onClick: () => addComment(task.id), className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0", style: { background: "#1F4E79" }, children: /* @__PURE__ */ jsx3(Send2, { size: 13, color: "white" }) })
        ] })
      ] })
    ] })
  ] }, task.id);
}
function AlertsBlock(ctx) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  if (alerts.length === 0) return null;
  return /* @__PURE__ */ jsx3("div", { className: "flex flex-col gap-2 mb-4", children: alerts.map((tk) => /* @__PURE__ */ jsxs3("div", { className: "rounded-xl p-3.5 flex flex-col gap-2", style: { background: "#FFF6EB", border: "1px solid #F0C57A" }, children: [
    /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx3(AlertTriangle2, { size: 16, color: "#B25E09" }),
        /* @__PURE__ */ jsxs3("span", { className: "text-sm", style: { color: "#5B4321" }, children: [
          t("dueSoon"),
          " ",
          /* @__PURE__ */ jsxs3("span", { className: "text-base font-black", children: [
            "\xAB",
            tk.title,
            "\xBB"
          ] }),
          " \u2014 ",
          t("isDone")
        ] })
      ] }),
      extendingAlertId !== tk.id && /* @__PURE__ */ jsxs3("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx3("button", { onClick: () => setStatus(tk.id, "completed"), className: "text-xs font-bold px-3 py-1.5 rounded-lg", style: { background: "#2F7D4F", color: "white" }, children: t("yesDone") }),
        /* @__PURE__ */ jsx3("button", { onClick: () => {
          setExtendingAlertId(tk.id);
          setExtendDate(tk.endDate);
          setExtendComment("");
        }, className: "text-xs font-bold px-3 py-1.5 rounded-lg", style: { background: "#FFFFFF", color: "#5B6B79", border: "1px solid #E2E8ED" }, children: t("postpone") })
      ] })
    ] }),
    extendingAlertId === tk.id && /* @__PURE__ */ jsxs3("div", { className: "flex flex-col gap-2 mt-1", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex flex-col sm:flex-row gap-2", children: [
        /* @__PURE__ */ jsx3("input", { type: "date", value: extendDate, onChange: (e) => setExtendDate(e.target.value), className: "text-sm outline-none flex-1", style: inputStyle }),
        /* @__PURE__ */ jsx3("textarea", { value: extendComment, onChange: (e) => setExtendComment(e.target.value), placeholder: t("postponeReasonReq"), rows: 2, className: "text-sm outline-none flex-[2] resize-none", style: inputStyle })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "flex gap-2 self-start", children: [
        /* @__PURE__ */ jsx3("button", { disabled: !extendComment.trim(), onClick: () => confirmExtend(tk.id), className: "text-xs font-bold px-4 py-1.5 rounded-lg", style: { background: extendComment.trim() ? "#1F4E79" : "#C3CBD1", color: "white" }, children: t("confirmPostpone") }),
        /* @__PURE__ */ jsx3("button", { onClick: () => setExtendingAlertId(null), className: "text-xs font-bold px-4 py-1.5 rounded-lg", style: { background: "#FFFFFF", color: "#5B6B79", border: "1px solid #E2E8ED" }, children: t("back") })
      ] })
    ] })
  ] }, tk.id)) });
}
function RenewalReviewBlock(ctx) {
  const { renewalGroups, confirmRenewalGroups, isShiftSupervisor, t, lang } = ctx;
  if (!isShiftSupervisor || !renewalGroups || renewalGroups.length === 0) return null;
  return /* @__PURE__ */ jsxs3("div", { className: "rounded-xl p-3.5 mb-4 flex flex-col gap-3", style: { background: "#FFF6EB", border: "1px solid #F0C57A" }, children: [
    /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx3("p", { className: "text-sm font-black", style: { color: "#5B4321" }, children: t("renewalReviewTitle") }),
        /* @__PURE__ */ jsx3("p", { className: "text-xs mt-0.5", style: { color: "#8A6A2E" }, children: t("renewalReviewDesc") })
      ] }),
      /* @__PURE__ */ jsx3("button", { onClick: () => confirmRenewalGroups(renewalGroups.map((g) => g.groupId)), className: "text-xs font-bold px-3 py-1.5 rounded-lg shrink-0", style: { background: "#2F7D4F", color: "white" }, children: t("confirmAllBtn") })
    ] }),
    /* @__PURE__ */ jsx3("div", { className: "flex flex-col gap-2", children: renewalGroups.map((g) => /* @__PURE__ */ jsxs3("div", { className: "rounded-lg p-2.5 flex items-center justify-between gap-3", style: { background: "#FFFFFF", border: "1px solid #F0C57A" }, children: [
      /* @__PURE__ */ jsxs3("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx3("p", { className: "text-sm font-bold truncate", style: { color: "#16222E" }, children: g.template.title }),
        /* @__PURE__ */ jsxs3("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
          g.template.department,
          " \xB7 ",
          g.template.recurrence.type === "daily" ? t("recDaily") : g.template.recurrence.type === "weekly" ? t("recWeekly") : t("recMonthly")
        ] })
      ] }),
      /* @__PURE__ */ jsx3("button", { onClick: () => confirmRenewalGroups([g.groupId]), className: "text-xs font-bold px-3 py-1.5 rounded-lg shrink-0", style: { background: "#1F4E79", color: "white" }, children: t("confirmBtn") })
    ] }, g.groupId)) })
  ] });
}
function MiniMonthGrid(ctx, monthDate, selectedDates, onToggle) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  const mStart = startOfWeek(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1));
  const grid = Array.from({ length: 42 }, (_, i) => addDays(mStart, i));
  return /* @__PURE__ */ jsxs3("div", { className: "rounded-lg overflow-hidden", style: { border: "1px solid #DCE3E8" }, children: [
    /* @__PURE__ */ jsx3("div", { className: "grid grid-cols-7", style: { background: "#F4F6F8" }, children: WEEKDAYS.map((w) => /* @__PURE__ */ jsx3("div", { className: "text-[10px] font-bold text-center py-1.5", style: labelStyle, children: w }, w)) }),
    /* @__PURE__ */ jsx3("div", { className: "grid grid-cols-7", children: grid.map((d) => {
      const ds = toISODate(d);
      const inMonth = d.getMonth() === monthDate.getMonth();
      const active = selectedDates.includes(ds);
      const isToday = ds === today2;
      return /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => onToggle(ds), className: "h-9 text-xs font-bold", style: { background: active ? "#1F4E79" : "#FFFFFF", color: active ? "white" : inMonth ? "#16222E" : "#C3CBD1", border: isToday && !active ? "1px solid #1F4E79" : "1px solid #EEF1F4" }, children: d.getDate() }, ds);
    }) })
  ] });
}
function TaskFormPanel({ ctx }) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  const taskTagRef2 = useRef(null), taskTagRef3 = useRef(null);
  return /* @__PURE__ */ jsxs3("form", { ref: formRef, onSubmit: submitTask, className: "rounded-xl p-4 mb-4 flex flex-col gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
    /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx3("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: editingId ? t("editTask") : t("newTask") }),
      /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => {
        setShowTaskForm(false);
        setEditingId(null);
      }, children: /* @__PURE__ */ jsx3(X, { size: 16, color: "#8A97A3" }) })
    ] }),
    /* @__PURE__ */ jsx3("input", { value: taskForm.title, onChange: (e) => setTaskForm({ ...taskForm, title: e.target.value }), placeholder: t("taskTitle"), className: "w-full text-sm outline-none", style: inputStyle }),
    /* @__PURE__ */ jsx3("textarea", { value: taskForm.description, onChange: (e) => setTaskForm({ ...taskForm, description: e.target.value }), placeholder: t("descOpt"), rows: 2, className: "w-full text-sm outline-none resize-none", style: inputStyle }),
    /* @__PURE__ */ jsxs3("div", { children: [
      /* @__PURE__ */ jsx3("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("equipmentTagOptLbl") }),
      /* @__PURE__ */ jsx3("input", { value: taskForm.equipmentName, onChange: (e) => setTaskForm({ ...taskForm, equipmentName: e.target.value }), placeholder: t("equipmentName"), className: "w-full text-sm outline-none mb-1.5", style: inputStyle }),
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx3("input", { value: taskForm.tag1, onChange: (e) => setTaskForm({ ...taskForm, tag1: e.target.value.replace(/[^0-9]/g, "").slice(0, 3) }), onKeyDown: (e) => handleTagKey(e, taskTagRef2), placeholder: "301", maxLength: 3, className: "w-14 text-sm font-bold text-center outline-none", style: inputStyle }),
        /* @__PURE__ */ jsx3("span", { style: { color: "#8A97A3" }, children: "-" }),
        /* @__PURE__ */ jsx3("input", { ref: taskTagRef2, value: taskForm.tag2, onChange: (e) => setTaskForm({ ...taskForm, tag2: e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 5) }), onKeyDown: (e) => handleTagKey(e, taskTagRef3), placeholder: "HVACS", maxLength: 5, className: "w-20 text-sm font-bold text-center outline-none", style: inputStyle }),
        /* @__PURE__ */ jsx3("span", { style: { color: "#8A97A3" }, children: "-" }),
        /* @__PURE__ */ jsx3("input", { ref: taskTagRef3, value: taskForm.tag3, onChange: (e) => setTaskForm({ ...taskForm, tag3: e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8) }), placeholder: "01A", maxLength: 8, className: "w-24 text-sm font-bold text-center outline-none", style: { ...inputStyle, textTransform: "uppercase" } })
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { children: [
      /* @__PURE__ */ jsx3("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("department") }),
      /* @__PURE__ */ jsx3("div", { className: "flex flex-col gap-1.5", children: departments.map((d) => /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => selectDeptForTask(d), className: "flex-1 flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-lg text-left", style: { background: taskForm.department === d ? "#1F4E79" : "#F4F6F8", color: taskForm.department === d ? "white" : "#5B6B79" }, children: d }),
        /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => openCustomizeForTask(d), className: "text-xs font-bold px-3 py-2 rounded-lg shrink-0", style: { background: customizeDept === d ? "#B25E09" : "#F4F6F8", color: customizeDept === d ? "white" : "#5B6B79" }, children: t("customize") })
      ] }, d)) }),
      customizeDept && /* @__PURE__ */ jsx3("div", { className: "mt-2 p-2 rounded-lg flex flex-wrap gap-2", style: { background: "#F9FAFB", border: "1px solid #EEF1F4" }, children: departmentOperators(customizeDept).filter((p) => !p.onLeave).map((p) => {
        const active = taskForm.assignees.includes(p.id);
        return /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => toggleAssignee(p.id), className: "text-xs font-bold px-3 py-1.5 rounded-full", style: { background: active ? "#1F4E79" : "#FFFFFF", color: active ? "white" : "#5B6B79", border: "1px solid " + (active ? "#1F4E79" : "#E2E8ED") }, children: p.name }, p.id);
      }) }),
      /* @__PURE__ */ jsxs3("p", { className: "text-[11px] mt-1", style: { color: "#8A97A3" }, children: [
        taskForm.assignees.length,
        " ",
        t("assignees")
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex-1 flex gap-2", children: [
        /* @__PURE__ */ jsxs3("button", { type: "button", onClick: () => setTaskForm({ ...taskForm, type: "public" }), className: "flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg font-bold", style: { background: taskForm.type === "public" ? "#1F4E79" : "#F4F6F8", color: taskForm.type === "public" ? "white" : "#5B6B79" }, children: [
          /* @__PURE__ */ jsx3(Globe2, { size: 14 }),
          " ",
          t("public")
        ] }),
        /* @__PURE__ */ jsxs3("button", { type: "button", onClick: () => setTaskForm({ ...taskForm, type: "private" }), className: "flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg font-bold", style: { background: taskForm.type === "private" ? "#B25E09" : "#F4F6F8", color: taskForm.type === "private" ? "white" : "#5B6B79" }, children: [
          /* @__PURE__ */ jsx3(Lock, { size: 14 }),
          " ",
          t("private")
        ] })
      ] }),
      taskForm.type === "private" && /* @__PURE__ */ jsx3("select", { value: taskForm.privateTo, onChange: (e) => setTaskForm({ ...taskForm, privateTo: Number(e.target.value) }), className: "flex-1 text-sm outline-none", style: inputStyle, children: people.filter((p) => !p.isAdmin).map((p) => /* @__PURE__ */ jsxs3("option", { value: p.id, children: [
        p.name,
        " - ",
        p.role
      ] }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxs3("div", { children: [
      /* @__PURE__ */ jsx3("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("priority") }),
      /* @__PURE__ */ jsx3("select", { value: taskForm.priority, onChange: (e) => setTaskForm({ ...taskForm, priority: e.target.value }), className: "w-full text-sm outline-none", style: inputStyle, children: Object.entries(PRIORITY).map(([k, v]) => /* @__PURE__ */ jsx3("option", { value: k, children: v[lang] || v.ar }, k)) })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs3("button", { type: "button", onClick: () => {
        setTaskCalOpen((o) => !o);
        setTaskRecOpen(false);
      }, className: "flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-lg", style: { background: taskCalOpen ? "#1F4E79" : "#F4F6F8", color: taskCalOpen ? "white" : "#5B6B79" }, children: [
        /* @__PURE__ */ jsx3(CalendarDays2, { size: 15 }),
        " ",
        taskForm.dates.length,
        " ",
        t("datesSelected")
      ] }),
      /* @__PURE__ */ jsxs3("button", { type: "button", onClick: () => {
        setTaskRecOpen((o) => !o);
        setTaskCalOpen(false);
      }, className: "flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-lg", style: { background: taskRecOpen || taskForm.recurrence.type !== "none" ? "#1F4E79" : "#F4F6F8", color: taskRecOpen || taskForm.recurrence.type !== "none" ? "white" : "#5B6B79" }, children: [
        /* @__PURE__ */ jsx3(Repeat, { size: 15 }),
        " ",
        t("recurrence")
      ] })
    ] }),
    taskCalOpen && /* @__PURE__ */ jsxs3("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => setTaskCalMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)), className: "text-xs font-bold px-2 py-1 rounded", style: { background: "#F4F6F8" }, children: t("prev") }),
        /* @__PURE__ */ jsxs3("span", { className: "text-xs font-bold", style: { color: "#16222E" }, children: [
          MONTHS[taskCalMonth.getMonth()],
          " ",
          taskCalMonth.getFullYear()
        ] }),
        /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => setTaskCalMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)), className: "text-xs font-bold px-2 py-1 rounded", style: { background: "#F4F6F8" }, children: t("next") })
      ] }),
      MiniMonthGrid(ctx, taskCalMonth, taskForm.dates, toggleTaskDate)
    ] }),
    taskRecOpen && /* @__PURE__ */ jsxs3("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx3("div", { className: "flex gap-2", children: [["none", t("recNone")], ["daily", t("recDaily")], ["weekly", t("recWeekly")], ["monthly", t("recMonthly")]].map(([k, l]) => /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => setTaskForm({ ...taskForm, recurrence: { ...taskForm.recurrence, type: k } }), className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: taskForm.recurrence.type === k ? "#1F4E79" : "#F4F6F8", color: taskForm.recurrence.type === k ? "white" : "#5B6B79" }, children: l }, k)) }),
      taskForm.recurrence.type === "weekly" && /* @__PURE__ */ jsx3("div", { className: "flex flex-wrap gap-1.5", children: WEEKDAYS.map((w) => {
        const active = taskForm.recurrence.weekdays.includes(w);
        return /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => toggleRecWeekday(w), className: "text-xs font-bold px-2.5 py-1 rounded-full", style: { background: active ? "#1F4E79" : "#F4F6F8", color: active ? "white" : "#5B6B79" }, children: w }, w);
      }) }),
      taskForm.recurrence.type === "monthly" && /* @__PURE__ */ jsx3("div", { className: "grid grid-cols-7 gap-1", children: Array.from({ length: 31 }, (_, i) => i + 1).map((n) => {
        const active = taskForm.recurrence.monthDays.includes(n);
        return /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => toggleRecMonthDay(n), className: "text-[11px] font-bold py-1.5 rounded", style: { background: active ? "#1F4E79" : "#F4F6F8", color: active ? "white" : "#5B6B79" }, children: n }, n);
      }) })
    ] }),
    /* @__PURE__ */ jsx3("button", { type: "submit", className: "text-sm font-bold py-2.5 rounded-lg", style: { background: "#16222E", color: "white" }, children: editingId ? t("save") : t("addTaskBtn") })
  ] });
}
function SupervisorTaskGroups(ctx, mode) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  const groups = [
    { key: "__private", label: t("myPrivateTasks"), filter: (tk) => tk.privateTo === currentUserId },
    ...departments.map((d) => ({ key: d, label: d, filter: (tk) => tk.department === d && tk.type === "public" }))
  ];
  return /* @__PURE__ */ jsx3("div", { className: "flex flex-col gap-6", children: groups.map((g) => {
    const all = tasks.filter(g.filter);
    let list;
    if (mode === "inprogress") list = sortForSupervisorList(all.filter((tk) => tk.status === "in_progress"));
    else if (mode === "completed") list = sortForSupervisorList(all.filter((tk) => tk.status === "completed" && tk.completedAt === today2));
    else list = sortForSupervisorList(all.filter((tk) => isTaskOnDate(tk, today2)));
    if (list.length === 0) return null;
    return /* @__PURE__ */ jsxs3("div", { children: [
      /* @__PURE__ */ jsx3("h3", { className: "text-sm font-black mb-2 px-1", style: { color: "#16222E" }, children: g.label }),
      /* @__PURE__ */ jsx3("div", { className: "flex flex-col gap-2", children: list.map((tk, i) => TaskCard(ctx, tk, false, i + 1)) })
    ] }, g.key);
  }) });
}

// source/components/ProblemComponents.jsx
import { Pencil as Pencil2, ChevronDown as ChevronDown2, ChevronUp as ChevronUp2, MapPin, X as X2, Mic, Camera, Download, FileText as FileText2, Play as Play2, Square } from "lucide-react";
import { useRef as useRef2 } from "react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function ProblemFormPanel({ ctx }) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleProblemMediaFiles,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isRecordingVoice,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    recordingSeconds,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeProblemMedia,
    removeVoiceNote,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    startVoiceRecording,
    stopVoiceRecording,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  const tagRef2 = useRef2(null), tagRef3 = useRef2(null);
  return /* @__PURE__ */ jsxs4("form", { ref: formRef, onSubmit: (e) => {
    e.preventDefault();
    runWithBusy("submitProblem", () => submitProblem(e));
  }, className: "rounded-xl p-4 mb-4 flex flex-col gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
    /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx4("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: editingProblemId ? t("editReport") : t("newReport") }),
      /* @__PURE__ */ jsx4("button", { type: "button", onClick: () => {
        setShowProblemForm(false);
        setEditingProblemId(null);
      }, children: /* @__PURE__ */ jsx4(X2, { size: 16, color: "#8A97A3" }) })
    ] }),
    /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("tagNumber") }),
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-1.5", dir: "ltr", children: [
        /* @__PURE__ */ jsx4("input", { value: problemForm.tag1, onChange: (e) => {
          const v = e.target.value.replace(/[^0-9]/g, "");
          setProblemForm({ ...problemForm, tag1: v, unitName: v ? `Unit ${v}` : "" });
        }, onKeyDown: (e) => handleTagKey(e, tagRef2), placeholder: "301", maxLength: 4, className: "w-16 text-sm font-bold text-center outline-none", style: inputStyle }),
        /* @__PURE__ */ jsx4("span", { style: { color: "#8A97A3" }, children: "-" }),
        /* @__PURE__ */ jsx4("input", { ref: tagRef2, value: problemForm.tag2, onChange: (e) => setProblemForm({ ...problemForm, tag2: e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase() }), onKeyDown: (e) => handleTagKey(e, tagRef3), placeholder: "HC", maxLength: 4, className: "w-16 text-sm font-bold text-center outline-none", style: inputStyle }),
        /* @__PURE__ */ jsx4("span", { style: { color: "#8A97A3" }, children: "-" }),
        /* @__PURE__ */ jsx4("input", { ref: tagRef3, value: problemForm.tag3, onChange: (e) => setProblemForm({ ...problemForm, tag3: e.target.value.toUpperCase() }), placeholder: "01A", maxLength: 8, className: "w-24 text-sm font-bold text-center outline-none", style: { ...inputStyle, textTransform: "uppercase" } })
      ] })
    ] }),
    /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("unitName") }),
      /* @__PURE__ */ jsx4("input", { value: problemForm.unitName, onChange: (e) => setProblemForm({ ...problemForm, unitName: e.target.value }), placeholder: t("unitName"), className: "w-full text-sm outline-none", style: { ...inputStyle, background: "#EEF1F4" } })
    ] }),
    /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("equipmentName") }),
      /* @__PURE__ */ jsx4("input", { value: problemForm.equipmentName, onChange: (e) => setProblemForm({ ...problemForm, equipmentName: e.target.value }), placeholder: t("equipmentName"), className: "w-full text-base font-black outline-none", style: inputStyle })
    ] }),
    /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("problemTitle") }),
      /* @__PURE__ */ jsx4("input", { value: problemForm.title, onChange: (e) => setProblemForm({ ...problemForm, title: e.target.value }), placeholder: t("problemTitle"), className: "w-full text-sm outline-none", style: inputStyle })
    ] }),
    /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("attachMediaLbl") }),
      /* @__PURE__ */ jsxs4("div", { className: "flex gap-2", children: [
        !isRecordingVoice ? /* @__PURE__ */ jsxs4("button", { type: "button", onClick: startVoiceRecording, className: "flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-lg", style: { background: "#F4F6F8", color: "#16222E", border: "1px dashed #DCE3E8" }, children: [
          /* @__PURE__ */ jsx4(Mic, { size: 14 }),
          " ",
          t("recordVoiceBtn")
        ] }) : /* @__PURE__ */ jsxs4("button", { type: "button", onClick: stopVoiceRecording, className: "flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-lg", style: { background: "#C0392B", color: "white" }, children: [
          /* @__PURE__ */ jsx4(Square, { size: 12 }),
          " ",
          t("stopRecordingBtn"),
          " \u2014 ",
          Math.floor(recordingSeconds / 60),
          ":",
          String(recordingSeconds % 60).padStart(2, "0")
        ] }),
        /* @__PURE__ */ jsxs4("label", { className: "flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-lg cursor-pointer", style: { background: "#F4F6F8", color: "#16222E", border: "1px dashed #DCE3E8" }, children: [
          /* @__PURE__ */ jsx4(Camera, { size: 14 }),
          " ",
          t("takePhotoBtn"),
          /* @__PURE__ */ jsx4("input", { type: "file", accept: "image/*", capture: "environment", multiple: true, className: "hidden", onChange: handleProblemMediaFiles })
        ] }),
        /* @__PURE__ */ jsxs4("label", { className: "flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-lg cursor-pointer", style: { background: "#F4F6F8", color: "#16222E", border: "1px dashed #DCE3E8" }, children: [
          /* @__PURE__ */ jsx4(Download, { size: 14, style: { transform: "rotate(180deg)" } }),
          " ",
          t("uploadFileBtn"),
          /* @__PURE__ */ jsx4("input", { type: "file", accept: "image/*,.pdf", multiple: true, className: "hidden", onChange: handleProblemMediaFiles })
        ] })
      ] }),
      problemForm.voiceNotes.length > 0 && /* @__PURE__ */ jsx4("div", { className: "flex flex-col gap-1.5 mt-2", children: problemForm.voiceNotes.map((v) => /* @__PURE__ */ jsxs4("div", { className: "rounded-lg px-2.5 py-2 flex items-center gap-2", style: { background: "#F4F6F8" }, children: [
        /* @__PURE__ */ jsx4(Play2, { size: 14, color: "#1F4E79" }),
        /* @__PURE__ */ jsx4("audio", { src: v.dataUrl, controls: true, className: "flex-1 h-8" }),
        /* @__PURE__ */ jsxs4("span", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
          Math.floor(v.duration / 60),
          ":",
          String(v.duration % 60).padStart(2, "0")
        ] }),
        /* @__PURE__ */ jsx4("button", { type: "button", onClick: () => removeVoiceNote(v.id), children: /* @__PURE__ */ jsx4(X2, { size: 14, color: "#8A97A3" }) })
      ] }, v.id)) }),
      problemForm.mediaFiles.length > 0 && /* @__PURE__ */ jsx4("div", { className: "flex flex-wrap gap-2 mt-2", children: problemForm.mediaFiles.map((m) => /* @__PURE__ */ jsxs4("div", { className: "relative", children: [
        m.isImage ? /* @__PURE__ */ jsx4("img", { src: m.dataUrl, alt: "", className: "w-16 h-16 rounded-lg object-cover" }) : /* @__PURE__ */ jsx4("div", { className: "w-16 h-16 rounded-lg flex items-center justify-center", style: { background: "#E6EEF5" }, children: /* @__PURE__ */ jsx4(FileText2, { size: 20, color: "#1F4E79" }) }),
        /* @__PURE__ */ jsx4("button", { type: "button", onClick: () => removeProblemMedia(m.id), className: "absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center", style: { background: "#C0392B" }, children: /* @__PURE__ */ jsx4(X2, { size: 11, color: "white" }) })
      ] }, m.id)) })
    ] }),
    /* @__PURE__ */ jsx4("textarea", { value: problemForm.description, onChange: (e) => setProblemForm({ ...problemForm, description: e.target.value }), placeholder: t("descProblem"), rows: 3, className: "w-full text-sm outline-none resize-none", style: inputStyle }),
    /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("location") }),
      /* @__PURE__ */ jsx4("select", { value: problemForm.location, onChange: (e) => setProblemForm({ ...problemForm, location: e.target.value }), className: "w-full text-sm outline-none", style: inputStyle, children: LOCATIONS.map((l) => /* @__PURE__ */ jsx4("option", { children: l }, l)) })
    ] }),
    /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("maintDept") }),
      /* @__PURE__ */ jsx4("div", { className: "flex flex-wrap gap-2", children: PROBLEM_CATEGORIES.map((c) => {
        const active = problemForm.categories.includes(c);
        return /* @__PURE__ */ jsx4("button", { type: "button", onClick: () => toggleCategory(c), className: "text-xs font-bold px-3 py-1.5 rounded-full", style: { background: active ? "#1F4E79" : "#F4F6F8", color: active ? "white" : "#5B6B79", border: "1px solid " + (active ? "#1F4E79" : "#E2E8ED") }, children: c }, c);
      }) })
    ] }),
    /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx4("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("priority") }),
      /* @__PURE__ */ jsx4("div", { className: "flex gap-2", children: Object.entries(PRIORITY).map(([k, v]) => /* @__PURE__ */ jsx4("button", { type: "button", onClick: () => setProblemForm({ ...problemForm, priority: k }), className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: problemForm.priority === k ? v.color : "#F4F6F8", color: problemForm.priority === k ? "white" : "#5B6B79", border: "1px solid " + (problemForm.priority === k ? v.color : "#E2E8ED") }, children: v[lang] || v.ar }, k)) })
    ] }),
    !editingProblemId && /* @__PURE__ */ jsx4("p", { className: "text-xs", style: labelStyle, children: canManage ? t("autoRouteSup") : t("autoRouteOp") }),
    /* @__PURE__ */ jsx4("button", { type: "submit", className: "text-sm font-bold py-2.5 rounded-lg", style: { background: "#16222E", color: "white" }, children: BtnContent(ctx, "submitProblem", editingProblemId ? t("saveEdit") : t("sendReport")) })
  ] });
}
function ProblemCard(ctx, p, { withApprove } = {}) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleProblemMediaFiles,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isRecordingVoice,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    recordingSeconds,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeProblemMedia,
    removeVoiceNote,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    startVoiceRecording,
    stopVoiceRecording,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  const isOpen = expandedProblemId === p.id;
  const canEdit = p.reportedBy === currentUserId || canManage;
  const sup = shiftSupervisorOf();
  const pr = PRIORITY[p.priority] || PRIORITY.medium;
  return /* @__PURE__ */ jsxs4("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
    /* @__PURE__ */ jsxs4("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs4("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2 flex-wrap mb-0.5", children: [
          /* @__PURE__ */ jsx4("p", { className: "text-base font-black truncate", style: { color: "#16222E" }, children: p.equipmentName || "\u2014" }),
          /* @__PURE__ */ jsx4("span", { className: "text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0", style: { background: pr.bg, color: pr.color }, children: pr[lang] || pr.ar }),
          /* @__PURE__ */ jsx4("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", style: { background: (REVIEW_STATUS_META[p.reviewStatus] || REVIEW_STATUS_META.submitted).bg, color: (REVIEW_STATUS_META[p.reviewStatus] || REVIEW_STATUS_META.submitted).color }, children: (REVIEW_STATUS_META[p.reviewStatus] || REVIEW_STATUS_META.submitted)[lang] })
        ] }),
        p.tagNumber && /* @__PURE__ */ jsx4("p", { className: "text-sm font-bold", dir: "ltr", style: { color: "#1F4E79", textAlign: "left" }, children: p.tagNumber }),
        /* @__PURE__ */ jsx4("p", { className: "text-sm mt-0.5", style: { color: "#5B6B79" }, children: p.title }),
        /* @__PURE__ */ jsxs4("p", { className: "text-[11px] mt-1", style: { color: "#8A97A3" }, children: [
          t("reportedBy"),
          " ",
          personLabel(p.reportedBy),
          " \u2014 ",
          p.createdAt
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-1 shrink-0", children: [
        canEdit && /* @__PURE__ */ jsx4("button", { onClick: () => startEditProblem(p), className: "w-7 h-7 rounded-md flex items-center justify-center", style: { color: "#5B6B79" }, children: /* @__PURE__ */ jsx4(Pencil2, { size: 14 }) }),
        /* @__PURE__ */ jsx4("button", { onClick: () => setExpandedProblemId(isOpen ? null : p.id), className: "w-7 h-7 rounded-md flex items-center justify-center", style: { color: "#1F4E79" }, children: isOpen ? /* @__PURE__ */ jsx4(ChevronUp2, { size: 16 }) : /* @__PURE__ */ jsx4(ChevronDown2, { size: 16 }) })
      ] })
    ] }),
    isOpen && /* @__PURE__ */ jsxs4("div", { className: "mt-3 pt-3 flex flex-col gap-1.5 text-xs", style: { borderTop: "1px solid #EEF1F4", color: "#5B6B79" }, children: [
      /* @__PURE__ */ jsxs4("p", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx4(MapPin, { size: 13 }),
        " ",
        p.location || "\u2014"
      ] }),
      /* @__PURE__ */ jsxs4("p", { children: [
        /* @__PURE__ */ jsxs4("b", { style: { color: "#16222E" }, children: [
          t("department"),
          ":"
        ] }),
        " ",
        p.department
      ] }),
      /* @__PURE__ */ jsxs4("p", { children: [
        /* @__PURE__ */ jsxs4("b", { style: { color: "#16222E" }, children: [
          t("maintDept"),
          ":"
        ] }),
        " ",
        p.categories?.join(", ") || "\u2014"
      ] }),
      p.unitName && /* @__PURE__ */ jsxs4("p", { children: [
        /* @__PURE__ */ jsxs4("b", { style: { color: "#16222E" }, children: [
          t("unitName"),
          ":"
        ] }),
        " ",
        p.unitName
      ] }),
      /* @__PURE__ */ jsxs4("p", { children: [
        /* @__PURE__ */ jsx4("b", { style: { color: "#16222E" }, children: t("respPerson") }),
        " ",
        sup ? personLabel(sup.id) : "\u2014"
      ] }),
      /* @__PURE__ */ jsx4("p", { children: p.description }),
      p.voiceNotes && p.voiceNotes.length > 0 && /* @__PURE__ */ jsx4("div", { className: "flex flex-col gap-1.5 mt-1", children: p.voiceNotes.map((v) => /* @__PURE__ */ jsxs4("div", { className: "rounded-lg px-2.5 py-2 flex items-center gap-2", style: { background: "#F4F6F8" }, children: [
        /* @__PURE__ */ jsx4(Play2, { size: 13, color: "#1F4E79" }),
        /* @__PURE__ */ jsx4("audio", { src: v.dataUrl, controls: true, className: "flex-1 h-8" }),
        /* @__PURE__ */ jsxs4("span", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
          Math.floor(v.duration / 60),
          ":",
          String(v.duration % 60).padStart(2, "0")
        ] })
      ] }, v.id)) }),
      p.mediaFiles && p.mediaFiles.length > 0 && /* @__PURE__ */ jsx4("div", { className: "flex flex-wrap gap-2 mt-1", children: p.mediaFiles.map((m) => m.isImage ? /* @__PURE__ */ jsx4("img", { src: m.dataUrl, alt: "", className: "w-16 h-16 rounded-lg object-cover" }, m.id) : /* @__PURE__ */ jsx4("div", { className: "w-16 h-16 rounded-lg flex items-center justify-center", style: { background: "#E6EEF5" }, children: /* @__PURE__ */ jsx4(FileText2, { size: 20, color: "#1F4E79" }) }, m.id)) }),
      p.editedNote && /* @__PURE__ */ jsxs4("p", { className: "italic", style: { color: "#B25E09" }, children: [
        p.editedNote,
        " \u2014 ",
        p.editedAt
      ] }),
      canManage && /* @__PURE__ */ jsx4("div", { className: "flex gap-1.5 flex-wrap mt-1", children: Object.entries(WORK_STATUS).map(([k, v]) => /* @__PURE__ */ jsx4("button", { onClick: () => setWorkStatus(p.id, k), className: "text-[11px] font-bold px-2.5 py-1.5 rounded-lg", style: { background: p.workStatus === k ? v.bg : "#F4F6F8", color: p.workStatus === k ? v.color : "#8A97A3", border: "1px solid " + (p.workStatus === k ? v.color : "#E2E8ED") }, children: v[lang] || v.ar }, k)) }),
      /* @__PURE__ */ jsxs4("div", { className: "mt-2 flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx4("p", { className: "text-[11px] font-black", style: { color: "#16222E" }, children: t("commentsLabel") }),
        ReviewBlock(ctx, p, reviewProblem, p.reportedBy)
      ] })
    ] })
  ] }, p.id);
}

// source/components/CalendarOverlay.jsx
import { Plus, X as X3, Search } from "lucide-react";
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function DayModal(ctx) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchField,
    calSearchOpen,
    calSearchTag1,
    calSearchTag2,
    calSearchTag3,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchField,
    setCalSearchOpen,
    setCalSearchTag1,
    setCalSearchTag2,
    setCalSearchTag3,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  if (!selectedCalDay) return null;
  const dt = tasksOnDate(selectedCalDay);
  return /* @__PURE__ */ jsx5("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(22,34,46,0.45)" }, onClick: () => {
    setSelectedCalDay(null);
    setDayModalAddOpen(false);
  }, children: /* @__PURE__ */ jsxs5("div", { className: "w-full max-w-sm rounded-xl p-4 max-h-[80vh] overflow-y-auto", style: { background: "#FFFFFF" }, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsx5("h3", { className: "text-base font-black", style: { color: "#16222E" }, children: selectedCalDay }),
      /* @__PURE__ */ jsx5("button", { onClick: () => {
        setSelectedCalDay(null);
        setDayModalAddOpen(false);
      }, children: /* @__PURE__ */ jsx5(X3, { size: 18, color: "#8A97A3" }) })
    ] }),
    /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-2 mb-3", children: [
      dt.length === 0 && /* @__PURE__ */ jsx5("p", { className: "text-xs", style: { color: "#8A97A3" }, children: t("noTasksDay") }),
      dt.map((tk, i) => /* @__PURE__ */ jsxs5("div", { className: "text-sm font-bold px-3 py-2 rounded-lg", style: { background: deptColor(tk.department).bg, color: deptColor(tk.department).text }, children: [
        i + 1,
        ". ",
        tk.title
      ] }, tk.id))
    ] }),
    canManage && !dayModalAddOpen && /* @__PURE__ */ jsxs5("button", { onClick: () => quickAddForDay(selectedCalDay), className: "w-full flex items-center justify-center gap-1.5 text-sm font-bold py-2 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: [
      /* @__PURE__ */ jsx5(Plus, { size: 15 }),
      " ",
      t("addTaskForDay")
    ] }),
    dayModalAddOpen && /* @__PURE__ */ jsx5(TaskFormPanel, { ctx })
  ] }) });
}
function CalendarOverlay(ctx) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchField,
    calSearchOpen,
    calSearchTag1,
    calSearchTag2,
    calSearchTag3,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchField,
    setCalSearchOpen,
    setCalSearchTag1,
    setCalSearchTag2,
    setCalSearchTag3,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  function filterBySearch(list) {
    if (calSearchField === "task") {
      if (!calSearch.trim()) return list;
      const q = calSearch.toLowerCase();
      return list.filter((tk) => tk.title.toLowerCase().includes(q));
    }
    if (calSearchField === "equipment") {
      if (!calSearch.trim()) return list;
      const q = calSearch.toLowerCase();
      return list.filter((tk) => (tk.equipmentName || "").toLowerCase().includes(q));
    }
    if (calSearchField === "tag") {
      if (!calSearchTag1 || !calSearchTag2 || !calSearchTag3) return list;
      const full = `${calSearchTag1}-${calSearchTag2}-${calSearchTag3}`;
      return list.filter((tk) => (tk.tagNumber || "") === full);
    }
    return list;
  }
  return /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-3", style: { animation: "fadeSlideUp 240ms ease-out" }, children: [
    /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsx5("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("calendar") }),
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx5("button", { onClick: () => setCalSearchOpen((o) => !o), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: calSearchOpen ? "#1F4E79" : "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx5(Search, { size: 16, color: calSearchOpen ? "white" : "#16222E" }) }),
        /* @__PURE__ */ jsx5("button", { onClick: () => setActiveOverlay(null), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx5(X3, { size: 16, color: "#16222E" }) })
      ] })
    ] }),
    calSearchOpen && /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx5("div", { className: "flex gap-1.5", children: [["task", t("searchByTaskTab")], ["tag", t("searchByTagTab")], ["date", t("searchByDateTab")], ["equipment", t("searchByEquipmentTab")]].map(([k, lbl]) => /* @__PURE__ */ jsx5("button", { onClick: () => setCalSearchField(k), className: "flex-1 text-[11px] font-bold py-2 rounded-lg", style: { background: calSearchField === k ? "#1F4E79" : "#FFFFFF", color: calSearchField === k ? "white" : "#5B6B79", border: "1px solid " + (calSearchField === k ? "#1F4E79" : "#DCE3E8") }, children: lbl }, k)) }),
      calSearchField === "task" && /* @__PURE__ */ jsx5("input", { autoFocus: true, value: calSearch, onChange: (e) => setCalSearch(e.target.value), placeholder: t("searchTaskPH"), className: "w-full text-sm outline-none", style: inputStyle }),
      calSearchField === "equipment" && /* @__PURE__ */ jsx5("input", { autoFocus: true, value: calSearch, onChange: (e) => setCalSearch(e.target.value), placeholder: t("equipmentName"), className: "w-full text-sm outline-none", style: inputStyle }),
      calSearchField === "tag" && /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx5("input", { value: calSearchTag1, onChange: (e) => setCalSearchTag1(e.target.value.replace(/[^0-9]/g, "").slice(0, 3)), placeholder: "301", maxLength: 3, className: "w-14 text-sm font-bold text-center outline-none", style: inputStyle }),
        /* @__PURE__ */ jsx5("span", { style: { color: "#8A97A3" }, children: "-" }),
        /* @__PURE__ */ jsx5("input", { value: calSearchTag2, onChange: (e) => setCalSearchTag2(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 5)), placeholder: "HVACS", maxLength: 5, className: "w-20 text-sm font-bold text-center outline-none", style: inputStyle }),
        /* @__PURE__ */ jsx5("span", { style: { color: "#8A97A3" }, children: "-" }),
        /* @__PURE__ */ jsx5("input", { value: calSearchTag3, onChange: (e) => setCalSearchTag3(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8)), placeholder: "01A", maxLength: 8, className: "w-24 text-sm font-bold text-center outline-none", style: { ...inputStyle, textTransform: "uppercase" } })
      ] }),
      calSearchField === "date" && /* @__PURE__ */ jsx5("input", { type: "date", onChange: (e) => {
        const v = e.target.value;
        if (!v) return;
        setCalDate(/* @__PURE__ */ new Date(v + "T00:00:00"));
        openDay(v);
        setCalSearchOpen(false);
      }, className: "w-full text-sm outline-none", style: inputStyle })
    ] }),
    /* @__PURE__ */ jsxs5("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx5("button", { onClick: () => setCalMode("week"), className: "flex-1 text-base font-black py-3 rounded-xl", style: { background: calMode === "week" ? "#1F4E79" : "#FFFFFF", color: calMode === "week" ? "white" : "#5B6B79", border: "1px solid " + (calMode === "week" ? "#1F4E79" : "#DCE3E8") }, children: t("weeklyBtn") }),
      /* @__PURE__ */ jsx5("button", { onClick: () => setCalMode("month"), className: "flex-1 text-base font-black py-3 rounded-xl", style: { background: calMode === "month" ? "#1F4E79" : "#FFFFFF", color: calMode === "month" ? "white" : "#5B6B79", border: "1px solid " + (calMode === "month" ? "#1F4E79" : "#DCE3E8") }, children: t("monthlyBtn") })
    ] }),
    /* @__PURE__ */ jsxs5("div", { className: "rounded-xl p-3 flex items-center justify-between", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsx5("button", { onClick: () => navigateCal(-1), className: "text-sm font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8" }, children: t("prev") }),
      /* @__PURE__ */ jsx5("button", { onClick: () => setCalDate(/* @__PURE__ */ new Date()), className: "text-sm font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8" }, children: calMode === "week" ? t("currentWeek") : t("currentMonth") }),
      /* @__PURE__ */ jsx5("button", { onClick: () => navigateCal(1), className: "text-sm font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8" }, children: t("next") })
    ] }),
    /* @__PURE__ */ jsx5("div", { className: "text-sm font-black text-center", style: { color: "#16222E" }, children: calLabel() }),
    calMode === "week" && weekDays.map((d) => {
      const ds = toISODate(d);
      const dt = filterBySearch(tasksOnDate(ds));
      const isToday = ds === today2;
      return /* @__PURE__ */ jsxs5("div", { className: "rounded-xl p-3", style: { background: "#FFFFFF", border: "1px solid " + (isToday ? "#1F4E79" : "#DCE3E8") }, children: [
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxs5("span", { className: "text-sm font-black", style: { color: isToday ? "#1F4E79" : "#16222E" }, children: [
            WEEKDAYS[d.getDay() === 6 ? 0 : d.getDay() + 1],
            " \u2014 ",
            d.getDate()
          ] }),
          isToday && /* @__PURE__ */ jsx5("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full", style: { background: "#E6EEF5", color: "#1F4E79" }, children: t("today") })
        ] }),
        dt.length === 0 ? /* @__PURE__ */ jsx5("p", { className: "text-xs", style: { color: "#C3CBD1" }, children: t("noTasks") }) : /* @__PURE__ */ jsx5("div", { className: "flex flex-col gap-1.5", children: dt.map((tk, i) => /* @__PURE__ */ jsxs5("div", { className: "text-xs font-bold px-2 py-1.5 rounded-lg", style: { background: deptColor(tk.department).bg, color: deptColor(tk.department).text }, children: [
          i + 1,
          ". ",
          tk.title
        ] }, tk.id)) })
      ] }, ds);
    }),
    calMode === "month" && /* @__PURE__ */ jsxs5("div", { className: "rounded-xl overflow-hidden", style: { border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsx5("div", { className: "grid grid-cols-7", style: { background: "#F4F6F8" }, children: WEEKDAYS.map((w) => /* @__PURE__ */ jsx5("div", { className: "text-[11px] font-bold text-center py-2", style: labelStyle, children: w }, w)) }),
      /* @__PURE__ */ jsx5("div", { className: "grid grid-cols-7", children: daysInMonthGrid.map((d) => {
        const ds = toISODate(d);
        const dt = filterBySearch(tasksOnDate(ds));
        const inMonth = d.getMonth() === calDate.getMonth();
        const isToday = ds === today2;
        return /* @__PURE__ */ jsxs5("div", { onClick: () => openDay(ds), className: "min-h-[90px] p-1.5 cursor-pointer", style: { background: inMonth ? "#FFFFFF" : "#F9FAFB", borderTop: "1px solid #EEF1F4", borderRight: "1px solid #EEF1F4" }, children: [
          /* @__PURE__ */ jsx5("div", { className: "text-[11px] font-bold mb-1", style: { color: isToday ? "#1F4E79" : inMonth ? "#16222E" : "#C3CBD1" }, children: d.getDate() }),
          /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-0.5", children: [
            dt.slice(0, 2).map((tk, i) => /* @__PURE__ */ jsxs5("div", { className: "text-[9px] font-bold px-1 py-0.5 rounded truncate", style: { background: deptColor(tk.department).bg, color: deptColor(tk.department).text }, children: [
              i + 1,
              ". ",
              tk.title
            ] }, tk.id)),
            dt.length > 2 && /* @__PURE__ */ jsxs5("div", { className: "text-[9px]", style: { color: "#8A97A3" }, children: [
              "+",
              dt.length - 2
            ] })
          ] })
        ] }, ds);
      }) })
    ] }),
    DayModal(ctx)
  ] });
}

// source/components/LogOverlay.jsx
import { CheckCircle2 as CheckCircle22, AlertTriangle as AlertTriangle3, X as X4, Search as Search2 } from "lucide-react";
import { Fragment as Fragment3, jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
function LogOverlay(ctx) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  const dateObj = new Date(selectedLogDate);
  const canGoNext = selectedLogDate < today2;
  return /* @__PURE__ */ jsxs6("div", { className: "flex flex-col gap-3", style: { animation: "fadeSlideUp 240ms ease-out" }, children: [
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsx6("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("eventList") }),
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx6("button", { onClick: () => setLogSearchOpen((o) => !o), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: logSearchOpen ? "#1F4E79" : "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx6(Search2, { size: 16, color: logSearchOpen ? "white" : "#16222E" }) }),
        /* @__PURE__ */ jsx6("button", { onClick: () => setActiveOverlay(null), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx6(X4, { size: 16, color: "#16222E" }) })
      ] })
    ] }),
    logSearchOpen && /* @__PURE__ */ jsx6("input", { autoFocus: true, value: logSearch, onChange: (e) => setLogSearch(e.target.value), placeholder: t("searchLogPH"), className: "w-full text-sm outline-none", style: inputStyle }),
    /* @__PURE__ */ jsxs6("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx6("button", { onClick: () => setLogMode("day"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: logMode === "day" ? "#1F4E79" : "#FFFFFF", color: logMode === "day" ? "white" : "#5B6B79", border: "1px solid " + (logMode === "day" ? "#1F4E79" : "#DCE3E8") }, children: t("dayEvents") }),
      /* @__PURE__ */ jsx6("button", { onClick: () => setLogMode("all"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: logMode === "all" ? "#1F4E79" : "#FFFFFF", color: logMode === "all" ? "white" : "#5B6B79", border: "1px solid " + (logMode === "all" ? "#1F4E79" : "#DCE3E8") }, children: t("allEvents") })
    ] }),
    logMode === "day" && /* @__PURE__ */ jsxs6(Fragment3, { children: [
      /* @__PURE__ */ jsxs6("div", { className: "rounded-xl p-3 flex items-center justify-between", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
        /* @__PURE__ */ jsx6("button", { onClick: () => setSelectedLogDate(toISODate(addDays(dateObj, -1))), className: "text-sm font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8" }, children: t("prev") }),
        /* @__PURE__ */ jsxs6("span", { className: "text-sm font-black", style: { color: "#16222E" }, children: [
          selectedLogDate,
          selectedLogDate === today2 ? ` (${t("today")})` : ""
        ] }),
        /* @__PURE__ */ jsx6("button", { disabled: !canGoNext, onClick: () => setSelectedLogDate(toISODate(addDays(dateObj, 1))), className: "text-sm font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8", opacity: canGoNext ? 1 : 0.4 }, children: t("next") })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "flex flex-col gap-2", children: [
        dayLogEntries.length === 0 && /* @__PURE__ */ jsx6("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noLogEntries") }),
        dayLogEntries.map((e, i) => /* @__PURE__ */ jsxs6("div", { className: "rounded-xl p-3.5 flex items-center gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
          /* @__PURE__ */ jsx6("div", { className: "w-8 h-8 rounded-full flex items-center justify-center shrink-0", style: { background: e.kind === "task" ? "#E4F3EA" : "#FBE7E4" }, children: e.kind === "task" ? /* @__PURE__ */ jsx6(CheckCircle22, { size: 16, color: "#2F7D4F" }) : /* @__PURE__ */ jsx6(AlertTriangle3, { size: 16, color: "#C0392B" }) }),
          /* @__PURE__ */ jsxs6("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx6("p", { className: "text-sm font-bold", style: { color: "#16222E" }, children: e.title }),
            /* @__PURE__ */ jsxs6("p", { className: "text-xs mt-0.5", style: { color: "#8A97A3" }, children: [
              e.by,
              " \u2014 ",
              e.at
            ] })
          ] })
        ] }, i))
      ] })
    ] }),
    logMode === "all" && /* @__PURE__ */ jsxs6("div", { className: "flex flex-col gap-4", children: [
      allLogGrouped.length === 0 && /* @__PURE__ */ jsx6("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noLogEntries") }),
      allLogGrouped.map((g) => /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxs6("span", { className: "text-xs font-black px-2.5 py-1 rounded-full", style: { background: "#EEF1F4", color: "#5B6B79" }, children: [
            g.dateISO,
            g.dateISO === today2 ? ` \xB7 ${t("today")}` : ""
          ] }),
          /* @__PURE__ */ jsx6("div", { className: "flex-1", style: { borderTop: "1px solid #DCE3E8" } })
        ] }),
        /* @__PURE__ */ jsx6("div", { className: "flex flex-col gap-2", children: g.items.map((e, i) => /* @__PURE__ */ jsxs6("div", { className: "rounded-xl p-3.5 flex items-center gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
          /* @__PURE__ */ jsx6("div", { className: "w-8 h-8 rounded-full flex items-center justify-center shrink-0", style: { background: e.kind === "task" ? "#E4F3EA" : "#FBE7E4" }, children: e.kind === "task" ? /* @__PURE__ */ jsx6(CheckCircle22, { size: 16, color: "#2F7D4F" }) : /* @__PURE__ */ jsx6(AlertTriangle3, { size: 16, color: "#C0392B" }) }),
          /* @__PURE__ */ jsxs6("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx6("p", { className: "text-sm font-bold", style: { color: "#16222E" }, children: e.title }),
            /* @__PURE__ */ jsxs6("p", { className: "text-xs mt-0.5", style: { color: "#8A97A3" }, children: [
              e.by,
              " \u2014 ",
              e.at
            ] })
          ] })
        ] }, i)) })
      ] }, g.dateISO))
    ] })
  ] });
}

// source/components/StaffOverlay.jsx
import { X as X5, ArrowLeftRight, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { Fragment as Fragment4, jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
function StaffOverlay(ctx) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    askStaffAction,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    cancelStaffAction,
    confirmStaffAction,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    pendingStaffAction,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setHandoverPickerOpen,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWhoInChargeOpen,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  const allStaff = people.filter((p) => !p.isAdmin);
  const presentStaff = allStaff.filter((p) => !p.onLeave);
  const leaveStaff = allStaff.filter((p) => p.onLeave);
  const filtered = staffTab === "all" ? allStaff : staffTab === "present" ? presentStaff : leaveStaff;
  const dayCount = presentStaff.filter((p) => !OFFICE_ROLES2.includes(p.role) && (p.shift || "day") === "day").length;
  const nightCount = presentStaff.filter((p) => !OFFICE_ROLES2.includes(p.role) && (p.shift || "day") === "night").length;
  const officeCount = presentStaff.filter((p) => OFFICE_ROLES2.includes(p.role)).length;
  let shiftFiltered = filtered;
  if (staffTab === "present") {
    if (presentShiftTab === "office") shiftFiltered = filtered.filter((p) => OFFICE_ROLES2.includes(p.role));
    else shiftFiltered = filtered.filter((p) => !OFFICE_ROLES2.includes(p.role) && (p.shift || "day") === presentShiftTab);
  }
  if (staffTab === "present") shiftFiltered = [...shiftFiltered].sort((a, b) => (b.inCharge ? 1 : 0) - (a.inCharge ? 1 : 0));
  const isOfficeView = staffTab === "present" && presentShiftTab === "office";
  const DirArrow = lang === "ar" ? ArrowLeft : ArrowRight;
  function statusBadge(p) {
    if (p.onLeave) return { label: t("onLeave"), bg: "#FBEEDF", color: "#B25E09" };
    if (OFFICE_ROLES2.includes(p.role)) return { label: t("officeShift"), bg: "#E4F3EA", color: "#2F7D4F" };
    if (p.shift === "night") return { label: t("nightShift"), bg: "#E9EEF5", color: "#1F4E79" };
    return { label: t("dayShift"), bg: "#FBEEDF", color: "#B25E09" };
  }
  return /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-3", style: { animation: "fadeSlideUp 240ms ease-out" }, children: [
    /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsx7("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("staff") }),
      /* @__PURE__ */ jsx7("button", { onClick: () => setActiveOverlay(null), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx7(X5, { size: 16, color: "#16222E" }) })
    ] }),
    /* @__PURE__ */ jsx7("button", { onClick: () => setWhoInChargeOpen(true), className: "w-full text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5", style: { background: "#FFF6EB", border: "1px solid #F0C57A", color: "#B25E09" }, children: t("whoInChargeBtn") }),
    /* @__PURE__ */ jsx7("div", { className: "flex gap-2", children: [["all", t("allStaff"), allStaff.length], ["present", t("present"), presentStaff.length], ["leave", t("onLeave"), leaveStaff.length]].map(([k, l, n]) => /* @__PURE__ */ jsxs7("button", { onClick: () => setStaffTab(k), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: staffTab === k ? "#1F4E79" : "#FFFFFF", color: staffTab === k ? "white" : "#5B6B79", border: "1px solid " + (staffTab === k ? "#1F4E79" : "#DCE3E8") }, children: [
      l,
      " (",
      n,
      ")"
    ] }, k)) }),
    staffTab === "present" && /* @__PURE__ */ jsxs7("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxs7("button", { onClick: () => setPresentShiftTab("day"), className: "flex-1 text-sm font-bold py-2 rounded-lg", style: { background: presentShiftTab === "day" ? "#B25E09" : "#F4F6F8", color: presentShiftTab === "day" ? "white" : "#5B6B79" }, children: [
        t("dayShift"),
        " (",
        dayCount,
        ")"
      ] }),
      /* @__PURE__ */ jsxs7("button", { onClick: () => setPresentShiftTab("night"), className: "flex-1 text-sm font-bold py-2 rounded-lg", style: { background: presentShiftTab === "night" ? "#1F4E79" : "#F4F6F8", color: presentShiftTab === "night" ? "white" : "#5B6B79" }, children: [
        t("nightShift"),
        " (",
        nightCount,
        ")"
      ] }),
      /* @__PURE__ */ jsxs7("button", { onClick: () => setPresentShiftTab("office"), className: "flex-1 text-sm font-bold py-2 rounded-lg", style: { background: presentShiftTab === "office" ? "#2F7D4F" : "#F4F6F8", color: presentShiftTab === "office" ? "white" : "#5B6B79" }, children: [
        t("officeShift"),
        " (",
        officeCount,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-4", children: [
      (isOfficeView ? OFFICE_ROLES2 : departments).map((g) => {
        const list = isOfficeView ? shiftFiltered.filter((p) => p.role === g) : shiftFiltered.filter((p) => p.department === g);
        if (list.length === 0) return null;
        const headerColor = isOfficeView ? "#1F4E79" : deptColor(g).text;
        return /* @__PURE__ */ jsxs7("div", { children: [
          /* @__PURE__ */ jsxs7("h4", { className: "text-xs font-black mb-2 px-1", style: { color: headerColor }, children: [
            g,
            " (",
            list.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx7("div", { className: "flex flex-col gap-2", children: list.map((p) => /* @__PURE__ */ jsxs7("div", { className: "rounded-xl p-3.5 flex items-center justify-between gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
            /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-3", children: [
              Avatar(ctx, p.department, 40),
              /* @__PURE__ */ jsxs7("div", { children: [
                /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx7("p", { className: "text-sm font-bold", style: { color: "#16222E" }, children: p.name }),
                  p.inCharge && (p.role === "Shift Supervisor" || p.role === "Section Supervisor") && /* @__PURE__ */ jsxs7("span", { className: "flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-full", style: { background: "#FBEEDF", color: "#B25E09" }, children: [
                    /* @__PURE__ */ jsx7(ShieldCheck, { size: 10 }),
                    " ",
                    t("inChargeBadge")
                  ] })
                ] }),
                /* @__PURE__ */ jsxs7("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
                  p.employeeId,
                  " \xB7 ",
                  p.role
                ] }),
                staffTab === "all" && (() => {
                  const b = statusBadge(p);
                  return /* @__PURE__ */ jsx7("span", { className: "inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md", style: { background: b.bg, color: b.color }, children: b.label });
                })()
              ] })
            ] }),
            /* @__PURE__ */ jsxs7("div", { className: "flex flex-col items-end gap-1.5 shrink-0", children: [
              canManage && (() => {
                const leaveBlocked = !p.onLeave && p.inCharge && (p.role === "Shift Supervisor" || p.role === "Section Supervisor");
                const isOfficeRole = OFFICE_ROLES2.includes(p.role);
                return /* @__PURE__ */ jsxs7(Fragment4, { children: [
                  /* @__PURE__ */ jsx7("button", { onClick: () => askStaffAction(p, "leave"), disabled: leaveBlocked, title: leaveBlocked ? t("cannotLeaveWhileInCharge") : void 0, className: "flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: leaveBlocked ? "#F4F6F8" : "#F4F6F8", color: leaveBlocked ? "#C3CBD1" : "#5B6B79", border: "1px solid #E2E8ED", opacity: leaveBlocked ? 0.6 : 1, cursor: leaveBlocked ? "not-allowed" : "pointer" }, children: lang === "ar" ? /* @__PURE__ */ jsxs7(Fragment4, { children: [
                    /* @__PURE__ */ jsx7(DirArrow, { size: 12 }),
                    " ",
                    p.onLeave ? t("presentShort") : t("vacationShort")
                  ] }) : /* @__PURE__ */ jsxs7(Fragment4, { children: [
                    p.onLeave ? t("presentShort") : t("vacationShort"),
                    " ",
                    /* @__PURE__ */ jsx7(DirArrow, { size: 12 })
                  ] }) }),
                  !p.onLeave && !isOfficeRole && /* @__PURE__ */ jsx7("button", { onClick: () => askStaffAction(p, "shift"), className: "flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8", color: "#5B6B79", border: "1px solid #E2E8ED" }, children: lang === "ar" ? /* @__PURE__ */ jsxs7(Fragment4, { children: [
                    /* @__PURE__ */ jsx7(DirArrow, { size: 12 }),
                    " ",
                    p.shift === "night" ? t("dayShift") : t("nightShift")
                  ] }) : /* @__PURE__ */ jsxs7(Fragment4, { children: [
                    p.shift === "night" ? t("dayShift") : t("nightShift"),
                    " ",
                    /* @__PURE__ */ jsx7(DirArrow, { size: 12 })
                  ] }) })
                ] });
              })(),
              !canManage && (() => {
                const b = statusBadge(p);
                return /* @__PURE__ */ jsx7("span", { className: "text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: b.bg, color: b.color }, children: b.label });
              })(),
              p.id === currentUserId && p.inCharge && (p.role === "Shift Supervisor" || p.role === "Section Supervisor") && /* @__PURE__ */ jsxs7("button", { onClick: () => setHandoverPickerOpen(true), className: "flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: [
                /* @__PURE__ */ jsx7(ArrowLeftRight, { size: 12 }),
                " ",
                t("requestHandoverBtn")
              ] })
            ] })
          ] }, p.id)) })
        ] }, g);
      }),
      shiftFiltered.length === 0 && /* @__PURE__ */ jsx7("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: "\u2014" })
    ] }),
    pendingStaffAction && (() => {
      const targetLabel = pendingStaffAction.type === "leave" ? t("vacationShort") : people.find((p) => p.id === pendingStaffAction.personId)?.shift === "night" ? t("dayShift") : t("nightShift");
      return /* @__PURE__ */ jsx7("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(22,34,46,0.45)" }, onClick: cancelStaffAction, children: /* @__PURE__ */ jsxs7("div", { className: "w-full max-w-xs rounded-xl p-4", style: { background: "#FFFFFF" }, onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsx7("h3", { className: "text-base font-black mb-2", style: { color: "#16222E" }, children: t("confirmStaffTitle") }),
        /* @__PURE__ */ jsxs7("p", { className: "text-sm mb-4", style: { color: "#5B6B79" }, children: [
          t("confirmStaffMsg"),
          " ",
          /* @__PURE__ */ jsx7("span", { className: "font-bold", style: { color: "#16222E" }, children: pendingStaffAction.personName }),
          " ",
          t("confirmStaffTo"),
          " ",
          /* @__PURE__ */ jsx7("span", { className: "font-bold", style: { color: "#16222E" }, children: targetLabel }),
          lang === "ar" ? "\u061F" : "?"
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx7("button", { onClick: cancelStaffAction, className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: "#F4F6F8", color: "#5B6B79", border: "1px solid #E2E8ED" }, children: t("cancelBtn") }),
          /* @__PURE__ */ jsx7("button", { onClick: confirmStaffAction, className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: t("confirmBtn") })
        ] })
      ] }) });
    })()
  ] });
}

// source/components/LogbookOverlay.jsx
import { X as X6, Download as Download2 } from "lucide-react";
import { Fragment as Fragment5, jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
function LogbookOverlay(ctx) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    viewerOnDuty,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  function deptContent(dept) {
    const dTasks = tasks.filter((tk) => tk.department === dept && visibleToViewer(tk));
    const dProblems = problems.filter((p) => p.department === dept);
    const pendingSections = [
      { key: "pendingTasks", list: dTasks.filter((tk) => tk.status !== "completed"), render: (tk, i) => TaskCard(ctx, tk, false, i + 1) },
      { key: "pendingProblems", list: dProblems.filter((p) => p.workStatus !== "resolved"), render: (p) => ProblemCard(ctx, p) }
    ];
    const generalSections = [
      { key: "generalTasks", list: dTasks.filter((tk) => tk.status === "completed" && tk.completedAt === today2), render: (tk, i) => TaskCard(ctx, tk, false, i + 1) },
      { key: "generalProblems", list: dProblems.filter((p) => p.workStatus === "resolved" && p.dateISO === today2), render: (p) => ProblemCard(ctx, p) }
    ];
    const allEmpty = [...pendingSections, ...generalSections].every((s) => s.list.length === 0);
    return { pendingSections, generalSections, allEmpty };
  }
  function Content({ dept }) {
    const { pendingSections, generalSections, allEmpty } = deptContent(dept);
    return /* @__PURE__ */ jsxs8(Fragment5, { children: [
      [["pendingIssuesTasksSec", pendingSections], ["generalSec", generalSections]].map(([labelKey, secs]) => secs.some((s) => s.list.length > 0) && /* @__PURE__ */ jsxs8("div", { children: [
        /* @__PURE__ */ jsx8("h4", { className: "text-sm font-black mb-2 px-1", style: { color: "#16222E" }, children: t(labelKey) }),
        secs.map((s) => s.list.length > 0 && /* @__PURE__ */ jsx8("div", { className: "flex flex-col gap-2.5 mb-2", children: s.list.map((item, i) => s.render(item, i)) }, s.key))
      ] }, labelKey)),
      allEmpty && /* @__PURE__ */ jsx8("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("logbookEmpty") })
    ] });
  }
  function SummaryBlock({ dept }) {
    const key = logbookKey(dept);
    const entry = logbookNotes[key];
    const isApproved = entry && entry.reviewStatus === "approved";
    const draftVal = logbookSummaryDraft[key] ?? entry?.summary ?? "";
    return /* @__PURE__ */ jsxs8("div", { className: "rounded-xl p-4 flex flex-col gap-2.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx8("p", { className: "text-sm font-bold", style: { color: "#16222E" }, children: t("logbookSummaryLbl") }),
        /* @__PURE__ */ jsx8("span", { className: "text-[10px] font-black px-2 py-0.5 rounded-full", style: { background: isApproved ? "#E4F3EA" : "#FBEEDF", color: isApproved ? "#2F7D4F" : "#B25E09" }, children: isApproved ? t("logbookApprovedBadge") : t("logbookDraftBadge") })
      ] }),
      /* @__PURE__ */ jsx8("textarea", { value: draftVal, onChange: (e) => setLogbookSummaryDraft((prev) => ({ ...prev, [key]: e.target.value })), placeholder: t("logbookSummaryPH"), rows: 3, className: "w-full text-sm outline-none resize-none", style: inputStyle }),
      /* @__PURE__ */ jsxs8("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx8("button", { onClick: () => saveLogbookDraft(dept), className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: "#F4F6F8", border: "1px solid #DCE3E8", color: "#16222E" }, children: t("saveDraftBtn") }),
        viewer.inCharge && viewerOnDuty && /* @__PURE__ */ jsx8("button", { onClick: () => runWithBusy("approveLogbook_" + dept, () => approveLogbook(dept)), className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: "#2F7D4F", color: "white" }, children: BtnContent(ctx, "approveLogbook_" + dept, t("approveLogbookBtn")) })
      ] }),
      viewer.inCharge && !viewerOnDuty && /* @__PURE__ */ jsx8("p", { className: "text-[11px] rounded-lg px-2.5 py-2", style: { background: "#FFF6EB", color: "#B25E09" }, children: t("offDutyNotice") }),
      isApproved && /* @__PURE__ */ jsxs8("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
        t("logbookApprovedBy"),
        " ",
        entry.approvedBy,
        " \u2014 ",
        entry.approvedAt
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs8("div", { className: "flex flex-col gap-3", style: { animation: "fadeSlideUp 240ms ease-out" }, children: [
    /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsx8("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("logbook") }),
      /* @__PURE__ */ jsx8("button", { onClick: () => setActiveOverlay(null), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx8(X6, { size: 16, color: "#16222E" }) })
    ] }),
    /* @__PURE__ */ jsx8("p", { className: "text-xs", style: { color: "#8A97A3" }, children: t("logbookDesc") }),
    canManage && /* @__PURE__ */ jsxs8(Fragment5, { children: [
      /* @__PURE__ */ jsxs8("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs8("button", { onClick: () => exportLogbook("pdf"), className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 rounded-lg", style: { background: "#FFFFFF", border: "1px solid #DCE3E8", color: "#16222E" }, children: [
          /* @__PURE__ */ jsx8(Download2, { size: 15 }),
          " ",
          t("exportPdf")
        ] }),
        /* @__PURE__ */ jsxs8("button", { onClick: () => exportLogbook("word"), className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 rounded-lg", style: { background: "#FFFFFF", border: "1px solid #DCE3E8", color: "#16222E" }, children: [
          /* @__PURE__ */ jsx8(Download2, { size: 15 }),
          " ",
          t("exportWord")
        ] })
      ] }),
      departments.map((dept) => /* @__PURE__ */ jsxs8("div", { className: "flex flex-col gap-2.5 pb-3", style: { borderBottom: "1px solid #EEF1F4" }, children: [
        /* @__PURE__ */ jsx8("h3", { className: "text-sm font-black px-1", style: { color: deptColor(dept).text }, children: dept }),
        /* @__PURE__ */ jsx8(Content, { dept }),
        /* @__PURE__ */ jsx8(SummaryBlock, { dept })
      ] }, dept))
    ] }),
    isAdvisory && departments.map((dept) => {
      const key = logbookKey(dept);
      const entry = logbookNotes[key];
      const isApproved = entry && entry.reviewStatus === "approved";
      return /* @__PURE__ */ jsxs8("div", { className: "flex flex-col gap-2.5 pb-3", style: { borderBottom: "1px solid #EEF1F4" }, children: [
        /* @__PURE__ */ jsx8("h3", { className: "text-sm font-black px-1", style: { color: deptColor(dept).text }, children: dept }),
        isApproved ? /* @__PURE__ */ jsxs8("div", { className: "rounded-xl p-4", style: { background: "#E4F3EA" }, children: [
          /* @__PURE__ */ jsx8("p", { className: "text-sm font-bold mb-1", style: { color: "#2F7D4F" }, children: t("logbookSummaryLbl") }),
          /* @__PURE__ */ jsx8("p", { className: "text-sm", style: { color: "#16222E" }, children: entry.summary }),
          /* @__PURE__ */ jsxs8("p", { className: "text-[11px] mt-1.5", style: { color: "#5B6B79" }, children: [
            t("logbookApprovedBy"),
            " ",
            entry.approvedBy,
            " \u2014 ",
            entry.approvedAt
          ] })
        ] }) : /* @__PURE__ */ jsx8("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("logbookAwaitingApproval") }),
        /* @__PURE__ */ jsx8(Content, { dept })
      ] }, dept);
    }),
    !canManage && !isAdvisory && /* @__PURE__ */ jsx8(Content, { dept: viewer.department })
  ] });
}

// source/components/ReadingsOverlay.jsx
import { Plus as Plus2, ChevronUp as ChevronUp3, X as X7, Activity as Activity2, FileText as FileText3, Download as Download3, Camera as Camera2, Search as Search3 } from "lucide-react";
import { Fragment as Fragment6, jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
var TIME_SLOTS = ["10AM", "4PM", "10PM", "4AM"];
var SLOT_LABEL = { "10AM": "10:00 AM", "4PM": "4:00 PM", "10PM": "10:00 PM", "4AM": "4:00 AM" };
function ReadingsOverlay(ctx) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingTimeSlot,
    readingsDateSearchOpen,
    readingsLog,
    readingsTab,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingTimeSlot,
    setReadingsDateSearchOpen,
    setReadingsLog,
    setReadingsTab,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  const deptReadings = readingsVisibleToViewer.filter((r) => r.dateISO === readingsViewDate);
  const canSubmitReading = viewerRole === "operator" || canManage;
  function ReadingCard(r) {
    return /* @__PURE__ */ jsxs9("div", { className: "rounded-xl p-3.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsxs9("p", { className: "text-[11px] mb-1.5", style: { color: "#8A97A3" }, children: [
        t("enteredByLbl"),
        " ",
        /* @__PURE__ */ jsx9("b", { style: { color: "#16222E" }, children: personLabel(r.enteredBy) }),
        " \u2014 ",
        r.createdAt
      ] }),
      r.attachment && /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2 mb-2", children: [
        r.attachment.isImage ? /* @__PURE__ */ jsx9("img", { src: r.attachment.dataUrl, alt: "", className: "w-12 h-12 rounded-lg object-cover" }) : /* @__PURE__ */ jsx9("div", { className: "w-12 h-12 rounded-lg flex items-center justify-center", style: { background: "#E6EEF5" }, children: /* @__PURE__ */ jsx9(FileText3, { size: 18, color: "#1F4E79" }) }),
        /* @__PURE__ */ jsx9("span", { className: "text-xs", style: { color: "#5B6B79" }, children: r.attachment.name })
      ] }),
      r.notes.length > 0 && /* @__PURE__ */ jsx9("div", { className: "flex flex-col gap-1.5", children: r.notes.map((n) => /* @__PURE__ */ jsxs9("div", { className: "rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 flex-wrap", style: { background: SEVERITY[n.severity].bg }, children: [
        /* @__PURE__ */ jsx9("span", { className: "text-[10px] font-black px-1.5 py-0.5 rounded-full", style: { background: SEVERITY[n.severity].color, color: "white" }, children: SEVERITY[n.severity][lang] || SEVERITY[n.severity].ar }),
        /* @__PURE__ */ jsx9("span", { className: "text-xs", style: { color: "#16222E" }, children: n.equipmentName || n.description })
      ] }, n.id)) }),
      ReviewBlock(ctx, r, reviewReading, r.enteredBy)
    ] }, r.id);
  }
  return /* @__PURE__ */ jsxs9("div", { className: "flex flex-col gap-3", style: { animation: "fadeSlideUp 240ms ease-out" }, children: [
    /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsx9("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("readings") }),
      /* @__PURE__ */ jsx9("button", { onClick: () => setActiveOverlay(null), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx9(X7, { size: 16, color: "#16222E" }) })
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "flex gap-2 mb-1", children: [
      /* @__PURE__ */ jsx9("button", { onClick: () => setReadingsTab("history"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: readingsTab === "history" ? "#1F4E79" : "#FFFFFF", color: readingsTab === "history" ? "white" : "#5B6B79", border: "1px solid " + (readingsTab === "history" ? "#1F4E79" : "#DCE3E8") }, children: t("readingsHistoryTab") }),
      canSubmitReading && /* @__PURE__ */ jsx9("button", { onClick: () => setReadingsTab("add"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: readingsTab === "add" ? "#1F4E79" : "#FFFFFF", color: readingsTab === "add" ? "white" : "#5B6B79", border: "1px solid " + (readingsTab === "add" ? "#1F4E79" : "#DCE3E8") }, children: t("addReadingTab") })
    ] }),
    readingsTab === "history" && /* @__PURE__ */ jsxs9(Fragment6, { children: [
      /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx9("button", { onClick: () => setReadingsDateSearchOpen(!readingsDateSearchOpen), className: "w-9 h-9 rounded-lg flex items-center justify-center shrink-0", style: { background: readingsDateSearchOpen ? "#1F4E79" : "#FFFFFF", border: "1px solid " + (readingsDateSearchOpen ? "#1F4E79" : "#DCE3E8") }, children: /* @__PURE__ */ jsx9(Search3, { size: 15, color: readingsDateSearchOpen ? "white" : "#16222E" }) }),
        /* @__PURE__ */ jsxs9("div", { className: "flex-1 flex items-center justify-between rounded-xl p-2.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
          /* @__PURE__ */ jsx9("button", { onClick: () => setReadingsViewDate((d) => shiftISODate(d, -1)), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx9(ChevronUp3, { size: 16, style: { transform: "rotate(-90deg)" }, color: "#16222E" }) }),
          /* @__PURE__ */ jsx9("p", { className: "text-sm font-black", style: { color: "#16222E" }, children: readingsViewDate === today2 ? t("todayLbl") : readingsViewDate }),
          /* @__PURE__ */ jsx9("button", { onClick: () => setReadingsViewDate((d) => shiftISODate(d, 1)), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx9(ChevronUp3, { size: 16, style: { transform: "rotate(90deg)" }, color: "#16222E" }) })
        ] })
      ] }),
      readingsDateSearchOpen && /* @__PURE__ */ jsx9("div", { className: "rounded-xl p-2.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx9("input", { type: "date", value: readingsViewDate, onChange: (e) => {
        setReadingsViewDate(e.target.value);
        setReadingsDateSearchOpen(false);
      }, className: "w-full text-sm outline-none", style: inputStyle }) }),
      TIME_SLOTS.map((slot) => {
        const slotReadings = deptReadings.filter((r) => r.timeSlot === slot);
        return /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx9("p", { className: "text-xs font-bold mb-2 px-1", style: labelStyle, children: SLOT_LABEL[slot] }),
          /* @__PURE__ */ jsxs9("div", { className: "flex flex-col gap-2.5", children: [
            slotReadings.length === 0 && /* @__PURE__ */ jsx9("div", { className: "rounded-xl p-4 text-center text-xs", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noReadingsForSlot") }),
            slotReadings.map((r) => ReadingCard(r))
          ] })
        ] }, slot);
      })
    ] }),
    readingsTab === "add" && canSubmitReading && /* @__PURE__ */ jsxs9("div", { className: "rounded-xl p-4 flex flex-col gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsx9("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: t("newReading") }),
      !readingAttachment ? /* @__PURE__ */ jsxs9("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs9("label", { className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-3 rounded-lg cursor-pointer", style: { background: "#F4F6F8", color: "#16222E", border: "1px dashed #DCE3E8" }, children: [
          /* @__PURE__ */ jsx9(Camera2, { size: 16 }),
          " ",
          t("takePhotoBtn"),
          /* @__PURE__ */ jsx9("input", { type: "file", accept: "image/*", capture: "environment", className: "hidden", onChange: handleReadingFile })
        ] }),
        /* @__PURE__ */ jsxs9("label", { className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-3 rounded-lg cursor-pointer", style: { background: "#F4F6F8", color: "#16222E", border: "1px dashed #DCE3E8" }, children: [
          /* @__PURE__ */ jsx9(Download3, { size: 16, style: { transform: "rotate(180deg)" } }),
          " ",
          t("uploadFileBtn"),
          /* @__PURE__ */ jsx9("input", { type: "file", accept: "image/*,.pdf", className: "hidden", onChange: handleReadingFile })
        ] })
      ] }) : /* @__PURE__ */ jsxs9("div", { className: "rounded-lg p-2.5 flex items-center gap-3", style: { background: "#F4F6F8" }, children: [
        readingAttachment.isImage ? /* @__PURE__ */ jsx9("img", { src: readingAttachment.dataUrl, alt: "", className: "w-14 h-14 rounded-lg object-cover shrink-0" }) : /* @__PURE__ */ jsx9("div", { className: "w-14 h-14 rounded-lg flex items-center justify-center shrink-0", style: { background: "#E6EEF5" }, children: /* @__PURE__ */ jsx9(FileText3, { size: 22, color: "#1F4E79" }) }),
        /* @__PURE__ */ jsx9("p", { className: "flex-1 text-xs font-bold truncate", style: { color: "#16222E" }, children: readingAttachment.name }),
        /* @__PURE__ */ jsx9("button", { onClick: () => setReadingAttachment(null), className: "text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0", style: { background: "#FBE7E4", color: "#C0392B" }, children: t("removeFile") })
      ] }),
      /* @__PURE__ */ jsxs9("div", { children: [
        /* @__PURE__ */ jsx9("p", { className: "text-xs font-bold mb-1.5", style: labelStyle, children: t("timeSlotLbl") }),
        /* @__PURE__ */ jsx9("div", { className: "flex gap-1.5", children: TIME_SLOTS.map((slot) => /* @__PURE__ */ jsx9("button", { type: "button", onClick: () => setReadingTimeSlot(slot), className: "flex-1 text-[11px] font-bold py-2 rounded-lg", style: { background: readingTimeSlot === slot ? "#1F4E79" : "#FFFFFF", color: readingTimeSlot === slot ? "white" : "#5B6B79", border: "1px solid " + (readingTimeSlot === slot ? "#1F4E79" : "#E2E8ED") }, children: SLOT_LABEL[slot] }, slot)) })
      ] }),
      /* @__PURE__ */ jsxs9("div", { children: [
        /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between mb-1.5", children: [
          /* @__PURE__ */ jsx9("p", { className: "text-xs font-bold", style: labelStyle, children: t("notesSectionTitle") }),
          !showNoteForm && /* @__PURE__ */ jsxs9("button", { onClick: () => setShowNoteForm(true), className: "flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: [
            /* @__PURE__ */ jsx9(Plus2, { size: 13 }),
            " ",
            t("addNoteBtn")
          ] })
        ] }),
        readingNotesDraft.length > 0 && /* @__PURE__ */ jsx9("div", { className: "flex flex-col gap-1.5 mb-2", children: readingNotesDraft.map((n) => /* @__PURE__ */ jsxs9("div", { className: "rounded-lg p-2.5 flex items-start justify-between gap-2", style: { background: SEVERITY[n.severity].bg }, children: [
          /* @__PURE__ */ jsxs9("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-1.5 flex-wrap mb-0.5", children: [
              /* @__PURE__ */ jsx9("span", { className: "text-[10px] font-black px-2 py-0.5 rounded-full", style: { background: SEVERITY[n.severity].color, color: "white" }, children: SEVERITY[n.severity][lang] || SEVERITY[n.severity].ar }),
              n.equipmentName && /* @__PURE__ */ jsx9("b", { className: "text-xs", style: { color: "#16222E" }, children: n.equipmentName }),
              n.tagNumber && /* @__PURE__ */ jsx9("span", { className: "text-[11px] font-bold", dir: "ltr", style: { color: "#1F4E79" }, children: n.tagNumber })
            ] }),
            n.unitName && /* @__PURE__ */ jsxs9("p", { className: "text-[11px]", style: { color: "#5B6B79" }, children: [
              t("unitNameLbl"),
              ": ",
              n.unitName
            ] }),
            n.description && /* @__PURE__ */ jsx9("p", { className: "text-xs mt-0.5", style: { color: "#5B6B79" }, children: n.description })
          ] }),
          /* @__PURE__ */ jsx9("button", { onClick: () => removeNoteDraft(n.id), className: "shrink-0", children: /* @__PURE__ */ jsx9(X7, { size: 14, color: "#8A97A3" }) })
        ] }, n.id)) }),
        showNoteForm && /* @__PURE__ */ jsxs9("div", { className: "rounded-lg p-3 flex flex-col gap-2 mt-1", style: { background: "#F4F6F8" }, children: [
          /* @__PURE__ */ jsx9("input", { value: noteDraft.unitName, onChange: (e) => setNoteDraft({ ...noteDraft, unitName: e.target.value }), placeholder: t("unitNameLbl"), className: "w-full text-sm outline-none", style: inputStyle }),
          /* @__PURE__ */ jsx9("input", { value: noteDraft.equipmentName, onChange: (e) => setNoteDraft({ ...noteDraft, equipmentName: e.target.value }), placeholder: t("equipmentName"), className: "w-full text-sm outline-none", style: inputStyle }),
          /* @__PURE__ */ jsx9("input", { value: noteDraft.tagNumber, onChange: (e) => setNoteDraft({ ...noteDraft, tagNumber: e.target.value }), placeholder: t("tagNumberLbl"), dir: "ltr", className: "w-full text-sm outline-none", style: inputStyle }),
          /* @__PURE__ */ jsx9("textarea", { value: noteDraft.description, onChange: (e) => setNoteDraft({ ...noteDraft, description: e.target.value }), placeholder: t("descProblem"), rows: 2, className: "w-full text-sm outline-none resize-none", style: inputStyle }),
          /* @__PURE__ */ jsxs9("div", { children: [
            /* @__PURE__ */ jsx9("p", { className: "text-[11px] font-bold mb-1", style: labelStyle, children: t("severityLabel") }),
            /* @__PURE__ */ jsx9("div", { className: "flex gap-1.5", children: Object.entries(SEVERITY).map(([k, v]) => /* @__PURE__ */ jsx9("button", { type: "button", onClick: () => setNoteDraft({ ...noteDraft, severity: k }), className: "flex-1 text-[11px] font-bold py-2 rounded-lg", style: { background: noteDraft.severity === k ? v.color : "#FFFFFF", color: noteDraft.severity === k ? "white" : "#5B6B79", border: "1px solid " + (noteDraft.severity === k ? v.color : "#E2E8ED") }, children: v[lang] || v.ar }, k)) })
          ] }),
          /* @__PURE__ */ jsxs9("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx9("button", { onClick: () => setShowNoteForm(false), className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: "#FFFFFF", border: "1px solid #DCE3E8", color: "#5B6B79" }, children: t("cancel") }),
            /* @__PURE__ */ jsx9("button", { onClick: addNoteDraft, className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: "#16222E", color: "white" }, children: t("addNoteBtn") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx9("button", { onClick: () => runWithBusy("saveReading", saveReading), disabled: !readingAttachment && readingNotesDraft.length === 0, className: "text-sm font-bold py-2.5 rounded-lg", style: { background: "#1F4E79", color: "white", opacity: !readingAttachment && readingNotesDraft.length === 0 ? 0.5 : 1 }, children: BtnContent(ctx, "saveReading", t("saveReadingBtn")) })
    ] })
  ] });
}

// source/components/ReportsOverlay.jsx
import { ChevronUp as ChevronUp4, X as X8, FileText as FileText4, Download as Download4, Camera as Camera3, Search as Search4 } from "lucide-react";
import { Fragment as Fragment7, jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
function ReportsOverlay(ctx) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsDateSearchOpen,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsDateSearchOpen,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  const dayReports = reportsVisibleToViewer.filter((r) => r.dateISO === reportsViewDate && r.reportKind === "production");
  const canSubmitProduction = viewer.role === "Panel Operator" || canManage;
  const periodicKind = periodicSection === "General" ? "general_" + periodicPeriod : periodicSection + "_" + periodicPeriod;
  const canSubmitPeriodic = periodicSection === "General" ? isShiftSupervisor : viewer.department === periodicSection && (viewerRole === "operator" || canManage);
  const currentPeriodKey = periodicPeriod === "weekly" ? periodicWeekKey : periodicMonthKey;
  const periodicList = reportsVisibleToViewer.filter((r) => r.reportKind === periodicKind && r.periodKey === currentPeriodKey).sort((a, b) => b.ts - a.ts);
  const periodLabel = periodicPeriod === "weekly" ? weekLabel(periodicWeekKey, lang) : monthLabel(periodicMonthKey, lang);
  const isCurrentPeriod = periodicPeriod === "weekly" ? periodicWeekKey === weekKeyOf(today2) : periodicMonthKey === monthKeyOf(today2);
  function UploadCard(onSaveKind, canSubmit, restrictionNote) {
    if (!canSubmit) return /* @__PURE__ */ jsx10("p", { className: "text-xs italic px-1", style: { color: "#8A97A3" }, children: restrictionNote });
    return /* @__PURE__ */ jsxs10("div", { className: "flex flex-col gap-3", style: { animation: "fadeSlideUp 240ms ease-out" }, children: [
      !reportAttachment ? /* @__PURE__ */ jsxs10("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs10("label", { className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-3 rounded-lg cursor-pointer", style: { background: "#F4F6F8", color: "#16222E", border: "1px dashed #DCE3E8" }, children: [
          /* @__PURE__ */ jsx10(Camera3, { size: 16 }),
          " ",
          t("takePhotoBtn"),
          /* @__PURE__ */ jsx10("input", { type: "file", accept: "image/*", capture: "environment", className: "hidden", onChange: handleReportFile })
        ] }),
        /* @__PURE__ */ jsxs10("label", { className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-3 rounded-lg cursor-pointer", style: { background: "#F4F6F8", color: "#16222E", border: "1px dashed #DCE3E8" }, children: [
          /* @__PURE__ */ jsx10(Download4, { size: 16, style: { transform: "rotate(180deg)" } }),
          " ",
          t("uploadFileBtn"),
          /* @__PURE__ */ jsx10("input", { type: "file", accept: "image/*,.pdf", className: "hidden", onChange: handleReportFile })
        ] })
      ] }) : /* @__PURE__ */ jsxs10("div", { className: "rounded-lg p-2.5 flex items-center gap-3", style: { background: "#F4F6F8" }, children: [
        reportAttachment.isImage ? /* @__PURE__ */ jsx10("img", { src: reportAttachment.dataUrl, alt: "", className: "w-14 h-14 rounded-lg object-cover shrink-0" }) : /* @__PURE__ */ jsx10("div", { className: "w-14 h-14 rounded-lg flex items-center justify-center shrink-0", style: { background: "#E6EEF5" }, children: /* @__PURE__ */ jsx10(FileText4, { size: 22, color: "#1F4E79" }) }),
        /* @__PURE__ */ jsx10("p", { className: "flex-1 text-xs font-bold truncate", style: { color: "#16222E" }, children: reportAttachment.name }),
        /* @__PURE__ */ jsx10("button", { onClick: () => setReportAttachment(null), className: "text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0", style: { background: "#FBE7E4", color: "#C0392B" }, children: t("removeFile") })
      ] }),
      /* @__PURE__ */ jsx10("button", { onClick: () => runWithBusy("saveReport", onSaveKind), disabled: !reportAttachment, className: "text-sm font-bold py-2.5 rounded-lg", style: { background: "#1F4E79", color: "white", opacity: !reportAttachment ? 0.5 : 1 }, children: BtnContent(ctx, "saveReport", t("saveReadingBtn")) })
    ] });
  }
  return /* @__PURE__ */ jsxs10("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxs10("div", { className: "flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsx10("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("reportsMenu") }),
      /* @__PURE__ */ jsx10("button", { onClick: () => setActiveOverlay(null), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx10(X8, { size: 16, color: "#16222E" }) })
    ] }),
    /* @__PURE__ */ jsxs10("div", { className: "flex gap-2 mb-1", children: [
      /* @__PURE__ */ jsx10("button", { onClick: () => setReportsTab("daily"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: reportsTab === "daily" ? "#1F4E79" : "#FFFFFF", color: reportsTab === "daily" ? "white" : "#5B6B79", border: "1px solid " + (reportsTab === "daily" ? "#1F4E79" : "#DCE3E8") }, children: t("dailyReportsTab") }),
      /* @__PURE__ */ jsx10("button", { onClick: () => setReportsTab("periodic"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: reportsTab === "periodic" ? "#1F4E79" : "#FFFFFF", color: reportsTab === "periodic" ? "white" : "#5B6B79", border: "1px solid " + (reportsTab === "periodic" ? "#1F4E79" : "#DCE3E8") }, children: t("periodicReportsTab") })
    ] }),
    reportsTab === "daily" && /* @__PURE__ */ jsxs10(Fragment7, { children: [
      /* @__PURE__ */ jsx10("p", { className: "text-sm font-black px-1", style: { color: "#B25E09" }, children: t("latestReportSection") }),
      /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx10("button", { onClick: () => setReportsDateSearchOpen(!reportsDateSearchOpen), className: "w-9 h-9 rounded-lg flex items-center justify-center shrink-0", style: { background: reportsDateSearchOpen ? "#1F4E79" : "#FFFFFF", border: "1px solid " + (reportsDateSearchOpen ? "#1F4E79" : "#DCE3E8") }, children: /* @__PURE__ */ jsx10(Search4, { size: 15, color: reportsDateSearchOpen ? "white" : "#16222E" }) }),
        /* @__PURE__ */ jsxs10("div", { className: "flex-1 flex items-center justify-between rounded-xl p-2.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
          /* @__PURE__ */ jsx10("button", { onClick: () => setReportsViewDate((d) => shiftISODate(d, -1)), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx10(ChevronUp4, { size: 16, style: { transform: "rotate(-90deg)" }, color: "#16222E" }) }),
          /* @__PURE__ */ jsx10("p", { className: "text-sm font-black", style: { color: "#16222E" }, children: reportsViewDate === today2 ? t("todayLbl") : reportsViewDate }),
          /* @__PURE__ */ jsx10("button", { onClick: () => setReportsViewDate((d) => shiftISODate(d, 1)), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx10(ChevronUp4, { size: 16, style: { transform: "rotate(90deg)" }, color: "#16222E" }) })
        ] })
      ] }),
      reportsDateSearchOpen && /* @__PURE__ */ jsx10("div", { className: "rounded-xl p-2.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx10("input", { type: "date", value: reportsViewDate, onChange: (e) => {
        setReportsViewDate(e.target.value);
        setReportsDateSearchOpen(false);
      }, className: "w-full text-sm outline-none", style: inputStyle }) }),
      /* @__PURE__ */ jsxs10("div", { className: "flex flex-col gap-2.5", children: [
        dayReports.length === 0 && /* @__PURE__ */ jsx10("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noReportsYet") }),
        dayReports.map((r) => /* @__PURE__ */ jsxs10("div", { className: "rounded-xl p-3.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
          /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-3", children: [
            r.attachment.isImage ? /* @__PURE__ */ jsx10("img", { src: r.attachment.dataUrl, alt: "", className: "w-12 h-12 rounded-lg object-cover shrink-0" }) : /* @__PURE__ */ jsx10("div", { className: "w-12 h-12 rounded-lg flex items-center justify-center shrink-0", style: { background: "#E6EEF5" }, children: /* @__PURE__ */ jsx10(FileText4, { size: 18, color: "#1F4E79" }) }),
            /* @__PURE__ */ jsxs10("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx10("p", { className: "text-sm font-bold truncate", style: { color: "#16222E" }, children: r.attachment.name }),
              /* @__PURE__ */ jsxs10("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
                t("enteredByLbl"),
                " ",
                personLabel(r.enteredBy),
                " \u2014 ",
                r.createdAt
              ] })
            ] })
          ] }),
          ReviewBlock(ctx, r, reviewReport, r.enteredBy)
        ] }, r.id))
      ] }),
      /* @__PURE__ */ jsx10("p", { className: "text-sm font-black px-1 mt-1", style: { color: "#B25E09" }, children: t("addReportSection") }),
      /* @__PURE__ */ jsxs10("div", { className: "rounded-xl p-4 flex flex-col gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
        /* @__PURE__ */ jsx10("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: t("dailyProductionReport") }),
        UploadCard(() => saveReport("production", "daily"), canSubmitProduction, t("panelOperatorOnlyNote"))
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "rounded-xl p-3.5 flex items-center gap-3", style: { background: "#F4F6F8", border: "1px dashed #DCE3E8" }, children: [
        /* @__PURE__ */ jsx10(FileText4, { size: 20, color: "#8A97A3" }),
        /* @__PURE__ */ jsxs10("div", { children: [
          /* @__PURE__ */ jsx10("p", { className: "text-sm font-bold", style: { color: "#16222E" }, children: t("labReportTitle") }),
          /* @__PURE__ */ jsx10("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: t("labReportSoon") }),
          /* @__PURE__ */ jsx10("p", { className: "text-[11px] mt-1", style: { color: "#8A97A3" }, children: "Water \xB7 Gas & Condensate \xB7 Hot Oil \xB7 Lube Oil \xB7 Seal Oil" })
        ] })
      ] })
    ] }),
    reportsTab === "periodic" && /* @__PURE__ */ jsxs10(Fragment7, { children: [
      /* @__PURE__ */ jsx10("div", { className: "flex flex-wrap gap-2", children: [...departments, "General"].map((s) => /* @__PURE__ */ jsx10("button", { onClick: () => setPeriodicSection(s), className: "text-xs font-bold px-3 py-2 rounded-lg", style: { background: periodicSection === s ? "#1F4E79" : "#FFFFFF", color: periodicSection === s ? "white" : "#5B6B79", border: "1px solid " + (periodicSection === s ? "#1F4E79" : "#DCE3E8") }, children: s === "General" ? t("generalReportTitle") : s }, s)) }),
      /* @__PURE__ */ jsxs10("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx10("button", { onClick: () => setPeriodicPeriod("weekly"), className: "flex-1 text-sm font-bold py-2 rounded-lg", style: { background: periodicPeriod === "weekly" ? "#B25E09" : "#F4F6F8", color: periodicPeriod === "weekly" ? "white" : "#5B6B79" }, children: t("weeklyBtn") }),
        /* @__PURE__ */ jsx10("button", { onClick: () => setPeriodicPeriod("monthly"), className: "flex-1 text-sm font-bold py-2 rounded-lg", style: { background: periodicPeriod === "monthly" ? "#1F4E79" : "#F4F6F8", color: periodicPeriod === "monthly" ? "white" : "#5B6B79" }, children: t("monthlyBtn") })
      ] }),
      /* @__PURE__ */ jsx10("p", { className: "text-sm font-black px-1", style: { color: "#B25E09" }, children: t("latestReportSection") }),
      /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx10("button", { onClick: () => setReportsDateSearchOpen(!reportsDateSearchOpen), className: "w-9 h-9 rounded-lg flex items-center justify-center shrink-0", style: { background: reportsDateSearchOpen ? "#1F4E79" : "#FFFFFF", border: "1px solid " + (reportsDateSearchOpen ? "#1F4E79" : "#DCE3E8") }, children: /* @__PURE__ */ jsx10(Search4, { size: 15, color: reportsDateSearchOpen ? "white" : "#16222E" }) }),
        /* @__PURE__ */ jsxs10("div", { className: "flex-1 flex items-center justify-between rounded-xl p-2.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
          /* @__PURE__ */ jsx10("button", { onClick: () => periodicPeriod === "weekly" ? setPeriodicWeekKey((k) => shiftWeekKey(k, -1)) : setPeriodicMonthKey((k) => shiftMonthKey(k, -1)), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx10(ChevronUp4, { size: 16, style: { transform: "rotate(-90deg)" }, color: "#16222E" }) }),
          /* @__PURE__ */ jsxs10("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx10("p", { className: "text-sm font-black", style: { color: "#16222E" }, children: periodLabel }),
            isCurrentPeriod && /* @__PURE__ */ jsx10("p", { className: "text-[10px] font-bold", style: { color: "#2F7D4F" }, children: t("todayLbl") })
          ] }),
          /* @__PURE__ */ jsx10("button", { onClick: () => periodicPeriod === "weekly" ? setPeriodicWeekKey((k) => shiftWeekKey(k, 1)) : setPeriodicMonthKey((k) => shiftMonthKey(k, 1)), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx10(ChevronUp4, { size: 16, style: { transform: "rotate(90deg)" }, color: "#16222E" }) })
        ] })
      ] }),
      reportsDateSearchOpen && /* @__PURE__ */ jsx10("div", { className: "rounded-xl p-2.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx10("input", { type: "date", onChange: (e) => {
        const v = e.target.value;
        if (!v) return;
        if (periodicPeriod === "weekly") setPeriodicWeekKey(weekKeyOf(v));
        else setPeriodicMonthKey(monthKeyOf(v));
        setReportsDateSearchOpen(false);
      }, className: "w-full text-sm outline-none", style: inputStyle }) }),
      /* @__PURE__ */ jsxs10("div", { className: "flex flex-col gap-2.5", children: [
        periodicList.length === 0 && /* @__PURE__ */ jsx10("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noReportsYet") }),
        periodicList.map((r) => /* @__PURE__ */ jsxs10("div", { className: "rounded-xl p-3.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
          /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-3", children: [
            r.attachment.isImage ? /* @__PURE__ */ jsx10("img", { src: r.attachment.dataUrl, alt: "", className: "w-12 h-12 rounded-lg object-cover shrink-0" }) : /* @__PURE__ */ jsx10("div", { className: "w-12 h-12 rounded-lg flex items-center justify-center shrink-0", style: { background: "#E6EEF5" }, children: /* @__PURE__ */ jsx10(FileText4, { size: 18, color: "#1F4E79" }) }),
            /* @__PURE__ */ jsxs10("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx10("p", { className: "text-sm font-bold truncate", style: { color: "#16222E" }, children: r.attachment.name }),
              /* @__PURE__ */ jsxs10("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
                t("enteredByLbl"),
                " ",
                personLabel(r.enteredBy),
                " \u2014 ",
                r.createdAt
              ] })
            ] })
          ] }),
          ReviewBlock(ctx, r, reviewReport, r.enteredBy)
        ] }, r.id))
      ] }),
      /* @__PURE__ */ jsx10("p", { className: "text-sm font-black px-1 mt-1", style: { color: "#B25E09" }, children: t("addReportSection") }),
      /* @__PURE__ */ jsxs10("div", { className: "rounded-xl p-4 flex flex-col gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
        /* @__PURE__ */ jsx10("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: periodicSection === "General" ? t("generalReportTitle") : t("sectionReportLabel") + " \xB7 " + periodicSection }),
        periodicSection === "General" && /* @__PURE__ */ jsx10("p", { className: "text-xs", style: { color: "#8A97A3" }, children: t("generalReportDesc") }),
        UploadCard(() => saveReport(periodicKind, periodicPeriod), canSubmitPeriodic, periodicSection === "General" ? t("shiftSupervisorOnlyNote") : t("noEntryPermission"))
      ] })
    ] })
  ] });
}

// source/components/DrawerMenu.jsx
import { X as X9, Languages } from "lucide-react";
import { jsx as jsx11, jsxs as jsxs11 } from "react/jsx-runtime";
function DrawerMenu(ctx) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  if (!drawerMounted) return null;
  const actionByKey = {
    tasks: () => {
      setActiveOverlay(null);
      setMainSubTab("tasks");
    },
    issues: () => {
      setActiveOverlay(null);
      setMainSubTab("problems");
    },
    reports: () => setActiveOverlay("reports"),
    calendar: () => setActiveOverlay("calendar"),
    logbook: () => setActiveOverlay("logbook"),
    readings: () => setActiveOverlay("readings"),
    staff: () => setActiveOverlay("staff"),
    eventList: () => setActiveOverlay("log")
  };
  const allowed = menuPermissions[viewer.role] || [];
  const items = MENU_ITEM_DEFS.filter((it) => allowed.includes(it.key));
  return /* @__PURE__ */ jsx11("div", { className: "fixed inset-0 z-50", style: { background: "rgba(22,34,46,0.45)", opacity: drawerVisible ? 1 : 0, transition: "opacity 220ms ease" }, onClick: () => setDrawerOpen(false), children: /* @__PURE__ */ jsxs11("div", { className: "fixed top-0 w-80 h-full flex flex-col p-5 gap-1.5", style: { right: 0, background: "#FFFFFF", boxShadow: "-6px 0 24px rgba(0,0,0,0.12)", transform: drawerVisible ? "translateX(0)" : "translateX(100%)", transition: "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)" }, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs11("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx11("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("menu") }),
      /* @__PURE__ */ jsx11("button", { onClick: () => setDrawerOpen(false), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx11(X9, { size: 19, color: "#5B6B79" }) })
    ] }),
    /* @__PURE__ */ jsxs11("div", { className: "flex flex-col gap-1.5 overflow-y-auto", children: [
      items.map((it, idx) => /* @__PURE__ */ jsxs11("button", { onClick: () => {
        actionByKey[it.key]();
        setDrawerOpen(false);
      }, className: "flex items-center gap-3.5 text-base font-bold px-4 py-4 rounded-xl transition-colors active:scale-[0.98]", style: { color: "#16222E", background: "#F8F9FA", opacity: drawerVisible ? 1 : 0, transform: drawerVisible ? "translateX(0)" : "translateX(12px)", transition: `opacity 220ms ease ${40 + idx * 30}ms, transform 220ms ease ${40 + idx * 30}ms` }, children: [
        /* @__PURE__ */ jsx11(it.icon, { size: 21, color: "#1F4E79" }),
        " ",
        t(it.labelKey)
      ] }, it.key)),
      items.length === 0 && /* @__PURE__ */ jsx11("p", { className: "text-sm text-center py-6", style: { color: "#8A97A3" }, children: "\u2014" })
    ] }),
    /* @__PURE__ */ jsx11("div", { className: "mt-auto pt-4", style: { borderTop: "1px solid #EEF1F4" }, children: /* @__PURE__ */ jsxs11("button", { onClick: () => setLang(lang === "ar" ? "en" : "ar"), className: "w-full flex items-center gap-3.5 text-base font-bold px-4 py-4 rounded-xl", style: { color: "#16222E", background: "#F8F9FA" }, children: [
      /* @__PURE__ */ jsx11(Languages, { size: 21, color: "#1F4E79" }),
      " ",
      lang === "ar" ? "English" : "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
    ] }) })
  ] }) });
}

// source/components/ToastStack.jsx
import { MessageSquare, CheckCircle2 as CheckCircle23 } from "lucide-react";
import { jsx as jsx12, jsxs as jsxs12 } from "react/jsx-runtime";
function ToastStack(ctx) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  if (toasts.length === 0) return null;
  return /* @__PURE__ */ jsx12("div", { className: "fixed top-4 left-1/2 z-[70] flex flex-col gap-2 items-center", style: { transform: "translateX(-50%)", width: "min(92vw, 380px)" }, children: toasts.map((tt) => /* @__PURE__ */ jsxs12("div", { className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg", style: { background: tt.kind === "success" ? "#1F4E3A" : tt.kind === "info" ? "#16222E" : "#7A2E22", color: "white", animation: "toastIn 240ms cubic-bezier(0.22, 1, 0.36, 1)" }, children: [
    tt.kind === "success" ? /* @__PURE__ */ jsx12(CheckCircle23, { size: 18, color: "#7EDCA8" }) : /* @__PURE__ */ jsx12(MessageSquare, { size: 18, color: "#9FB4C7" }),
    /* @__PURE__ */ jsx12("p", { className: "text-sm font-bold flex-1", children: tt.text })
  ] }, tt.id)) });
}

// source/components/AdminView.jsx
import { Trash2 as Trash22, UserPlus, ShieldCheck as ShieldCheck2, X as X10, Menu } from "lucide-react";
import { jsx as jsx13, jsxs as jsxs13 } from "react/jsx-runtime";
function AdminView(ctx) {
  const {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchOpen,
    canManage,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    extendingAlertId,
    formRef,
    getPerson,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingsLog,
    readingsViewDate,
    readingsVisibleToViewer,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeRole,
    reportAttachment,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    reviewProblem,
    reviewReading,
    reviewReport,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchOpen,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingsLog,
    setReadingsViewDate,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    tasksOnDate,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    visibleToViewer,
    weekDays,
    weekStart
  } = ctx;
  return /* @__PURE__ */ jsxs13("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs13("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsx13(ShieldCheck2, { size: 16, color: "#1F4E79" }),
        /* @__PURE__ */ jsx13("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: t("accounts") })
      ] }),
      /* @__PURE__ */ jsxs13("form", { onSubmit: addPerson, className: "flex flex-col sm:flex-row gap-2 items-end mb-3", children: [
        /* @__PURE__ */ jsx13("input", { value: newPerson.name, onChange: (e) => setNewPerson({ ...newPerson, name: e.target.value }), placeholder: t("name"), className: "flex-1 text-sm outline-none", style: inputStyle }),
        /* @__PURE__ */ jsx13("select", { value: newPerson.department, onChange: (e) => setNewPerson({ ...newPerson, department: e.target.value }), className: "text-sm outline-none", style: inputStyle, children: departments.map((d) => /* @__PURE__ */ jsx13("option", { children: d }, d)) }),
        /* @__PURE__ */ jsx13("select", { value: newPerson.role, onChange: (e) => setNewPerson({ ...newPerson, role: e.target.value }), className: "text-sm outline-none", style: inputStyle, children: roles.map((r) => /* @__PURE__ */ jsx13("option", { children: r }, r)) }),
        /* @__PURE__ */ jsxs13("label", { className: "flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg", style: { background: "#F4F6F8", color: "#5B6B79" }, children: [
          /* @__PURE__ */ jsx13("input", { type: "checkbox", checked: newPerson.isAdmin, onChange: (e) => setNewPerson({ ...newPerson, isAdmin: e.target.checked }) }),
          " ",
          t("appAdmin")
        ] }),
        /* @__PURE__ */ jsxs13("button", { type: "submit", className: "flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg shrink-0", style: { background: "#1F4E79", color: "white" }, children: [
          /* @__PURE__ */ jsx13(UserPlus, { size: 15 }),
          " ",
          t("addBtn")
        ] })
      ] }),
      /* @__PURE__ */ jsx13("div", { className: "flex flex-col gap-2 max-h-96 overflow-y-auto", children: people.map((p) => /* @__PURE__ */ jsxs13("div", { className: "flex items-center justify-between rounded-lg px-3 py-2", style: { background: "#F4F6F8" }, children: [
        /* @__PURE__ */ jsxs13("div", { children: [
          /* @__PURE__ */ jsx13("span", { className: "text-sm font-bold", style: { color: "#16222E" }, children: p.name }),
          /* @__PURE__ */ jsx13("span", { className: "text-xs mr-2", style: { color: "#8A97A3" }, children: p.employeeId }),
          /* @__PURE__ */ jsxs13("span", { className: "text-xs mr-2", style: labelStyle, children: [
            p.role,
            " \xB7 ",
            p.department
          ] }),
          p.isAdmin && /* @__PURE__ */ jsx13("span", { className: "text-[10px] font-bold mr-2 px-2 py-0.5 rounded-full", style: { background: "#E6EEF5", color: "#1F4E79" }, children: t("appAdmin") })
        ] }),
        /* @__PURE__ */ jsx13("button", { onClick: () => removePerson(p.id), className: "w-7 h-7 rounded-md flex items-center justify-center", style: { color: "#C0392B" }, children: /* @__PURE__ */ jsx13(Trash22, { size: 14 }) })
      ] }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsx13("h3", { className: "text-sm font-bold mb-3", style: { color: "#16222E" }, children: t("departmentsLabel") }),
      /* @__PURE__ */ jsxs13("form", { onSubmit: addDept, className: "flex gap-2 mb-3", children: [
        /* @__PURE__ */ jsx13("input", { value: newDept, onChange: (e) => setNewDept(e.target.value), placeholder: t("newDeptPH"), className: "flex-1 text-sm outline-none", style: inputStyle }),
        /* @__PURE__ */ jsx13("button", { type: "submit", className: "text-sm font-bold px-4 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: t("addBtn") })
      ] }),
      /* @__PURE__ */ jsx13("div", { className: "flex flex-wrap gap-2", children: departments.map((d) => /* @__PURE__ */ jsxs13("span", { className: "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full", style: { background: deptColor(d).bg, color: deptColor(d).text }, children: [
        d,
        /* @__PURE__ */ jsx13("button", { onClick: () => removeDept(d), children: /* @__PURE__ */ jsx13(X10, { size: 12 }) })
      ] }, d)) })
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsx13("h3", { className: "text-sm font-bold mb-3", style: { color: "#16222E" }, children: t("rolesLabel") }),
      /* @__PURE__ */ jsxs13("form", { onSubmit: addRole, className: "flex gap-2 mb-3", children: [
        /* @__PURE__ */ jsx13("input", { value: newRole, onChange: (e) => setNewRole(e.target.value), placeholder: t("newRolePH"), className: "flex-1 text-sm outline-none", style: inputStyle }),
        /* @__PURE__ */ jsx13("button", { type: "submit", className: "text-sm font-bold px-4 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: t("addBtn") })
      ] }),
      /* @__PURE__ */ jsx13("div", { className: "flex flex-wrap gap-2", children: roles.map((r) => /* @__PURE__ */ jsxs13("span", { className: "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full", style: { background: "#F4F6F8", color: "#5B6B79" }, children: [
        r,
        /* @__PURE__ */ jsx13("button", { onClick: () => removeRole(r), children: /* @__PURE__ */ jsx13(X10, { size: 12 }) })
      ] }, r)) })
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsx13(Menu, { size: 16, color: "#1F4E79" }),
        /* @__PURE__ */ jsx13("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: t("menuPermissionsTitle") })
      ] }),
      /* @__PURE__ */ jsx13("p", { className: "text-xs mb-3", style: { color: "#8A97A3" }, children: t("menuPermissionsDesc") }),
      /* @__PURE__ */ jsx13("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs13("table", { className: "w-full text-xs", style: { borderCollapse: "collapse" }, children: [
        /* @__PURE__ */ jsx13("thead", { children: /* @__PURE__ */ jsxs13("tr", { children: [
          /* @__PURE__ */ jsx13("th", { className: "text-start py-2 px-2 sticky right-0", style: { background: "#FFFFFF", color: "#8A97A3" }, children: t("rolesLabel") }),
          MENU_ITEM_DEFS.map((it) => /* @__PURE__ */ jsx13("th", { className: "py-2 px-2 font-bold whitespace-nowrap", style: { color: "#16222E" }, children: t(it.labelKey) }, it.key))
        ] }) }),
        /* @__PURE__ */ jsx13("tbody", { children: [...SUPERVISOR_ROLES, ...OPERATOR_ROLES].map((role) => /* @__PURE__ */ jsxs13("tr", { style: { borderTop: "1px solid #EEF1F4" }, children: [
          /* @__PURE__ */ jsx13("td", { className: "py-2 px-2 font-bold whitespace-nowrap sticky right-0", style: { background: "#FFFFFF", color: "#16222E" }, children: role }),
          MENU_ITEM_DEFS.map((it) => /* @__PURE__ */ jsx13("td", { className: "py-2 px-2 text-center", children: /* @__PURE__ */ jsx13("input", { type: "checkbox", checked: (menuPermissions[role] || []).includes(it.key), onChange: () => toggleMenuPermission(role, it.key) }) }, it.key))
        ] }, role)) })
      ] }) })
    ] })
  ] });
}

// source/components/HandoverBlock.jsx
import { ArrowLeftRight as ArrowLeftRight2, Check as Check3, X as X11, Clock, ShieldCheck as ShieldCheck3 } from "lucide-react";
import { Fragment as Fragment8, jsx as jsx14, jsxs as jsxs14 } from "react/jsx-runtime";
function HandoverBanner(ctx) {
  const { myIncomingHandovers, respondHandover, t, lang } = ctx;
  if (!myIncomingHandovers || myIncomingHandovers.length === 0) return null;
  return /* @__PURE__ */ jsx14("div", { className: "flex flex-col gap-2 mb-4", children: myIncomingHandovers.map((req) => /* @__PURE__ */ jsxs14("div", { className: "rounded-xl p-3.5", style: { background: "#FFF6EB", border: "1px solid #F0C57A" }, children: [
    /* @__PURE__ */ jsxs14("div", { className: "flex items-center gap-2 mb-2", children: [
      /* @__PURE__ */ jsx14(ArrowLeftRight2, { size: 16, color: "#B25E09" }),
      /* @__PURE__ */ jsx14("p", { className: "text-sm font-bold", style: { color: "#5B4321" }, children: t("handoverRequestTitle") })
    ] }),
    /* @__PURE__ */ jsxs14("p", { className: "text-xs mb-3", style: { color: "#5B4321" }, children: [
      /* @__PURE__ */ jsx14("span", { className: "font-bold", children: req.fromName }),
      " ",
      t("handoverRequestMsg"),
      " ",
      /* @__PURE__ */ jsx14("span", { className: "font-bold", children: req.role })
    ] }),
    /* @__PURE__ */ jsxs14("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxs14("button", { onClick: () => respondHandover(req.id, false), className: "flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg", style: { background: "#FFFFFF", border: "1px solid #DCE3E8", color: "#5B6B79" }, children: [
        /* @__PURE__ */ jsx14(X11, { size: 13 }),
        " ",
        t("handoverRejectBtn")
      ] }),
      /* @__PURE__ */ jsxs14("button", { onClick: () => respondHandover(req.id, true), className: "flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg", style: { background: "#2F7D4F", color: "white" }, children: [
        /* @__PURE__ */ jsx14(Check3, { size: 13 }),
        " ",
        t("handoverAcceptBtn")
      ] })
    ] })
  ] }, req.id)) });
}
function AutoHandoverBanner(ctx) {
  const { autoHandover, viewer, t, acceptAutoHandoverNow, extendAutoHandover, tempDelegateAutoHandover, reclaimAutoHandover, autoHandoverColleagues } = ctx;
  if (!autoHandover || autoHandover.phase === "done") return null;
  const isIncoming = viewer.id === autoHandover.incomingId;
  const isOutgoing = viewer.id === autoHandover.outgoingId;
  if (!isIncoming && !isOutgoing) return null;
  if (isOutgoing) {
    return /* @__PURE__ */ jsxs14("div", { className: "rounded-xl p-3.5 mb-4 flex items-center gap-2", style: { background: "#E9F3FB", border: "1px solid #BFE0F5" }, children: [
      /* @__PURE__ */ jsx14(Clock, { size: 16, color: "#1F4E79" }),
      /* @__PURE__ */ jsxs14("p", { className: "text-xs", style: { color: "#1F4E79" }, children: [
        t("autoHandoverTitle"),
        " \u2014 ",
        autoHandover.phase === "extended" ? t("autoHandoverExtendedMsg") : t("autoHandoverNotifyMsg"),
        " ",
        autoHandover.boundary
      ] })
    ] });
  }
  if (autoHandover.phase === "temp_delegated") {
    return /* @__PURE__ */ jsxs14("div", { className: "rounded-xl p-3.5 mb-4", style: { background: "#FFF6EB", border: "1px solid #F0C57A" }, children: [
      /* @__PURE__ */ jsx14("p", { className: "text-xs mb-2", style: { color: "#5B4321" }, children: t("tempDelegatedNotice") }),
      /* @__PURE__ */ jsx14("button", { onClick: reclaimAutoHandover, className: "text-xs font-bold px-4 py-2 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: t("reclaimBtn") })
    ] });
  }
  const colleagues = autoHandoverColleagues();
  const canAct = autoHandover.phase === "extended";
  return /* @__PURE__ */ jsxs14("div", { className: "rounded-xl p-3.5 mb-4", style: { background: "#FFF6EB", border: "1px solid #F0C57A" }, children: [
    /* @__PURE__ */ jsxs14("div", { className: "flex items-center gap-2 mb-2", children: [
      /* @__PURE__ */ jsx14(Clock, { size: 16, color: "#B25E09" }),
      /* @__PURE__ */ jsx14("p", { className: "text-sm font-bold", style: { color: "#5B4321" }, children: t("autoHandoverTitle") })
    ] }),
    /* @__PURE__ */ jsxs14("p", { className: "text-xs mb-3", style: { color: "#5B4321" }, children: [
      canAct && autoHandover.extendMinutes ? t("autoHandoverExtendedMsg") : canAct ? t("autoHandoverDecisionMsg") : t("autoHandoverNotifyMsg"),
      " ",
      autoHandover.boundary
    ] }),
    canAct && /* @__PURE__ */ jsxs14(Fragment8, { children: [
      /* @__PURE__ */ jsxs14("div", { className: "flex flex-wrap gap-2 mb-2", children: [
        /* @__PURE__ */ jsxs14("button", { onClick: acceptAutoHandoverNow, className: "flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg", style: { background: "#2F7D4F", color: "white" }, children: [
          /* @__PURE__ */ jsx14(Check3, { size: 13 }),
          " ",
          t("acceptNowBtn")
        ] }),
        /* @__PURE__ */ jsx14("button", { onClick: () => extendAutoHandover(5), className: "text-xs font-bold px-3 py-2 rounded-lg", style: { background: "#FFFFFF", border: "1px solid #DCE3E8", color: "#5B6B79" }, children: t("extendBtn5") }),
        /* @__PURE__ */ jsx14("button", { onClick: () => extendAutoHandover(10), className: "text-xs font-bold px-3 py-2 rounded-lg", style: { background: "#FFFFFF", border: "1px solid #DCE3E8", color: "#5B6B79" }, children: t("extendBtn10") }),
        /* @__PURE__ */ jsx14("button", { onClick: () => extendAutoHandover(15), className: "text-xs font-bold px-3 py-2 rounded-lg", style: { background: "#FFFFFF", border: "1px solid #DCE3E8", color: "#5B6B79" }, children: t("extendBtn15") })
      ] }),
      colleagues.length > 0 && /* @__PURE__ */ jsxs14("div", { className: "pt-2", style: { borderTop: "1px solid #F0C57A" }, children: [
        /* @__PURE__ */ jsxs14("p", { className: "text-[11px] font-bold mb-1.5", style: { color: "#5B4321" }, children: [
          t("cantComeBtn"),
          ":"
        ] }),
        /* @__PURE__ */ jsx14("div", { className: "flex flex-wrap gap-1.5", children: colleagues.map((c) => /* @__PURE__ */ jsx14("button", { onClick: () => tempDelegateAutoHandover(c.id), className: "text-[11px] font-bold px-2.5 py-1.5 rounded-lg", style: { background: "#FBE7E4", color: "#C0392B" }, children: c.name }, c.id)) })
      ] })
    ] })
  ] });
}
function WhoInChargeModal(ctx) {
  const { whoInChargeOpen, setWhoInChargeOpen, setHandoverHistoryOpen, people, t, isSectionSupervisor, adminOverrideInCharge } = ctx;
  if (!whoInChargeOpen) return null;
  const sectionIC = people.find((p) => p.role === "Section Supervisor" && p.inCharge);
  const shiftDayIC = people.find((p) => p.role === "Shift Supervisor" && p.shift === "day" && p.inCharge);
  const shiftNightIC = people.find((p) => p.role === "Shift Supervisor" && p.shift === "night" && p.inCharge);
  const rows = [
    { label: t("sectionInChargeLbl"), person: sectionIC, candidates: people.filter((p) => p.role === "Section Supervisor" && !p.onLeave) },
    { label: t("shiftDayInChargeLbl"), person: shiftDayIC, candidates: people.filter((p) => p.role === "Shift Supervisor" && p.shift === "day" && !p.onLeave) },
    { label: t("shiftNightInChargeLbl"), person: shiftNightIC, candidates: people.filter((p) => p.role === "Shift Supervisor" && p.shift === "night" && !p.onLeave) }
  ];
  return /* @__PURE__ */ jsx14("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(22,34,46,0.45)" }, onClick: () => setWhoInChargeOpen(false), children: /* @__PURE__ */ jsxs14("div", { className: "w-full max-w-sm rounded-xl p-4 max-h-[80vh] overflow-y-auto", style: { background: "#FFFFFF" }, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs14("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsx14("h3", { className: "text-base font-black", style: { color: "#16222E" }, children: t("whoInChargeTitle") }),
      /* @__PURE__ */ jsx14("button", { onClick: () => setWhoInChargeOpen(false), children: /* @__PURE__ */ jsx14(X11, { size: 18, color: "#8A97A3" }) })
    ] }),
    /* @__PURE__ */ jsx14("div", { className: "flex flex-col gap-2.5", children: rows.map((r, i) => /* @__PURE__ */ jsxs14("div", { className: "rounded-xl p-3.5", style: { background: "#F4F6F8" }, children: [
      /* @__PURE__ */ jsx14("p", { className: "text-[11px] font-bold mb-1", style: { color: "#8A97A3" }, children: r.label }),
      r.person ? /* @__PURE__ */ jsxs14("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx14(ShieldCheck3, { size: 14, color: "#B25E09" }),
        /* @__PURE__ */ jsx14("span", { className: "text-sm font-black", style: { color: "#16222E" }, children: r.person.name }),
        /* @__PURE__ */ jsxs14("span", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
          "(",
          r.person.employeeId,
          ")"
        ] })
      ] }) : /* @__PURE__ */ jsx14("p", { className: "text-sm font-bold", style: { color: "#C0392B" }, children: t("noneAssigned") }),
      isSectionSupervisor && r.candidates.length > 0 && /* @__PURE__ */ jsxs14("div", { className: "mt-2 pt-2", style: { borderTop: "1px solid #E2E8ED" }, children: [
        /* @__PURE__ */ jsxs14("p", { className: "text-[10px] font-bold mb-1", style: { color: "#8A97A3" }, children: [
          t("adminOverrideBtn"),
          ":"
        ] }),
        /* @__PURE__ */ jsx14("div", { className: "flex flex-wrap gap-1", children: r.candidates.map((c) => /* @__PURE__ */ jsx14("button", { onClick: () => adminOverrideInCharge(c.id), disabled: c.inCharge, className: "text-[10px] font-bold px-2 py-1 rounded-md", style: { background: c.inCharge ? "#FBEEDF" : "#FFFFFF", color: c.inCharge ? "#B25E09" : "#5B6B79", border: "1px solid #E2E8ED", opacity: c.inCharge ? 0.7 : 1 }, children: c.name }, c.id)) })
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsx14("button", { onClick: () => {
      setWhoInChargeOpen(false);
      setHandoverHistoryOpen(true);
    }, className: "w-full text-xs font-bold py-2.5 rounded-lg mt-3", style: { background: "#F4F6F8", border: "1px solid #DCE3E8", color: "#16222E" }, children: t("viewHandoverHistoryBtn") })
  ] }) });
}
function HandoverHistoryModal(ctx) {
  const { handoverHistoryOpen, setHandoverHistoryOpen, handoverHistory, t } = ctx;
  if (!handoverHistoryOpen) return null;
  const methodMap = { manual: "methodManual", auto: "methodAuto", auto_early: "methodAutoEarly", emergency_reassign: "methodEmergency", temp_delegate: "methodTempDelegate", reclaim: "methodReclaim", admin_override: "methodAdminOverride" };
  return /* @__PURE__ */ jsx14("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(22,34,46,0.45)" }, onClick: () => setHandoverHistoryOpen(false), children: /* @__PURE__ */ jsxs14("div", { className: "w-full max-w-sm rounded-xl p-4 max-h-[80vh] overflow-y-auto", style: { background: "#FFFFFF" }, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs14("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsx14("h3", { className: "text-base font-black", style: { color: "#16222E" }, children: t("handoverHistoryTitle") }),
      /* @__PURE__ */ jsx14("button", { onClick: () => setHandoverHistoryOpen(false), children: /* @__PURE__ */ jsx14(X11, { size: 18, color: "#8A97A3" }) })
    ] }),
    handoverHistory.length === 0 && /* @__PURE__ */ jsx14("p", { className: "text-xs text-center py-6", style: { color: "#8A97A3" }, children: t("noHandoverHistory") }),
    /* @__PURE__ */ jsx14("div", { className: "flex flex-col gap-2", children: handoverHistory.map((h) => /* @__PURE__ */ jsxs14("div", { className: "rounded-lg p-3", style: { background: "#F4F6F8" }, children: [
      /* @__PURE__ */ jsxs14("div", { className: "flex items-center gap-1.5 text-sm mb-1", children: [
        /* @__PURE__ */ jsx14("span", { className: "font-bold", style: { color: "#16222E" }, children: h.fromName || "\u2014" }),
        /* @__PURE__ */ jsx14(ArrowLeftRight2, { size: 12, color: "#8A97A3" }),
        /* @__PURE__ */ jsx14("span", { className: "font-bold", style: { color: "#16222E" }, children: h.toName })
      ] }),
      /* @__PURE__ */ jsxs14("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
        h.role,
        " \xB7 ",
        t(methodMap[h.method] || h.method),
        " \xB7 ",
        h.at
      ] })
    ] }, h.id)) })
  ] }) });
}
function HandoverPicker(ctx) {
  const { handoverPickerOpen, setHandoverPickerOpen, eligibleHandoverColleagues, requestHandover, t, deptColor, viewer } = ctx;
  if (!handoverPickerOpen) return null;
  const colleagues = eligibleHandoverColleagues();
  return /* @__PURE__ */ jsx14("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(22,34,46,0.45)" }, onClick: () => setHandoverPickerOpen(false), children: /* @__PURE__ */ jsxs14("div", { className: "w-full max-w-sm rounded-xl p-4 max-h-[75vh] overflow-y-auto", style: { background: "#FFFFFF" }, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs14("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsx14("h3", { className: "text-base font-black", style: { color: "#16222E" }, children: t("handoverPickerTitle") }),
      /* @__PURE__ */ jsx14("button", { onClick: () => setHandoverPickerOpen(false), children: /* @__PURE__ */ jsx14(X11, { size: 18, color: "#8A97A3" }) })
    ] }),
    colleagues.length === 0 && /* @__PURE__ */ jsx14("p", { className: "text-xs text-center py-6", style: { color: "#8A97A3" }, children: t("noEligibleColleagues") }),
    /* @__PURE__ */ jsx14("div", { className: "flex flex-col gap-2", children: colleagues.map((p) => /* @__PURE__ */ jsxs14("div", { className: "rounded-xl p-3 flex items-center justify-between gap-2", style: { background: "#F4F6F8" }, children: [
      /* @__PURE__ */ jsxs14("div", { children: [
        /* @__PURE__ */ jsx14("p", { className: "text-sm font-bold", style: { color: "#16222E" }, children: p.name }),
        /* @__PURE__ */ jsxs14("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
          p.employeeId,
          " \xB7 ",
          p.department
        ] })
      ] }),
      /* @__PURE__ */ jsx14("button", { onClick: () => requestHandover(p.id), className: "text-[11px] font-bold px-3 py-1.5 rounded-lg shrink-0", style: { background: "#1F4E79", color: "white" }, children: t("sendRequestBtn") })
    ] }, p.id)) })
  ] }) });
}

// source/App.jsx
import { Fragment as Fragment9, jsx as jsx15, jsxs as jsxs15 } from "react/jsx-runtime";
var initialSnapshot = loadSnapshot();
syncCountersFromSnapshot(initialSnapshot);
function TaskManagerInner() {
  const [clockTick, setClockTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setClockTick((t2) => t2 + 1), 6e4);
    return () => clearInterval(id);
  }, []);
  const today2 = useMemo(() => getTodayISO(), [clockTick]);
  const [lang, setLang] = useState(initialSnapshot?.lang || "en");
  const t = (k) => STR[k] ? STR[k][lang] : k;
  const WEEKDAYS = lang === "en" ? WEEKDAYS_EN : WEEKDAYS_AR;
  const MONTHS = lang === "en" ? MONTHS_EN : MONTHS_AR;
  const [departments, setDepartments] = useState(initialSnapshot?.departments || [...DEPARTMENTS_SEED]);
  const [roles, setRoles] = useState(initialSnapshot?.roles || [...OPERATOR_ROLES, ...SUPERVISOR_ROLES]);
  const [people, setPeople] = useState(initialSnapshot?.people || seedPeople);
  const [tasks, setTasks] = useState(initialSnapshot?.tasks || seedTasks);
  const [problems, setProblems] = useState(initialSnapshot?.problems || seedProblems);
  const [readingsLog, setReadingsLog] = useState(initialSnapshot?.readingsLog || []);
  const [menuPermissions, setMenuPermissions] = useState(initialSnapshot?.menuPermissions || DEFAULT_MENU_PERMISSIONS);
  const [readingsViewDate, setReadingsViewDate] = useState(today2);
  const [readingsDateSearchOpen, setReadingsDateSearchOpen] = useState(false);
  const [reportsLog, setReportsLog] = useState(initialSnapshot?.reportsLog || []);
  const [reportAttachment, setReportAttachment] = useState(null);
  const [reportsViewDate, setReportsViewDate] = useState(today2);
  const [reportsDateSearchOpen, setReportsDateSearchOpen] = useState(false);
  const [reportsTab, setReportsTab] = useState("daily");
  const [logbookNotes, setLogbookNotes] = useState(initialSnapshot?.logbookNotes || {});
  const [logbookSummaryDraft, setLogbookSummaryDraft] = useState({});
  const [periodicSection, setPeriodicSection] = useState("Outside");
  const [periodicPeriod, setPeriodicPeriod] = useState("weekly");
  const [periodicWeekKey, setPeriodicWeekKey] = useState(() => weekKeyOf(today2));
  const [periodicMonthKey, setPeriodicMonthKey] = useState(() => monthKeyOf(today2));
  const [readingAttachment, setReadingAttachment] = useState(null);
  const [entryCommentDraft, setEntryCommentDraft] = useState({ id: null, text: "" });
  const [readingNotesDraft, setReadingNotesDraft] = useState([]);
  const [noteDraft, setNoteDraft] = useState({ unitName: "", equipmentName: "", tagNumber: "", description: "", severity: "note" });
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [activityLog, setActivityLog] = useState(initialSnapshot?.activityLog || seedActivityLog);
  const [currentUserId, setCurrentUserId] = useState(initialSnapshot?.currentUserId ?? seedPeople[1].id);
  const [mainSubTab, setMainSubTab] = useState("tasks");
  const [problemView, setProblemView] = useState("status");
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [selectedLogDate, setSelectedLogDate] = useState(today2);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedProblemId, setExpandedProblemId] = useState(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [problemCommentDraft, setProblemCommentDraft] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [busyAction, setBusyAction] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [extendingAlertId, setExtendingAlertId] = useState(null);
  const [extendDate, setExtendDate] = useState("");
  const [extendComment, setExtendComment] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingProblemId, setEditingProblemId] = useState(null);
  const [problemLogFilter, setProblemLogFilter] = useState("open");
  const [problemSearch, setProblemSearch] = useState("");
  const [problemSearchField, setProblemSearchField] = useState("all");
  const [problemSearchOpen, setProblemSearchOpen] = useState(false);
  const [logSearchOpen, setLogSearchOpen] = useState(false);
  const [logSearch, setLogSearch] = useState("");
  const [logMode, setLogMode] = useState("day");
  const [calSearchOpen, setCalSearchOpen] = useState(false);
  const [calSearch, setCalSearch] = useState("");
  const [calSearchField, setCalSearchField] = useState("task");
  const [calSearchTag1, setCalSearchTag1] = useState("");
  const [calSearchTag2, setCalSearchTag2] = useState("");
  const [calSearchTag3, setCalSearchTag3] = useState("");
  const [presentShiftTab, setPresentShiftTab] = useState("day");
  const [pendingStaffAction, setPendingStaffAction] = useState(null);
  const [readingsTab, setReadingsTab] = useState("history");
  const [readingTimeSlot, setReadingTimeSlot] = useState("10AM");
  const [handoverRequests, setHandoverRequests] = useState(initialSnapshot?.handoverRequests || []);
  const [handoverHistory, setHandoverHistory] = useState(initialSnapshot?.handoverHistory || []);
  const [autoHandover, setAutoHandover] = useState(initialSnapshot?.autoHandover ?? null);
  const [whoInChargeOpen, setWhoInChargeOpen] = useState(false);
  const [handoverHistoryOpen, setHandoverHistoryOpen] = useState(false);
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingFilterDept, setPendingFilterDept] = useState("all");
  const [handoverPickerOpen, setHandoverPickerOpen] = useState(false);
  const [calMode, setCalMode] = useState("week");
  const [calDate, setCalDate] = useState(/* @__PURE__ */ new Date());
  const [selectedCalDay, setSelectedCalDay] = useState(null);
  const [dayModalAddOpen, setDayModalAddOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "", department: "", role: "", isAdmin: false });
  const [newDept, setNewDept] = useState("");
  const [newRole, setNewRole] = useState("");
  const [staffTab, setStaffTab] = useState("present");
  const [supTasksTab, setSupTasksTab] = useState("list");
  const [customizeDept, setCustomizeDept] = useState(null);
  const [taskCalOpen, setTaskCalOpen] = useState(false);
  const [taskCalMonth, setTaskCalMonth] = useState(/* @__PURE__ */ new Date());
  const [taskRecOpen, setTaskRecOpen] = useState(false);
  const notifRef = useRef3(null);
  const formRef = useRef3(null);
  const storageWarnedRef = useRef3(false);
  const [pendingConfirm, setPendingConfirm] = useState(null);
  function askConfirm(cfg) {
    setPendingConfirm(cfg);
  }
  function cancelConfirmDialog() {
    setPendingConfirm(null);
  }
  function runConfirmDialog() {
    if (pendingConfirm && pendingConfirm.onConfirm) pendingConfirm.onConfirm();
    setPendingConfirm(null);
  }
  useEffect(() => {
    function onClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (formRef.current && !formRef.current.contains(e.target)) {
        setShowTaskForm(false);
        setShowProblemForm(false);
        setEditingId(null);
        setEditingProblemId(null);
        setTaskCalOpen(false);
        setTaskRecOpen(false);
        setCustomizeDept(null);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  function getPerson(id) {
    return people.find((p) => p.id === id);
  }
  function personLabel(id) {
    const p = getPerson(id);
    return p ? `${p.name} - ${p.role}` : "\u2014";
  }
  const PALETTE = { text: "#1F4E79", bg: "#E6EEF5" };
  function deptColor(dept) {
    const map = { "Outside": { bg: "#FBE7E4", text: "#C0392B" }, "Turbine": { bg: "#F1E6F8", text: "#6B3FA0" }, "Utilities": { bg: "#E4F3EA", text: "#2F7D4F" }, "Control Panel": { bg: "#E6EEF5", text: "#1F4E79" } };
    return map[dept] || PALETTE;
  }
  function deptIcon(dept) {
    return DEPT_ICONS[dept] || Users2;
  }
  function shiftSupervisorOf() {
    return people.find((p) => p.role === "Shift Supervisor" && p.inCharge);
  }
  function departmentOperators(dept) {
    return people.filter((p) => !p.isAdmin && OPERATOR_ROLES.includes(p.role) && p.department === dept);
  }
  function departmentStaff(dept) {
    return people.filter((p) => !p.isAdmin && p.department === dept);
  }
  const viewer = getPerson(currentUserId) || people[0];
  const viewerRole = viewer.isAdmin ? "admin" : SUPERVISOR_ROLES.includes(viewer.role) ? "supervisor" : "operator";
  const actingAs = viewer.name;
  const isCoordinator = viewer.role === "Coordinator";
  const isSectionSupervisor = viewer.role === "Section Supervisor";
  const isUnitSupervisor = viewer.role === "Unit Supervisor";
  const isShiftSupervisor = viewer.role === "Shift Supervisor";
  const canManage = isSectionSupervisor || isShiftSupervisor;
  const isAdvisory = isUnitSupervisor;
  const viewerOnDuty = useMemo(() => {
    if (isWithinDutyHours(viewer, OPERATOR_ROLES)) return true;
    if (autoHandover && autoHandover.phase !== "done" && [autoHandover.outgoingId, autoHandover.incomingId, autoHandover.tempAssigneeId].includes(viewer.id)) return true;
    return false;
  }, [viewer, clockTick, autoHandover]);
  const dutyMinutesLeft = useMemo(() => {
    if (!viewerOnDuty) return null;
    const hour = plantHourDecimal();
    const OFFICE_ROLES3 = ["Coordinator", "Section Supervisor", "Unit Supervisor"];
    let endHour;
    if (OFFICE_ROLES3.includes(viewer.role)) endHour = 19;
    else if (viewer.role === "Shift Supervisor" || OPERATOR_ROLES.includes(viewer.role)) endHour = viewer.shift === "night" ? 6 : 18;
    else return null;
    let diff = endHour - hour;
    if (diff <= 0) diff += 24;
    if (diff > 12) return null;
    return Math.round(diff * 60);
  }, [viewer, clockTick, viewerOnDuty]);
  const hasDrawer = viewerRole !== "admin";
  useEffect(() => {
    setProblemView("status");
    setActiveOverlay(null);
    setSupTasksTab("list");
    setDrawerOpen(false);
    setMainSubTab(isCoordinator ? "problems" : "tasks");
  }, [currentUserId, isCoordinator]);
  useEffect(() => {
    if (!departments.includes(newPerson.department)) setNewPerson((p) => ({ ...p, department: departments[0] || "" }));
    if (!roles.includes(newPerson.role)) setNewPerson((p) => ({ ...p, role: roles[0] || "" }));
  }, [departments, roles]);
  useEffect(() => {
    let closeTimer;
    if (drawerOpen) {
      setDrawerMounted(true);
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => setDrawerVisible(true));
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    } else if (drawerMounted) {
      setDrawerVisible(false);
      closeTimer = setTimeout(() => setDrawerMounted(false), 260);
    }
    return () => clearTimeout(closeTimer);
  }, [drawerOpen]);
  function showToast(text, kind = "success") {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((tt) => tt.id !== id)), 3200);
  }
  function runWithBusy(actionKey, fn, delay = 380) {
    setBusyAction(actionKey);
    setTimeout(() => {
      fn();
      setBusyAction(null);
    }, delay);
  }
  function defaultAssignees(dept) {
    return departmentOperators(dept).filter((p) => !p.onLeave).map((p) => p.id);
  }
  function emptyTaskForm() {
    return { title: "", description: "", type: "public", privateTo: people[0]?.id || "", assignees: defaultAssignees(viewer.department), department: viewer.department, priority: "medium", equipmentName: "", tag1: "", tag2: "", tag3: "", dates: [today2], startDate: today2, endDate: today2, startTime: "", endTime: "", recurrence: { type: "none", weekdays: [], monthDays: [] } };
  }
  const [taskForm, setTaskForm] = useState(emptyTaskForm());
  function emptyProblemForm() {
    return { title: "", location: LOCATIONS[0], categories: [], equipmentName: "", unitName: "", tag1: "", tag2: "", tag3: "", description: "", priority: "medium", mediaFiles: [], voiceNotes: [] };
  }
  const [problemForm, setProblemForm] = useState(emptyProblemForm());
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef3(null);
  const recordingChunksRef = useRef3([]);
  const recordingTimerRef = useRef3(null);
  const alerts = useMemo(() => tasks.filter((tk) => {
    if (tk.status === "completed" || dismissedAlerts.includes(tk.id) || isTaskHiddenFromOperators(tk.reviewStatus)) return false;
    if (!tk.endDate || tk.endDate > today2) return false;
    return tk.createdBy === currentUserId || tk.assignees.includes(currentUserId) || viewerRole === "supervisor";
  }), [tasks, currentUserId, dismissedAlerts, viewerRole]);
  const renewalGroups = useMemo(() => {
    const y = Number(today2.slice(0, 4));
    const m = Number(today2.slice(5, 7));
    if (m !== 12) return [];
    const latestByGroup = {};
    tasks.forEach((tk) => {
      if (!tk.recurrenceGroupId) return;
      const tkYear = Number((tk.startDate || "").slice(0, 4));
      if (tkYear !== y) return;
      if (!latestByGroup[tk.recurrenceGroupId] || tk.startDate > latestByGroup[tk.recurrenceGroupId].startDate) latestByGroup[tk.recurrenceGroupId] = tk;
    });
    return Object.entries(latestByGroup).filter(([gid]) => !tasks.some((tk) => tk.recurrenceGroupId === gid && Number((tk.startDate || "").slice(0, 4)) === y + 1)).map(([gid, template]) => ({ groupId: gid, template, year: y }));
  }, [tasks, today2]);
  function generateRenewalTasks(groupId, template, entryStatus) {
    const nextYearStart = `${template.year_ != null ? template.year_ : Number(template.startDate.slice(0, 4)) + 1}-01-01`;
    const occDates = computeRecurrenceDates(template.recurrence, nextYearStart);
    return occDates.map((ds) => ({
      ...template,
      id: getNextTaskId(),
      dates: [ds],
      startDate: ds,
      endDate: ds,
      status: "not_started",
      completedAt: null,
      reviewStatus: entryStatus,
      comments: [],
      createdAt: nowStamp(lang),
      recurrenceGroupId: groupId
    }));
  }
  function confirmRenewalGroups(groupIds) {
    const entryStatus = computeTaskEntryStatus(viewer.role, isNightGapWindow());
    setTasks((prev) => {
      let additions = [];
      renewalGroups.filter((g) => groupIds.includes(g.groupId)).forEach((g) => {
        additions = additions.concat(generateRenewalTasks(g.groupId, { ...g.template, year_: g.year + 1 }, entryStatus));
      });
      return [...additions, ...prev];
    });
    showToast(t("toastRenewalConfirmed"), "success");
  }
  useEffect(() => {
    const y = Number(today2.slice(0, 4));
    const m = Number(today2.slice(5, 7));
    if (m !== 1) return;
    const prevYear = y - 1;
    const latestByGroup = {};
    tasks.forEach((tk) => {
      if (!tk.recurrenceGroupId) return;
      const tkYear = Number((tk.startDate || "").slice(0, 4));
      if (tkYear !== prevYear) return;
      if (!latestByGroup[tk.recurrenceGroupId] || tk.startDate > latestByGroup[tk.recurrenceGroupId].startDate) latestByGroup[tk.recurrenceGroupId] = tk;
    });
    const pending = Object.entries(latestByGroup).filter(([gid]) => !tasks.some((tk) => tk.recurrenceGroupId === gid && Number((tk.startDate || "").slice(0, 4)) === y));
    if (pending.length === 0) return;
    setTasks((prev) => {
      let additions = [];
      pending.forEach(([gid, template]) => {
        additions = additions.concat(generateRenewalTasks(gid, { ...template, year_: y }, "approved_to_start"));
      });
      return [...additions, ...prev];
    });
    showToast(t("toastAutoRenewed"), "info");
  }, [today2]);
  const notifications = useMemo(() => {
    const scope = tasks.filter((tk) => !isTaskHiddenFromOperators(tk.reviewStatus) && (tk.assignees.includes(currentUserId) || tk.createdBy === currentUserId || tk.privateTo === currentUserId || viewerRole === "supervisor" && tk.department === viewer.department));
    const dueTomorrow = scope.filter((tk) => tk.status !== "completed" && tk.endDate === tomorrow).map((tk) => ({ kind: "\u2192", text: tk.title }));
    const dueToday = scope.filter((tk) => tk.status !== "completed" && tk.endDate === today2).map((tk) => ({ kind: t("today"), text: tk.title }));
    const commentNotifs = scope.filter((tk) => tk.assignees.includes(currentUserId)).flatMap((tk) => tk.comments.filter((c) => c.author !== actingAs).map((c) => ({ kind: "\u{1F4AC}", text: `${c.author}: ${tk.title}` })));
    const myTurnStatus = (s) => isShiftSupervisor && isShiftTurn(s) || isSectionSupervisor && isSectionTurn(s);
    const problemNotifs = problems.filter((p) => p.department === viewer.department && myTurnStatus(p.reviewStatus)).map((p) => ({ kind: "!", text: p.title }));
    const criticalNotifs = isCoordinator ? problems.filter((p) => p.priority === "high" && p.reviewStatus === "approved_final").map((p) => ({ kind: "\u203C", text: p.title })) : [];
    const readingAlertNotifs = isShiftSupervisor ? readingsLog.filter((r) => r.department === viewer.department).flatMap((r) => (r.notes || []).filter((n) => n.severity === "warning" || n.severity === "critical").map((n) => ({ kind: n.severity === "critical" ? "\u203C" : "!", text: n.description || n.equipmentName }))) : [];
    const readingReviewNotifs = readingsLog.filter((r) => r.department === viewer.department && myTurnStatus(r.reviewStatus)).map((r) => ({ kind: "!", text: t("readings") + ": " + (r.attachment?.name || r.createdAt) }));
    const reportReviewNotifs = reportsLog.filter((r) => r.department === viewer.department && myTurnStatus(r.reviewStatus)).map((r) => ({ kind: "!", text: t("reportsMenu") + ": " + (r.attachment?.name || r.createdAt) }));
    return [...dueToday, ...dueTomorrow, ...commentNotifs, ...problemNotifs, ...criticalNotifs, ...readingAlertNotifs, ...readingReviewNotifs, ...reportReviewNotifs];
  }, [tasks, problems, readingsLog, reportsLog, currentUserId, actingAs, viewerRole, viewer.department, isShiftSupervisor, isSectionSupervisor, isCoordinator, lang]);
  function sortByPriority(list) {
    return [...list].sort((a, b) => {
      const mineA = a.privateTo === currentUserId ? 0 : 1, mineB = b.privateTo === currentUserId ? 0 : 1;
      if (mineA !== mineB) return mineA - mineB;
      const prA = PRIORITY[a.priority]?.rank ?? 1, prB = PRIORITY[b.priority]?.rank ?? 1;
      if (prA !== prB) return prA - prB;
      return (a.endDate || "9999").localeCompare(b.endDate || "9999");
    });
  }
  const visibleToViewer = (tk) => tk.type === "public" || tk.privateTo === currentUserId || tk.createdBy === currentUserId;
  const deptTasks = useMemo(() => sortByPriority(tasks.filter(
    (tk) => !isTaskHiddenFromOperators(tk.reviewStatus) && (isShiftSupervisor || isSectionSupervisor || isUnitSupervisor || isCoordinator || tk.department === viewer.department) && visibleToViewer(tk)
  )), [tasks, viewer, currentUserId, isShiftSupervisor, isSectionSupervisor, isUnitSupervisor, isCoordinator]);
  const tasksPendingPreApproval = useMemo(() => isSectionSupervisor ? tasks.filter((tk) => isPreApprovalSectionTurn(tk.reviewStatus)) : [], [tasks, isSectionSupervisor]);
  const tasksReturnedPre = useMemo(() => isShiftSupervisor ? tasks.filter((tk) => isPreApprovalShiftTurn(tk.reviewStatus)) : [], [tasks, isShiftSupervisor]);
  const tasksVisibleToCoordinator = useMemo(() => isCoordinator ? tasks.filter((tk) => tk.priority === "high" && tk.reviewStatus === "approved_final") : [], [tasks, isCoordinator]);
  const deptProblems = useMemo(() => problems.filter((p) => isShiftSupervisor || isSectionSupervisor || isUnitSupervisor || isCoordinator || p.department === viewer.department), [problems, viewer, isShiftSupervisor, isSectionSupervisor, isUnitSupervisor, isCoordinator]);
  const problemsVisibleToViewer = useMemo(() => {
    let list = deptProblems;
    if (viewerRole === "supervisor" && !isShiftSupervisor) list = list.filter((p) => sectionCanSee(p.reviewStatus));
    if (viewerRole === "operator") list = list;
    if (isCoordinator) list = list.filter((p) => p.priority === "high" && p.reviewStatus === "approved_final");
    return list;
  }, [deptProblems, viewerRole, isShiftSupervisor, isCoordinator]);
  const problemsChrono = useMemo(() => [...problemsVisibleToViewer].sort((a, b) => b.ts - a.ts), [problemsVisibleToViewer]);
  const readingsVisibleToViewer = useMemo(() => {
    let list = readingsLog.filter((r) => isShiftSupervisor || isSectionSupervisor || isUnitSupervisor || r.department === viewer.department);
    if (viewerRole === "supervisor" && !isShiftSupervisor) list = list.filter((r) => sectionCanSee(r.reviewStatus));
    return list;
  }, [readingsLog, viewer.department, viewerRole, isShiftSupervisor, isSectionSupervisor, isUnitSupervisor]);
  const reportsVisibleToViewer = useMemo(() => {
    let list = reportsLog.filter((r) => isShiftSupervisor || isSectionSupervisor || isUnitSupervisor || r.department === viewer.department);
    if (viewerRole === "supervisor" && !isShiftSupervisor) list = list.filter((r) => sectionCanSee(r.reviewStatus));
    return list;
  }, [reportsLog, viewer.department, viewerRole, isShiftSupervisor, isSectionSupervisor, isUnitSupervisor]);
  const problemLogList = useMemo(() => deptProblems.filter((p) => p.workStatus === problemLogFilter), [deptProblems, problemLogFilter]);
  function matchesProblemSearch(p) {
    if (!problemSearch.trim()) return true;
    const q = problemSearch.toLowerCase();
    if (problemSearchField === "tagNumber") return (p.tagNumber || "").toLowerCase().includes(q);
    if (problemSearchField === "equipmentName") return (p.equipmentName || "").toLowerCase().includes(q);
    if (problemSearchField === "department") return (p.department || "").toLowerCase().includes(q);
    if (problemSearchField === "location") return (p.location || "").toLowerCase().includes(q);
    return (p.tagNumber || "").toLowerCase().includes(q) || (p.equipmentName || "").toLowerCase().includes(q) || (p.department || "").toLowerCase().includes(q) || (p.location || "").toLowerCase().includes(q) || (p.title || "").toLowerCase().includes(q);
  }
  const weekStart = startOfWeek(calDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const monthStart = new Date(calDate.getFullYear(), calDate.getMonth(), 1);
  const monthGridStart = startOfWeek(monthStart);
  const daysInMonthGrid = Array.from({ length: 42 }, (_, i) => addDays(monthGridStart, i));
  function isTaskOnDate(tk, ds) {
    return tk.dates && tk.dates.length > 0 ? tk.dates.includes(ds) : tk.startDate <= ds && ds <= tk.endDate;
  }
  function tasksOnDate(ds) {
    return sortByPriority(tasks.filter((tk) => !isTaskHiddenFromOperators(tk.reviewStatus) && (isShiftSupervisor || isSectionSupervisor || isUnitSupervisor || isCoordinator || tk.department === viewer.department) && visibleToViewer(tk) && isTaskOnDate(tk, ds)));
  }
  function navigateCal(dir) {
    if (calMode === "week") setCalDate((d) => addDays(d, dir * 7));
    else setCalDate((d) => new Date(d.getFullYear(), d.getMonth() + dir, 1));
  }
  function calLabel() {
    if (calMode === "week") {
      const end = addDays(weekStart, 6);
      return `${weekStart.getDate()} ${MONTHS[weekStart.getMonth()]} \u2014 ${end.getDate()} ${MONTHS[end.getMonth()]}`;
    }
    return `${MONTHS[calDate.getMonth()]} ${calDate.getFullYear()}`;
  }
  function openDay(ds) {
    setSelectedCalDay(ds);
    setDayModalAddOpen(false);
  }
  function quickAddForDay(ds) {
    setTaskForm({ ...emptyTaskForm(), dates: [ds], startDate: ds, endDate: ds });
    setDayModalAddOpen(true);
  }
  const dayLogEntries = useMemo(() => {
    const taskEntries = activityLog.filter((e) => e.dateISO === selectedLogDate).map((e) => ({ kind: "task", ts: e.ts, title: e.taskTitle, by: e.by, at: e.at, dateISO: e.dateISO }));
    const problemEntries = problems.filter((p) => p.dateISO === selectedLogDate).map((p) => ({ kind: "problem", ts: p.ts, title: p.title, by: personLabel(p.reportedBy), at: p.createdAt, dateISO: p.dateISO }));
    return [...taskEntries, ...problemEntries].sort((a, b) => a.ts - b.ts);
  }, [activityLog, problems, selectedLogDate]);
  const allLogEntries = useMemo(() => {
    const taskEntries = activityLog.map((e) => ({ kind: "task", ts: e.ts, title: e.taskTitle, by: e.by, at: e.at, dateISO: e.dateISO }));
    const problemEntries = problems.map((p) => ({ kind: "problem", ts: p.ts, title: p.title, by: personLabel(p.reportedBy), at: p.createdAt, dateISO: p.dateISO }));
    return [...taskEntries, ...problemEntries].sort((a, b) => b.ts - a.ts);
  }, [activityLog, problems]);
  const allLogGrouped = useMemo(() => {
    const q = logSearch.trim().toLowerCase();
    const filtered = q ? allLogEntries.filter((e) => e.title.toLowerCase().includes(q) || e.by.toLowerCase().includes(q)) : allLogEntries;
    const groups = [];
    filtered.forEach((e) => {
      let g = groups.find((x) => x.dateISO === e.dateISO);
      if (!g) {
        g = { dateISO: e.dateISO, items: [] };
        groups.push(g);
      }
      g.items.push(e);
    });
    return groups;
  }, [allLogEntries, logSearch]);
  function toggleAssignee(id) {
    setTaskForm((f) => ({ ...f, assignees: f.assignees.includes(id) ? f.assignees.filter((a) => a !== id) : [...f.assignees, id] }));
  }
  function selectDeptForTask(d) {
    setTaskForm((f) => ({ ...f, department: d, assignees: defaultAssignees(d) }));
    setCustomizeDept(null);
  }
  function openCustomizeForTask(d) {
    setTaskForm((f) => ({ ...f, department: d }));
    setCustomizeDept(d);
  }
  function toggleTaskDate(ds) {
    setTaskForm((f) => {
      const has = f.dates.includes(ds);
      const dates = has ? f.dates.filter((x) => x !== ds) : [...f.dates, ds].sort();
      const startDate = dates[0] || today2, endDate = dates[dates.length - 1] || today2;
      return { ...f, dates, startDate, endDate };
    });
  }
  function toggleRecWeekday(day) {
    setTaskForm((f) => ({ ...f, recurrence: { ...f.recurrence, weekdays: f.recurrence.weekdays.includes(day) ? f.recurrence.weekdays.filter((d) => d !== day) : [...f.recurrence.weekdays, day] } }));
  }
  function toggleRecMonthDay(n) {
    setTaskForm((f) => ({ ...f, recurrence: { ...f.recurrence, monthDays: f.recurrence.monthDays.includes(n) ? f.recurrence.monthDays.filter((d) => d !== n) : [...f.recurrence.monthDays, n] } }));
  }
  function computeRecurrenceDates(rec, baseDateStr) {
    const base = new Date(baseDateStr);
    const yearEnd = new Date(base.getFullYear(), 11, 31);
    const out = [];
    if (rec.type === "daily") {
      for (let d = new Date(base); d <= yearEnd; d = addDays(d, 1)) out.push(toISODate(d));
    } else if (rec.type === "weekly" && rec.weekdays.length > 0) {
      for (let d = new Date(base); d <= yearEnd; d = addDays(d, 1)) {
        const wd = WEEKDAYS[d.getDay() === 6 ? 0 : d.getDay() + 1];
        if (rec.weekdays.includes(wd)) out.push(toISODate(d));
      }
    } else if (rec.type === "monthly" && rec.monthDays.length > 0) {
      for (let m = base.getMonth(); m <= 11; m++) {
        const monthRef = new Date(base.getFullYear(), m, 1);
        rec.monthDays.forEach((dayNum) => {
          const d = new Date(monthRef.getFullYear(), monthRef.getMonth(), dayNum);
          if (d >= base && d <= yearEnd) out.push(toISODate(d));
        });
      }
    }
    return out.length > 0 ? out.sort() : [baseDateStr];
  }
  function submitTask(e) {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    const tagNumber = [taskForm.tag1, taskForm.tag2, taskForm.tag3].filter(Boolean).join("-");
    if (editingId) {
      setTasks((prev) => prev.map((tk) => {
        if (tk.id !== editingId) return tk;
        const wasReturnedPre = tk.reviewStatus === "returned_pre";
        const nextReviewStatus = wasReturnedPre ? computeTaskEntryStatus(viewer.role, isNightGapWindow()) : tk.reviewStatus;
        const comments = wasReturnedPre ? [...tk.comments, { id: getNextCommentId(), author: actingAs, text: t("taskResentNote"), at: nowStamp(lang) }] : tk.comments;
        return { ...tk, ...taskForm, tagNumber, privateTo: taskForm.type === "private" ? taskForm.privateTo : null, reviewStatus: nextReviewStatus, comments };
      }));
    } else if (taskForm.recurrence.type !== "none") {
      const baseDate = taskForm.dates[0] || today2;
      const occDates = computeRecurrenceDates(taskForm.recurrence, baseDate);
      const groupId = "rec-" + Date.now();
      const entryStatus = computeTaskEntryStatus(viewer.role, isNightGapWindow());
      const newOnes = occDates.map((ds) => ({
        id: getNextTaskId(),
        ...taskForm,
        tagNumber,
        dates: [ds],
        startDate: ds,
        endDate: ds,
        privateTo: taskForm.type === "private" ? taskForm.privateTo : null,
        createdBy: currentUserId,
        createdAt: nowStamp(lang),
        status: "not_started",
        completedAt: null,
        reviewStatus: entryStatus,
        comments: [],
        recurrenceGroupId: groupId
      }));
      setTasks((prev) => [...newOnes, ...prev]);
    } else {
      const entryStatus = computeTaskEntryStatus(viewer.role, isNightGapWindow());
      setTasks((prev) => [{ id: getNextTaskId(), ...taskForm, tagNumber, privateTo: taskForm.type === "private" ? taskForm.privateTo : null, createdBy: currentUserId, createdAt: nowStamp(lang), status: "not_started", completedAt: null, reviewStatus: entryStatus, comments: [] }, ...prev]);
    }
    setTaskForm(emptyTaskForm());
    setEditingId(null);
    setShowTaskForm(false);
    setDayModalAddOpen(false);
    setSelectedCalDay(null);
    setTaskCalOpen(false);
    setTaskRecOpen(false);
    setCustomizeDept(null);
  }
  function startEditTask(task) {
    const [tg1, tg2, tg3] = (task.tagNumber || "").split("-");
    setTaskForm({ title: task.title, description: task.description, type: task.type, privateTo: task.privateTo || people[0]?.id, assignees: task.assignees, department: task.department, priority: task.priority, equipmentName: task.equipmentName || "", tag1: tg1 || "", tag2: tg2 || "", tag3: tg3 || "", dates: task.dates || [task.startDate], startDate: task.startDate, endDate: task.endDate, startTime: task.startTime, endTime: task.endTime, recurrence: task.recurrence || { type: "none", weekdays: [], monthDays: [] } });
    setEditingId(task.id);
    setShowTaskForm(true);
  }
  function deleteTask(id) {
    const tk = tasks.find((x) => x.id === id);
    askConfirm({
      title: t("confirmDeleteTitle"),
      message: t("confirmDeleteMsg") + (tk ? ` \xAB${tk.title}\xBB` : ""),
      confirmLabel: t("deleteBtn"),
      danger: true,
      onConfirm: () => {
        setTasks((prev) => prev.filter((x) => x.id !== id));
        showToast(t("toastTaskDeleted"), "info");
      }
    });
  }
  function setStatus(id, status) {
    setTasks((prev) => prev.map((tk) => {
      if (tk.id !== id) return tk;
      if (status === "completed" && tk.status !== "completed") setActivityLog((log) => [{ id: getNextLogId(), taskTitle: tk.title, by: actingAs, at: nowStamp(lang), dateISO: today2, ts: Date.now() }, ...log]);
      const nextReviewStatus = status === "completed" ? "submitted" : tk.reviewStatus;
      return { ...tk, status, completedAt: status === "completed" ? today2 : null, reviewStatus: nextReviewStatus };
    }));
    if (status === "completed") showToast(t("toastTaskCompleted"), "success");
  }
  function approveTaskPre(taskId) {
    setTasks((prev) => prev.map((tk) => tk.id !== taskId ? tk : {
      ...tk,
      reviewStatus: "approved_to_start",
      comments: [...tk.comments, { id: getNextCommentId(), author: actingAs, text: t("taskPreApprovedNote"), at: nowStamp(lang) }]
    }));
    showToast(t("toastApproved"), "success");
  }
  function rejectTaskPre(taskId, text) {
    setTasks((prev) => prev.map((tk) => tk.id !== taskId ? tk : {
      ...tk,
      reviewStatus: "returned_pre",
      comments: [...tk.comments, { id: getNextCommentId(), author: actingAs, text: text || t("taskPreRejectedNote"), at: nowStamp(lang) }]
    }));
    showToast(t("toastRerouted"), "info");
  }
  function reviewTask(id, action, text) {
    applyReviewAction(setTasks, id, action, text);
  }
  function addComment(taskId) {
    if (!commentDraft.trim()) return;
    setTasks((prev) => prev.map((tk) => tk.id === taskId ? { ...tk, comments: [...tk.comments, { id: getNextCommentId(), author: actingAs, text: commentDraft, at: nowStamp(lang) }] } : tk));
    setCommentDraft("");
    showToast(t("toastCommentAdded"), "info");
  }
  function confirmExtend(taskId) {
    if (!extendComment.trim()) return;
    setTasks((prev) => prev.map((tk) => tk.id !== taskId ? tk : { ...tk, endDate: extendDate || tk.endDate, status: tk.status === "not_started" ? "in_progress" : tk.status, comments: [...tk.comments, { id: getNextCommentId(), author: actingAs, text: `Postponed: ${extendComment}`, at: nowStamp(lang) }] }));
    setDismissedAlerts((d) => [...d, taskId]);
    setExtendingAlertId(null);
    setExtendDate("");
    setExtendComment("");
    showToast(t("toastTaskPostponed"), "info");
  }
  function toggleCategory(cat) {
    setProblemForm((f) => ({ ...f, categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat] }));
  }
  function handleReadingFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReadingAttachment({ name: file.name, dataUrl: reader.result, isImage: file.type.startsWith("image/") });
    reader.readAsDataURL(file);
    e.target.value = "";
  }
  function handleProblemMediaFiles(e) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setProblemForm((prev) => ({ ...prev, mediaFiles: [...prev.mediaFiles, { id: getNextProblemMediaId(), name: file.name, dataUrl: reader.result, isImage: file.type.startsWith("image/") }] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }
  function removeProblemMedia(id) {
    setProblemForm((prev) => ({ ...prev, mediaFiles: prev.mediaFiles.filter((m) => m.id !== id) }));
  }
  function removeVoiceNote(id) {
    setProblemForm((prev) => ({ ...prev, voiceNotes: prev.voiceNotes.filter((v) => v.id !== id) }));
  }
  function startVoiceRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast(t("micNotSupported"), "error");
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      recordingChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordingChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((tr) => tr.stop());
        const blob = new Blob(recordingChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          setProblemForm((prev) => ({ ...prev, voiceNotes: [...prev.voiceNotes, { id: getNextVoiceNoteId(), dataUrl: reader.result, duration: recordingSeconds }] }));
        };
        reader.readAsDataURL(blob);
        setIsRecordingVoice(false);
        setRecordingSeconds(0);
        clearInterval(recordingTimerRef.current);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecordingVoice(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => {
          if (s + 1 >= 120) {
            setTimeout(stopVoiceRecording, 0);
            return 120;
          }
          return s + 1;
        });
      }, 1e3);
    }).catch(() => showToast(t("micPermissionDenied"), "error"));
  }
  function stopVoiceRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
  }
  function addNoteDraft() {
    if (!noteDraft.description.trim() && !noteDraft.equipmentName.trim()) return;
    setReadingNotesDraft((prev) => [...prev, { id: getNextReadingNoteId(), ...noteDraft }]);
    setNoteDraft({ unitName: "", equipmentName: "", tagNumber: "", description: "", severity: "note" });
    setShowNoteForm(false);
  }
  function removeNoteDraft(id) {
    setReadingNotesDraft((prev) => prev.filter((n) => n.id !== id));
  }
  function saveReading() {
    if (!readingAttachment && readingNotesDraft.length === 0) return;
    setReadingsLog((prev) => [{ id: getNextReadingId(), department: viewer.department, enteredBy: currentUserId, createdAt: nowStamp(lang), dateISO: today2, ts: Date.now(), timeSlot: readingTimeSlot, attachment: readingAttachment, notes: readingNotesDraft, reviewStatus: canManage ? "approved_by_shift" : "submitted", comments: [] }, ...prev]);
    setReadingAttachment(null);
    setReadingNotesDraft([]);
    showToast(t("toastReadingSaved"), "success");
  }
  function shiftISODate(iso, n) {
    return toISODate(addDays(/* @__PURE__ */ new Date(iso + "T00:00:00"), n));
  }
  function toggleMenuPermission(role, key) {
    setMenuPermissions((prev) => {
      const cur = prev[role] || [];
      const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
      return { ...prev, [role]: next };
    });
  }
  function handleReportFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReportAttachment({ name: file.name, dataUrl: reader.result, isImage: file.type.startsWith("image/") });
    reader.readAsDataURL(file);
    e.target.value = "";
  }
  function saveReport(reportKind, period) {
    if (!reportAttachment) return;
    const periodKey = period === "weekly" ? weekKeyOf(today2) : period === "monthly" ? monthKeyOf(today2) : null;
    setReportsLog((prev) => [{ id: getNextReadingId(), department: viewer.department, reportKind, period, periodKey, enteredBy: currentUserId, createdAt: nowStamp(lang), dateISO: today2, ts: Date.now(), attachment: reportAttachment, reviewStatus: canManage ? "approved_by_shift" : "submitted", comments: [] }, ...prev]);
    setReportAttachment(null);
    showToast(t("toastReportSaved"), "success");
  }
  function submitProblem(e) {
    e.preventDefault();
    if (!problemForm.title.trim()) return;
    const tagNumber = [problemForm.tag1, problemForm.tag2, problemForm.tag3].filter(Boolean).join("-");
    if (editingProblemId) {
      setProblems((prev) => prev.map((p) => p.id === editingProblemId ? { ...p, ...problemForm, tagNumber, editedNote: "Edited", editedAt: nowStamp(lang) } : p));
      showToast(t("toastProblemUpdated"), "success");
    } else {
      const selfCreated = canManage;
      setProblems((prev) => [{
        id: getNextProblemId(),
        title: problemForm.title,
        location: problemForm.location,
        categories: problemForm.categories,
        equipmentName: problemForm.equipmentName,
        unitName: problemForm.unitName,
        tagNumber,
        description: problemForm.description,
        priority: problemForm.priority || "medium",
        mediaFiles: problemForm.mediaFiles,
        voiceNotes: problemForm.voiceNotes,
        reportedBy: currentUserId,
        department: viewer.department,
        createdAt: nowStamp(lang),
        dateISO: today2,
        ts: Date.now(),
        reviewStatus: selfCreated ? "approved_by_shift" : "submitted",
        workStatus: "open",
        editedNote: "",
        editedAt: "",
        comments: []
      }, ...prev]);
      showToast(t("toastProblemSubmitted"), "success");
    }
    setProblemForm(emptyProblemForm());
    setShowProblemForm(false);
    setEditingProblemId(null);
  }
  function startEditProblem(p) {
    const [t1, t2, t3] = (p.tagNumber || "").split("-");
    setProblemForm({ title: p.title, location: p.location, categories: p.categories, equipmentName: p.equipmentName, unitName: p.unitName || (t1 ? `Unit ${t1}` : ""), tag1: t1 || "", tag2: t2 || "", tag3: t3 || "", description: p.description, priority: p.priority || "medium", mediaFiles: p.mediaFiles || [], voiceNotes: p.voiceNotes || [] });
    setEditingProblemId(p.id);
    setShowProblemForm(true);
  }
  function applyReviewAction(setCollection, id, action, text) {
    setCollection((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      let status = item.reviewStatus;
      const comments = [...item.comments || []];
      if (action === "approve") {
        const { status: nextStatus, nightShortcut, wasNightPending } = computeApproveNextStatus(status, {
          isShiftSupervisor,
          inCharge: viewer.inCharge,
          onDuty: viewerOnDuty,
          isNightGap: isNightGapWindow(),
          priority: item.priority
        });
        status = nextStatus;
        const noteKey = nightShortcut ? "nightDualApproveNote" : wasNightPending ? "confirmNightNote" : isShiftTurn(item.reviewStatus) ? "approve" : "approveFinal";
        comments.push({ id: Date.now(), author: actingAs, text: text || t(noteKey), at: nowStamp(lang), action: "approve" });
      } else if (action === "reroute") {
        status = computeRerouteNextStatus(status);
        comments.push({ id: Date.now(), author: actingAs, text, at: nowStamp(lang), action: "reroute" });
      } else if (action === "comment") {
        comments.push({ id: Date.now(), author: actingAs, text, at: nowStamp(lang), action: "comment" });
      } else if (action === "resubmit") {
        status = "submitted";
        comments.push({ id: Date.now(), author: actingAs, text: text || t("resubmitted"), at: nowStamp(lang), action: "resubmit" });
      }
      return { ...item, reviewStatus: status, comments };
    }));
    const toastMap = { approve: ["toastApproved", "success"], reroute: ["toastRerouted", "info"], comment: ["toastCommentAdded", "info"], resubmit: ["toastResubmitted", "info"] };
    if (toastMap[action]) showToast(t(toastMap[action][0]), toastMap[action][1]);
  }
  function reviewProblem(id, action, text) {
    applyReviewAction(setProblems, id, action, text);
  }
  function reviewReading(id, action, text) {
    applyReviewAction(setReadingsLog, id, action, text);
  }
  function reviewReport(id, action, text) {
    applyReviewAction(setReportsLog, id, action, text);
  }
  function setWorkStatus(id, ws) {
    setProblems((prev) => prev.map((p) => p.id === id ? { ...p, workStatus: ws } : p));
  }
  function addPerson(e) {
    e.preventDefault();
    if (!newPerson.name.trim()) return;
    const id = getNextPersonId();
    setPeople((prev) => [...prev, { id, employeeId: getNextEmpId(), onLeave: false, shift: "day", inCharge: false, ...newPerson }]);
    setNewPerson({ name: "", department: departments[0] || "", role: roles[0] || "", isAdmin: false });
  }
  function removePerson(id) {
    const person = getPerson(id);
    if (person && person.inCharge && (person.role === "Shift Supervisor" || person.role === "Section Supervisor")) {
      showToast(t("cannotDeleteInCharge"), "error");
      return;
    }
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }
  function toggleLeave(id) {
    setPeople((prev) => prev.map((p) => p.id === id ? { ...p, onLeave: !p.onLeave } : p));
  }
  function toggleShift(id) {
    setPeople((prev) => prev.map((p) => p.id === id ? { ...p, shift: p.shift === "night" ? "day" : "night" } : p));
  }
  function askStaffAction(person, type) {
    if (type === "leave" && !person.onLeave && person.inCharge && (person.role === "Shift Supervisor" || person.role === "Section Supervisor")) {
      showToast(t("cannotLeaveWhileInCharge"), "error");
      return;
    }
    setPendingStaffAction({ personId: person.id, personName: person.name, type });
  }
  function confirmStaffAction() {
    if (!pendingStaffAction) return;
    if (pendingStaffAction.type === "leave") toggleLeave(pendingStaffAction.personId);
    else toggleShift(pendingStaffAction.personId);
    setPendingStaffAction(null);
  }
  function cancelStaffAction() {
    setPendingStaffAction(null);
  }
  function autoHandoverColleagues() {
    if (!autoHandover) return [];
    const incoming = getPerson(autoHandover.incomingId);
    if (!incoming) return [];
    return people.filter((p) => p.role === "Shift Supervisor" && p.shift === incoming.shift && p.id !== incoming.id && !p.isAdmin && !p.onLeave);
  }
  function eligibleHandoverColleagues() {
    if (!viewer.inCharge) return [];
    return people.filter((p) => {
      if (p.id === currentUserId || p.isAdmin || p.onLeave || p.role !== viewer.role) return false;
      if (viewer.role === "Shift Supervisor") return p.shift === viewer.shift;
      return true;
    });
  }
  function requestHandover(toId) {
    const to = getPerson(toId);
    setHandoverRequests((prev) => [...prev, { id: Date.now(), fromId: currentUserId, fromName: viewer.name, toId, role: viewer.role, createdAt: nowStamp(lang), status: "pending" }]);
    setHandoverPickerOpen(false);
    showToast(t("handoverRequestSentToast") + " " + (to?.name || ""), "info");
  }
  function pushHandoverHistory(entry) {
    setHandoverHistory((prev) => [{ id: Date.now() + Math.random(), at: nowStamp(lang), ...entry }, ...prev]);
  }
  function respondHandover(reqId, accept) {
    const req = handoverRequests.find((r) => r.id === reqId);
    if (!req) return;
    setHandoverRequests((prev) => prev.map((r) => r.id === reqId ? { ...r, status: accept ? "accepted" : "rejected" } : r));
    if (accept) {
      setPeople((prev) => prev.map((p) => {
        if (p.id === req.fromId) return { ...p, inCharge: false };
        if (p.id === req.toId) return { ...p, inCharge: true };
        return p;
      }));
      pushHandoverHistory({ fromId: req.fromId, toId: req.toId, fromName: req.fromName, toName: getPerson(req.toId)?.name, role: req.role, method: "manual" });
    }
    showToast(t(accept ? "handoverAcceptedToast" : "handoverRejectedToast"), accept ? "success" : "info");
  }
  const myIncomingHandovers = useMemo(() => handoverRequests.filter((r) => r.toId === currentUserId && r.status === "pending"), [handoverRequests, currentUserId]);
  function finalizeAutoTransfer(record, targetId, method) {
    let target = getPerson(targetId);
    if (!target || target.onLeave) {
      const fallback = people.find((p) => p.role === "Shift Supervisor" && p.shift === record.incomingShift && p.id !== record.outgoingId && !p.onLeave && !p.isAdmin);
      if (!fallback) {
        setAutoHandover((prev) => prev && prev.key === record.key ? { ...prev, phase: "done" } : prev);
        showToast(t("autoHandoverNoTargetToast"), "error");
        return;
      }
      targetId = fallback.id;
    }
    setPeople((prev) => prev.map((p) => {
      if (p.id === record.outgoingId) return { ...p, inCharge: false };
      if (p.id === targetId) return { ...p, inCharge: true };
      return p;
    }));
    pushHandoverHistory({ fromId: record.outgoingId, toId: targetId, fromName: getPerson(record.outgoingId)?.name, toName: getPerson(targetId)?.name, role: "Shift Supervisor", method });
    setAutoHandover((prev) => prev && prev.key === record.key ? { ...prev, phase: "done", tempAssigneeId: null } : prev);
    showToast(t("autoHandoverDoneToast"), "success");
  }
  function acceptAutoHandoverNow() {
    if (autoHandover) finalizeAutoTransfer(autoHandover, autoHandover.incomingId, "auto_early");
  }
  function extendAutoHandover(minutes) {
    if (!autoHandover) return;
    const hour = plantHourDecimal();
    const base = Math.max(hour, autoHandover.boundaryHour);
    setAutoHandover((prev) => prev ? { ...prev, phase: "extended", extendMinutes: minutes, extendUntil: base + minutes / 60 } : prev);
    showToast(t("autoHandoverExtendedToast"), "info");
  }
  function emergencyReassignAutoHandover(newPersonId) {
    if (autoHandover) finalizeAutoTransfer(autoHandover, newPersonId, "emergency_reassign");
  }
  function tempDelegateAutoHandover(assistantId) {
    if (!autoHandover) return;
    const record = autoHandover;
    setPeople((prev) => prev.map((p) => {
      if (p.id === record.outgoingId) return { ...p, inCharge: false };
      if (p.id === assistantId) return { ...p, inCharge: true };
      return p;
    }));
    pushHandoverHistory({ fromId: record.outgoingId, toId: assistantId, fromName: getPerson(record.outgoingId)?.name, toName: getPerson(assistantId)?.name, role: "Shift Supervisor", method: "temp_delegate" });
    setAutoHandover((prev) => prev ? { ...prev, tempAssigneeId: assistantId, phase: "temp_delegated" } : prev);
    showToast(t("autoHandoverTempDelegateToast"), "info");
  }
  function reclaimAutoHandover() {
    if (!autoHandover || !autoHandover.tempAssigneeId) return;
    const record = autoHandover;
    setPeople((prev) => prev.map((p) => {
      if (p.id === record.tempAssigneeId) return { ...p, inCharge: false };
      if (p.id === record.incomingId) return { ...p, inCharge: true };
      return p;
    }));
    pushHandoverHistory({ fromId: record.tempAssigneeId, toId: record.incomingId, fromName: getPerson(record.tempAssigneeId)?.name, toName: getPerson(record.incomingId)?.name, role: "Shift Supervisor", method: "reclaim" });
    setAutoHandover((prev) => prev ? { ...prev, tempAssigneeId: null, phase: "done" } : prev);
    showToast(t("autoHandoverReclaimedToast"), "success");
  }
  function adminOverrideInCharge(targetId) {
    const target = getPerson(targetId);
    if (!target) return;
    const prevIC = people.find((p) => p.role === target.role && (target.role !== "Shift Supervisor" || p.shift === target.shift) && p.inCharge);
    setPeople((prev) => prev.map((p) => {
      if (p.role !== target.role) return p;
      if (target.role === "Shift Supervisor" && p.shift !== target.shift) return p;
      if (p.id === targetId) return { ...p, inCharge: true };
      if (p.inCharge) return { ...p, inCharge: false };
      return p;
    }));
    pushHandoverHistory({ fromId: prevIC?.id || null, toId: targetId, fromName: prevIC?.name || "\u2014", toName: target.name, role: target.role, method: "admin_override" });
    if (autoHandover && (autoHandover.outgoingId === targetId || autoHandover.incomingId === targetId || autoHandover.outgoingId === prevIC?.id || autoHandover.incomingId === prevIC?.id)) {
      setAutoHandover((prev) => prev ? { ...prev, phase: "done" } : prev);
    }
    showToast(t("adminOverrideToast"), "success");
  }
  useEffect(() => {
    const hour = plantHourDecimal();
    const boundaries = [
      { label: "18:00", boundaryHour: 18, outgoingShift: "day", incomingShift: "night" },
      { label: "06:00", boundaryHour: 6, outgoingShift: "night", incomingShift: "day" }
    ];
    const info = boundaries.find((b) => hour >= b.boundaryHour - 5 / 60 && hour < b.boundaryHour);
    const key = info ? today2 + "_" + info.label : null;
    if (info && (!autoHandover || autoHandover.key !== key)) {
      const outgoing = people.find((p) => p.role === "Shift Supervisor" && p.shift === info.outgoingShift && p.inCharge);
      const incoming = people.find((p) => p.role === "Shift Supervisor" && p.shift === info.incomingShift && p.inCharge);
      if (outgoing && incoming && outgoing.id !== incoming.id) {
        setAutoHandover({ key, boundary: info.label, boundaryHour: info.boundaryHour, outgoingId: outgoing.id, incomingId: incoming.id, incomingShift: info.incomingShift, tempAssigneeId: null, phase: "notified", extendUntil: null, extendMinutes: null });
      }
    } else if (autoHandover && autoHandover.phase === "notified" && hour >= autoHandover.boundaryHour) {
      setAutoHandover((prev) => prev ? { ...prev, phase: "extended", extendMinutes: null, extendUntil: hour + 1 / 60 } : prev);
    } else if (autoHandover && autoHandover.phase === "extended" && autoHandover.extendUntil != null && hour >= autoHandover.extendUntil) {
      if (autoHandover.extendMinutes) {
        setAutoHandover((prev) => prev ? { ...prev, extendUntil: prev.extendUntil + prev.extendMinutes / 60 } : prev);
      } else {
        finalizeAutoTransfer(autoHandover, autoHandover.incomingId, "auto");
      }
    }
  }, [clockTick]);
  function addDept(e) {
    e.preventDefault();
    if (!newDept.trim() || departments.includes(newDept.trim())) return;
    setDepartments((d) => [...d, newDept.trim()]);
    setNewDept("");
  }
  function removeDept(d) {
    setDepartments((prev) => prev.filter((x) => x !== d));
  }
  function addRole(e) {
    e.preventDefault();
    if (!newRole.trim() || roles.includes(newRole.trim())) return;
    setRoles((r) => [...r, newRole.trim()]);
    setNewRole("");
  }
  function removeRole(r) {
    setRoles((prev) => prev.filter((x) => x !== r));
  }
  const inputStyle = { background: "#F4F6F8", border: "1px solid #E2E8ED", borderRadius: 8, padding: "9px 12px", color: "#16222E" };
  const labelStyle = { color: "#5B6B79" };
  const dc = deptColor(viewer.department);
  const tagRef2 = useRef3(null), tagRef3 = useRef3(null);
  function handleTagKey(e, nextRef) {
    if (e.key === " ") {
      e.preventDefault();
      if (nextRef && nextRef.current) nextRef.current.focus();
    }
  }
  function exportLogbook(kind) {
    showToast(lang === "ar" ? `\u0633\u064A\u062A\u0645 \u062A\u0635\u062F\u064A\u0631 \u0633\u062C\u0644 \u0627\u0644\u0648\u0631\u062F\u064A\u0629 \u0628\u0635\u064A\u063A\u0629 ${kind === "pdf" ? "PDF" : "Word"} \u2014 \u0647\u0630\u0647 \u0627\u0644\u0645\u064A\u0632\u0629 \u0633\u062A\u064F\u0641\u0639\u0651\u0644 \u0639\u0646\u062F \u0631\u0628\u0637 \u0627\u0644\u062E\u0627\u062F\u0645.` : `Logbook will export as ${kind === "pdf" ? "PDF" : "Word"} \u2014 this will be enabled once the backend is connected.`, "info");
  }
  function logbookKey(dept) {
    return (dept || viewer.department) + "_" + today2;
  }
  function approveLogbook(dept) {
    const key = logbookKey(dept);
    setLogbookNotes((prev) => ({ ...prev, [key]: { summary: (logbookSummaryDraft[key] ?? prev[key]?.summary) || "", reviewStatus: "approved", approvedBy: actingAs, approvedAt: nowStamp(lang) } }));
    showToast(t("toastLogbookApproved"), "success");
  }
  function saveLogbookDraft(dept) {
    const key = logbookKey(dept);
    setLogbookNotes((prev) => ({ ...prev, [key]: { ...prev[key] || {}, summary: (logbookSummaryDraft[key] ?? prev[key]?.summary) || "", reviewStatus: "draft" } }));
    showToast(t("toastDraftSaved"), "info");
  }
  const STATUS_WEIGHT = { not_started: 0, in_progress: 1, completed: 2 };
  function sortForSupervisorList(list) {
    return [...list].sort((a, b) => {
      const prA = PRIORITY[a.priority]?.rank ?? 1, prB = PRIORITY[b.priority]?.rank ?? 1;
      if (prA !== prB) return prA - prB;
      const swA = STATUS_WEIGHT[a.status] ?? 1, swB = STATUS_WEIGHT[b.status] ?? 1;
      if (swA !== swB) return swA - swB;
      return (a.endDate || "9999").localeCompare(b.endDate || "9999");
    });
  }
  const ctx = {
    MONTHS,
    PALETTE,
    STATUS_WEIGHT,
    WEEKDAYS,
    actingAs,
    activeOverlay,
    activityLog,
    addComment,
    addDept,
    addNoteDraft,
    addPerson,
    addRole,
    alerts,
    allLogEntries,
    allLogGrouped,
    applyReviewAction,
    approveLogbook,
    approveTaskPre,
    acceptAutoHandoverNow,
    adminOverrideInCharge,
    askStaffAction,
    autoHandover,
    autoHandoverColleagues,
    busyAction,
    calDate,
    calLabel,
    calMode,
    calSearch,
    calSearchField,
    calSearchOpen,
    calSearchTag1,
    calSearchTag2,
    calSearchTag3,
    canManage,
    cancelStaffAction,
    confirmStaffAction,
    pendingConfirm,
    askConfirm,
    cancelConfirmDialog,
    runConfirmDialog,
    commentDraft,
    computeRecurrenceDates,
    confirmExtend,
    currentUserId,
    customizeDept,
    dayLogEntries,
    dayModalAddOpen,
    daysInMonthGrid,
    dutyMinutesLeft,
    dc,
    defaultAssignees,
    deleteTask,
    departmentOperators,
    departmentStaff,
    departments,
    deptColor,
    deptIcon,
    deptProblems,
    deptTasks,
    dismissedAlerts,
    drawerMounted,
    drawerOpen,
    drawerVisible,
    editingId,
    editingProblemId,
    emptyProblemForm,
    emptyTaskForm,
    entryCommentDraft,
    expandedId,
    expandedProblemId,
    exportLogbook,
    extendComment,
    extendDate,
    emergencyReassignAutoHandover,
    extendAutoHandover,
    extendingAlertId,
    formRef,
    getPerson,
    handleProblemMediaFiles,
    handleReadingFile,
    handleReportFile,
    handleTagKey,
    handoverHistory,
    handoverHistoryOpen,
    handoverPickerOpen,
    handoverRequests,
    hasDrawer,
    inputStyle,
    isAdvisory,
    isCoordinator,
    isRecordingVoice,
    isSectionSupervisor,
    isShiftSupervisor,
    isTaskOnDate,
    isUnitSupervisor,
    labelStyle,
    lang,
    logMode,
    logSearch,
    logSearchOpen,
    logbookKey,
    logbookNotes,
    logbookSummaryDraft,
    mainSubTab,
    matchesProblemSearch,
    menuPermissions,
    monthGridStart,
    monthStart,
    myIncomingHandovers,
    navigateCal,
    newDept,
    newPerson,
    newRole,
    noteDraft,
    notifOpen,
    notifRef,
    notifications,
    openCustomizeForTask,
    openDay,
    people,
    periodicMonthKey,
    periodicPeriod,
    periodicSection,
    periodicWeekKey,
    personLabel,
    pendingFilterDept,
    pendingSearch,
    pendingStaffAction,
    presentShiftTab,
    problemCommentDraft,
    problemForm,
    problemLogFilter,
    problemLogList,
    problemSearch,
    problemSearchField,
    problemSearchOpen,
    problemView,
    problems,
    problemsChrono,
    problemsVisibleToViewer,
    quickAddForDay,
    readingAttachment,
    readingNotesDraft,
    readingTimeSlot,
    readingsDateSearchOpen,
    readingsLog,
    readingsTab,
    readingsViewDate,
    readingsVisibleToViewer,
    reclaimAutoHandover,
    recordingSeconds,
    rejectTaskPre,
    removeDept,
    removeNoteDraft,
    removePerson,
    removeProblemMedia,
    removeVoiceNote,
    removeRole,
    reportAttachment,
    reportsDateSearchOpen,
    reportsLog,
    reportsTab,
    reportsViewDate,
    reportsVisibleToViewer,
    requestHandover,
    respondHandover,
    reviewProblem,
    reviewReading,
    eligibleHandoverColleagues,
    reviewReport,
    reviewTask,
    roles,
    runWithBusy,
    saveLogbookDraft,
    saveReading,
    saveReport,
    selectDeptForTask,
    selectedCalDay,
    selectedLogDate,
    setActiveOverlay,
    setActivityLog,
    setBusyAction,
    setCalDate,
    setCalMode,
    setCalSearch,
    setCalSearchField,
    setCalSearchOpen,
    setCalSearchTag1,
    setCalSearchTag2,
    setCalSearchTag3,
    setCommentDraft,
    setCurrentUserId,
    setCustomizeDept,
    setDayModalAddOpen,
    setDepartments,
    setDismissedAlerts,
    setDrawerMounted,
    setDrawerOpen,
    setDrawerVisible,
    setEditingId,
    setEditingProblemId,
    setEntryCommentDraft,
    setExpandedId,
    setExpandedProblemId,
    setExtendComment,
    setExtendDate,
    setExtendingAlertId,
    setHandoverPickerOpen,
    setLang,
    setLogMode,
    setLogSearch,
    setLogSearchOpen,
    setLogbookNotes,
    setLogbookSummaryDraft,
    setMainSubTab,
    setMenuPermissions,
    setNewDept,
    setNewPerson,
    setNewRole,
    setNoteDraft,
    setNotifOpen,
    setPeople,
    setPeriodicMonthKey,
    setPeriodicPeriod,
    setPeriodicSection,
    setPeriodicWeekKey,
    setPendingFilterDept,
    setPendingSearch,
    setPendingStaffAction,
    setPresentShiftTab,
    setProblemCommentDraft,
    setProblemForm,
    setProblemLogFilter,
    setProblemSearch,
    setProblemSearchField,
    setProblemSearchOpen,
    setProblemView,
    setProblems,
    setReadingAttachment,
    setReadingNotesDraft,
    setReadingTimeSlot,
    setReadingsDateSearchOpen,
    setReadingsLog,
    setReadingsTab,
    setReadingsViewDate,
    setReportsDateSearchOpen,
    setReportAttachment,
    setReportsLog,
    setReportsTab,
    setReportsViewDate,
    setRoles,
    setSelectedCalDay,
    setSelectedLogDate,
    setShowNoteForm,
    setShowProblemForm,
    setShowTaskForm,
    setStaffTab,
    setStatus,
    setSupTasksTab,
    setTaskCalMonth,
    setTaskCalOpen,
    setTaskForm,
    setTaskRecOpen,
    setTasks,
    setToasts,
    setWhoInChargeOpen,
    setHandoverHistoryOpen,
    setWorkStatus,
    shiftISODate,
    shiftSupervisorOf,
    showNoteForm,
    showProblemForm,
    startVoiceRecording,
    stopVoiceRecording,
    showTaskForm,
    showToast,
    sortByPriority,
    sortForSupervisorList,
    staffTab,
    startEditProblem,
    startEditTask,
    submitProblem,
    submitTask,
    supTasksTab,
    t,
    taskCalMonth,
    taskCalOpen,
    taskForm,
    taskRecOpen,
    tasks,
    today: today2,
    tasksOnDate,
    tasksPendingPreApproval,
    tasksReturnedPre,
    tasksVisibleToCoordinator,
    tempDelegateAutoHandover,
    toasts,
    toggleAssignee,
    toggleCategory,
    toggleLeave,
    toggleMenuPermission,
    toggleRecMonthDay,
    toggleRecWeekday,
    toggleShift,
    toggleTaskDate,
    viewer,
    viewerRole,
    viewerOnDuty,
    visibleToViewer,
    weekDays,
    weekStart,
    whoInChargeOpen,
    renewalGroups,
    confirmRenewalGroups
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      const snapshot = {
        v: 1,
        savedAt: Date.now(),
        lang,
        departments,
        roles,
        people,
        tasks,
        problems,
        readingsLog,
        reportsLog,
        menuPermissions,
        logbookNotes,
        activityLog,
        currentUserId,
        handoverRequests,
        handoverHistory,
        autoHandover
      };
      const result = saveSnapshot(snapshot);
      if (!storageWarnedRef.current && result.warn) {
        storageWarnedRef.current = true;
        showToast(t(result.ok ? "storageNearFullWarning" : "storageSaveFailedWarning"), "error");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [lang, departments, roles, people, tasks, problems, readingsLog, reportsLog, menuPermissions, logbookNotes, activityLog, currentUserId, handoverRequests, handoverHistory, autoHandover]);
  return /* @__PURE__ */ jsxs15("div", { dir: lang === "en" ? "ltr" : "rtl", className: "min-h-screen w-full", style: { background: "#EEF1F4", fontFamily: lang === "en" ? "system-ui, sans-serif" : "'Tajawal', sans-serif" }, children: [
    /* @__PURE__ */ jsx15("style", { children: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;}
        @keyframes fadeSlideUp { from { opacity:0; transform: translateY(10px);} to {opacity:1; transform:translateY(0);} }
        @keyframes ntmSpin { to { transform: rotate(360deg);} }
        @keyframes toastIn { from {opacity:0; transform:translateY(-12px) scale(0.96);} to {opacity:1; transform:translateY(0) scale(1);} }
      ` }),
    ToastStack(ctx),
    ConfirmDialog(ctx),
    /* @__PURE__ */ jsxs15("div", { className: "max-w-3xl mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxs15("div", { className: "rounded-xl p-2.5 mb-4 flex items-center gap-2", style: { background: "#FFF6EB", border: "1px solid #F0C57A" }, children: [
        /* @__PURE__ */ jsx15("span", { className: "text-xs font-bold", style: { color: "#5B4321" }, children: t("previewAs") }),
        /* @__PURE__ */ jsx15("select", { value: currentUserId, onChange: (e) => setCurrentUserId(Number(e.target.value)), className: "text-xs outline-none flex-1", style: { ...inputStyle, padding: "6px 10px" }, children: people.map((p) => /* @__PURE__ */ jsxs15("option", { value: p.id, children: [
          p.name,
          " (",
          p.employeeId,
          ") \u2014 ",
          p.isAdmin ? t("appAdmin") : p.role
        ] }, p.id)) }),
        /* @__PURE__ */ jsxs15("button", { onClick: () => setLang(lang === "ar" ? "en" : "ar"), className: "flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0", style: { background: "#FFFFFF", border: "1px solid #F0C57A", color: "#5B4321" }, children: [
          /* @__PURE__ */ jsx15(Languages2, { size: 13 }),
          " ",
          lang === "ar" ? "EN" : "AR"
        ] })
      ] }),
      viewerRole === "admin" ? /* @__PURE__ */ jsxs15(Fragment9, { children: [
        /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-3 mb-5", children: [
          Avatar(ctx, viewer.department, 48),
          /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsx15("p", { className: "text-base font-black", style: { color: "#16222E" }, children: viewer.name }),
            /* @__PURE__ */ jsx15("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: viewer.employeeId }),
            /* @__PURE__ */ jsx15("p", { className: "text-xs", style: labelStyle, children: t("appAdmin") })
          ] })
        ] }),
        AdminView(ctx)
      ] }) : /* @__PURE__ */ jsxs15(Fragment9, { children: [
        /* @__PURE__ */ jsxs15("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-3", children: [
            Avatar(ctx, viewer.department, 48),
            /* @__PURE__ */ jsxs15("div", { children: [
              /* @__PURE__ */ jsx15("p", { className: "text-base font-black", style: { color: "#16222E" }, children: viewer.name }),
              /* @__PURE__ */ jsx15("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: viewer.employeeId }),
              /* @__PURE__ */ jsx15("p", { className: "text-xs", style: labelStyle, children: viewer.role }),
              dutyMinutesLeft != null && /* @__PURE__ */ jsxs15("p", { className: "flex items-center gap-1 text-[11px] font-bold mt-0.5", style: { color: dutyMinutesLeft <= 30 ? "#C0392B" : "#8A97A3" }, children: [
                /* @__PURE__ */ jsx15(Clock2, { size: 11 }),
                " ",
                t("dutyTimeLeft"),
                " ",
                Math.floor(dutyMinutesLeft / 60) > 0 ? `${Math.floor(dutyMinutesLeft / 60)}${lang === "ar" ? "\u0633" : "h"} ` : "",
                dutyMinutesLeft % 60,
                lang === "ar" ? "\u062F" : "m"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs15("div", { className: "relative", ref: notifRef, children: [
              /* @__PURE__ */ jsxs15("button", { onClick: () => setNotifOpen((o) => !o), className: "w-12 h-12 rounded-full flex items-center justify-center relative", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
                /* @__PURE__ */ jsx15(Bell, { size: 22, color: "#16222E" }),
                notifications.length > 0 && /* @__PURE__ */ jsx15("span", { className: "absolute -top-1 -left-1 text-[10px] font-bold rounded-full flex items-center justify-center", style: { width: 18, height: 18, background: "#C0392B", color: "white" }, children: notifications.length })
              ] }),
              notifOpen && /* @__PURE__ */ jsxs15("div", { className: "absolute left-0 mt-2 w-72 rounded-xl p-2 z-10 flex flex-col gap-1", style: { background: "#FFFFFF", border: "1px solid #DCE3E8", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }, children: [
                notifications.length === 0 && /* @__PURE__ */ jsx15("p", { className: "text-xs text-center py-4", style: { color: "#8A97A3" }, children: t("noNotifications") }),
                notifications.map((n, i) => /* @__PURE__ */ jsxs15("div", { className: "text-xs px-3 py-2 rounded-lg", style: { background: "#F4F6F8" }, children: [
                  /* @__PURE__ */ jsxs15("span", { className: "font-bold ml-1", style: { color: "#1F4E79" }, children: [
                    "[",
                    n.kind,
                    "]"
                  ] }),
                  /* @__PURE__ */ jsx15("span", { style: { color: "#16222E" }, children: n.text })
                ] }, i))
              ] })
            ] }),
            hasDrawer && /* @__PURE__ */ jsx15("button", { onClick: () => setDrawerOpen(true), className: "w-11 h-11 rounded-full flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx15(Menu2, { size: 19, color: "#16222E" }) })
          ] })
        ] }),
        HandoverBanner(ctx),
        HandoverPicker(ctx),
        AutoHandoverBanner(ctx),
        WhoInChargeModal(ctx),
        HandoverHistoryModal(ctx),
        DrawerMenu(ctx),
        activeOverlay === "calendar" && CalendarOverlay(ctx),
        activeOverlay === "log" && LogOverlay(ctx),
        activeOverlay === "staff" && StaffOverlay(ctx),
        activeOverlay === "logbook" && LogbookOverlay(ctx),
        activeOverlay === "readings" && ReadingsOverlay(ctx),
        activeOverlay === "reports" && ReportsOverlay(ctx),
        !activeOverlay && /* @__PURE__ */ jsxs15(Fragment9, { children: [
          /* @__PURE__ */ jsxs15("div", { className: "flex gap-2 mb-3", children: [
            !isCoordinator && /* @__PURE__ */ jsx15("button", { onClick: () => setMainSubTab("tasks"), className: "flex-1 text-base font-black py-3 rounded-xl", style: { background: mainSubTab === "tasks" ? "#1F4E79" : "#FFFFFF", color: mainSubTab === "tasks" ? "white" : "#5B6B79", border: "1px solid " + (mainSubTab === "tasks" ? "#1F4E79" : "#DCE3E8") }, children: t("tasks") }),
            /* @__PURE__ */ jsxs15("button", { onClick: () => setMainSubTab("problems"), className: "flex-1 text-base font-black py-3 rounded-xl", style: { background: mainSubTab === "problems" ? "#1F4E79" : "#FFFFFF", color: mainSubTab === "problems" ? "white" : "#5B6B79", border: "1px solid " + (mainSubTab === "problems" ? "#1F4E79" : "#DCE3E8") }, children: [
              t("problems"),
              " ",
              (isCoordinator ? problemsVisibleToViewer.length : deptProblems.length) > 0 && `(${isCoordinator ? problemsVisibleToViewer.length : deptProblems.length})`
            ] })
          ] }),
          isAdvisory && /* @__PURE__ */ jsx15("p", { className: "text-xs mb-3 px-1", style: { color: "#B25E09" }, children: t("advisoryNote") }),
          isCoordinator && /* @__PURE__ */ jsx15("p", { className: "text-xs mb-3 px-1", style: { color: "#B25E09" }, children: t("coordinatorNote") }),
          mainSubTab === "tasks" && viewerRole === "supervisor" && /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx15("button", { onClick: () => setSupTasksTab("list"), className: "w-11 h-11 rounded-lg flex items-center justify-center shrink-0", title: t("todayTaskList"), style: { background: supTasksTab === "list" ? "#1F4E79" : "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx15(List, { size: 19, color: supTasksTab === "list" ? "white" : "#16222E" }) }),
            canManage && /* @__PURE__ */ jsx15("button", { onClick: () => {
              setTaskForm(emptyTaskForm());
              setEditingId(null);
              setShowTaskForm(true);
            }, className: "w-11 h-11 rounded-lg flex items-center justify-center shrink-0", style: { background: "#1F4E79" }, children: /* @__PURE__ */ jsx15(Plus3, { size: 20, color: "white" }) }),
            /* @__PURE__ */ jsx15("button", { onClick: () => setSupTasksTab((s) => s === "inprogress" ? "list" : "inprogress"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: supTasksTab === "inprogress" ? "#1F4E79" : "#FFFFFF", color: supTasksTab === "inprogress" ? "white" : "#5B6B79", border: "1px solid " + (supTasksTab === "inprogress" ? "#1F4E79" : "#DCE3E8") }, children: t("inProgressBtn") }),
            /* @__PURE__ */ jsx15("button", { onClick: () => setSupTasksTab((s) => s === "completed" ? "list" : "completed"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: supTasksTab === "completed" ? "#1F4E79" : "#FFFFFF", color: supTasksTab === "completed" ? "white" : "#5B6B79", border: "1px solid " + (supTasksTab === "completed" ? "#1F4E79" : "#DCE3E8") }, children: t("completedBtn") })
          ] }),
          mainSubTab === "problems" && /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx15("button", { onClick: () => setProblemView("status"), className: "w-11 h-11 rounded-lg flex items-center justify-center shrink-0", title: t("problemsList"), style: { background: problemView === "status" ? "#1F4E79" : "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx15(List, { size: 19, color: problemView === "status" ? "white" : "#16222E" }) }),
            (viewerRole === "operator" || canManage) && /* @__PURE__ */ jsx15("button", { onClick: () => {
              setShowProblemForm(true);
            }, className: "w-11 h-11 rounded-lg flex items-center justify-center shrink-0", style: { background: "#1F4E79" }, children: /* @__PURE__ */ jsx15(Plus3, { size: 20, color: "white" }) }),
            /* @__PURE__ */ jsx15("button", { onClick: () => setProblemSearchOpen((o) => !o), className: "w-11 h-11 rounded-lg flex items-center justify-center shrink-0", style: { background: problemSearchOpen ? "#1F4E79" : "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx15(Search5, { size: 18, color: problemSearchOpen ? "white" : "#16222E" }) }),
            !isCoordinator && /* @__PURE__ */ jsxs15("button", { onClick: () => setProblemView((s) => s === "log" ? "status" : "log"), className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 rounded-lg", style: { background: problemView === "log" ? "#1F4E79" : "#FFFFFF", color: problemView === "log" ? "white" : "#5B6B79", border: "1px solid " + (problemView === "log" ? "#1F4E79" : "#DCE3E8") }, children: [
              /* @__PURE__ */ jsx15(Clock2, { size: 15 }),
              " ",
              t("fullLog")
            ] })
          ] }),
          mainSubTab === "problems" && problemSearchOpen && /* @__PURE__ */ jsxs15("div", { className: "rounded-xl p-3 mb-4 flex flex-col gap-2", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
            /* @__PURE__ */ jsx15("input", { autoFocus: true, value: problemSearch, onChange: (e) => setProblemSearch(e.target.value), placeholder: t("searchPlaceholder"), className: "w-full text-sm outline-none", style: inputStyle }),
            /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsx15("span", { className: "text-[11px] font-bold", style: { color: "#8A97A3" }, children: t("searchField") }),
              [["all", t("all")], ["tagNumber", t("fieldTag")], ["equipmentName", t("fieldEquip")], ["department", t("fieldDept")], ["location", t("fieldLoc")]].map(([k, l]) => /* @__PURE__ */ jsx15("button", { onClick: () => setProblemSearchField(k), className: "text-[11px] font-bold px-2.5 py-1 rounded-full", style: { background: problemSearchField === k ? "#1F4E79" : "#F4F6F8", color: problemSearchField === k ? "white" : "#5B6B79" }, children: l }, k))
            ] })
          ] }),
          mainSubTab === "tasks" && showTaskForm && canManage && /* @__PURE__ */ jsx15(TaskFormPanel, { ctx }),
          mainSubTab === "problems" && showProblemForm && /* @__PURE__ */ jsx15(ProblemFormPanel, { ctx }),
          mainSubTab === "tasks" && /* @__PURE__ */ jsxs15(Fragment9, { children: [
            RenewalReviewBlock(ctx),
            AlertsBlock(ctx),
            TaskPreApprovalBlock(ctx),
            TaskReturnedPreBlock(ctx),
            viewerRole === "operator" ? /* @__PURE__ */ jsxs15("div", { className: "flex flex-col gap-2.5", children: [
              deptTasks.length === 0 && /* @__PURE__ */ jsxs15("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: [
                t("noTasks"),
                "."
              ] }),
              deptTasks.map((tk, i) => TaskCard(ctx, tk, false, i + 1))
            ] }) : SupervisorTaskGroups(ctx, supTasksTab)
          ] }),
          isCoordinator && tasksVisibleToCoordinator.length > 0 && /* @__PURE__ */ jsxs15("div", { className: "flex flex-col gap-2.5 mb-5", children: [
            /* @__PURE__ */ jsx15("h3", { className: "text-sm font-black px-1", style: { color: "#B25E09" }, children: t("coordinatorTasksTitle") }),
            tasksVisibleToCoordinator.map((tk, i) => TaskCard(ctx, tk, true, i + 1))
          ] }),
          mainSubTab === "problems" && problemView === "status" && /* @__PURE__ */ jsxs15("div", { className: "flex flex-col gap-5", children: [
            Object.entries(WORK_STATUS).map(([k, v]) => {
              const list = problemsVisibleToViewer.filter((p) => p.workStatus === k && matchesProblemSearch(p));
              if (list.length === 0) return null;
              return /* @__PURE__ */ jsxs15("div", { children: [
                /* @__PURE__ */ jsx15("h4", { className: "text-sm font-black mb-2 px-1", style: { color: v.color }, children: v[lang] || v.ar }),
                /* @__PURE__ */ jsx15("div", { className: "flex flex-col gap-2.5", children: list.map((p) => ProblemCard(ctx, p, { withApprove: true })) })
              ] }, k);
            }),
            problemsVisibleToViewer.filter(matchesProblemSearch).length === 0 && /* @__PURE__ */ jsx15("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noProblems") })
          ] }),
          mainSubTab === "problems" && problemView === "log" && /* @__PURE__ */ jsxs15("div", { className: "flex flex-col gap-2.5", children: [
            problemsChrono.filter(matchesProblemSearch).length === 0 && /* @__PURE__ */ jsx15("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noProblems") }),
            problemsChrono.filter(matchesProblemSearch).map((p) => ProblemCard(ctx, p, { withApprove: true }))
          ] })
        ] })
      ] })
    ] })
  ] });
}
function TaskManager() {
  return /* @__PURE__ */ jsx15(ErrorBoundary, { children: /* @__PURE__ */ jsx15(TaskManagerInner, {}) });
}
export {
  TaskManager as default
};
