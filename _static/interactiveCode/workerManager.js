// workerManager.js

class WorkerManager {
    static instance = null;

    static getInstance(preloadPackages = null) {
        if (!WorkerManager.instance) {
            WorkerManager.instance = new WorkerManager(preloadPackages);
        } else {
            // If preloadPackages is provided later, ensure the packages are loaded
            if (preloadPackages) {
                WorkerManager.instance.loadPackages(preloadPackages);
            }
        }
        return WorkerManager.instance;
    }

    constructor(preloadPackages = null) {
        if (WorkerManager.instance) {
            return WorkerManager.instance;
        }

        this.worker = null;
        this.callbacks = {}; // For managing callbacks with message IDs
        this.preloadPackages = preloadPackages;
        this.loadedPackages = new Set();
        this.packageLoadPromises = {}; // Map of packageRequestId to {resolve, reject, packages}
        console.log("Preload packages in WorkerManager:", this.preloadPackages);

        // Create a promise that resolves when the worker is ready and preloadPackages are loaded
        this.workerReadyPromise = new Promise((resolve, reject) => {
            this.workerReadyResolve = resolve;
            this.workerReadyReject = reject;
        });

        this.initWorker();

        WorkerManager.instance = this;
    }

    initWorker() {
        const workerScript = `
importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js');

let pyodideReadyPromise = loadPyodide();
let initialGlobals = new Set();

async function resetPyodide(pyodide, initialGlobals) {
    const currentGlobals = new Set(pyodide.globals.keys());
    const globalsToClear = Array.from(currentGlobals).filter(x => !initialGlobals.has(x));
    for (const key of globalsToClear) {
        pyodide.globals.delete(key);
    }
    console.log("Globals cleared:", globalsToClear);
}

onmessage = async (event) => {
    const messageId = event.data.messageId;
    if (event.data.type === 'init') {
        const pyodide = await pyodideReadyPromise;
        await pyodide.loadPackage("micropip");
        initialGlobals = new Set(pyodide.globals.keys());
        postMessage(JSON.stringify({ type: 'initReady' }));
    }
    if (event.data.type === 'runCode') {
        const { code } = event.data;
        try {
            const pyodide = await pyodideReadyPromise;
            await resetPyodide(pyodide, initialGlobals);

            // Prepare the Python code
            const pyCode = \`
import sys
import json
import micropip
from js import postMessage

class PyConsole:
    def __init__(self, messageId):
        self.messageId = messageId
        self.buffer = ""

    def write(self, msg):
        self.buffer += msg
        if "\\\\n" in msg:
            self.flush()

    def flush(self):
        if self.buffer:
            postMessage(json.dumps({'type': 'stdout', 'msg': self.buffer, 'messageId': self.messageId}))
            self.buffer = ""

sys.stdout = PyConsole("\${messageId}")
sys.stderr = PyConsole("\${messageId}")
\`;

            await pyodide.runPythonAsync(pyCode);

            await pyodide.runPythonAsync(code);
            postMessage(JSON.stringify({ type: 'executionComplete', messageId }));
        } catch (err) {
            postMessage(JSON.stringify({ type: 'stderr', msg: String(err), messageId }));
        }
    }

    if (event.data.type === 'loadPackage') {
        const { packages, packageRequestId } = event.data;
        try {
            const pyodide = await pyodideReadyPromise;
            console.log("Loading packages:", packages);
            const filteredPackages = packages.filter(pkg => pkg !== "casify");
            await pyodide.loadPackage(filteredPackages);
            
            // Custom installation of casify package if present in the package list.
            if (packages.includes('casify')) {
                await pyodide.loadPackage("micropip");
                await pyodide.runPythonAsync("import micropip; await micropip.install('casify')");
            }

            console.log("Packages loaded:", packages);
            postMessage(JSON.stringify({ type: 'packagesLoaded', packageRequestId }));
        } catch (err) {
            postMessage(JSON.stringify({ type: 'stderr', msg: String(err), packageRequestId }));
        }
    }
};
`;

        const workerBlob = new Blob([workerScript], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(workerBlob));

        this.worker.onmessage = this.handleMessage.bind(this);
        this.worker.onerror = this.handleError.bind(this);

        this.worker.postMessage({ type: 'init' });
    }

    generateMessageId() {
        return 'msg-' + Math.random().toString(36).substr(2, 9);
    }

    loadPackages(packages) {
        const packagesToLoad = packages.filter(pkg => !this.loadedPackages.has(pkg));

        if (packagesToLoad.length === 0) {
            // All packages are already loaded
            return Promise.resolve();
        }

        // Create a unique ID for this package load request
        const packageRequestId = 'pkg-' + Math.random().toString(36).substr(2, 9);

        return new Promise((resolve, reject) => {
            // Store the resolve and reject functions
            this.packageLoadPromises[packageRequestId] = { resolve, reject, packages: packagesToLoad };
            this.worker.postMessage({ type: 'loadPackage', packages: packagesToLoad, packageRequestId });
        });
    }

    runCode(code, onMessageCallback) {
        const messageId = this.generateMessageId();
        this.callbacks[messageId] = onMessageCallback;
        this.worker.postMessage({ type: 'runCode', code, messageId });
        return messageId;
    }

    handleMessage(event) {
        let data;
        try {
            data = JSON.parse(event.data);
        } catch (e) {
            console.error("Failed to parse message from worker:", event.data);
            return;
        }

        const messageId = data.messageId;
        const packageRequestId = data.packageRequestId;

        if (messageId && this.callbacks[messageId]) {
            this.callbacks[messageId](data);

            // Optionally remove the callback if execution is complete
            if (data.type === 'executionComplete') {
                delete this.callbacks[messageId];
            }
        } else if (packageRequestId && this.packageLoadPromises[packageRequestId]) {
            const packagePromise = this.packageLoadPromises[packageRequestId];
            if (data.type === 'packagesLoaded') {
                // Mark packages as loaded
                for (const pkg of packagePromise.packages) {
                    this.loadedPackages.add(pkg);
                }
                packagePromise.resolve();
            } else if (data.type === 'stderr') {
                packagePromise.reject(new Error(data.msg));
            }
            delete this.packageLoadPromises[packageRequestId];
        } else {
            // Handle messages without messageId, like 'initReady'
            if (data.type === 'initReady') {
                console.log("Worker initialization message:", data.type);
                // Now load preloadPackages if any
                if (this.preloadPackages && this.preloadPackages.length > 0) {
                    this.loadPackages(this.preloadPackages)
                        .then(() => {
                            console.log("Preload packages loaded:", this.preloadPackages);
                            this.workerReadyResolve();
                        })
                        .catch((err) => {
                            console.error("Failed to load preload packages:", err);
                            this.workerReadyReject(err);
                        });
                } else {
                    this.workerReadyResolve();
                }
            } else {
                console.warn("Unhandled message from worker:", data);
            }
        }
    }

    handleError(error) {
        console.error("Worker error:", error);
        if (this.workerReadyReject) {
            this.workerReadyReject(error);
        }
    }

    restartWorker() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }

        // Reset loaded packages and create a new workerReadyPromise
        this.loadedPackages = new Set();
        this.workerReadyPromise = new Promise((resolve, reject) => {
            this.workerReadyResolve = resolve;
            this.workerReadyReject = reject;
        });

        this.initWorker();
    }
}
