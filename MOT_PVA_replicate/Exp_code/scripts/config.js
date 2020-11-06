// experiment settings
var expt = {
    name: 'MOT',
    maxTrials: 48,
    saveURL: 'submit.simple.php',
    sona: {
        experiment_id: 1826,
        credit_token: 'e98fb1903d964c3fab72d5afd11e2a96'
    }
};

function debugLog(message) {
    if (expt.debug) {
        console.log(message);
    }
}