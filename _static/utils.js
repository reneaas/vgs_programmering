// Helper function to generate a unique ID for each puzzle instance
function generateUUID() {
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, function () {
        const r = Math.random() * 16 | 0;
        return r.toString(16);
    });
}