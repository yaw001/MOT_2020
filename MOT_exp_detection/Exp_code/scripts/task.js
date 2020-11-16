var client = parseClient();
var circleArray = [];
var targetIndex = [];
var numObj = 4;
var targetIndex = range(0, numObj - 2, 2);
var numTarget = targetIndex.length;
var radius = canvas.height / 36;
var HLradius = radius + 10;
var idx;
var highLightX = [];
var highLightY = [];
var highLCircle = [];
var id;
var trialNumber = 0;
var trialData = [];

var shuffled_trials = trial_shuffle([0, 1, 2, 3, 4, 5, 6, 7], expt.maxTrials/8);

//horizontal and vertical identifier 
var btn = document.getElementById("btnStart");

var crit_idx = [0, 1 ,2, 3, 4, 5, 6, 7];

//Parameter specifications for initializations of paths
//rotation direction indicator
binary = [0, 1];
unit_len_2 = Math.round(canvas.height / 25);


//Fixation point
center_X = canvas.width / 2;
center_Y = canvas.height / 2;
fixation_len = unit_len_2;
fixation_plus = new fixation(center_X, center_Y, fixation_len);
fixation_plus.draw();

function path_and_number_init(trialNumber) {
    crit_shuffled = crit_idx[shuffled_trials[trialNumber]];
    jumps = 1;
    critical_time = 1;
    binary = [0, 1];
    unit_len = Math.round(canvas.height / 6);
    center = [
        [Math.round(canvas.width / 4), Math.round(canvas.height / 4)],
        [3 * Math.round(canvas.width / 4), Math.round(canvas.height / 4)],
        [3 * Math.round(canvas.width / 4), 3 * Math.round(canvas.height / 4)],
        [Math.round(canvas.width / 4), 3 * Math.round(canvas.height / 4)]
    ];
    //4 start(end) positions
    startPoints = startP_generator(center, unit_len);
    //interpolation step length
    step_len_path = unit_len * 2 / (trackTime / jumps / interval);
    x = range(-unit_len, unit_len, step_len_path).concat(unit_len);
    //All the vertices and intersections used for interpolation
    points = points_generator(center, unit_len);
    //The reference points of rotations
    ref = ref_generator(center, unit_len);
    //Generate path profile
    profile_with_crit = pairs_profile_generator(points, ref, x, binary);
    path_length = profile_with_crit[0][0][0].length;
    profile_with_crit = round_start(profile_with_crit, path_length);
    objectBag = object_init(startPoints);
    // Randomized critical index (total number of critical conditions should not be greater than jumps - 3)
    critical_range = range(2, jumps - 2, 1);
    critical_idx = randSample(critical_range, critical_time);
    // critical_index = 0;
    // path_dat = case_path_generator(startPoints, objectBag, profile_with_crit, path_length, jumps, crit_shuffled);
    path_dat = case_path_generator_one_jump(startPoints, objectBag, profile_with_crit, path_length, jumps, crit_shuffled);
    return init_info = {
        trial_type: crit_shuffled,
        rand_crit: crit.rand_crit,
        objectBag: objectBag,
        path_dat: path_dat
    }
}

//object_init function new trials 
//initilization 
function init(objectBag) {
    circleArray = [];
    console.log(objectBag[0][0])
    for (var i = 0; i < numObj; i++) {
        circleArray.push(new Circle(objectBag[i][0][0], objectBag[i][0][1], radius));
        circleArray.map(x => x.draw());
    }
    return circleArray;
}
//Highlight circle initialization
// function initHL(objectBag) {
//     highLCircle = [];
//     for (var i = 0; i < numPair; i++) {
//         highLightX = objectBag[i][0][0];
//         highLightY = objectBag[i][0][1];
//         highLCircle.push(new HLCircle(highLightX, highLightY, HLradius));
//     }
//     highLCircle.map(x => x.draw());
//     return highLCircle;
// }


// function init_path(critical_index, startPoints, objectBag, profile, path_length, jumps) {
//     let path_dat;
//     if (critical_index == 0) {
//         path_dat = position_case(startPoints, objectBag, profile, path_length, jumps);
//     } else if (critical_index == 1) {
//         path_dat = velocity_case(startPoints, objectBag, profile, path_length, jumps);
//     } else if (critical_index == 2) {
//         path_dat = acceleration_case(startPoints, objectBag, profile, path_length, jumps);
//     }
//     return path_dat;
// }

