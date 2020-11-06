var client = parseClient();
var circleArray = [];
var targetIndex = [];
var numObj = 8;
var targetIndex = range(0, numObj - 2, 2);
var numTarget = targetIndex.length;
var numPair = numObj/2;
var numDistractor = numObj - numTarget;
var radius = canvas.height / 36;
var HLradius = radius + 10;
var idx;
var highLightX = [];
var highLightY = [];
var highLCircle = [];
var id;
var trialNumber = 0;
var trialData = [];
var shuffled_trials = trial_shuffle([0, 1, 2], expt.maxTrials/3);

//unblock trials 
console.log(shuffled_trials)

//Fixation point
center_X = canvas.width/2;
center_Y = canvas.height/2;
fixation_len = unit_len/5;
fixation_plus = new fixation(center_X, center_Y, fixation_len);
fixation_plus.draw();

function path_and_number_init(startPoints, trialNumber) {
    objectBag = object_init(startPoints);
    critical_index = shuffled_trials[trialNumber];
    path_dat = init_path(critical_index, startPoints, objectBag, profile, path_length, jumps);
    return init_info = {
        objectBag: objectBag,
        critical_index: critical_index,
        path_dat: path_dat
    }
}

//object_init function new trials 
//initilization 
function init(objectBag) {
    circleArray = [];
    for (var i = 0; i < numPair; i++) {
        for (var j = 0; j < 2; j++){ 
            circleArray.push(new Circle(objectBag[i][j][0],objectBag[i][j][1],radius));
        }
        circleArray.map(x=>x.draw());
    }
    return circleArray;
}

//Highlight circle initialization
function initHL(objectBag){
    highLCircle = [];
    for (var i = 0; i < numPair; i++) {
        highLightX = objectBag[i][0][0];
        highLightY = objectBag[i][0][1];
        highLCircle.push(new HLCircle(highLightX, highLightY, HLradius));
    }
    highLCircle.map(x=>x.draw());
    return highLCircle;
}


function init_path(critical_index, startPoints, objectBag, profile, path_length, jumps) {
    let path_dat;
    if (critical_index == 0) {
        path_dat = position_case(startPoints, objectBag, profile, path_length, jumps);
    } else if (critical_index == 1) {
        path_dat = velocity_case(startPoints, objectBag, profile, path_length, jumps);
    } else if (critical_index == 2) {
        path_dat = acceleration_case(startPoints, objectBag, profile, path_length, jumps);
    }
    return path_dat;
}

//Animation
async function animate(path_dat) {
    const len = objectBag.length * 2;
    let timePassed = 0;
    var count = 0;
    let startTime = Date.now();
    while (timePassed < trackTime + 1000) {
        function frame() {
            c.clearRect(0, 0, innerWidth, innerHeight);
            fixation_plus = new fixation(center_X, center_Y, fixation_len);
            fixation_plus.draw();
            for (var i = 0; i < len; i++) {
                if(count < (jumps * path_length-1)) {
                    circleArray[i] = new Circle(path_dat.path_coordinates[i][count][0],
                    path_dat.path_coordinates[i][count][1], radius);
                    circleArray[i].draw();
                } else {
                    circleArray[i] = new Circle(path_dat.path_coordinates[i][(jumps * path_length - 1)][0],
                        path_dat.path_coordinates[i][(jumps * path_length - 1)][1], radius);
                    circleArray[i].draw();
                }
            }
            count += 1;
        }
        Stamp = Date.now();
        frame();
        funRT = Date.now() - Stamp;
        restTime = interval - funRT;
        if (funRT < interval) {
            await sleep(restTime - 1);
        }
        timePassed = Date.now() - startTime;
    }
    return circleArray;
}

// Animation Start function
function start(path_dat) {
    time_1 = Date.now();
    animate(path_dat);
    return time_1;
}

//Stop function
var submit;
function stop() {
    clearInterval(id);
    btn.disabled = false;
    btn.innerHTML = "Submit";
    clickTarget();
}

//click event: initialization, after 2s, highlight shown for 3s,
//start moving, track for "trackTime"
function trial(objectBag, path_dat) {
    init(objectBag);
    setTimeout(function () {
            initHL(objectBag);
        },
        2000);
    setTimeout(function () {
            start(path_dat);
        },
        5000);

    setTimeout(function () {
            stop();
        },
        5000 + trackTime + 200);
}


