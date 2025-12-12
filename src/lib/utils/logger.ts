/**
 * Persistent logger that stores logs in localStorage
 * Useful for debugging redirect-based payment flows (e.g., FPX)
 */

export interface LogEntry {
  timestamp: string;
  level: "log" | "info" | "warn" | "error" | "success" | "redirect";
  message: string;
  data?: unknown;
  category?: string;
}

const MAX_LOGS = 500; // Maximum number of logs to store
const STORAGE_KEY = "fpx-checkout-logs";

/**
 * Get all stored logs
 */
export function getStoredLogs(): LogEntry[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to parse stored logs:", error);
  }
  
  return [];
}

/**
 * Store a log entry
 */
function storeLog(entry: LogEntry): void {
  if (typeof window === "undefined") return;
  
  try {
    const logs = getStoredLogs();
    logs.push(entry);
    
    // Keep only the most recent logs
    if (logs.length > MAX_LOGS) {
      logs.splice(0, logs.length - MAX_LOGS);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    // If storage is full, try to clear old logs
    try {
      localStorage.removeItem(STORAGE_KEY);
      const logs: LogEntry[] = [entry];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to store log:", e);
    }
  }
}

/**
 * Clear all stored logs
 */
export function clearStoredLogs(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Create a persistent logger with category prefix
 */
export function createLogger(category: string) {
  const prefix = `[${category}]`;
  
  return {
    log: (message: string, data?: unknown) => {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "log",
        message: `${prefix} ${message}`,
        data,
        category,
      };
      console.log(entry.message, data || "");
      storeLog(entry);
    },
    
    info: (message: string, data?: unknown) => {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "info",
        message: `${prefix} ${message}`,
        data,
        category,
      };
      console.info(entry.message, data || "");
      storeLog(entry);
    },
    
    warn: (message: string, data?: unknown) => {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "warn",
        message: `${prefix} ${message}`,
        data,
        category,
      };
      console.warn(entry.message, data || "");
      storeLog(entry);
    },
    
    error: (message: string, data?: unknown) => {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "error",
        message: `${prefix} ${message}`,
        data,
        category,
      };
      console.error(entry.message, data || "");
      storeLog(entry);
    },
    
    success: (message: string, data?: unknown) => {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "success",
        message: `${prefix} ${message}`,
        data,
        category,
      };
      console.log(`✅ ${entry.message}`, data || "");
      storeLog(entry);
    },
    
    redirect: (message: string, data?: unknown) => {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: "redirect",
        message: `${prefix} ${message}`,
        data,
        category,
      };
      console.log(`🔄 ${entry.message}`, data || "");
      storeLog(entry);
    },
  };
}

/**
 * Print all stored logs to console
 */
export function printStoredLogs(): void {
  const logs = getStoredLogs();
  
  if (logs.length === 0) {
    console.log("📋 No stored logs found");
    return;
  }
  
  console.group("📋 FPX Checkout Logs (Stored)");
  console.log(`Total logs: ${logs.length}`);
  console.log("---");
  
  logs.forEach((log, index) => {
    const emoji = {
      log: "🔵",
      info: "ℹ️",
      warn: "⚠️",
      error: "❌",
      success: "✅",
      redirect: "🔄",
    }[log.level] || "📝";
    
    const style = {
      log: "color: blue",
      info: "color: cyan",
      warn: "color: orange",
      error: "color: red",
      success: "color: green",
      redirect: "color: purple",
    }[log.level] || "";
    
    console.log(
      `%c${emoji} [${new Date(log.timestamp).toLocaleTimeString()}] ${log.message}`,
      style,
      log.data || ""
    );
  });
  
  console.groupEnd();
}

/**
 * Export logs as JSON string
 */
export function exportLogsAsJSON(): string {
  return JSON.stringify(getStoredLogs(), null, 2);
}

/**
 * Export logs as formatted text
 */
export function exportLogsAsText(): string {
  const logs = getStoredLogs();
  return logs
    .map((log) => {
      const emoji = {
        log: "🔵",
        info: "ℹ️",
        warn: "⚠️",
        error: "❌",
        success: "✅",
        redirect: "🔄",
      }[log.level] || "📝";
      
      const timestamp = new Date(log.timestamp).toLocaleString();
      const dataStr = log.data ? `\n  Data: ${JSON.stringify(log.data, null, 2)}` : "";
      return `${emoji} [${timestamp}] ${log.message}${dataStr}`;
    })
    .join("\n\n");
}

/**
 * Make logger utilities available globally for console access
 * Call window.viewFPXLogs() or window.clearFPXLogs() from browser console
 */
if (typeof window !== "undefined") {
  (window as unknown as { 
    viewFPXLogs: () => void;
    clearFPXLogs: () => void;
    exportFPXLogs: () => string;
  }).viewFPXLogs = printStoredLogs;
  
  (window as unknown as { 
    viewFPXLogs: () => void;
    clearFPXLogs: () => void;
    exportFPXLogs: () => string;
  }).clearFPXLogs = clearStoredLogs;
  
  (window as unknown as { 
    viewFPXLogs: () => void;
    clearFPXLogs: () => void;
    exportFPXLogs: () => string;
  }).exportFPXLogs = exportLogsAsText;
  
  console.log(
    "%c📋 FPX Checkout Logger Available",
    "color: green; font-weight: bold; font-size: 14px;",
    "\nUse these commands in console:\n" +
    "  • viewFPXLogs() - View all stored logs\n" +
    "  • clearFPXLogs() - Clear all stored logs\n" +
    "  • exportFPXLogs() - Export logs as text"
  );
}

