// App.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Lock,
  Globe2,
  ListChecks as ListChecks2,
  MessageSquare,
  History as History2,
  ChevronDown,
  ChevronUp,
  Send,
  Circle,
  CircleDot,
  CheckCircle2,
  CalendarDays as CalendarDays2,
  Users as Users2,
  AlertTriangle as AlertTriangle2,
  UserPlus,
  Bell,
  ShieldCheck,
  MapPin,
  Wrench,
  Tag,
  X,
  Check,
  Languages,
  Play,
  Flame as Flame2,
  Fan as Fan2,
  Droplets as Droplets2,
  Gauge as Gauge2,
  ArrowLeftRight,
  List,
  Repeat,
  Clock,
  Search,
  Menu,
  BookOpen as BookOpen2,
  Activity as Activity2,
  FileText as FileText2,
  Download
} from "lucide-react";

// constants.js
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
  returned_to_operator: { ar: "\u0623\u064F\u0639\u064A\u062F \u0644\u0644\u0645\u0634\u063A\u0644 \u0644\u0644\u062A\u0635\u062D\u064A\u062D", en: "Returned to operator for correction", color: "#C0392B", bg: "#FBE7E4" },
  approved_final: { ar: "\u0645\u0639\u062A\u0645\u062F \u0646\u0647\u0627\u0626\u064A\u064B\u0627", en: "Fully approved", color: "#2F7D4F", bg: "#E4F3EA" }
};
var WEEKDAYS_AR = ["\u0627\u0644\u0633\u0628\u062A", "\u0627\u0644\u0623\u062D\u062F", "\u0627\u0644\u0627\u062B\u0646\u064A\u0646", "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621", "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621", "\u0627\u0644\u062E\u0645\u064A\u0633", "\u0627\u0644\u062C\u0645\u0639\u0629"];
var WEEKDAYS_EN = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
var MONTHS_AR = ["\u064A\u0646\u0627\u064A\u0631", "\u0641\u0628\u0631\u0627\u064A\u0631", "\u0645\u0627\u0631\u0633", "\u0623\u0628\u0631\u064A\u0644", "\u0645\u0627\u064A\u0648", "\u064A\u0648\u0646\u064A\u0648", "\u064A\u0648\u0644\u064A\u0648", "\u0623\u063A\u0633\u0637\u0633", "\u0633\u0628\u062A\u0645\u0628\u0631", "\u0623\u0643\u062A\u0648\u0628\u0631", "\u0646\u0648\u0641\u0645\u0628\u0631", "\u062F\u064A\u0633\u0645\u0628\u0631"];
var MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// translations.js
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
  todayTaskList: { ar: "\u0642\u0627\u0626\u0645\u0629 \u0645\u0647\u0627\u0645 \u0627\u0644\u064A\u0648\u0645", en: "Today's Task List" },
  inProgressBtn: { ar: "\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630", en: "In Progress" },
  completedBtn: { ar: "\u0645\u0646\u062C\u0632\u0629", en: "Completed" },
  problemsList: { ar: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0634\u0627\u0643\u0644", en: "Problems List" },
  reportProblem: { ar: "\u0628\u0644\u0627\u063A", en: "Report" },
  fullLog: { ar: "\u0633\u062C\u0644 \u0643\u0644 \u0627\u0644\u0628\u0644\u0627\u063A\u0627\u062A", en: "Full Report Log" },
  noProblems: { ar: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0634\u0627\u0643\u0644", en: "No problems" },
  confirmDeleteMsg: { ar: "\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0647\u0630\u0647 \u0627\u0644\u0645\u0647\u0645\u0629\u061F \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639.", en: "Delete this task? This cannot be undone." },
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
  moveToDayShift: { ar: "\u0646\u0642\u0644 \u0644\u0648\u0631\u062F\u064A\u0629 \u0627\u0644\u0646\u0647\u0627\u0631", en: "Move to Day Shift" },
  moveToNightShift: { ar: "\u0646\u0642\u0644 \u0644\u0648\u0631\u062F\u064A\u0629 \u0627\u0644\u0644\u064A\u0644", en: "Move to Night Shift" },
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
  noReportsHere: { ar: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u0644\u0627\u063A\u0627\u062A \u062D\u0631\u062C\u0629 \u062D\u0627\u0644\u064A\u064B\u0627", en: "No critical reports right now" }
};

// reviewEngine.js
function isShiftTurn(status) {
  return status === "submitted" || status === "returned_to_shift";
}
function isSectionTurn(status) {
  return status === "approved_by_shift";
}
function sectionCanSee(status) {
  return status === "approved_by_shift" || status === "approved_final";
}

// dateHelpers.js
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
var tomorrow = toISODate(addDays(/* @__PURE__ */ new Date(), 1));
var in2days = toISODate(addDays(/* @__PURE__ */ new Date(), 2));
var in3days = toISODate(addDays(/* @__PURE__ */ new Date(), 3));
var nowTs = Date.now();

// seedData.js
var empNum = 4e3;
function nextEmpId() {
  return String(empNum++);
}
var NAME_POOL = ["Ahmed", "Khalid", "Fahad", "Saud", "Turki", "Bandar", "Majed", "Nawaf", "Abdulaziz", "Sultan", "Faisal", "Mishal", "Yousef", "Ibrahim", "Omar", "Ziad", "Waleed", "Nasser", "Saleh", "Hamad", "Rashed", "Talal", "Badr", "Mansour", "Hazza", "Salem", "Naif", "Fawaz", "Rakan", "Meshal", "Sami", "Adel", "Anas", "Karim", "Hassan", "Yasser", "Osama", "Marwan", "Riyad", "Adnan", "Jaber", "Suhail", "Amer"];
var pid = 1;
var DEPARTMENTS_SEED = ["Outside", "Turbine", "Utilities", "Control Panel"];
var seedPeople = [];
function addSeed(name, dept, role, admin) {
  seedPeople.push({ id: pid++, name, employeeId: nextEmpId(), department: dept, role, isAdmin: !!admin, onLeave: false, shift: pid % 2 === 0 ? "night" : "day" });
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
function getNextPersonId() {
  return nextPersonId++;
}
function getNextEmpId() {
  return nextEmpId();
}

// App.jsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function TaskManager() {
  const [lang, setLang] = useState("en");
  const t = (k) => STR[k] ? STR[k][lang] : k;
  const WEEKDAYS = lang === "en" ? WEEKDAYS_EN : WEEKDAYS_AR;
  const MONTHS = lang === "en" ? MONTHS_EN : MONTHS_AR;
  const [departments, setDepartments] = useState([...DEPARTMENTS_SEED]);
  const [roles, setRoles] = useState([...OPERATOR_ROLES, ...SUPERVISOR_ROLES]);
  const [people, setPeople] = useState(seedPeople);
  const [tasks, setTasks] = useState(seedTasks);
  const [problems, setProblems] = useState(seedProblems);
  const [readingsLog, setReadingsLog] = useState([]);
  const [menuPermissions, setMenuPermissions] = useState(DEFAULT_MENU_PERMISSIONS);
  const [readingsViewDate, setReadingsViewDate] = useState(today);
  const [reportsLog, setReportsLog] = useState([]);
  const [reportAttachment, setReportAttachment] = useState(null);
  const [reportsViewDate, setReportsViewDate] = useState(today);
  const [reportsTab, setReportsTab] = useState("daily");
  const [logbookNotes, setLogbookNotes] = useState({});
  const [logbookSummaryDraft, setLogbookSummaryDraft] = useState({});
  const [periodicSection, setPeriodicSection] = useState("Outside");
  const [periodicPeriod, setPeriodicPeriod] = useState("weekly");
  const [periodicWeekKey, setPeriodicWeekKey] = useState(() => weekKeyOf(today));
  const [periodicMonthKey, setPeriodicMonthKey] = useState(() => monthKeyOf(today));
  const [readingAttachment, setReadingAttachment] = useState(null);
  const [entryCommentDraft, setEntryCommentDraft] = useState({ id: null, text: "" });
  const [readingNotesDraft, setReadingNotesDraft] = useState([]);
  const [noteDraft, setNoteDraft] = useState({ unitName: "", equipmentName: "", tagNumber: "", description: "", severity: "note" });
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [activityLog, setActivityLog] = useState(seedActivityLog);
  const [currentUserId, setCurrentUserId] = useState(seedPeople[1].id);
  const [mainSubTab, setMainSubTab] = useState("tasks");
  const [problemView, setProblemView] = useState("status");
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [selectedLogDate, setSelectedLogDate] = useState(today);
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
  const [presentShiftTab, setPresentShiftTab] = useState("day");
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
  const notifRef = useRef(null);
  const formRef = useRef(null);
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
  function shiftSupervisorOf(dept) {
    return people.find((p) => p.department === dept && p.role === "Shift Supervisor");
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
    return { title: "", description: "", type: "public", privateTo: people[0]?.id || "", assignees: defaultAssignees(viewer.department), department: viewer.department, priority: "medium", dates: [today], startDate: today, endDate: today, startTime: "", endTime: "", recurrence: { type: "none", weekdays: [], monthDays: [] } };
  }
  const [taskForm, setTaskForm] = useState(emptyTaskForm());
  function emptyProblemForm() {
    return { title: "", location: LOCATIONS[0], categories: [], equipmentName: "", unitName: "", tag1: "", tag2: "", tag3: "", description: "", priority: "medium" };
  }
  const [problemForm, setProblemForm] = useState(emptyProblemForm());
  const alerts = useMemo(() => tasks.filter((tk) => {
    if (tk.status === "completed" || dismissedAlerts.includes(tk.id)) return false;
    if (!tk.endDate || tk.endDate > today) return false;
    return tk.createdBy === currentUserId || tk.assignees.includes(currentUserId) || viewerRole === "supervisor";
  }), [tasks, currentUserId, dismissedAlerts, viewerRole]);
  const notifications = useMemo(() => {
    const scope = tasks.filter((tk) => tk.assignees.includes(currentUserId) || tk.createdBy === currentUserId || tk.privateTo === currentUserId || viewerRole === "supervisor" && tk.department === viewer.department);
    const dueTomorrow = scope.filter((tk) => tk.status !== "completed" && tk.endDate === tomorrow).map((tk) => ({ kind: "\u2192", text: tk.title }));
    const dueToday = scope.filter((tk) => tk.status !== "completed" && tk.endDate === today).map((tk) => ({ kind: t("today"), text: tk.title }));
    const commentNotifs = scope.filter((tk) => tk.assignees.includes(currentUserId)).flatMap((tk) => tk.comments.filter((c) => c.author !== actingAs).map((c) => ({ kind: "\u{1F4AC}", text: `${c.author}: ${tk.title}` })));
    const myTurnStatus = (s) => isShiftSupervisor && isShiftTurn(s) || isSectionSupervisor && isSectionTurn(s);
    const problemNotifs = problems.filter((p) => p.department === viewer.department && myTurnStatus(p.reviewStatus)).map((p) => ({ kind: "!", text: p.title }));
    const criticalNotifs = isCoordinator ? problems.filter((p) => p.priority === "high" && p.reviewStatus !== "submitted").map((p) => ({ kind: "\u203C", text: p.title })) : [];
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
  const deptTasks = useMemo(() => sortByPriority(tasks.filter((tk) => tk.department === viewer.department && visibleToViewer(tk))), [tasks, viewer, currentUserId]);
  const deptProblems = useMemo(() => problems.filter((p) => p.department === viewer.department), [problems, viewer]);
  const problemsVisibleToViewer = useMemo(() => {
    let list = deptProblems;
    if (viewerRole === "supervisor" && !isShiftSupervisor) list = list.filter((p) => sectionCanSee(p.reviewStatus));
    if (viewerRole === "operator") list = list;
    if (isCoordinator) list = list.filter((p) => p.priority === "high");
    return list;
  }, [deptProblems, viewerRole, isShiftSupervisor, isCoordinator]);
  const problemsChrono = useMemo(() => [...problemsVisibleToViewer].sort((a, b) => b.ts - a.ts), [problemsVisibleToViewer]);
  const readingsVisibleToViewer = useMemo(() => {
    let list = readingsLog.filter((r) => r.department === viewer.department);
    if (viewerRole === "supervisor" && !isShiftSupervisor) list = list.filter((r) => sectionCanSee(r.reviewStatus));
    return list;
  }, [readingsLog, viewer.department, viewerRole, isShiftSupervisor]);
  const reportsVisibleToViewer = useMemo(() => {
    let list = reportsLog.filter((r) => r.department === viewer.department);
    if (viewerRole === "supervisor" && !isShiftSupervisor) list = list.filter((r) => sectionCanSee(r.reviewStatus));
    return list;
  }, [reportsLog, viewer.department, viewerRole, isShiftSupervisor]);
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
    return sortByPriority(tasks.filter((tk) => tk.department === viewer.department && visibleToViewer(tk) && isTaskOnDate(tk, ds)));
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
      const startDate = dates[0] || today, endDate = dates[dates.length - 1] || today;
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
    const out = [];
    if (rec.type === "daily") {
      for (let i = 0; i < 30; i++) out.push(toISODate(addDays(base, i)));
    } else if (rec.type === "weekly" && rec.weekdays.length > 0) {
      for (let i = 0; i < 56; i++) {
        const d = addDays(base, i);
        const wd = WEEKDAYS[d.getDay() === 6 ? 0 : d.getDay() + 1];
        if (rec.weekdays.includes(wd)) out.push(toISODate(d));
      }
    } else if (rec.type === "monthly" && rec.monthDays.length > 0) {
      for (let m = 0; m < 6; m++) {
        const monthRef = new Date(base.getFullYear(), base.getMonth() + m, 1);
        rec.monthDays.forEach((dayNum) => {
          const d = new Date(monthRef.getFullYear(), monthRef.getMonth(), dayNum);
          if (d >= base) out.push(toISODate(d));
        });
      }
    }
    return out.length > 0 ? out.sort() : [baseDateStr];
  }
  function submitTask(e) {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    if (editingId) {
      setTasks((prev) => prev.map((tk) => tk.id === editingId ? { ...tk, ...taskForm, privateTo: taskForm.type === "private" ? taskForm.privateTo : null } : tk));
    } else if (taskForm.recurrence.type !== "none") {
      const baseDate = taskForm.dates[0] || today;
      const occDates = computeRecurrenceDates(taskForm.recurrence, baseDate);
      const groupId = "rec-" + Date.now();
      const newOnes = occDates.map((ds) => ({
        id: getNextTaskId(),
        ...taskForm,
        dates: [ds],
        startDate: ds,
        endDate: ds,
        privateTo: taskForm.type === "private" ? taskForm.privateTo : null,
        createdBy: currentUserId,
        createdAt: nowStamp(lang),
        status: "not_started",
        completedAt: null,
        comments: [],
        recurrenceGroupId: groupId
      }));
      setTasks((prev) => [...newOnes, ...prev]);
    } else {
      setTasks((prev) => [{ id: getNextTaskId(), ...taskForm, privateTo: taskForm.type === "private" ? taskForm.privateTo : null, createdBy: currentUserId, createdAt: nowStamp(lang), status: "not_started", completedAt: null, comments: [] }, ...prev]);
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
    setTaskForm({ title: task.title, description: task.description, type: task.type, privateTo: task.privateTo || people[0]?.id, assignees: task.assignees, department: task.department, priority: task.priority, dates: task.dates || [task.startDate], startDate: task.startDate, endDate: task.endDate, startTime: task.startTime, endTime: task.endTime, recurrence: task.recurrence || { type: "none", weekdays: [], monthDays: [] } });
    setEditingId(task.id);
    setShowTaskForm(true);
  }
  function deleteTask(id) {
    if (!window.confirm(t("confirmDeleteMsg"))) return;
    setTasks((prev) => prev.filter((tk) => tk.id !== id));
    showToast(t("toastTaskDeleted"), "info");
  }
  function setStatus(id, status) {
    setTasks((prev) => prev.map((tk) => {
      if (tk.id !== id) return tk;
      if (status === "completed" && tk.status !== "completed") setActivityLog((log) => [{ id: getNextLogId(), taskTitle: tk.title, by: actingAs, at: nowStamp(lang), dateISO: today, ts: Date.now() }, ...log]);
      return { ...tk, status, completedAt: status === "completed" ? today : null };
    }));
    if (status === "completed") showToast(t("toastTaskCompleted"), "success");
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
    setReadingsLog((prev) => [{ id: getNextReadingId(), department: viewer.department, enteredBy: currentUserId, createdAt: nowStamp(lang), dateISO: today, ts: Date.now(), attachment: readingAttachment, notes: readingNotesDraft, reviewStatus: canManage ? "approved_by_shift" : "submitted", comments: [] }, ...prev]);
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
    const periodKey = period === "weekly" ? weekKeyOf(today) : period === "monthly" ? monthKeyOf(today) : null;
    setReportsLog((prev) => [{ id: getNextReadingId(), department: viewer.department, reportKind, period, periodKey, enteredBy: currentUserId, createdAt: nowStamp(lang), dateISO: today, ts: Date.now(), attachment: reportAttachment, reviewStatus: canManage ? "approved_by_shift" : "submitted", comments: [] }, ...prev]);
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
        reportedBy: currentUserId,
        department: viewer.department,
        createdAt: nowStamp(lang),
        dateISO: today,
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
    setProblemForm({ title: p.title, location: p.location, categories: p.categories, equipmentName: p.equipmentName, unitName: p.unitName || (t1 ? `Unit ${t1}` : ""), tag1: t1 || "", tag2: t2 || "", tag3: t3 || "", description: p.description, priority: p.priority || "medium" });
    setEditingProblemId(p.id);
    setShowProblemForm(true);
  }
  function applyReviewAction(setCollection, id, action, text) {
    setCollection((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      let status = item.reviewStatus;
      const comments = [...item.comments || []];
      if (action === "approve") {
        if (isShiftTurn(status)) status = "approved_by_shift";
        else if (isSectionTurn(status)) status = "approved_final";
        comments.push({ id: Date.now(), author: actingAs, text: text || t("approve"), at: nowStamp(lang), action: "approve" });
      } else if (action === "reroute") {
        if (isShiftTurn(status)) status = "returned_to_operator";
        else if (isSectionTurn(status)) status = "returned_to_shift";
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
    setPeople((prev) => [...prev, { id, employeeId: getNextEmpId(), onLeave: false, ...newPerson }]);
    setNewPerson({ name: "", department: departments[0] || "", role: roles[0] || "", isAdmin: false });
  }
  function removePerson(id) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }
  function toggleLeave(id) {
    setPeople((prev) => prev.map((p) => p.id === id ? { ...p, onLeave: !p.onLeave } : p));
  }
  function toggleShift(id) {
    setPeople((prev) => prev.map((p) => p.id === id ? { ...p, shift: p.shift === "night" ? "day" : "night" } : p));
  }
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
  const tagRef2 = useRef(null), tagRef3 = useRef(null);
  function handleTagKey(e, nextRef) {
    if (e.key === " ") {
      e.preventDefault();
      if (nextRef && nextRef.current) nextRef.current.focus();
    }
  }
  function Avatar(dept, size) {
    const Icon = deptIcon(dept);
    const c = deptColor(dept);
    return /* @__PURE__ */ jsx("div", { style: { width: size, height: size, borderRadius: 10, border: "2px solid " + c.text, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: /* @__PURE__ */ jsx(Icon, { size: Math.round(size * 0.45), color: c.text }) });
  }
  function StatusControl(task) {
    if (task.status === "not_started") return /* @__PURE__ */ jsxs("button", { onClick: () => setStatus(task.id, "in_progress"), className: "flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: [
      /* @__PURE__ */ jsx(Play, { size: 11 }),
      " ",
      t("start")
    ] });
    if (task.status === "in_progress") return /* @__PURE__ */ jsxs("button", { onClick: () => setStatus(task.id, "completed"), className: "flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: "#2F7D4F", color: "white" }, children: [
      /* @__PURE__ */ jsx(CheckCircle2, { size: 11 }),
      " ",
      t("markDone")
    ] });
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: "#E4F3EA", color: "#2F7D4F" }, children: [
        /* @__PURE__ */ jsx(CheckCircle2, { size: 11 }),
        " ",
        t("completed")
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => setStatus(task.id, "in_progress"), className: "text-[11px] underline", style: { color: "#8A97A3" }, children: t("reopen") })
    ] });
  }
  function TaskCard(task, showDept, numberIdx) {
    const isExpanded = expandedId === task.id;
    const pr = PRIORITY[task.priority] || PRIORITY.medium;
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
            numberIdx != null && /* @__PURE__ */ jsxs("span", { className: "text-xs font-black", style: { color: "#8A97A3" }, children: [
              numberIdx,
              "."
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-base font-black", style: { color: "#16222E" }, children: task.title }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold px-2 py-0.5 rounded-full", style: { background: pr.bg, color: pr.color }, children: pr[lang] || pr.ar }),
            showDept && /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold px-2 py-0.5 rounded-full", style: { background: deptColor(task.department).bg, color: deptColor(task.department).text }, children: task.department }),
            task.type === "private" && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full", style: { background: "#FBEEDF", color: "#B25E09" }, children: [
              /* @__PURE__ */ jsx(Lock, { size: 11 }),
              " ",
              t("private")
            ] }),
            task.recurrenceGroupId && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full", style: { background: "#E9F3FB", color: "#0E7490" }, children: [
              /* @__PURE__ */ jsx(Repeat, { size: 11 }),
              " ",
              t("recurringBadge")
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: "#5B6B79" }, children: (task.dates || []).join(", ") || `${task.startDate} \u2192 ${task.endDate}` })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
          canManage && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("button", { onClick: () => startEditTask(task), className: "w-7 h-7 rounded-md flex items-center justify-center", style: { color: "#5B6B79" }, children: /* @__PURE__ */ jsx(Pencil, { size: 14 }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => deleteTask(task.id), className: "w-7 h-7 rounded-md flex items-center justify-center", style: { color: "#C0392B" }, children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setExpandedId(isExpanded ? null : task.id), className: "w-7 h-7 rounded-md flex items-center justify-center", style: { color: "#1F4E79" }, children: isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { size: 16 }) : /* @__PURE__ */ jsx(ChevronDown, { size: 16 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 pt-3 flex items-center gap-2", style: { borderTop: "1px solid #EEF1F4" }, children: StatusControl(task) }),
      isExpanded && /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-3 flex flex-col gap-2 text-xs", style: { borderTop: "1px solid #EEF1F4", color: "#5B6B79" }, children: [
        task.description && /* @__PURE__ */ jsx("p", { children: task.description }),
        /* @__PURE__ */ jsxs("p", { children: [
          t("createdByLbl"),
          " ",
          /* @__PURE__ */ jsx("b", { style: { color: "#16222E" }, children: personLabel(task.createdBy) }),
          " \u2014 ",
          task.createdAt
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          t("assignedToLbl"),
          " ",
          /* @__PURE__ */ jsx("b", { style: { color: "#16222E" }, children: task.assignees.map((id) => personLabel(id)).join(", ") || "\u2014" })
        ] }),
        task.recurrence && task.recurrence.type !== "none" && /* @__PURE__ */ jsxs("p", { children: [
          t("recurrence"),
          ": ",
          /* @__PURE__ */ jsx("b", { style: { color: "#16222E" }, children: task.recurrence.type === "daily" ? t("recDaily") : task.recurrence.type === "weekly" ? task.recurrence.weekdays.join(", ") : task.recurrence.monthDays.join(", ") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-col gap-2", children: [
          task.comments.map((c) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-3 py-2", style: { background: "#F4F6F8" }, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-0.5", children: [
              /* @__PURE__ */ jsx("b", { style: { color: "#16222E" }, children: c.author }),
              /* @__PURE__ */ jsx("span", { style: { color: "#8A97A3" }, children: c.at })
            ] }),
            /* @__PURE__ */ jsx("p", { children: c.text })
          ] }, c.id)),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx("input", { value: commentDraft, onChange: (e) => setCommentDraft(e.target.value), onKeyDown: (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addComment(task.id);
              }
            }, placeholder: `${t("commentPH")} ${actingAs}...`, className: "flex-1 text-xs outline-none", style: { ...inputStyle, padding: "8px 10px" } }),
            /* @__PURE__ */ jsx("button", { onClick: () => addComment(task.id), className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0", style: { background: "#1F4E79" }, children: /* @__PURE__ */ jsx(Send, { size: 13, color: "white" }) })
          ] })
        ] })
      ] })
    ] }, task.id);
  }
  function AlertsBlock() {
    if (alerts.length === 0) return null;
    return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 mb-4", children: alerts.map((tk) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-3.5 flex flex-col gap-2", style: { background: "#FFF6EB", border: "1px solid #F0C57A" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(AlertTriangle2, { size: 16, color: "#B25E09" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm", style: { color: "#5B4321" }, children: [
            t("dueSoon"),
            " ",
            /* @__PURE__ */ jsxs("span", { className: "text-base font-black", children: [
              "\xAB",
              tk.title,
              "\xBB"
            ] }),
            " \u2014 ",
            t("isDone")
          ] })
        ] }),
        extendingAlertId !== tk.id && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setStatus(tk.id, "completed"), className: "text-xs font-bold px-3 py-1.5 rounded-lg", style: { background: "#2F7D4F", color: "white" }, children: t("yesDone") }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setExtendingAlertId(tk.id);
            setExtendDate(tk.endDate);
            setExtendComment("");
          }, className: "text-xs font-bold px-3 py-1.5 rounded-lg", style: { background: "#FFFFFF", color: "#5B6B79", border: "1px solid #E2E8ED" }, children: t("postpone") })
        ] })
      ] }),
      extendingAlertId === tk.id && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 mt-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
          /* @__PURE__ */ jsx("input", { type: "date", value: extendDate, onChange: (e) => setExtendDate(e.target.value), className: "text-sm outline-none flex-1", style: inputStyle }),
          /* @__PURE__ */ jsx("textarea", { value: extendComment, onChange: (e) => setExtendComment(e.target.value), placeholder: t("postponeReasonReq"), rows: 2, className: "text-sm outline-none flex-[2] resize-none", style: inputStyle })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 self-start", children: [
          /* @__PURE__ */ jsx("button", { disabled: !extendComment.trim(), onClick: () => confirmExtend(tk.id), className: "text-xs font-bold px-4 py-1.5 rounded-lg", style: { background: extendComment.trim() ? "#1F4E79" : "#C3CBD1", color: "white" }, children: t("confirmPostpone") }),
          /* @__PURE__ */ jsx("button", { onClick: () => setExtendingAlertId(null), className: "text-xs font-bold px-4 py-1.5 rounded-lg", style: { background: "#FFFFFF", color: "#5B6B79", border: "1px solid #E2E8ED" }, children: t("back") })
        ] })
      ] })
    ] }, tk.id)) });
  }
  function MiniMonthGrid(monthDate, selectedDates, onToggle) {
    const mStart = startOfWeek(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1));
    const grid = Array.from({ length: 42 }, (_, i) => addDays(mStart, i));
    return /* @__PURE__ */ jsxs("div", { className: "rounded-lg overflow-hidden", style: { border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7", style: { background: "#F4F6F8" }, children: WEEKDAYS.map((w) => /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-center py-1.5", style: labelStyle, children: w }, w)) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7", children: grid.map((d) => {
        const ds = toISODate(d);
        const inMonth = d.getMonth() === monthDate.getMonth();
        const active = selectedDates.includes(ds);
        const isToday = ds === today;
        return /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onToggle(ds), className: "h-9 text-xs font-bold", style: { background: active ? "#1F4E79" : "#FFFFFF", color: active ? "white" : inMonth ? "#16222E" : "#C3CBD1", border: isToday && !active ? "1px solid #1F4E79" : "1px solid #EEF1F4" }, children: d.getDate() }, ds);
      }) })
    ] });
  }
  function TaskFormPanel() {
    return /* @__PURE__ */ jsxs("form", { ref: formRef, onSubmit: submitTask, className: "rounded-xl p-4 mb-4 flex flex-col gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: editingId ? t("editTask") : t("newTask") }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
          setShowTaskForm(false);
          setEditingId(null);
        }, children: /* @__PURE__ */ jsx(X, { size: 16, color: "#8A97A3" }) })
      ] }),
      /* @__PURE__ */ jsx("input", { value: taskForm.title, onChange: (e) => setTaskForm({ ...taskForm, title: e.target.value }), placeholder: t("taskTitle"), className: "w-full text-sm outline-none", style: inputStyle }),
      /* @__PURE__ */ jsx("textarea", { value: taskForm.description, onChange: (e) => setTaskForm({ ...taskForm, description: e.target.value }), placeholder: t("descOpt"), rows: 2, className: "w-full text-sm outline-none resize-none", style: inputStyle }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("department") }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5", children: departments.map((d) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => selectDeptForTask(d), className: "flex-1 flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-lg text-left", style: { background: taskForm.department === d ? "#1F4E79" : "#F4F6F8", color: taskForm.department === d ? "white" : "#5B6B79" }, children: d }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => openCustomizeForTask(d), className: "text-xs font-bold px-3 py-2 rounded-lg shrink-0", style: { background: customizeDept === d ? "#B25E09" : "#F4F6F8", color: customizeDept === d ? "white" : "#5B6B79" }, children: t("customize") })
        ] }, d)) }),
        customizeDept && /* @__PURE__ */ jsx("div", { className: "mt-2 p-2 rounded-lg flex flex-wrap gap-2", style: { background: "#F9FAFB", border: "1px solid #EEF1F4" }, children: departmentOperators(customizeDept).filter((p) => !p.onLeave).map((p) => {
          const active = taskForm.assignees.includes(p.id);
          return /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toggleAssignee(p.id), className: "text-xs font-bold px-3 py-1.5 rounded-full", style: { background: active ? "#1F4E79" : "#FFFFFF", color: active ? "white" : "#5B6B79", border: "1px solid " + (active ? "#1F4E79" : "#E2E8ED") }, children: p.name }, p.id);
        }) }),
        /* @__PURE__ */ jsxs("p", { className: "text-[11px] mt-1", style: { color: "#8A97A3" }, children: [
          taskForm.assignees.length,
          " ",
          t("assignees")
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex gap-2", children: [
          /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setTaskForm({ ...taskForm, type: "public" }), className: "flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg font-bold", style: { background: taskForm.type === "public" ? "#1F4E79" : "#F4F6F8", color: taskForm.type === "public" ? "white" : "#5B6B79" }, children: [
            /* @__PURE__ */ jsx(Globe2, { size: 14 }),
            " ",
            t("public")
          ] }),
          /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setTaskForm({ ...taskForm, type: "private" }), className: "flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg font-bold", style: { background: taskForm.type === "private" ? "#B25E09" : "#F4F6F8", color: taskForm.type === "private" ? "white" : "#5B6B79" }, children: [
            /* @__PURE__ */ jsx(Lock, { size: 14 }),
            " ",
            t("private")
          ] })
        ] }),
        taskForm.type === "private" && /* @__PURE__ */ jsx("select", { value: taskForm.privateTo, onChange: (e) => setTaskForm({ ...taskForm, privateTo: Number(e.target.value) }), className: "flex-1 text-sm outline-none", style: inputStyle, children: people.filter((p) => !p.isAdmin).map((p) => /* @__PURE__ */ jsxs("option", { value: p.id, children: [
          p.name,
          " - ",
          p.role
        ] }, p.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("priority") }),
        /* @__PURE__ */ jsx("select", { value: taskForm.priority, onChange: (e) => setTaskForm({ ...taskForm, priority: e.target.value }), className: "w-full text-sm outline-none", style: inputStyle, children: Object.entries(PRIORITY).map(([k, v]) => /* @__PURE__ */ jsx("option", { value: k, children: v[lang] || v.ar }, k)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => {
          setTaskCalOpen((o) => !o);
          setTaskRecOpen(false);
        }, className: "flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-lg", style: { background: taskCalOpen ? "#1F4E79" : "#F4F6F8", color: taskCalOpen ? "white" : "#5B6B79" }, children: [
          /* @__PURE__ */ jsx(CalendarDays2, { size: 15 }),
          " ",
          taskForm.dates.length,
          " ",
          t("datesSelected")
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => {
          setTaskRecOpen((o) => !o);
          setTaskCalOpen(false);
        }, className: "flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-lg", style: { background: taskRecOpen || taskForm.recurrence.type !== "none" ? "#1F4E79" : "#F4F6F8", color: taskRecOpen || taskForm.recurrence.type !== "none" ? "white" : "#5B6B79" }, children: [
          /* @__PURE__ */ jsx(Repeat, { size: 15 }),
          " ",
          t("recurrence")
        ] })
      ] }),
      taskCalOpen && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setTaskCalMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)), className: "text-xs font-bold px-2 py-1 rounded", style: { background: "#F4F6F8" }, children: t("prev") }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold", style: { color: "#16222E" }, children: [
            MONTHS[taskCalMonth.getMonth()],
            " ",
            taskCalMonth.getFullYear()
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setTaskCalMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)), className: "text-xs font-bold px-2 py-1 rounded", style: { background: "#F4F6F8" }, children: t("next") })
        ] }),
        MiniMonthGrid(taskCalMonth, taskForm.dates, toggleTaskDate)
      ] }),
      taskRecOpen && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: [["none", t("recNone")], ["daily", t("recDaily")], ["weekly", t("recWeekly")], ["monthly", t("recMonthly")]].map(([k, l]) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setTaskForm({ ...taskForm, recurrence: { ...taskForm.recurrence, type: k } }), className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: taskForm.recurrence.type === k ? "#1F4E79" : "#F4F6F8", color: taskForm.recurrence.type === k ? "white" : "#5B6B79" }, children: l }, k)) }),
        taskForm.recurrence.type === "weekly" && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: WEEKDAYS.map((w) => {
          const active = taskForm.recurrence.weekdays.includes(w);
          return /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toggleRecWeekday(w), className: "text-xs font-bold px-2.5 py-1 rounded-full", style: { background: active ? "#1F4E79" : "#F4F6F8", color: active ? "white" : "#5B6B79" }, children: w }, w);
        }) }),
        taskForm.recurrence.type === "monthly" && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1", children: Array.from({ length: 31 }, (_, i) => i + 1).map((n) => {
          const active = taskForm.recurrence.monthDays.includes(n);
          return /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toggleRecMonthDay(n), className: "text-[11px] font-bold py-1.5 rounded", style: { background: active ? "#1F4E79" : "#F4F6F8", color: active ? "white" : "#5B6B79" }, children: n }, n);
        }) })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "text-sm font-bold py-2.5 rounded-lg", style: { background: "#16222E", color: "white" }, children: editingId ? t("save") : t("addTaskBtn") })
    ] });
  }
  function ProblemFormPanel() {
    return /* @__PURE__ */ jsxs("form", { ref: formRef, onSubmit: (e) => {
      e.preventDefault();
      runWithBusy("submitProblem", () => submitProblem(e));
    }, className: "rounded-xl p-4 mb-4 flex flex-col gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: editingProblemId ? t("editReport") : t("newReport") }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
          setShowProblemForm(false);
          setEditingProblemId(null);
        }, children: /* @__PURE__ */ jsx(X, { size: 16, color: "#8A97A3" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("tagNumber") }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", dir: "ltr", children: [
          /* @__PURE__ */ jsx("input", { value: problemForm.tag1, onChange: (e) => {
            const v = e.target.value.replace(/[^0-9]/g, "");
            setProblemForm({ ...problemForm, tag1: v, unitName: v ? `Unit ${v}` : "" });
          }, onKeyDown: (e) => handleTagKey(e, tagRef2), placeholder: "301", maxLength: 4, className: "w-16 text-sm font-bold text-center outline-none", style: inputStyle }),
          /* @__PURE__ */ jsx("span", { style: { color: "#8A97A3" }, children: "-" }),
          /* @__PURE__ */ jsx("input", { ref: tagRef2, value: problemForm.tag2, onChange: (e) => setProblemForm({ ...problemForm, tag2: e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase() }), onKeyDown: (e) => handleTagKey(e, tagRef3), placeholder: "HC", maxLength: 4, className: "w-16 text-sm font-bold text-center outline-none", style: inputStyle }),
          /* @__PURE__ */ jsx("span", { style: { color: "#8A97A3" }, children: "-" }),
          /* @__PURE__ */ jsx("input", { ref: tagRef3, value: problemForm.tag3, onChange: (e) => setProblemForm({ ...problemForm, tag3: e.target.value.toUpperCase() }), placeholder: "01A", maxLength: 8, className: "w-24 text-sm font-bold text-center outline-none", style: { ...inputStyle, textTransform: "uppercase" } })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("unitName") }),
        /* @__PURE__ */ jsx("input", { value: problemForm.unitName, onChange: (e) => setProblemForm({ ...problemForm, unitName: e.target.value }), placeholder: t("unitName"), className: "w-full text-sm outline-none", style: { ...inputStyle, background: "#EEF1F4" } })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("equipmentName") }),
        /* @__PURE__ */ jsx("input", { value: problemForm.equipmentName, onChange: (e) => setProblemForm({ ...problemForm, equipmentName: e.target.value }), placeholder: t("equipmentName"), className: "w-full text-base font-black outline-none", style: inputStyle })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("problemTitle") }),
        /* @__PURE__ */ jsx("input", { value: problemForm.title, onChange: (e) => setProblemForm({ ...problemForm, title: e.target.value }), placeholder: t("problemTitle"), className: "w-full text-sm outline-none", style: inputStyle })
      ] }),
      /* @__PURE__ */ jsx("textarea", { value: problemForm.description, onChange: (e) => setProblemForm({ ...problemForm, description: e.target.value }), placeholder: t("descProblem"), rows: 3, className: "w-full text-sm outline-none resize-none", style: inputStyle }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("location") }),
        /* @__PURE__ */ jsx("select", { value: problemForm.location, onChange: (e) => setProblemForm({ ...problemForm, location: e.target.value }), className: "w-full text-sm outline-none", style: inputStyle, children: LOCATIONS.map((l) => /* @__PURE__ */ jsx("option", { children: l }, l)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("maintDept") }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: PROBLEM_CATEGORIES.map((c) => {
          const active = problemForm.categories.includes(c);
          return /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toggleCategory(c), className: "text-xs font-bold px-3 py-1.5 rounded-full", style: { background: active ? "#1F4E79" : "#F4F6F8", color: active ? "white" : "#5B6B79", border: "1px solid " + (active ? "#1F4E79" : "#E2E8ED") }, children: c }, c);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-xs font-bold block mb-1", style: labelStyle, children: t("priority") }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: Object.entries(PRIORITY).map(([k, v]) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setProblemForm({ ...problemForm, priority: k }), className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: problemForm.priority === k ? v.color : "#F4F6F8", color: problemForm.priority === k ? "white" : "#5B6B79", border: "1px solid " + (problemForm.priority === k ? v.color : "#E2E8ED") }, children: v[lang] || v.ar }, k)) })
      ] }),
      !editingProblemId && /* @__PURE__ */ jsx("p", { className: "text-xs", style: labelStyle, children: canManage ? t("autoRouteSup") : t("autoRouteOp") }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "text-sm font-bold py-2.5 rounded-lg", style: { background: "#16222E", color: "white" }, children: BtnContent("submitProblem", editingProblemId ? t("saveEdit") : t("sendReport")) })
    ] });
  }
  function DayModal() {
    if (!selectedCalDay) return null;
    const dt = tasksOnDate(selectedCalDay);
    return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(22,34,46,0.45)" }, onClick: () => {
      setSelectedCalDay(null);
      setDayModalAddOpen(false);
    }, children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm rounded-xl p-4 max-h-[80vh] overflow-y-auto", style: { background: "#FFFFFF" }, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-black", style: { color: "#16222E" }, children: selectedCalDay }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          setSelectedCalDay(null);
          setDayModalAddOpen(false);
        }, children: /* @__PURE__ */ jsx(X, { size: 18, color: "#8A97A3" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 mb-3", children: [
        dt.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: "#8A97A3" }, children: t("noTasksDay") }),
        dt.map((tk, i) => /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold px-3 py-2 rounded-lg", style: { background: deptColor(tk.department).bg, color: deptColor(tk.department).text }, children: [
          i + 1,
          ". ",
          tk.title
        ] }, tk.id))
      ] }),
      canManage && !dayModalAddOpen && /* @__PURE__ */ jsxs("button", { onClick: () => quickAddForDay(selectedCalDay), className: "w-full flex items-center justify-center gap-1.5 text-sm font-bold py-2 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: [
        /* @__PURE__ */ jsx(Plus, { size: 15 }),
        " ",
        t("addTaskForDay")
      ] }),
      dayModalAddOpen && TaskFormPanel()
    ] }) });
  }
  function CalendarOverlay() {
    function filterBySearch(list) {
      if (!calSearch.trim()) return list;
      const q = calSearch.toLowerCase();
      return list.filter((tk) => tk.title.toLowerCase().includes(q));
    }
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", style: { animation: "fadeSlideUp 240ms ease-out" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("calendar") }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setCalSearchOpen((o) => !o), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: calSearchOpen ? "#1F4E79" : "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx(Search, { size: 16, color: calSearchOpen ? "white" : "#16222E" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setActiveOverlay(null), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx(X, { size: 16, color: "#16222E" }) })
        ] })
      ] }),
      calSearchOpen && /* @__PURE__ */ jsx("input", { autoFocus: true, value: calSearch, onChange: (e) => setCalSearch(e.target.value), placeholder: t("searchTaskPH"), className: "w-full text-sm outline-none", style: inputStyle }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setCalMode("week"), className: "flex-1 text-base font-black py-3 rounded-xl", style: { background: calMode === "week" ? "#1F4E79" : "#FFFFFF", color: calMode === "week" ? "white" : "#5B6B79", border: "1px solid " + (calMode === "week" ? "#1F4E79" : "#DCE3E8") }, children: t("weeklyBtn") }),
        /* @__PURE__ */ jsx("button", { onClick: () => setCalMode("month"), className: "flex-1 text-base font-black py-3 rounded-xl", style: { background: calMode === "month" ? "#1F4E79" : "#FFFFFF", color: calMode === "month" ? "white" : "#5B6B79", border: "1px solid " + (calMode === "month" ? "#1F4E79" : "#DCE3E8") }, children: t("monthlyBtn") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-3 flex items-center justify-between", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
        /* @__PURE__ */ jsx("button", { onClick: () => navigateCal(-1), className: "text-sm font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8" }, children: t("prev") }),
        /* @__PURE__ */ jsx("button", { onClick: () => setCalDate(/* @__PURE__ */ new Date()), className: "text-sm font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8" }, children: calMode === "week" ? t("currentWeek") : t("currentMonth") }),
        /* @__PURE__ */ jsx("button", { onClick: () => navigateCal(1), className: "text-sm font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8" }, children: t("next") })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-sm font-black text-center", style: { color: "#16222E" }, children: calLabel() }),
      calMode === "week" && weekDays.map((d) => {
        const ds = toISODate(d);
        const dt = filterBySearch(tasksOnDate(ds));
        const isToday = ds === today;
        return /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-3", style: { background: "#FFFFFF", border: "1px solid " + (isToday ? "#1F4E79" : "#DCE3E8") }, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-black", style: { color: isToday ? "#1F4E79" : "#16222E" }, children: [
              WEEKDAYS[d.getDay() === 6 ? 0 : d.getDay() + 1],
              " \u2014 ",
              d.getDate()
            ] }),
            isToday && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full", style: { background: "#E6EEF5", color: "#1F4E79" }, children: t("today") })
          ] }),
          dt.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: "#C3CBD1" }, children: t("noTasks") }) : /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5", children: dt.map((tk, i) => /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold px-2 py-1.5 rounded-lg", style: { background: deptColor(tk.department).bg, color: deptColor(tk.department).text }, children: [
            i + 1,
            ". ",
            tk.title
          ] }, tk.id)) })
        ] }, ds);
      }),
      calMode === "month" && /* @__PURE__ */ jsxs("div", { className: "rounded-xl overflow-hidden", style: { border: "1px solid #DCE3E8" }, children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7", style: { background: "#F4F6F8" }, children: WEEKDAYS.map((w) => /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold text-center py-2", style: labelStyle, children: w }, w)) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7", children: daysInMonthGrid.map((d) => {
          const ds = toISODate(d);
          const dt = filterBySearch(tasksOnDate(ds));
          const inMonth = d.getMonth() === calDate.getMonth();
          const isToday = ds === today;
          return /* @__PURE__ */ jsxs("div", { onClick: () => openDay(ds), className: "min-h-[90px] p-1.5 cursor-pointer", style: { background: inMonth ? "#FFFFFF" : "#F9FAFB", borderTop: "1px solid #EEF1F4", borderRight: "1px solid #EEF1F4" }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold mb-1", style: { color: isToday ? "#1F4E79" : inMonth ? "#16222E" : "#C3CBD1" }, children: d.getDate() }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
              dt.slice(0, 2).map((tk, i) => /* @__PURE__ */ jsxs("div", { className: "text-[9px] font-bold px-1 py-0.5 rounded truncate", style: { background: deptColor(tk.department).bg, color: deptColor(tk.department).text }, children: [
                i + 1,
                ". ",
                tk.title
              ] }, tk.id)),
              dt.length > 2 && /* @__PURE__ */ jsxs("div", { className: "text-[9px]", style: { color: "#8A97A3" }, children: [
                "+",
                dt.length - 2
              ] })
            ] })
          ] }, ds);
        }) })
      ] }),
      DayModal()
    ] });
  }
  function LogOverlay() {
    const dateObj = new Date(selectedLogDate);
    const canGoNext = selectedLogDate < today;
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", style: { animation: "fadeSlideUp 240ms ease-out" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("eventList") }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setLogSearchOpen((o) => !o), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: logSearchOpen ? "#1F4E79" : "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx(Search, { size: 16, color: logSearchOpen ? "white" : "#16222E" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setActiveOverlay(null), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx(X, { size: 16, color: "#16222E" }) })
        ] })
      ] }),
      logSearchOpen && /* @__PURE__ */ jsx("input", { autoFocus: true, value: logSearch, onChange: (e) => setLogSearch(e.target.value), placeholder: t("searchLogPH"), className: "w-full text-sm outline-none", style: inputStyle }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setLogMode("day"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: logMode === "day" ? "#1F4E79" : "#FFFFFF", color: logMode === "day" ? "white" : "#5B6B79", border: "1px solid " + (logMode === "day" ? "#1F4E79" : "#DCE3E8") }, children: t("dayEvents") }),
        /* @__PURE__ */ jsx("button", { onClick: () => setLogMode("all"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: logMode === "all" ? "#1F4E79" : "#FFFFFF", color: logMode === "all" ? "white" : "#5B6B79", border: "1px solid " + (logMode === "all" ? "#1F4E79" : "#DCE3E8") }, children: t("allEvents") })
      ] }),
      logMode === "day" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-3 flex items-center justify-between", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setSelectedLogDate(toISODate(addDays(dateObj, -1))), className: "text-sm font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8" }, children: t("prev") }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-black", style: { color: "#16222E" }, children: [
            selectedLogDate,
            selectedLogDate === today ? ` (${t("today")})` : ""
          ] }),
          /* @__PURE__ */ jsx("button", { disabled: !canGoNext, onClick: () => setSelectedLogDate(toISODate(addDays(dateObj, 1))), className: "text-sm font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8", opacity: canGoNext ? 1 : 0.4 }, children: t("next") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          dayLogEntries.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noLogEntries") }),
          dayLogEntries.map((e, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-3.5 flex items-center gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center shrink-0", style: { background: e.kind === "task" ? "#E4F3EA" : "#FBE7E4" }, children: e.kind === "task" ? /* @__PURE__ */ jsx(CheckCircle2, { size: 16, color: "#2F7D4F" }) : /* @__PURE__ */ jsx(AlertTriangle2, { size: 16, color: "#C0392B" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", style: { color: "#16222E" }, children: e.title }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs mt-0.5", style: { color: "#8A97A3" }, children: [
                e.by,
                " \u2014 ",
                e.at
              ] })
            ] })
          ] }, i))
        ] })
      ] }),
      logMode === "all" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        allLogGrouped.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noLogEntries") }),
        allLogGrouped.map((g) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-black px-2.5 py-1 rounded-full", style: { background: "#EEF1F4", color: "#5B6B79" }, children: [
              g.dateISO,
              g.dateISO === today ? ` \xB7 ${t("today")}` : ""
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex-1", style: { borderTop: "1px solid #DCE3E8" } })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: g.items.map((e, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-3.5 flex items-center gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center shrink-0", style: { background: e.kind === "task" ? "#E4F3EA" : "#FBE7E4" }, children: e.kind === "task" ? /* @__PURE__ */ jsx(CheckCircle2, { size: 16, color: "#2F7D4F" }) : /* @__PURE__ */ jsx(AlertTriangle2, { size: 16, color: "#C0392B" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", style: { color: "#16222E" }, children: e.title }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs mt-0.5", style: { color: "#8A97A3" }, children: [
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
  function StaffOverlay() {
    const allStaff = people.filter((p) => !p.isAdmin);
    const filtered = staffTab === "all" ? allStaff : staffTab === "present" ? allStaff.filter((p) => !p.onLeave) : allStaff.filter((p) => p.onLeave);
    const shiftFiltered = staffTab === "present" ? filtered.filter((p) => (p.shift || "day") === presentShiftTab) : filtered;
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", style: { animation: "fadeSlideUp 240ms ease-out" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("staff") }),
        /* @__PURE__ */ jsx("button", { onClick: () => setActiveOverlay(null), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx(X, { size: 16, color: "#16222E" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: [["all", t("allStaff")], ["present", t("present")], ["leave", t("onLeave")]].map(([k, l]) => /* @__PURE__ */ jsx("button", { onClick: () => setStaffTab(k), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: staffTab === k ? "#1F4E79" : "#FFFFFF", color: staffTab === k ? "white" : "#5B6B79", border: "1px solid " + (staffTab === k ? "#1F4E79" : "#DCE3E8") }, children: l }, k)) }),
      staffTab === "present" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setPresentShiftTab("day"), className: "flex-1 text-sm font-bold py-2 rounded-lg", style: { background: presentShiftTab === "day" ? "#B25E09" : "#F4F6F8", color: presentShiftTab === "day" ? "white" : "#5B6B79" }, children: t("dayShift") }),
        /* @__PURE__ */ jsx("button", { onClick: () => setPresentShiftTab("night"), className: "flex-1 text-sm font-bold py-2 rounded-lg", style: { background: presentShiftTab === "night" ? "#1F4E79" : "#F4F6F8", color: presentShiftTab === "night" ? "white" : "#5B6B79" }, children: t("nightShift") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        departments.map((d) => {
          const list = shiftFiltered.filter((p) => p.department === d);
          if (list.length === 0) return null;
          return /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black mb-2 px-1", style: { color: deptColor(d).text }, children: [
              d,
              " (",
              list.length,
              ")"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: list.map((p) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-3.5 flex items-center justify-between gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                Avatar(p.department, 40),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", style: { color: "#16222E" }, children: p.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
                    p.employeeId,
                    " \xB7 ",
                    p.role
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-1.5 shrink-0", children: [
                canManage && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("button", { onClick: () => toggleLeave(p.id), className: "flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8", color: "#5B6B79", border: "1px solid #E2E8ED" }, children: [
                    /* @__PURE__ */ jsx(ArrowLeftRight, { size: 12 }),
                    " ",
                    p.onLeave ? t("moveToPresent") : t("moveToLeave")
                  ] }),
                  !p.onLeave && /* @__PURE__ */ jsxs("button", { onClick: () => toggleShift(p.id), className: "flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: "#F4F6F8", color: "#5B6B79", border: "1px solid #E2E8ED" }, children: [
                    /* @__PURE__ */ jsx(ArrowLeftRight, { size: 12 }),
                    " ",
                    p.shift === "night" ? t("moveToDayShift") : t("moveToNightShift")
                  ] })
                ] }),
                !canManage && /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold px-3 py-1.5 rounded-lg", style: { background: p.onLeave ? "#FBEEDF" : "#E4F3EA", color: p.onLeave ? "#B25E09" : "#2F7D4F" }, children: p.onLeave ? t("onLeave") : p.shift === "night" ? t("nightShift") : t("dayShift") })
              ] })
            ] }, p.id)) })
          ] }, d);
        }),
        shiftFiltered.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: "\u2014" })
      ] })
    ] });
  }
  function exportLogbook(kind) {
    showToast(lang === "ar" ? `\u0633\u064A\u062A\u0645 \u062A\u0635\u062F\u064A\u0631 \u0633\u062C\u0644 \u0627\u0644\u0648\u0631\u062F\u064A\u0629 \u0628\u0635\u064A\u063A\u0629 ${kind === "pdf" ? "PDF" : "Word"} \u2014 \u0647\u0630\u0647 \u0627\u0644\u0645\u064A\u0632\u0629 \u0633\u062A\u064F\u0641\u0639\u0651\u0644 \u0639\u0646\u062F \u0631\u0628\u0637 \u0627\u0644\u062E\u0627\u062F\u0645.` : `Logbook will export as ${kind === "pdf" ? "PDF" : "Word"} \u2014 this will be enabled once the backend is connected.`, "info");
  }
  function logbookKey(dept) {
    return (dept || viewer.department) + "_" + today;
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
  function LogbookOverlay() {
    function deptContent(dept) {
      const dTasks = tasks.filter((tk) => tk.department === dept && visibleToViewer(tk));
      const dProblems = problems.filter((p) => p.department === dept);
      const pendingSections = [
        { key: "pendingTasks", list: dTasks.filter((tk) => tk.status !== "completed"), render: (tk, i) => TaskCard(tk, false, i + 1) },
        { key: "pendingProblems", list: dProblems.filter((p) => p.workStatus !== "resolved"), render: (p) => ProblemCard(p) }
      ];
      const generalSections = [
        { key: "generalTasks", list: dTasks.filter((tk) => tk.status === "completed" && tk.completedAt === today), render: (tk, i) => TaskCard(tk, false, i + 1) },
        { key: "generalProblems", list: dProblems.filter((p) => p.workStatus === "resolved" && p.dateISO === today), render: (p) => ProblemCard(p) }
      ];
      const allEmpty = [...pendingSections, ...generalSections].every((s) => s.list.length === 0);
      return { pendingSections, generalSections, allEmpty };
    }
    function Content({ dept }) {
      const { pendingSections, generalSections, allEmpty } = deptContent(dept);
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        [["pendingIssuesTasksSec", pendingSections], ["generalSec", generalSections]].map(([labelKey, secs]) => secs.some((s) => s.list.length > 0) && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-black mb-2 px-1", style: { color: "#16222E" }, children: t(labelKey) }),
          secs.map((s) => s.list.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2.5 mb-2", children: s.list.map((item, i) => s.render(item, i)) }, s.key))
        ] }, labelKey)),
        allEmpty && /* @__PURE__ */ jsx("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("logbookEmpty") })
      ] });
    }
    function SummaryBlock({ dept }) {
      const key = logbookKey(dept);
      const entry = logbookNotes[key];
      const isApproved = entry && entry.reviewStatus === "approved";
      const draftVal = logbookSummaryDraft[key] ?? entry?.summary ?? "";
      return /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4 flex flex-col gap-2.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", style: { color: "#16222E" }, children: t("logbookSummaryLbl") }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black px-2 py-0.5 rounded-full", style: { background: isApproved ? "#E4F3EA" : "#FBEEDF", color: isApproved ? "#2F7D4F" : "#B25E09" }, children: isApproved ? t("logbookApprovedBadge") : t("logbookDraftBadge") })
        ] }),
        /* @__PURE__ */ jsx("textarea", { value: draftVal, onChange: (e) => setLogbookSummaryDraft((prev) => ({ ...prev, [key]: e.target.value })), placeholder: t("logbookSummaryPH"), rows: 3, className: "w-full text-sm outline-none resize-none", style: inputStyle }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => saveLogbookDraft(dept), className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: "#F4F6F8", border: "1px solid #DCE3E8", color: "#16222E" }, children: t("saveDraftBtn") }),
          /* @__PURE__ */ jsx("button", { onClick: () => runWithBusy("approveLogbook_" + dept, () => approveLogbook(dept)), className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: "#2F7D4F", color: "white" }, children: BtnContent("approveLogbook_" + dept, t("approveLogbookBtn")) })
        ] }),
        isApproved && /* @__PURE__ */ jsxs("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
          t("logbookApprovedBy"),
          " ",
          entry.approvedBy,
          " \u2014 ",
          entry.approvedAt
        ] })
      ] });
    }
    const ownEntry = logbookNotes[logbookKey(viewer.department)];
    const ownApproved = ownEntry && ownEntry.reviewStatus === "approved";
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", style: { animation: "fadeSlideUp 240ms ease-out" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("logbook") }),
        /* @__PURE__ */ jsx("button", { onClick: () => setActiveOverlay(null), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx(X, { size: 16, color: "#16222E" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: "#8A97A3" }, children: t("logbookDesc") }),
      isShiftSupervisor && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => exportLogbook("pdf"), className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 rounded-lg", style: { background: "#FFFFFF", border: "1px solid #DCE3E8", color: "#16222E" }, children: [
            /* @__PURE__ */ jsx(Download, { size: 15 }),
            " ",
            t("exportPdf")
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => exportLogbook("word"), className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 rounded-lg", style: { background: "#FFFFFF", border: "1px solid #DCE3E8", color: "#16222E" }, children: [
            /* @__PURE__ */ jsx(Download, { size: 15 }),
            " ",
            t("exportWord")
          ] })
        ] }),
        departments.map((dept) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2.5 pb-3", style: { borderBottom: "1px solid #EEF1F4" }, children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-black px-1", style: { color: deptColor(dept).text }, children: dept }),
          /* @__PURE__ */ jsx(Content, { dept }),
          /* @__PURE__ */ jsx(SummaryBlock, { dept })
        ] }, dept))
      ] }),
      !isShiftSupervisor && canManage && (ownApproved ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4", style: { background: "#E4F3EA" }, children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold mb-1", style: { color: "#2F7D4F" }, children: t("logbookSummaryLbl") }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "#16222E" }, children: ownEntry.summary }),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] mt-1.5", style: { color: "#5B6B79" }, children: [
            t("logbookApprovedBy"),
            " ",
            ownEntry.approvedBy,
            " \u2014 ",
            ownEntry.approvedAt
          ] })
        ] }),
        /* @__PURE__ */ jsx(Content, { dept: viewer.department })
      ] }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("logbookAwaitingApproval") })),
      !canManage && /* @__PURE__ */ jsx(Content, { dept: viewer.department })
    ] });
  }
  function ReadingsOverlay() {
    const deptReadings = readingsVisibleToViewer.filter((r) => r.dateISO === readingsViewDate);
    const canSubmitReading = viewerRole === "operator" || canManage;
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", style: { animation: "fadeSlideUp 240ms ease-out" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("readings") }),
        /* @__PURE__ */ jsx("button", { onClick: () => setActiveOverlay(null), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx(X, { size: 16, color: "#16222E" }) })
      ] }),
      canSubmitReading && /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4 flex flex-col gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: t("newReading") }),
        !readingAttachment ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-3 rounded-lg cursor-pointer", style: { background: "#F4F6F8", color: "#16222E", border: "1px dashed #DCE3E8" }, children: [
            /* @__PURE__ */ jsx(Download, { size: 16, style: { transform: "rotate(180deg)" } }),
            " ",
            t("attachReadingFile"),
            /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*,.pdf", className: "hidden", onChange: handleReadingFile })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-3 rounded-lg cursor-pointer", style: { background: "#F4F6F8", color: "#16222E", border: "1px dashed #DCE3E8" }, children: [
            /* @__PURE__ */ jsx(Activity2, { size: 16 }),
            " ",
            t("takePhoto"),
            /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", capture: "environment", className: "hidden", onChange: handleReadingFile })
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "rounded-lg p-2.5 flex items-center gap-3", style: { background: "#F4F6F8" }, children: [
          readingAttachment.isImage ? /* @__PURE__ */ jsx("img", { src: readingAttachment.dataUrl, alt: "", className: "w-14 h-14 rounded-lg object-cover shrink-0" }) : /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-lg flex items-center justify-center shrink-0", style: { background: "#E6EEF5" }, children: /* @__PURE__ */ jsx(FileText2, { size: 22, color: "#1F4E79" }) }),
          /* @__PURE__ */ jsx("p", { className: "flex-1 text-xs font-bold truncate", style: { color: "#16222E" }, children: readingAttachment.name }),
          /* @__PURE__ */ jsx("button", { onClick: () => setReadingAttachment(null), className: "text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0", style: { background: "#FBE7E4", color: "#C0392B" }, children: t("removeFile") })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold", style: labelStyle, children: t("notesSectionTitle") }),
            !showNoteForm && /* @__PURE__ */ jsxs("button", { onClick: () => setShowNoteForm(true), className: "flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: [
              /* @__PURE__ */ jsx(Plus, { size: 13 }),
              " ",
              t("addNoteBtn")
            ] })
          ] }),
          readingNotesDraft.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5 mb-2", children: readingNotesDraft.map((n) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg p-2.5 flex items-start justify-between gap-2", style: { background: SEVERITY[n.severity].bg }, children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 flex-wrap mb-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black px-2 py-0.5 rounded-full", style: { background: SEVERITY[n.severity].color, color: "white" }, children: SEVERITY[n.severity][lang] || SEVERITY[n.severity].ar }),
                n.equipmentName && /* @__PURE__ */ jsx("b", { className: "text-xs", style: { color: "#16222E" }, children: n.equipmentName }),
                n.tagNumber && /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold", dir: "ltr", style: { color: "#1F4E79" }, children: n.tagNumber })
              ] }),
              n.unitName && /* @__PURE__ */ jsxs("p", { className: "text-[11px]", style: { color: "#5B6B79" }, children: [
                t("unitNameLbl"),
                ": ",
                n.unitName
              ] }),
              n.description && /* @__PURE__ */ jsx("p", { className: "text-xs mt-0.5", style: { color: "#5B6B79" }, children: n.description })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => removeNoteDraft(n.id), className: "shrink-0", children: /* @__PURE__ */ jsx(X, { size: 14, color: "#8A97A3" }) })
          ] }, n.id)) }),
          showNoteForm && /* @__PURE__ */ jsxs("div", { className: "rounded-lg p-3 flex flex-col gap-2 mt-1", style: { background: "#F4F6F8" }, children: [
            /* @__PURE__ */ jsx("input", { value: noteDraft.unitName, onChange: (e) => setNoteDraft({ ...noteDraft, unitName: e.target.value }), placeholder: t("unitNameLbl"), className: "w-full text-sm outline-none", style: inputStyle }),
            /* @__PURE__ */ jsx("input", { value: noteDraft.equipmentName, onChange: (e) => setNoteDraft({ ...noteDraft, equipmentName: e.target.value }), placeholder: t("equipmentName"), className: "w-full text-sm outline-none", style: inputStyle }),
            /* @__PURE__ */ jsx("input", { value: noteDraft.tagNumber, onChange: (e) => setNoteDraft({ ...noteDraft, tagNumber: e.target.value }), placeholder: t("tagNumberLbl"), dir: "ltr", className: "w-full text-sm outline-none", style: inputStyle }),
            /* @__PURE__ */ jsx("textarea", { value: noteDraft.description, onChange: (e) => setNoteDraft({ ...noteDraft, description: e.target.value }), placeholder: t("descProblem"), rows: 2, className: "w-full text-sm outline-none resize-none", style: inputStyle }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-bold mb-1", style: labelStyle, children: t("severityLabel") }),
              /* @__PURE__ */ jsx("div", { className: "flex gap-1.5", children: Object.entries(SEVERITY).map(([k, v]) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setNoteDraft({ ...noteDraft, severity: k }), className: "flex-1 text-[11px] font-bold py-2 rounded-lg", style: { background: noteDraft.severity === k ? v.color : "#FFFFFF", color: noteDraft.severity === k ? "white" : "#5B6B79", border: "1px solid " + (noteDraft.severity === k ? v.color : "#E2E8ED") }, children: v[lang] || v.ar }, k)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => setShowNoteForm(false), className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: "#FFFFFF", border: "1px solid #DCE3E8", color: "#5B6B79" }, children: t("cancel") }),
              /* @__PURE__ */ jsx("button", { onClick: addNoteDraft, className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: "#16222E", color: "white" }, children: t("addNoteBtn") })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => runWithBusy("saveReading", saveReading), disabled: !readingAttachment && readingNotesDraft.length === 0, className: "text-sm font-bold py-2.5 rounded-lg", style: { background: "#1F4E79", color: "white", opacity: !readingAttachment && readingNotesDraft.length === 0 ? 0.5 : 1 }, children: BtnContent("saveReading", t("saveReadingBtn")) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl p-2.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setReadingsViewDate((d) => shiftISODate(d, -1)), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx(ChevronUp, { size: 16, style: { transform: "rotate(-90deg)" }, color: "#16222E" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-black", style: { color: "#16222E" }, children: readingsViewDate === today ? t("todayLbl") : readingsViewDate }),
        /* @__PURE__ */ jsx("button", { onClick: () => setReadingsViewDate((d) => shiftISODate(d, 1)), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx(ChevronUp, { size: 16, style: { transform: "rotate(90deg)" }, color: "#16222E" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold mb-2 px-1", style: labelStyle, children: t("previousReadings") }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2.5", children: [
          deptReadings.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noReadingsYet") }),
          deptReadings.map((r) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-3.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[11px] mb-1.5", style: { color: "#8A97A3" }, children: [
              t("enteredByLbl"),
              " ",
              /* @__PURE__ */ jsx("b", { style: { color: "#16222E" }, children: personLabel(r.enteredBy) }),
              " \u2014 ",
              r.createdAt
            ] }),
            r.attachment && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              r.attachment.isImage ? /* @__PURE__ */ jsx("img", { src: r.attachment.dataUrl, alt: "", className: "w-12 h-12 rounded-lg object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg flex items-center justify-center", style: { background: "#E6EEF5" }, children: /* @__PURE__ */ jsx(FileText2, { size: 18, color: "#1F4E79" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-xs", style: { color: "#5B6B79" }, children: r.attachment.name })
            ] }),
            r.notes.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5", children: r.notes.map((n) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 flex-wrap", style: { background: SEVERITY[n.severity].bg }, children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black px-1.5 py-0.5 rounded-full", style: { background: SEVERITY[n.severity].color, color: "white" }, children: SEVERITY[n.severity][lang] || SEVERITY[n.severity].ar }),
              /* @__PURE__ */ jsx("span", { className: "text-xs", style: { color: "#16222E" }, children: n.equipmentName || n.description })
            ] }, n.id)) }),
            ReviewBlock(r, reviewReading, r.enteredBy)
          ] }, r.id))
        ] })
      ] })
    ] });
  }
  function ReportsOverlay() {
    const dayReports = reportsVisibleToViewer.filter((r) => r.dateISO === reportsViewDate && r.reportKind === "production");
    const canSubmitProduction = viewer.role === "Panel Operator" || canManage;
    const periodicKind = periodicSection === "General" ? "general_" + periodicPeriod : periodicSection + "_" + periodicPeriod;
    const canSubmitPeriodic = periodicSection === "General" ? isShiftSupervisor : viewer.department === periodicSection && (viewerRole === "operator" || canManage);
    const currentPeriodKey = periodicPeriod === "weekly" ? periodicWeekKey : periodicMonthKey;
    const periodicList = reportsVisibleToViewer.filter((r) => r.reportKind === periodicKind && r.periodKey === currentPeriodKey).sort((a, b) => b.ts - a.ts);
    const periodLabel = periodicPeriod === "weekly" ? weekLabel(periodicWeekKey, lang) : monthLabel(periodicMonthKey, lang);
    const isCurrentPeriod = periodicPeriod === "weekly" ? periodicWeekKey === weekKeyOf(today) : periodicMonthKey === monthKeyOf(today);
    function UploadCard(onSaveKind, canSubmit, restrictionNote) {
      if (!canSubmit) return /* @__PURE__ */ jsx("p", { className: "text-xs italic px-1", style: { color: "#8A97A3" }, children: restrictionNote });
      return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", style: { animation: "fadeSlideUp 240ms ease-out" }, children: [
        !reportAttachment ? /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-center gap-1.5 text-sm font-bold py-3 rounded-lg cursor-pointer", style: { background: "#F4F6F8", color: "#16222E", border: "1px dashed #DCE3E8" }, children: [
          /* @__PURE__ */ jsx(Download, { size: 16, style: { transform: "rotate(180deg)" } }),
          " ",
          t("attachReportFile"),
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*,.pdf", className: "hidden", onChange: handleReportFile })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "rounded-lg p-2.5 flex items-center gap-3", style: { background: "#F4F6F8" }, children: [
          reportAttachment.isImage ? /* @__PURE__ */ jsx("img", { src: reportAttachment.dataUrl, alt: "", className: "w-14 h-14 rounded-lg object-cover shrink-0" }) : /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-lg flex items-center justify-center shrink-0", style: { background: "#E6EEF5" }, children: /* @__PURE__ */ jsx(FileText2, { size: 22, color: "#1F4E79" }) }),
          /* @__PURE__ */ jsx("p", { className: "flex-1 text-xs font-bold truncate", style: { color: "#16222E" }, children: reportAttachment.name }),
          /* @__PURE__ */ jsx("button", { onClick: () => setReportAttachment(null), className: "text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0", style: { background: "#FBE7E4", color: "#C0392B" }, children: t("removeFile") })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => runWithBusy("saveReport", onSaveKind), disabled: !reportAttachment, className: "text-sm font-bold py-2.5 rounded-lg", style: { background: "#1F4E79", color: "white", opacity: !reportAttachment ? 0.5 : 1 }, children: BtnContent("saveReport", t("saveReadingBtn")) })
      ] });
    }
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("reportsMenu") }),
        /* @__PURE__ */ jsx("button", { onClick: () => setActiveOverlay(null), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx(X, { size: 16, color: "#16222E" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-1", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setReportsTab("daily"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: reportsTab === "daily" ? "#1F4E79" : "#FFFFFF", color: reportsTab === "daily" ? "white" : "#5B6B79", border: "1px solid " + (reportsTab === "daily" ? "#1F4E79" : "#DCE3E8") }, children: t("dailyReportsTab") }),
        /* @__PURE__ */ jsx("button", { onClick: () => setReportsTab("periodic"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: reportsTab === "periodic" ? "#1F4E79" : "#FFFFFF", color: reportsTab === "periodic" ? "white" : "#5B6B79", border: "1px solid " + (reportsTab === "periodic" ? "#1F4E79" : "#DCE3E8") }, children: t("periodicReportsTab") })
      ] }),
      reportsTab === "daily" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4 flex flex-col gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: t("dailyProductionReport") }),
          UploadCard(() => saveReport("production", "daily"), canSubmitProduction, t("panelOperatorOnlyNote"))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-3.5 flex items-center gap-3", style: { background: "#F4F6F8", border: "1px dashed #DCE3E8" }, children: [
          /* @__PURE__ */ jsx(FileText2, { size: 20, color: "#8A97A3" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", style: { color: "#16222E" }, children: t("labReportTitle") }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: t("labReportSoon") }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] mt-1", style: { color: "#8A97A3" }, children: "Water \xB7 Gas & Condensate \xB7 Hot Oil \xB7 Lube Oil \xB7 Seal Oil" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl p-2.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setReportsViewDate((d) => shiftISODate(d, -1)), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx(ChevronUp, { size: 16, style: { transform: "rotate(-90deg)" }, color: "#16222E" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-black", style: { color: "#16222E" }, children: reportsViewDate === today ? t("todayLbl") : reportsViewDate }),
          /* @__PURE__ */ jsx("button", { onClick: () => setReportsViewDate((d) => shiftISODate(d, 1)), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx(ChevronUp, { size: 16, style: { transform: "rotate(90deg)" }, color: "#16222E" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold mb-2 px-1", style: labelStyle, children: t("previousReports") }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2.5", children: [
            dayReports.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noReportsYet") }),
            dayReports.map((r) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-3.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                r.attachment.isImage ? /* @__PURE__ */ jsx("img", { src: r.attachment.dataUrl, alt: "", className: "w-12 h-12 rounded-lg object-cover shrink-0" }) : /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg flex items-center justify-center shrink-0", style: { background: "#E6EEF5" }, children: /* @__PURE__ */ jsx(FileText2, { size: 18, color: "#1F4E79" }) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold truncate", style: { color: "#16222E" }, children: r.attachment.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
                    t("enteredByLbl"),
                    " ",
                    personLabel(r.enteredBy),
                    " \u2014 ",
                    r.createdAt
                  ] })
                ] })
              ] }),
              ReviewBlock(r, reviewReport, r.enteredBy)
            ] }, r.id))
          ] })
        ] })
      ] }),
      reportsTab === "periodic" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: [...departments, "General"].map((s) => /* @__PURE__ */ jsx("button", { onClick: () => setPeriodicSection(s), className: "text-xs font-bold px-3 py-2 rounded-lg", style: { background: periodicSection === s ? "#1F4E79" : "#FFFFFF", color: periodicSection === s ? "white" : "#5B6B79", border: "1px solid " + (periodicSection === s ? "#1F4E79" : "#DCE3E8") }, children: s === "General" ? t("generalReportTitle") : s }, s)) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setPeriodicPeriod("weekly"), className: "flex-1 text-sm font-bold py-2 rounded-lg", style: { background: periodicPeriod === "weekly" ? "#B25E09" : "#F4F6F8", color: periodicPeriod === "weekly" ? "white" : "#5B6B79" }, children: t("weeklyBtn") }),
          /* @__PURE__ */ jsx("button", { onClick: () => setPeriodicPeriod("monthly"), className: "flex-1 text-sm font-bold py-2 rounded-lg", style: { background: periodicPeriod === "monthly" ? "#1F4E79" : "#F4F6F8", color: periodicPeriod === "monthly" ? "white" : "#5B6B79" }, children: t("monthlyBtn") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4 flex flex-col gap-3", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: periodicSection === "General" ? t("generalReportTitle") : t("sectionReportLabel") + " \xB7 " + periodicSection }),
          periodicSection === "General" && /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: "#8A97A3" }, children: t("generalReportDesc") }),
          UploadCard(() => saveReport(periodicKind, periodicPeriod), canSubmitPeriodic, periodicSection === "General" ? t("shiftSupervisorOnlyNote") : t("noEntryPermission"))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl p-2.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
          /* @__PURE__ */ jsx("button", { onClick: () => periodicPeriod === "weekly" ? setPeriodicWeekKey((k) => shiftWeekKey(k, -1)) : setPeriodicMonthKey((k) => shiftMonthKey(k, -1)), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx(ChevronUp, { size: 16, style: { transform: "rotate(-90deg)" }, color: "#16222E" }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-black", style: { color: "#16222E" }, children: periodLabel }),
            isCurrentPeriod && /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold", style: { color: "#2F7D4F" }, children: t("todayLbl") })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => periodicPeriod === "weekly" ? setPeriodicWeekKey((k) => shiftWeekKey(k, 1)) : setPeriodicMonthKey((k) => shiftMonthKey(k, 1)), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx(ChevronUp, { size: 16, style: { transform: "rotate(90deg)" }, color: "#16222E" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2.5", children: [
          periodicList.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noReportsYet") }),
          periodicList.map((r) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-3.5", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              r.attachment.isImage ? /* @__PURE__ */ jsx("img", { src: r.attachment.dataUrl, alt: "", className: "w-12 h-12 rounded-lg object-cover shrink-0" }) : /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg flex items-center justify-center shrink-0", style: { background: "#E6EEF5" }, children: /* @__PURE__ */ jsx(FileText2, { size: 18, color: "#1F4E79" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold truncate", style: { color: "#16222E" }, children: r.attachment.name }),
                /* @__PURE__ */ jsxs("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: [
                  t("enteredByLbl"),
                  " ",
                  personLabel(r.enteredBy),
                  " \u2014 ",
                  r.createdAt
                ] })
              ] })
            ] }),
            ReviewBlock(r, reviewReport, r.enteredBy)
          ] }, r.id))
        ] })
      ] })
    ] });
  }
  function BtnContent(key, label) {
    if (busyAction !== key) return label;
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { style: { width: 14, height: 14, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "ntmSpin 700ms linear infinite" } }),
      label
    ] });
  }
  function ToastStack() {
    if (toasts.length === 0) return null;
    return /* @__PURE__ */ jsx("div", { className: "fixed top-4 left-1/2 z-[70] flex flex-col gap-2 items-center", style: { transform: "translateX(-50%)", width: "min(92vw, 380px)" }, children: toasts.map((tt) => /* @__PURE__ */ jsxs("div", { className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg", style: { background: tt.kind === "success" ? "#1F4E3A" : tt.kind === "info" ? "#16222E" : "#7A2E22", color: "white", animation: "toastIn 240ms cubic-bezier(0.22, 1, 0.36, 1)" }, children: [
      tt.kind === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { size: 18, color: "#7EDCA8" }) : /* @__PURE__ */ jsx(MessageSquare, { size: 18, color: "#9FB4C7" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold flex-1", children: tt.text })
    ] }, tt.id)) });
  }
  function DrawerMenu() {
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
    return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50", style: { background: "rgba(22,34,46,0.45)", opacity: drawerVisible ? 1 : 0, transition: "opacity 220ms ease" }, onClick: () => setDrawerOpen(false), children: /* @__PURE__ */ jsxs("div", { className: "fixed top-0 w-80 h-full flex flex-col p-5 gap-1.5", style: { right: 0, background: "#FFFFFF", boxShadow: "-6px 0 24px rgba(0,0,0,0.12)", transform: drawerVisible ? "translateX(0)" : "translateX(100%)", transition: "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)" }, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-black", style: { color: "#16222E" }, children: t("menu") }),
        /* @__PURE__ */ jsx("button", { onClick: () => setDrawerOpen(false), className: "w-9 h-9 rounded-lg flex items-center justify-center", style: { background: "#F4F6F8" }, children: /* @__PURE__ */ jsx(X, { size: 19, color: "#5B6B79" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5 overflow-y-auto", children: [
        items.map((it, idx) => /* @__PURE__ */ jsxs("button", { onClick: () => {
          actionByKey[it.key]();
          setDrawerOpen(false);
        }, className: "flex items-center gap-3.5 text-base font-bold px-4 py-4 rounded-xl transition-colors active:scale-[0.98]", style: { color: "#16222E", background: "#F8F9FA", opacity: drawerVisible ? 1 : 0, transform: drawerVisible ? "translateX(0)" : "translateX(12px)", transition: `opacity 220ms ease ${40 + idx * 30}ms, transform 220ms ease ${40 + idx * 30}ms` }, children: [
          /* @__PURE__ */ jsx(it.icon, { size: 21, color: "#1F4E79" }),
          " ",
          t(it.labelKey)
        ] }, it.key)),
        items.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-center py-6", style: { color: "#8A97A3" }, children: "\u2014" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-auto pt-4", style: { borderTop: "1px solid #EEF1F4" }, children: /* @__PURE__ */ jsxs("button", { onClick: () => setLang(lang === "ar" ? "en" : "ar"), className: "w-full flex items-center gap-3.5 text-base font-bold px-4 py-4 rounded-xl", style: { color: "#16222E", background: "#F8F9FA" }, children: [
        /* @__PURE__ */ jsx(Languages, { size: 21, color: "#1F4E79" }),
        " ",
        lang === "ar" ? "English" : "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
      ] }) })
    ] }) });
  }
  function ReviewBlock(item, reviewFn, ownerId) {
    const status = item.reviewStatus;
    const meta = REVIEW_STATUS_META[status] || REVIEW_STATUS_META.submitted;
    const myTurn = isShiftSupervisor && isShiftTurn(status) || isSectionSupervisor && isSectionTurn(status);
    const canResubmit = status === "returned_to_operator" && viewerRole === "operator" && ownerId === currentUserId;
    const draft = entryCommentDraft.id === item.id ? entryCommentDraft.text : "";
    const setDraft = (v) => setEntryCommentDraft({ id: item.id, text: v });
    const clearDraft = () => setEntryCommentDraft({ id: null, text: "" });
    return /* @__PURE__ */ jsxs("div", { className: "mt-2 pt-2 flex flex-col gap-2", style: { borderTop: "1px solid #EEF1F4" }, children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-black px-2 py-1 rounded-full self-start", style: { background: meta.bg, color: meta.color }, children: meta[lang] || meta.ar }),
      (item.comments || []).length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5", children: item.comments.map((c) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-3 py-2 text-xs", style: { background: "#F4F6F8" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-0.5", children: [
          /* @__PURE__ */ jsx("b", { style: { color: "#16222E" }, children: c.author }),
          /* @__PURE__ */ jsx("span", { style: { color: "#8A97A3" }, children: c.at })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { color: "#5B6B79" }, children: c.text })
      ] }, c.id)) }),
      canResubmit && /* @__PURE__ */ jsx("button", { onClick: () => runWithBusy("resubmit_" + item.id, () => {
        reviewFn(item.id, "resubmit");
        clearDraft();
      }), className: "text-xs font-bold py-2 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: BtnContent("resubmit_" + item.id, t("resubmitBtn")) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("input", { value: draft, onChange: (e) => setDraft(e.target.value), placeholder: myTurn ? t("rerouteNotePlaceholder") : t("addCommentBtn"), className: "flex-1 text-xs outline-none", style: { ...inputStyle, padding: "8px 10px" } }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          if (draft.trim()) {
            reviewFn(item.id, "comment", draft);
            clearDraft();
          }
        }, className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0", style: { background: "#1F4E79" }, children: /* @__PURE__ */ jsx(Send, { size: 13, color: "white" }) })
      ] }),
      myTurn && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => runWithBusy("approve_" + item.id, () => {
          reviewFn(item.id, "approve");
          clearDraft();
        }), className: "flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg", style: { background: "#2F7D4F", color: "white" }, children: busyAction === "approve_" + item.id ? BtnContent("approve_" + item.id, isShiftTurn(status) ? t("approve") : t("approveFinal")) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Check, { size: 14 }),
          " ",
          isShiftTurn(status) ? t("approve") : t("approveFinal")
        ] }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => runWithBusy("reroute_" + item.id, () => {
          reviewFn(item.id, "reroute", draft);
          clearDraft();
        }), className: "flex-1 text-xs font-bold py-2 rounded-lg", style: { background: "#C0392B", color: "white" }, children: BtnContent("reroute_" + item.id, t("reroute")) })
      ] })
    ] });
  }
  function ProblemCard(p, { withApprove } = {}) {
    const isOpen = expandedProblemId === p.id;
    const canEdit = p.reportedBy === currentUserId || canManage;
    const sup = shiftSupervisorOf(p.department);
    const pr = PRIORITY[p.priority] || PRIORITY.medium;
    return /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-0.5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-base font-black truncate", style: { color: "#16222E" }, children: p.equipmentName || "\u2014" }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0", style: { background: pr.bg, color: pr.color }, children: pr[lang] || pr.ar }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", style: { background: (REVIEW_STATUS_META[p.reviewStatus] || REVIEW_STATUS_META.submitted).bg, color: (REVIEW_STATUS_META[p.reviewStatus] || REVIEW_STATUS_META.submitted).color }, children: (REVIEW_STATUS_META[p.reviewStatus] || REVIEW_STATUS_META.submitted)[lang] })
          ] }),
          p.tagNumber && /* @__PURE__ */ jsx("p", { className: "text-sm font-bold", dir: "ltr", style: { color: "#1F4E79", textAlign: "left" }, children: p.tagNumber }),
          /* @__PURE__ */ jsx("p", { className: "text-sm mt-0.5", style: { color: "#5B6B79" }, children: p.title }),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] mt-1", style: { color: "#8A97A3" }, children: [
            t("reportedBy"),
            " ",
            personLabel(p.reportedBy),
            " \u2014 ",
            p.createdAt
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
          canEdit && /* @__PURE__ */ jsx("button", { onClick: () => startEditProblem(p), className: "w-7 h-7 rounded-md flex items-center justify-center", style: { color: "#5B6B79" }, children: /* @__PURE__ */ jsx(Pencil, { size: 14 }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setExpandedProblemId(isOpen ? null : p.id), className: "w-7 h-7 rounded-md flex items-center justify-center", style: { color: "#1F4E79" }, children: isOpen ? /* @__PURE__ */ jsx(ChevronUp, { size: 16 }) : /* @__PURE__ */ jsx(ChevronDown, { size: 16 }) })
        ] })
      ] }),
      isOpen && /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-3 flex flex-col gap-1.5 text-xs", style: { borderTop: "1px solid #EEF1F4", color: "#5B6B79" }, children: [
        /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(MapPin, { size: 13 }),
          " ",
          p.location || "\u2014"
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsxs("b", { style: { color: "#16222E" }, children: [
            t("department"),
            ":"
          ] }),
          " ",
          p.department
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsxs("b", { style: { color: "#16222E" }, children: [
            t("maintDept"),
            ":"
          ] }),
          " ",
          p.categories?.join(", ") || "\u2014"
        ] }),
        p.unitName && /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsxs("b", { style: { color: "#16222E" }, children: [
            t("unitName"),
            ":"
          ] }),
          " ",
          p.unitName
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("b", { style: { color: "#16222E" }, children: t("respPerson") }),
          " ",
          sup ? personLabel(sup.id) : "\u2014"
        ] }),
        /* @__PURE__ */ jsx("p", { children: p.description }),
        p.editedNote && /* @__PURE__ */ jsxs("p", { className: "italic", style: { color: "#B25E09" }, children: [
          p.editedNote,
          " \u2014 ",
          p.editedAt
        ] }),
        canManage && /* @__PURE__ */ jsx("div", { className: "flex gap-1.5 flex-wrap mt-1", children: Object.entries(WORK_STATUS).map(([k, v]) => /* @__PURE__ */ jsx("button", { onClick: () => setWorkStatus(p.id, k), className: "text-[11px] font-bold px-2.5 py-1.5 rounded-lg", style: { background: p.workStatus === k ? v.bg : "#F4F6F8", color: p.workStatus === k ? v.color : "#8A97A3", border: "1px solid " + (p.workStatus === k ? v.color : "#E2E8ED") }, children: v[lang] || v.ar }, k)) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black", style: { color: "#16222E" }, children: t("commentsLabel") }),
          ReviewBlock(p, reviewProblem, p.reportedBy)
        ] })
      ] })
    ] }, p.id);
  }
  function AdminView() {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { size: 16, color: "#1F4E79" }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: t("accounts") })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: addPerson, className: "flex flex-col sm:flex-row gap-2 items-end mb-3", children: [
          /* @__PURE__ */ jsx("input", { value: newPerson.name, onChange: (e) => setNewPerson({ ...newPerson, name: e.target.value }), placeholder: t("name"), className: "flex-1 text-sm outline-none", style: inputStyle }),
          /* @__PURE__ */ jsx("select", { value: newPerson.department, onChange: (e) => setNewPerson({ ...newPerson, department: e.target.value }), className: "text-sm outline-none", style: inputStyle, children: departments.map((d) => /* @__PURE__ */ jsx("option", { children: d }, d)) }),
          /* @__PURE__ */ jsx("select", { value: newPerson.role, onChange: (e) => setNewPerson({ ...newPerson, role: e.target.value }), className: "text-sm outline-none", style: inputStyle, children: roles.map((r) => /* @__PURE__ */ jsx("option", { children: r }, r)) }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg", style: { background: "#F4F6F8", color: "#5B6B79" }, children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: newPerson.isAdmin, onChange: (e) => setNewPerson({ ...newPerson, isAdmin: e.target.checked }) }),
            " ",
            t("appAdmin")
          ] }),
          /* @__PURE__ */ jsxs("button", { type: "submit", className: "flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg shrink-0", style: { background: "#1F4E79", color: "white" }, children: [
            /* @__PURE__ */ jsx(UserPlus, { size: 15 }),
            " ",
            t("addBtn")
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 max-h-96 overflow-y-auto", children: people.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg px-3 py-2", style: { background: "#F4F6F8" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", style: { color: "#16222E" }, children: p.name }),
            /* @__PURE__ */ jsx("span", { className: "text-xs mr-2", style: { color: "#8A97A3" }, children: p.employeeId }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs mr-2", style: labelStyle, children: [
              p.role,
              " \xB7 ",
              p.department
            ] }),
            p.isAdmin && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold mr-2 px-2 py-0.5 rounded-full", style: { background: "#E6EEF5", color: "#1F4E79" }, children: t("appAdmin") })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => removePerson(p.id), className: "w-7 h-7 rounded-md flex items-center justify-center", style: { color: "#C0392B" }, children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
        ] }, p.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold mb-3", style: { color: "#16222E" }, children: t("departmentsLabel") }),
        /* @__PURE__ */ jsxs("form", { onSubmit: addDept, className: "flex gap-2 mb-3", children: [
          /* @__PURE__ */ jsx("input", { value: newDept, onChange: (e) => setNewDept(e.target.value), placeholder: t("newDeptPH"), className: "flex-1 text-sm outline-none", style: inputStyle }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "text-sm font-bold px-4 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: t("addBtn") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: departments.map((d) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full", style: { background: deptColor(d).bg, color: deptColor(d).text }, children: [
          d,
          /* @__PURE__ */ jsx("button", { onClick: () => removeDept(d), children: /* @__PURE__ */ jsx(X, { size: 12 }) })
        ] }, d)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold mb-3", style: { color: "#16222E" }, children: t("rolesLabel") }),
        /* @__PURE__ */ jsxs("form", { onSubmit: addRole, className: "flex gap-2 mb-3", children: [
          /* @__PURE__ */ jsx("input", { value: newRole, onChange: (e) => setNewRole(e.target.value), placeholder: t("newRolePH"), className: "flex-1 text-sm outline-none", style: inputStyle }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "text-sm font-bold px-4 rounded-lg", style: { background: "#1F4E79", color: "white" }, children: t("addBtn") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: roles.map((r) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full", style: { background: "#F4F6F8", color: "#5B6B79" }, children: [
          r,
          /* @__PURE__ */ jsx("button", { onClick: () => removeRole(r), children: /* @__PURE__ */ jsx(X, { size: 12 }) })
        ] }, r)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-4", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx(Menu, { size: 16, color: "#1F4E79" }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold", style: { color: "#16222E" }, children: t("menuPermissionsTitle") })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs mb-3", style: { color: "#8A97A3" }, children: t("menuPermissionsDesc") }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs", style: { borderCollapse: "collapse" }, children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "text-start py-2 px-2 sticky right-0", style: { background: "#FFFFFF", color: "#8A97A3" }, children: t("rolesLabel") }),
            MENU_ITEM_DEFS.map((it) => /* @__PURE__ */ jsx("th", { className: "py-2 px-2 font-bold whitespace-nowrap", style: { color: "#16222E" }, children: t(it.labelKey) }, it.key))
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: [...SUPERVISOR_ROLES, ...OPERATOR_ROLES].map((role) => /* @__PURE__ */ jsxs("tr", { style: { borderTop: "1px solid #EEF1F4" }, children: [
            /* @__PURE__ */ jsx("td", { className: "py-2 px-2 font-bold whitespace-nowrap sticky right-0", style: { background: "#FFFFFF", color: "#16222E" }, children: role }),
            MENU_ITEM_DEFS.map((it) => /* @__PURE__ */ jsx("td", { className: "py-2 px-2 text-center", children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: (menuPermissions[role] || []).includes(it.key), onChange: () => toggleMenuPermission(role, it.key) }) }, it.key))
          ] }, role)) })
        ] }) })
      ] })
    ] });
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
  function SupervisorTaskGroups(mode) {
    const groups = [
      { key: "__private", label: t("myPrivateTasks"), filter: (tk) => tk.privateTo === currentUserId },
      ...departments.map((d) => ({ key: d, label: d, filter: (tk) => tk.department === d && tk.type === "public" }))
    ];
    return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-6", children: groups.map((g) => {
      const all = tasks.filter(g.filter);
      let list;
      if (mode === "inprogress") list = sortForSupervisorList(all.filter((tk) => tk.status === "in_progress"));
      else if (mode === "completed") list = sortForSupervisorList(all.filter((tk) => tk.status === "completed" && tk.completedAt === today));
      else list = sortForSupervisorList(all.filter((tk) => isTaskOnDate(tk, today)));
      if (list.length === 0) return null;
      return /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-black mb-2 px-1", style: { color: "#16222E" }, children: g.label }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: list.map((tk, i) => TaskCard(tk, false, i + 1)) })
      ] }, g.key);
    }) });
  }
  return /* @__PURE__ */ jsxs("div", { dir: lang === "en" ? "ltr" : "rtl", className: "min-h-screen w-full", style: { background: "#EEF1F4", fontFamily: lang === "en" ? "system-ui, sans-serif" : "'Tajawal', sans-serif" }, children: [
    /* @__PURE__ */ jsx("style", { children: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;}
        @keyframes fadeSlideUp { from { opacity:0; transform: translateY(10px);} to {opacity:1; transform:translateY(0);} }
        @keyframes ntmSpin { to { transform: rotate(360deg);} }
        @keyframes toastIn { from {opacity:0; transform:translateY(-12px) scale(0.96);} to {opacity:1; transform:translateY(0) scale(1);} }
      ` }),
    ToastStack(),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-2.5 mb-4 flex items-center gap-2", style: { background: "#FFF6EB", border: "1px solid #F0C57A" }, children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", style: { color: "#5B4321" }, children: t("previewAs") }),
        /* @__PURE__ */ jsx("select", { value: currentUserId, onChange: (e) => setCurrentUserId(Number(e.target.value)), className: "text-xs outline-none flex-1", style: { ...inputStyle, padding: "6px 10px" }, children: people.map((p) => /* @__PURE__ */ jsxs("option", { value: p.id, children: [
          p.name,
          " (",
          p.employeeId,
          ") \u2014 ",
          p.isAdmin ? t("appAdmin") : p.role
        ] }, p.id)) }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setLang(lang === "ar" ? "en" : "ar"), className: "flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0", style: { background: "#FFFFFF", border: "1px solid #F0C57A", color: "#5B4321" }, children: [
          /* @__PURE__ */ jsx(Languages, { size: 13 }),
          " ",
          lang === "ar" ? "EN" : "AR"
        ] })
      ] }),
      viewerRole === "admin" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
          Avatar(viewer.department, 48),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-base font-black", style: { color: "#16222E" }, children: viewer.name }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: viewer.employeeId }),
            /* @__PURE__ */ jsx("p", { className: "text-xs", style: labelStyle, children: t("appAdmin") })
          ] })
        ] }),
        AdminView()
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            Avatar(viewer.department, 48),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-base font-black", style: { color: "#16222E" }, children: viewer.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px]", style: { color: "#8A97A3" }, children: viewer.employeeId }),
              /* @__PURE__ */ jsx("p", { className: "text-xs", style: labelStyle, children: viewer.role })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", ref: notifRef, children: [
              /* @__PURE__ */ jsxs("button", { onClick: () => setNotifOpen((o) => !o), className: "w-12 h-12 rounded-full flex items-center justify-center relative", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
                /* @__PURE__ */ jsx(Bell, { size: 22, color: "#16222E" }),
                notifications.length > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -left-1 text-[10px] font-bold rounded-full flex items-center justify-center", style: { width: 18, height: 18, background: "#C0392B", color: "white" }, children: notifications.length })
              ] }),
              notifOpen && /* @__PURE__ */ jsxs("div", { className: "absolute left-0 mt-2 w-72 rounded-xl p-2 z-10 flex flex-col gap-1", style: { background: "#FFFFFF", border: "1px solid #DCE3E8", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }, children: [
                notifications.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-xs text-center py-4", style: { color: "#8A97A3" }, children: t("noNotifications") }),
                notifications.map((n, i) => /* @__PURE__ */ jsxs("div", { className: "text-xs px-3 py-2 rounded-lg", style: { background: "#F4F6F8" }, children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-bold ml-1", style: { color: "#1F4E79" }, children: [
                    "[",
                    n.kind,
                    "]"
                  ] }),
                  /* @__PURE__ */ jsx("span", { style: { color: "#16222E" }, children: n.text })
                ] }, i))
              ] })
            ] }),
            hasDrawer && /* @__PURE__ */ jsx("button", { onClick: () => setDrawerOpen(true), className: "w-11 h-11 rounded-full flex items-center justify-center", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx(Menu, { size: 19, color: "#16222E" }) })
          ] })
        ] }),
        DrawerMenu(),
        activeOverlay === "calendar" && CalendarOverlay(),
        activeOverlay === "log" && LogOverlay(),
        activeOverlay === "staff" && StaffOverlay(),
        activeOverlay === "logbook" && LogbookOverlay(),
        activeOverlay === "readings" && ReadingsOverlay(),
        activeOverlay === "reports" && ReportsOverlay(),
        !activeOverlay && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-3", children: [
            !isCoordinator && /* @__PURE__ */ jsx("button", { onClick: () => setMainSubTab("tasks"), className: "flex-1 text-base font-black py-3 rounded-xl", style: { background: mainSubTab === "tasks" ? "#1F4E79" : "#FFFFFF", color: mainSubTab === "tasks" ? "white" : "#5B6B79", border: "1px solid " + (mainSubTab === "tasks" ? "#1F4E79" : "#DCE3E8") }, children: t("tasks") }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setMainSubTab("problems"), className: "flex-1 text-base font-black py-3 rounded-xl", style: { background: mainSubTab === "problems" ? "#1F4E79" : "#FFFFFF", color: mainSubTab === "problems" ? "white" : "#5B6B79", border: "1px solid " + (mainSubTab === "problems" ? "#1F4E79" : "#DCE3E8") }, children: [
              t("problems"),
              " ",
              (isCoordinator ? problemsVisibleToViewer.length : deptProblems.length) > 0 && `(${isCoordinator ? problemsVisibleToViewer.length : deptProblems.length})`
            ] })
          ] }),
          isAdvisory && /* @__PURE__ */ jsx("p", { className: "text-xs mb-3 px-1", style: { color: "#B25E09" }, children: t("advisoryNote") }),
          isCoordinator && /* @__PURE__ */ jsx("p", { className: "text-xs mb-3 px-1", style: { color: "#B25E09" }, children: t("coordinatorNote") }),
          mainSubTab === "tasks" && viewerRole === "supervisor" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => setSupTasksTab("list"), className: "w-11 h-11 rounded-lg flex items-center justify-center shrink-0", title: t("todayTaskList"), style: { background: supTasksTab === "list" ? "#1F4E79" : "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx(List, { size: 19, color: supTasksTab === "list" ? "white" : "#16222E" }) }),
            canManage && /* @__PURE__ */ jsx("button", { onClick: () => {
              setTaskForm(emptyTaskForm());
              setEditingId(null);
              setShowTaskForm(true);
            }, className: "w-11 h-11 rounded-lg flex items-center justify-center shrink-0", style: { background: "#1F4E79" }, children: /* @__PURE__ */ jsx(Plus, { size: 20, color: "white" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => setSupTasksTab((s) => s === "inprogress" ? "list" : "inprogress"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: supTasksTab === "inprogress" ? "#1F4E79" : "#FFFFFF", color: supTasksTab === "inprogress" ? "white" : "#5B6B79", border: "1px solid " + (supTasksTab === "inprogress" ? "#1F4E79" : "#DCE3E8") }, children: t("inProgressBtn") }),
            /* @__PURE__ */ jsx("button", { onClick: () => setSupTasksTab((s) => s === "completed" ? "list" : "completed"), className: "flex-1 text-sm font-bold py-2.5 rounded-lg", style: { background: supTasksTab === "completed" ? "#1F4E79" : "#FFFFFF", color: supTasksTab === "completed" ? "white" : "#5B6B79", border: "1px solid " + (supTasksTab === "completed" ? "#1F4E79" : "#DCE3E8") }, children: t("completedBtn") })
          ] }),
          mainSubTab === "problems" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => setProblemView("status"), className: "w-11 h-11 rounded-lg flex items-center justify-center shrink-0", title: t("problemsList"), style: { background: problemView === "status" ? "#1F4E79" : "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx(List, { size: 19, color: problemView === "status" ? "white" : "#16222E" }) }),
            (viewerRole === "operator" || canManage) && /* @__PURE__ */ jsx("button", { onClick: () => {
              setShowProblemForm(true);
            }, className: "w-11 h-11 rounded-lg flex items-center justify-center shrink-0", style: { background: "#1F4E79" }, children: /* @__PURE__ */ jsx(Plus, { size: 20, color: "white" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => setProblemSearchOpen((o) => !o), className: "w-11 h-11 rounded-lg flex items-center justify-center shrink-0", style: { background: problemSearchOpen ? "#1F4E79" : "#FFFFFF", border: "1px solid #DCE3E8" }, children: /* @__PURE__ */ jsx(Search, { size: 18, color: problemSearchOpen ? "white" : "#16222E" }) }),
            !isCoordinator && /* @__PURE__ */ jsxs("button", { onClick: () => setProblemView((s) => s === "log" ? "status" : "log"), className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 rounded-lg", style: { background: problemView === "log" ? "#1F4E79" : "#FFFFFF", color: problemView === "log" ? "white" : "#5B6B79", border: "1px solid " + (problemView === "log" ? "#1F4E79" : "#DCE3E8") }, children: [
              /* @__PURE__ */ jsx(Clock, { size: 15 }),
              " ",
              t("fullLog")
            ] })
          ] }),
          mainSubTab === "problems" && problemSearchOpen && /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-3 mb-4 flex flex-col gap-2", style: { background: "#FFFFFF", border: "1px solid #DCE3E8" }, children: [
            /* @__PURE__ */ jsx("input", { autoFocus: true, value: problemSearch, onChange: (e) => setProblemSearch(e.target.value), placeholder: t("searchPlaceholder"), className: "w-full text-sm outline-none", style: inputStyle }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold", style: { color: "#8A97A3" }, children: t("searchField") }),
              [["all", t("all")], ["tagNumber", t("fieldTag")], ["equipmentName", t("fieldEquip")], ["department", t("fieldDept")], ["location", t("fieldLoc")]].map(([k, l]) => /* @__PURE__ */ jsx("button", { onClick: () => setProblemSearchField(k), className: "text-[11px] font-bold px-2.5 py-1 rounded-full", style: { background: problemSearchField === k ? "#1F4E79" : "#F4F6F8", color: problemSearchField === k ? "white" : "#5B6B79" }, children: l }, k))
            ] })
          ] }),
          mainSubTab === "tasks" && showTaskForm && canManage && TaskFormPanel(),
          mainSubTab === "problems" && showProblemForm && ProblemFormPanel(),
          mainSubTab === "tasks" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(AlertsBlock, {}),
            viewerRole === "operator" ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2.5", children: [
              deptTasks.length === 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: [
                t("noTasks"),
                "."
              ] }),
              deptTasks.map((tk, i) => TaskCard(tk, false, i + 1))
            ] }) : SupervisorTaskGroups(supTasksTab)
          ] }),
          mainSubTab === "problems" && problemView === "status" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
            Object.entries(WORK_STATUS).map(([k, v]) => {
              const list = problemsVisibleToViewer.filter((p) => p.workStatus === k && matchesProblemSearch(p));
              if (list.length === 0) return null;
              return /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-black mb-2 px-1", style: { color: v.color }, children: v[lang] || v.ar }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2.5", children: list.map((p) => ProblemCard(p, { withApprove: true })) })
              ] }, k);
            }),
            problemsVisibleToViewer.filter(matchesProblemSearch).length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noProblems") })
          ] }),
          mainSubTab === "problems" && problemView === "log" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2.5", children: [
            problemsChrono.filter(matchesProblemSearch).length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl p-8 text-center text-sm", style: { background: "#FFFFFF", border: "1px dashed #DCE3E8", color: "#8A97A3" }, children: t("noProblems") }),
            problemsChrono.filter(matchesProblemSearch).map((p) => ProblemCard(p, { withApprove: true }))
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  TaskManager as default
};
