enum WPQTTypes {
  Task = "task",
  User = "user",
}

enum WPQTLogCreatedBy {
  System = "system",
  Admin = "admin",
  WPQTUser = "quicktasker_user",
}

enum WPQTArchiveDoneFilter {
  All = "all",
  Completed = "completed",
  NotCompleted = "not completed",
}

export { WPQTArchiveDoneFilter, WPQTLogCreatedBy, WPQTTypes };
