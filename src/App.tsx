import { GenericEvents } from "@newrelic/browser-agent/features/generic_events";
import { Logging } from "@newrelic/browser-agent/features/logging";
import { BrowserAgent } from "@newrelic/browser-agent/loaders/browser-agent";
import "./App.css";

let newrelicAgent: BrowserAgent | null = null;

// Initialize New Relic agent immediately
(async function initializeNewRelic() {
  if (window.NREUM?.log) {
    console.log(
      "New Relic already initialized via snippet, aborting instance creation."
    );
    return;
  }
  try {
    const response = await fetch("/config/newrelic-config.json");
    if (!response.ok) {
      throw new Error(
        `Failed to load New Relic configuration: ${response.status}`
      );
    }

    const config = await response.json();

    const browserAgentOptions = {
      info: config.info,
      init: config.init,
      loader_config: config.loader_config,
      features: [Logging, GenericEvents],
    };

    newrelicAgent = new BrowserAgent(browserAgentOptions);
  } catch (error) {
    console.error("Failed to initialize New Relic:", error);
  }
})();

function App() {
  return (
    <>
      <h1>New Relic Browser Test</h1>
      <div>
        <button
          onClick={() => {
            //@ts-ignore
            newrelic.log("my log message", {
              level: "debug",
              customAttributes: { myFavoriteApp: true },
            });
            //@ts-ignore
            newrelic.log("Global - Test Simple");
            log("Fn - Test Complex", LogLevel.DEBUG, {
              test: "2",
            });
          }}
        >
          Send logs to New Relic
        </button>
      </div>
    </>
  );
}

/**
 * Logs a message to New Relic
 * @param message The message to log
 * @param level The log level (default is `LogLevel.INFO`)
 * @param customAttrs Optional custom attributes to include with the log
 */
function log(
  message: string,
  level: LogLevel = LogLevel.INFO,
  customAttrs?: object
): void {
  const nr = newrelicAgent || window.NREUM;
  if (nr) {
    console.log(
      `${message} [CON] | ${level} | ${JSON.stringify(customAttrs || {})}`
    );
    nr.log(message + " [MSG]");
    nr.log(message + " [W/ LVL]", { level: level });
    nr.log(message + " [W/ LVL + ATT]", {
      level: level,
      customAttributes: customAttrs,
    });
  } else {
    console.error("New Relic is not initialized.");
  }
}

enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  TRACE = "TRACE",
}

declare global {
  interface Window {
    NREUM?: {
      log: (
        message: string,
        options?: { level?: string; customAttributes?: object }
      ) => void;
    };
  }
}

export default App;
