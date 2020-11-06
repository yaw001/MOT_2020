// experiment settings
var expt = {
    name: 'MOT',
    maxTrials: 45,
    saveURL: 'submit.simple.php',
    sona: {
        experiment_id: 1454,
        credit_token: 'e6ea9243f00448a994bc2631cd462c35'
    }
};

function debugLog(message) {
    if (expt.debug) {
        console.log(message);
    }
}