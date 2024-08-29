class WorkerManager {
    constructor() {
        this.worker = null;
        this.pyoidideReadyPromise = null;
        this.initialGlobals = new Set();
        this.onMessageCallback = null;
        this.onErrorCallback = null;
        this.initWorker();
    }


    initWorker() {
        const workerScript = `
            importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js');

            let pyodideReadyPromise = loadPyodide();
            let pyodide;
            let firstrun = true;
            let initialGlobals = new Set();

            async function resetPyodide() {
                const currentGlobals = new Set(pyodide.globals.keys());
                const globalsToClear = Array.from(currentGlobals).filter(x => !initialGlobals.has(x));
                for (const key of globalsToClear) {
                    pyodide.globals.delete(key);
                }
                console.log("Globals cleared:", globalsToClear);
            }


            onmessage = async (event) => {
                await pyodideReadyPromise;
                if (event.data.type === 'init') {
                    pyodide = await pyodideReadyPromise;
                }
                if (event.data.type === 'runCode') {
                    const { code } = event.data;
                    try {
                        await resetPyodide();
                        await pyodide.runPythonAsync(code);
                    } catch (err) {
                        postMessage({ type: 'stderr', 'msg': String(err) });
                    }
                }

                if (event.data.type === 'loadPackage') {
                    const { packages } = event.data;
                    try {
                        await pyodide.loadPackage(packages);
                        postMessage(JSON.stringify({ type: 'packagesLoaded' }));
                    } catch (err) {
                        postMessage(JSON.stringify({ type: 'stderr', msg: String(err)}));
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

    handleMessage(event) {
        let data;
        try {
            data = JSON.parse(event.data);
        } catch (e) {
            data = event.data;
        }
    
        if (this.onMessageCallback) {
            this.onMessageCallback(data);
        }
    }

    handleError(error) {
        if (this.onErrorCallback) {
            this.onErrorCallback(error);
        }
    }

    runCode(code) {
        this.worker.postMessage({ type: 'runCode', code });
    }

    loadPackages(packages) {
        this.worker.postMessage({ type: 'loadPackage', packages });
    }

    restartWorker() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }

        this.initWorker();
    }

    setMessageCallback(callback) {
        this.onMessageCallback = callback;
    }

    setErrorCallback(callback) {
        this.onErrorCallback = callback;
    }
}