//Target clicking function    
var delta = [0, 0, 0, 0, 0, 0, 0, 0]
var delta_list = [0, 0, 0, 0, 0, 0, 0, 0];
function clickTarget() {
    var tmp;
    var deltaSum = 0;
    if (!submit) {
        if (deltaSum != 4) {
            btn.disabled = true;
        }
        document.querySelector("canvas").addEventListener("click", click_fcn = function (e) {
            var cx = e.clientX;
            var cy = e.clientY;
            var rect = this.getBoundingClientRect();
            for(var i = 0; i < numObj; i++){
                if(checkInside(i, [0, 2, 4, 6])) {
                    if (Math.pow(cx - rect.left - circleArray[i].x, 2) +
                        Math.pow(cy - rect.top - circleArray[i].y, 2) <=
                        Math.pow(radius, 2)
                        && delta[i] == 0
                        && delta[i+1] == 0
                        && deltaSum < numTarget) {
                        circleArray[i].clicked_do();
                        delta[i] = 1;
                        deltaSum += 1;
                        break;
                    }
                    if (Math.pow(cx - rect.left - circleArray[i].x, 2) +
                        Math.pow(cy - rect.top - circleArray[i].y, 2) <=
                        Math.pow(radius, 2) 
                        && delta[i] == 1) {
                        circleArray[i].clicked_undo();
                        delta[i] = 0;
                        deltaSum -= 1;
                        break;
                    }
                }
                if (checkInside(i, [1, 3, 5, 7])) {
                    if (Math.pow(cx - rect.left - circleArray[i].x, 2) +
                        Math.pow(cy - rect.top - circleArray[i].y, 2) <=
                        Math.pow(radius, 2) &&
                        delta[i] == 0 &&
                        delta[i - 1] == 0 &&
                        deltaSum < numTarget) {
                        circleArray[i].clicked_do();
                        delta[i] = 1;
                        deltaSum += 1;
                        break;
                    }
                    if (Math.pow(cx - rect.left - circleArray[i].x, 2) +
                        Math.pow(cy - rect.top - circleArray[i].y, 2) <=
                        Math.pow(radius, 2) &&
                        delta[i] == 1) {
                        circleArray[i].clicked_undo();
                        delta[i] = 0;
                        deltaSum -= 1;
                        break;
                    }
                }
            }
            if (deltaSum == 4) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
            tmp = clone(delta);
            //record the click events and store the picks in delta_list
            delta_list = delta_list.concat([tmp]);
        });
    } else {
        //disable the click event
        document.querySelector("canvas").style.pointerEvents = 'none';
    }
    return result = {click_behavior: delta_list,
        selected_targets: delta_list[delta_list.length - 1]
    }
}

//Do I return the trialData
function trialDone(time_1) {
    trial_time = Date.now() - time_1;
    trialData.push({
        trialType: shuffled_trials[trialNumber],
        trialNumber: trialNumber,
        transition_coord: path_dat.objectBag,
        transition_index: path_dat.profile_index,
        transition_status: path_dat.status,
        transition_path: path_dat.dir_index,
        // path_coord: path_dat.path_coordinates,
        // click_behavior: result.click_behavior,
        selected_targets: result.selected_targets,
        trial_time: trial_time
    });
    console.log(path_dat.objectBag)
    trialNumber++; 
    if (trialNumber < expt.maxTrials) {
        c.clearRect(0, 0, canvas.width, canvas.height);
        btn.disabled = false;
        btn.innerHTML = "Start";
        fixation_plus.draw();
        document.querySelector("canvas").style.pointerEvents = 'auto';
    } else {
        data = {client: client, trials: trialData};
        writeServer(data);
        document.getElementById('completed').style.display = "block";
        document.getElementById('MOT').style.display = 'none';
    }
    return trialNumber;
}
function experimentDone() {
    submitExternal(client);
}

//Disable Start button after clicking
document.querySelector('#btnStart').addEventListener('click', function () {
    btn.disabled = true;
});

//Three events defined after clicking the button
document.querySelector("#btnStart").addEventListener('click', function() {
    if (btn.innerHTML == "Start"){
        init_info = path_and_number_init(startPoints, trialNumber);
        trial(init_info.objectBag, init_info.path_dat);
        submit = false;
    }
    else if (btn.innerHTML == "Submit") {
        submit = true;
        clickTarget();
        showSolution(result.selected_targets, circleArray, targetIndex);
        delta = [0,0,0,0,0,0,0,0];
        delta_list = [0,0,0,0,0,0,0,0];
        btn.innerHTML = "Next";
        btn.disabled = false;
        document.querySelector("canvas").removeEventListener("click", click_fcn)
    } else if(btn.innerHTML = "Next") {
        trialDone(time_1);
    }
})

