// workerManager.js

class WorkerManager {
    static instance = null;

    static getInstance(preloadPackages = null) {
        if (!WorkerManager.instance) {
            // Default PYODIDE packages (micropip is needed for custom packages)
            const defaultPreloadPackages = ['matplotlib', 'numpy', 'scipy', 'sympy', 'micropip'];
            const combinedPreloadPackages = Array.from(new Set(preloadPackages ? [...defaultPreloadPackages, ...preloadPackages] : defaultPreloadPackages));
            WorkerManager.instance = new WorkerManager(combinedPreloadPackages);
        } else if (preloadPackages) {
             // Only load packages that are NOT already loaded.
            const packagesToLoad = preloadPackages.filter(pkg => !WorkerManager.instance.loadedPackages.has(pkg));
            const combinedPreloadPackages = Array.from(new Set(['matplotlib', 'numpy', 'scipy', 'sympy', 'micropip', ...packagesToLoad]));
            if (combinedPreloadPackages.length > 0) {
                WorkerManager.instance.loadPackages(combinedPreloadPackages);
            }
        }
        return WorkerManager.instance;
    }

    constructor(preloadPackages = []) { // Corrected default
        if (WorkerManager.instance) {
            return WorkerManager.instance;
        }

        this.worker = null;
        this.callbacks = {};
        this.preloadPackages = preloadPackages;
        this.loadedPackages = new Set();
        this.packageLoadPromises = {};
        console.log("Preload packages in WorkerManager:", this.preloadPackages);

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

// Helper function to install packages via micropip
async function installPackages(pyodide, packages) {
    if (packages.length > 0) {
        await pyodide.loadPackage("micropip"); // Load micropip
        const micropip = pyodide.pyimport("micropip");
        await micropip.install(packages);
    }
}

onmessage = async (event) => {
    const messageId = event.data.messageId;

    if (event.data.type === 'init') {
        const { preloadPackages } = event.data; // Receive preloadPackages
        const pyodide = await pyodideReadyPromise;
        initialGlobals = new Set(pyodide.globals.keys());

        // Separate Pyodide packages from PyPI packages
        const pyodidePackages = preloadPackages.filter(pkg => ['matplotlib', 'numpy', 'scipy', 'sympy', 'micropip'].includes(pkg));
        const pypiPackages = preloadPackages.filter(pkg => !['matplotlib', 'numpy', 'scipy', 'sympy', 'micropip'].includes(pkg));

        // Load Pyodide packages
        if (pyodidePackages.length > 0) {
            await pyodide.loadPackage(pyodidePackages);
        }

        // Install PyPI packages using micropip
        await installPackages(pyodide, pypiPackages);

        postMessage(JSON.stringify({ type: 'initReady' })); // Send AFTER preloading
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
import io
import base64
from js import postMessage
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

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

# Override plt.show()
def show_override(messageId):
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    fig = plt.gcf()
    width_in = fig.get_figwidth()
    height_in = fig.get_figheight()
    dpi = fig.get_dpi()
    width_px = int(width_in * dpi)
    height_px = int(height_in * dpi)
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    postMessage(json.dumps({
        'type': 'plot',
        'data': image_base64,
        'messageId': messageId,
        'width': width_px,
        'height': height_px
    }))
    plt.clf()
    # Add a newline after the plot
    sys.stdout.write('\\\\n')
    sys.stdout.write('\\\\n')
    sys.stdout.flush()

plt.show = lambda: show_override("\${messageId}")
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

            // Separate Pyodide packages from PyPI packages
            const pyodidePackages = packages.filter(pkg => ['matplotlib', 'numpy', 'scipy', 'sympy', 'micropip'].includes(pkg));
            const pypiPackages = packages.filter(pkg => !['matplotlib', 'numpy', 'scipy', 'sympy', 'micropip'].includes(pkg));

            // Load Pyodide packages directly
            if (pyodidePackages.length > 0) {
                await pyodide.loadPackage(pyodidePackages);
            }

            // Install custom packages using micropip
            await installPackages(pyodide, pypiPackages);

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

        // Send preloadPackages with the init message!
        this.worker.postMessage({ type: 'init', preloadPackages: this.preloadPackages });
    }

    generateMessageId() {
        return 'msg-' + Math.random().toString(36).substr(2, 9);
    }

    loadPackages(packages) {
        const packagesToLoad = packages.filter(pkg => !this.loadedPackages.has(pkg));

        if (packagesToLoad.length === 0) {
            return Promise.resolve(); // All packages already loaded
        }

        const packageRequestId = 'pkg-' + Math.random().toString(36).substr(2, 9);

        return new Promise((resolve, reject) => {
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

            if (data.type === 'executionComplete') {
                delete this.callbacks[messageId];
            }
        } else if (packageRequestId && this.packageLoadPromises[packageRequestId]) {
            const packagePromise = this.packageLoadPromises[packageRequestId];
            if (data.type === 'packagesLoaded') {
                for (const pkg of packagePromise.packages) {
                    this.loadedPackages.add(pkg);
                }
                packagePromise.resolve();
            } else if (data.type === 'stderr') {
                packagePromise.reject(new Error(data.msg));
            }
            delete this.packageLoadPromises[packageRequestId];
        } else {
            if (data.type === 'initReady') {
                console.log("Worker initialization message:", data.type);
                this.workerReadyResolve(); // Resolve *after* preloading is done in the worker.
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

        this.loadedPackages = new Set();
        this.workerReadyPromise = new Promise((resolve, reject) => {
            this.workerReadyResolve = resolve;
            this.workerReadyReject = reject;
        });

        this.initWorker();
    }
}