// function init_path(critical_index, startPoints, objectBag, profile, path_length, jumps, hv) {
//     let path_dat;
//     if (critical_index == 0) {
//         path_dat = position_case(startPoints, objectBag, profile, path_length, jumps);
//     } else if (critical_index == 1) {
//         path_dat = velocity_case(startPoints, objectBag, profile, path_length, jumps, hv);
//     } else if (critical_index == 2) {
//         path_dat = acceleration_case(startPoints, objectBag, profile, path_length, jumps, hv);
//     }
//     return path_dat;
// }



// animate is a callback function
// Simply put: A callback is a function that is to be executed after another
// function has finished executing — hence the name ‘call back’.
// More complexly put: In JavaScript, functions are objects. 
// Because of this, functions can take functions as arguments, 
// and can be returned by other functions. 
// Functions that do this are called higher-order functions.
// Any function that is passed as an argument is called a callback function

async function animate(path_dat) {
    const len = objectBag.length;
    let timePassed = 0;
    var count = 0;
    let startTime = Date.now();
    console.log(path_dat)
    while (timePassed < trackTime + 1000) {
        function frame() {
            c.clearRect(0, 0, innerWidth, innerHeight);
            fixation_plus = new fixation(center_X, center_Y, fixation_len);
            fixation_plus.draw();
            for (var i = 0; i < len; i++) {
                if (count < (jumps * path_length - 1)) {
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
            start(path_dat);
        },
        2000);
    setTimeout(function () {
            stop();
        },
        2000 + trackTime + 100);
}

var delta = [0, 0, 0, 0]
var delta_list = [0, 0, 0, 0];
//Target clicking function    
function clickTarget() {
    // var delta = [];
    var tmp;
    // for (var i = 0; i < numObj; i++){
    //     delta.push(0);
    // }
    var deltaSum = 0;
    if (!submit) {
        if (deltaSum != 1) {
            btn.disabled = true;
        }
        document.querySelector("canvas").addEventListener("click", click_fcn = function (e) {

            var cx = e.clientX;
            var cy = e.clientY;
            var rect = this.getBoundingClientRect();
            for (var i = 0; i < numObj; i++) {
                if (Math.pow(cx - rect.left - circleArray[i].x, 2) +
                    Math.pow(cy - rect.top - circleArray[i].y, 2) <=
                    Math.pow(radius, 2) &&
                    delta[i] == 0 &&
                    deltaSum < 1) {
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
            if (deltaSum == 1) {
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
    return result = {
        click_behavior: delta_list,
        selected_targets: delta_list[delta_list.length - 1]
    }
}

//Do I return the trialData
function trialDone(time_1,rand_crit, trialType) {
    trial_time = Date.now() - time_1;
    trialData.push({
        trialNumber: trialNumber,
        trialType: trialType,
        transition_coord: path_dat.objectBag,
        transition_index: path_dat.profile_index,
        transition_path: path_dat.dir_index,
        // path_coord: path_dat.path_coordinates,
        // click_behavior: result.click_behavior,
        selected_targets: result.selected_targets,
        rand_crit: rand_crit,
        trial_time: trial_time
    });
    console.log(trialData)
    trialNumber++;
    if (trialNumber < expt.maxTrials) {
        c.clearRect(0, 0, canvas.width, canvas.height);
        btn.disabled = false;
        btn.innerHTML = "Start";
        fixation_plus.draw();
        document.querySelector("canvas").style.pointerEvents = 'auto';
    } else {
        data = {
            client: client,
            trials: trialData
        };
        writeServer(data);
        document.getElementById('completed').style.display = "block";
        document.getElementById('ad').style.display = 'none';
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
document.querySelector("#btnStart").addEventListener('click', function () {
    if (btn.innerHTML == "Start") {
        init_info = path_and_number_init(trialNumber);
        console.log(path_and_number_init(trialNumber));
        trial(init_info.objectBag, init_info.path_dat);
        submit = false;
    } else if (btn.innerHTML == "Submit") {
        submit = true;
        clickTarget();
        console.log(result.selected_targets)
        showSolution(result.selected_targets, circleArray, init_info.rand_crit);
        delta = [0, 0, 0, 0];
        delta_list = [0, 0, 0, 0];
        btn.innerHTML = "Next";
        btn.disabled = false;
        document.querySelector("canvas").removeEventListener("click", click_fcn)
    } else if (btn.innerHTML = "Next") {
        trialDone(time_1, init_info.rand_crit, init_info.trial_type);
    }
})
