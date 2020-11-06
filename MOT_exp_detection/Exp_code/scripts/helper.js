//Highlight correct targets
function showSolution(delta, objectBag, targetIndex) {
    
    for (var i = 0; i < numObj; i++) {
        if(delta[i] == 1
            && i == targetIndex) {
            new HLCircle(objectBag[i].x, objectBag[i].y, HLradius).correct();
        } else if(delta[i] == 1
            && i != targetIndex) {
                new HLCircle(objectBag[i].x, objectBag[i].y, HLradius).incorrect();
        } else if(delta[i] == 0
            && i == targetIndex) {
                new HLCircle(objectBag[i].x, objectBag[i].y, HLradius).correct();
        }
    }
}


//sleep function 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Check equality within an array
function isEqual(a, b) {
    let indicator = a[0]==b[0] && a[1]==b[1];
    return indicator;
}

//randomly sample a size of array
function randSample(arr, size) {
    let len = arr.length;
    let tmp = len;
    for (i = 0; i < (len - size); i++) {
        arr.splice(Math.floor(Math.random()*tmp), 1);
        tmp = tmp - 1;
    }
    return arr;
}

//check whether a is inside range_b
function checkInside(a, range_b) {
    let boolean = false;
    for(let i = 0; i < range_b.length; i++) {
        if(a == range_b[i]) {
            boolean = true;
            break;
        }
    }
    return boolean;
}

function trial_shuffle(array, len) {
    return shuffle(fillArray(array, len));
}

//create a range of number with start, end and step
var range = function (start, end, step) {
    var range = [];
    var typeofStart = typeof start;
    var typeofEnd = typeof end;

    if (step === 0) {
        throw TypeError("Step cannot be zero.");
    }

    if (typeofStart == "undefined" || typeofEnd == "undefined") {
        throw TypeError("Must pass start and end arguments.");
    } else if (typeofStart != typeofEnd) {
        throw TypeError("Start and end arguments must be of same type.");
    }

    typeof step == "undefined" && (step = 1);

    if (end < start) {
        step = -step;
    }

    if (typeofStart == "number") {

        while (step > 0 ? end >= start : end <= start) {
            range.push(start);
            start += step;
        }

    } else if (typeofStart == "string") {

        if (start.length != 1 || end.length != 1) {
            throw TypeError("Only strings with one character are supported.");
        }

        start = start.charCodeAt(0);
        end = end.charCodeAt(0);

        while (step > 0 ? end >= start : end <= start) {
            range.push(String.fromCharCode(start));
            start += step;
        }

    } else {
        throw TypeError("Only string and number types are supported");
    }

    return range;
}

//shuffle function
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

//repeat function
function fillArray(value, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr = arr.concat(value);
    }
    return arr;
}

var repeatelem = function (elem, n) {
    // returns an array with element elem repeated n times.
    var arr = [];
    for (var i = 0; i < n; i++) {
        arr = arr.concat(elem);
    };
    return arr;
};

//clone objects (hard copy)
function clone(obj) {
    if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

    if (obj instanceof Date)
        var temp = new obj.constructor(); //or new Date(obj);
    else
        var temp = obj.constructor();

    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = clone(obj[key]);
            delete obj['isActiveClone'];
        }
    }
    return temp;
}

//calculate the points with unit_len and center
// function points_cal(unit_len, center, ratio) {
//     let points = [];
//     g_1 = [
//         [
//             [-unit_len*ratio, -unit_len],
//             [-unit_len*(ratio+1), 0],
//             [-unit_len*ratio, unit_len]
//         ]
//     ];
//     g_2 = [
//         [
//             [-unit_len * ratio, -unit_len],
//             [0, 0],
//             [-unit_len * ratio, unit_len]
//         ]
//     ];
//     g_3 = [
//         [
//             [unit_len * ratio, -unit_len],
//             [unit_len * (ratio + 1), 0],
//             [unit_len * ratio, unit_len]
//         ]
//     ];
//     g_4 = [
//         [
//             [unit_len * ratio, -unit_len],
//             [0, 0],
//             [unit_len * ratio, unit_len]
//         ]
//     ];
//     g_5 = [
//         [
//             [-unit_len * ratio, unit_len],
//             [0, 2*unit_len],
//             [unit_len*ratio, unit_len]
//         ]
//     ];
//     g_6 = [
//         [
//             [-unit_len * ratio, unit_len],
//             [0, 0],
//             [unit_len * ratio, unit_len]
//         ]
//     ];
//     g_7 = [
//         [
//             [unit_len * ratio, -unit_len],
//             [0, -2*unit_len],
//             [-unit_len*ratio, -unit_len]
//         ]
//     ];
//     g_8 = [
//         [
//             [unit_len * ratio, -unit_len],
//             [0, 0],
//             [-unit_len * ratio, -unit_len]
//         ]
//     ];
//     newPoints = points.concat(g_1, g_2, g_3, g_4, g_5, g_6, g_7, g_8);
//     for (var i = 0; i < newPoints.length; i++) {
//         newPoints[i].map(function (x) {
//             x[0] = x[0] + center[0];
//             x[1] = -(x[1] - center[1]);
//         })
//     }
//     return newPoints;
// }

//calculate the points with unit_len and center
function points_cal(unit_len, center) {
    let points = [];
    g_1 = [
        [
            [-unit_len, -unit_len],
            [0, 0],
            [-unit_len, unit_len]
        ]
    ];
    g_2 = [
        [
            [-unit_len, -unit_len],
            [-2*unit_len, 0],
            [-unit_len, unit_len]
        ]
    ];
    g_3 = [
        [
            [unit_len, -unit_len],
            [0, 0],
            [unit_len, unit_len]
        ]
    ];
    g_4 = [
        [
            [unit_len, -unit_len],
            [2*unit_len, 0],
            [unit_len, unit_len]
        ]
    ];
    g_5 = [
        [
            [-unit_len, -unit_len],
            [0, 0],
            [unit_len, -unit_len]
        ]
    ];
    g_6 = [
        [
            [-unit_len, unit_len],
            [0, 0],
            [unit_len, unit_len]
        ]
    ];
    newPoints = points.concat(g_1, g_2, g_3, g_4,g_5,g_6);
    for (var i = 0; i < newPoints.length; i++) {
        newPoints[i].map(function (x) {
            x[0] = x[0] + center[0];
            x[1] = -(x[1] - center[1]);
        })
    }
    return newPoints;
}
//Specify the reference points
function ref_cal(center, unit_len) {
    let ref = [];
    r_1 = [
        [-unit_len, 0]
    ];
    r_2 = [
        [-unit_len, 0]
    ];
    r_3 = [
        [unit_len, 0]
    ];
    r_4 = [
        [unit_len, 0]
    ];
    r_5 = [
        [0, -unit_len]
    ];
    r_6 = [
        [0, unit_len]
    ];
    let newRef = ref.concat(r_1, r_2, r_3, r_4, r_5, r_6);

    newRef.map(function (x) {
        x[0] = x[0] + center[0];
        x[1] = -x[1] + center[1];
    });
    return newRef;
}

//compute arcLength
function arcLength(a, x) {
    arc_length = 2 * (2*a*x*Math.sqrt(4*a**2*x**2+1)+Math.asinh(2*a*x))/(4*a);
    return(arc_length)
}

//compute radius of a circle with arc_length
function radius_cal(arc_length) {
    return r = arc_length/(2 * Math.PI);
}

//generate 4 main positions for each center
function startP_generator(center, unit_len) {
    let startPoints = [];
    for(var i = 0; i < center.length; i++) {
        startPoints = startPoints.concat([startPosition(center[i], unit_len)]);
    }
    return startPoints;
}

//initialize the starting positions for the objects
function object_init(startPoints) {
    let init_pos = clone(startPoints);
    for (var i = 0; i < startPoints.length; i++) {
        num_1 = Math.floor(Math.random() * 4);
        num_2 = Math.floor(Math.random() * 3);
        num_3 = Math.floor(Math.random() * 2);
        init_pos[i].splice(num_1, 1);
        init_pos[i].splice(num_2, 1);
        init_pos[i].splice(num_3, 1);
    }
    return init_pos;
}

//generate all the points for all the centers and unit_len provided
function points_generator(center, unit_len) {
    let points = [];
    for(var i = 0; i < center.length; i++) {
        points = points.concat([points_cal(unit_len, center[i])]);
    }
    return points;
}


//generate all the ref points for all the centers and unit_len provided
function ref_generator(center, unit_len, ratio) {
    let ref = [];
    for (var i = 0; i < center.length; i++) {
        ref = ref.concat([ref_cal(center[i], unit_len, ratio)]);
    }
    return ref;
}

//round the start and end of each transition
function round_start(profile, path_length) {
    len = profile.length;
    for (let k = 0; k < len; k++) {
        for(let j = 0; j < 4; j++) {
            for(let i = 0; i < 5; i++) {
                profile[k][j][i][0][0] = Math.round(profile[k][j][i][0][0]);
                profile[k][j][i][0][1] = Math.round(profile[k][j][i][0][1]);
                profile[k][j][i][path_length - 1][0] = Math.round(profile[k][j][i][path_length - 1][0]);
                profile[k][j][i][path_length - 1][1] = Math.round(profile[k][j][i][path_length - 1][1]);
            }
        }
    }
    return profile;
}

//check the main position that the object is loacted at. 0 = left, 1 = top, 2 = right, 3 = bottom
function checkPos(end_point, startPoints) {
    let indexList = [];
    let profile_index = [];
    for (let j = 0; j < end_point.length; j++) {
        if (isEqual(end_point[j][0], startPoints[j][0])) {
            indexList.push(0);
        } else if (isEqual(end_point[j][0], startPoints[j][1])) {
            indexList.push(1);
        } else if (isEqual(end_point[j][0], startPoints[j][2])) {
            indexList.push(2);
        } else if (isEqual(end_point[j][0], startPoints[j][3])) {
            indexList.push(3);
        }
        profile_index.push(indexList);
        indexList = [];
    }
    return profile_index;
}

//Check if two objects are in opposite positions or neighbors 
function checkStatus(profile_index) {
    let status = [];
    for(let i = 0; i < profile_index.length; i++){
        if (Math.abs(profile_index[i][1] - profile_index[i][0]) == 2) {
            status.push(0);
        } else if (profile_index[i][0] == 1 && profile_index[i][1] == 2) {
            //1 = horizontal relaion
            status.push(1);
        } else if (profile_index[i][0] == 2 && profile_index[i][1] == 1) {
            status.push(1);
        } else if (profile_index[i][0] == 0 && profile_index[i][1] == 3) {
            status.push(1);
        } else if (profile_index[i][0] == 3 && profile_index[i][1] == 0) {
            status.push(1);
        } else if (profile_index[i][0] == 1 && profile_index[i][1] == 0) {
            // 2 = vertical relation
            status.push(2);
        } else if (profile_index[i][0] == 0 && profile_index[i][1] == 1) {
            status.push(2);
        } else if (profile_index[i][0] == 2 && profile_index[i][1] == 3) {
            status.push(2);
        } else if (profile_index[i][0] == 3 && profile_index[i][1] == 2) {
            status.push(2);
        }
    }
    return [status];
}


//update the object position
function newStartPoints(profile, profile_index, dir_index, path_length) {
    let tmp = [];
    let objectUpdate = [];
    const len = profile_index.length;
    for (var i = 0; i < len; i++) {
        tmp.push(profile[i][profile_index[i]][dir_index[i]][path_length - 1]);
        objectUpdate.push(tmp);
        tmp = [];
    }
    return objectUpdate;
}

//combine two arrays (2d)
function combineArray(arr_1, arr_2) {
    let len = arr_1.length;
    let tmp = [];
    let arr_3 = [];
    for(var i = 0; i < len; i++) {
        tmp = [[arr_1[i]].concat([arr_2[i]])];
        arr_3 = arr_3.concat(tmp);
        tmp = [];
    }
    return arr_3;
}

//add another array to a given one
function addArray(arr_1, arr_2) {
    let len = arr_1.length;
    for (var i = 0; i < len; i++) {
        arr_1[i].push(arr_2[i]);
    }
    return arr_1;
}

//concatenate two arrays (1d)
function concatArr(arr_1, arr_2) {
    let len = arr_1.length;
    let tmp = [];
    let arr_3 = [];
    for (var i = 0; i < len; i++) {
        tmp = [
            arr_1[i].concat(arr_2[i])
        ];
        arr_3 = arr_3.concat(tmp);
        tmp = [];
    }
    return arr_3;
}

//randomly pick a transition update for a given condition
function RandDir(profile_index) {
    let moves = [0,1,2]
    let len = profile_index.length;
    let dir_index = [];
    for (let j = 0; j < len; j++) {
        dir_index.push(moves[Math.floor(Math.random()*3)]);
    } 
    return dir_index;
}

function RandCrit_p(profile_index) {
    let moves = [0, 1, 2];
    let crit_moves = [3, 4];
    let rand_crit = Math.floor(Math.random() * 4)
    let len = profile_index.length;
    let dir_index = [];
    for (let j = 0; j < len; j++) {
        if (j == rand_crit) {
            dir_index.push(crit_moves[Math.floor(Math.random() * 2)]);
        } else {
            dir_index.push(moves[Math.floor(Math.random() * 3)]);
        }
    }
    console.log(rand_crit)
    return crit = {dir_index: dir_index,
    rand_crit: rand_crit};
}

function RandCrit_v(profile_index) {
    let moves = [0, 1, 2];
    let crit_moves = [5, 6, 7];
    let rand_crit = Math.floor(Math.random() * 4)
    let len = profile_index.length;
    let dir_index = [];
    for (let j = 0; j < len; j++) {
        if (j == rand_crit) {
            dir_index.push(crit_moves[Math.floor(Math.random() * 3)]);
        } else {
            dir_index.push(moves[Math.floor(Math.random() * 3)]);
        }
    }
    console.log(rand_crit)
    return crit = {
        dir_index: dir_index,
        rand_crit: rand_crit
    };
}

function RandCrit_a(profile_index) {
    let moves = [0, 1, 2];
    let crit_moves = [8, 9];
    let rand_crit = Math.floor(Math.random() * 4)
    let len = profile_index.length;
    let dir_index = [];
    for (let j = 0; j < len; j++) {
        if (j == rand_crit) {
            dir_index.push(crit_moves[Math.floor(Math.random() * 2)]);
        } else {
            dir_index.push(moves[Math.floor(Math.random() * 3)]);
        }
    }
    console.log(rand_crit)
    return crit = {
        dir_index: dir_index,
        rand_crit: rand_crit
    };
}

function RandCrit_other_1(profile_index) {
    let moves = [0, 1, 2];
    let crit_moves = [10, 11];
    let rand_crit = Math.floor(Math.random() * 4)
    let len = profile_index.length;
    let dir_index = [];
    for (let j = 0; j < len; j++) {
        if (j == rand_crit) {
            dir_index.push(crit_moves[Math.floor(Math.random() * 2)]);
        } else {
            dir_index.push(moves[Math.floor(Math.random() * 3)]);
        }
    }
    console.log(rand_crit)
    return crit = {
        dir_index: dir_index,
        rand_crit: rand_crit
    };
}

function RandCrit_other_2(profile_index) {
    let moves = [0, 1, 2];
    let crit_moves = [12, 13];
    let rand_crit = Math.floor(Math.random() * 4)
    let len = profile_index.length;
    let dir_index = [];
    for (let j = 0; j < len; j++) {
        if (j == rand_crit) {
            dir_index.push(crit_moves[Math.floor(Math.random() * 2)]);
        } else {
            dir_index.push(moves[Math.floor(Math.random() * 3)]);
        }
    }
    console.log(rand_crit)
    return crit = {
        dir_index: dir_index,
        rand_crit: rand_crit
    };
}

function RandCrit_other_3(profile_index) {
    let moves = [0, 1, 2];
    let crit_moves = [14, 15];
    let rand_crit = Math.floor(Math.random() * 4)
    let len = profile_index.length;
    let dir_index = [];
    for (let j = 0; j < len; j++) {
        if (j == rand_crit) {
            dir_index.push(crit_moves[Math.floor(Math.random() * 2)]);
        } else {
            dir_index.push(moves[Math.floor(Math.random() * 3)]);
        }
    }
    console.log(rand_crit)
    return crit = {
        dir_index: dir_index,
        rand_crit: rand_crit
    };
}

function RandCrit_other_4(profile_index) {
    let moves = [0, 1, 2];
    let crit_moves = [16, 17];
    let rand_crit = Math.floor(Math.random() * 4)
    let len = profile_index.length;
    let dir_index = [];
    for (let j = 0; j < len; j++) {
        if (j == rand_crit) {
            dir_index.push(crit_moves[Math.floor(Math.random() * 2)]);
        } else {
            dir_index.push(moves[Math.floor(Math.random() * 3)]);
        }
    }
    console.log(rand_crit)
    return crit = {
        dir_index: dir_index,
        rand_crit: rand_crit
    };
}

function RandCrit_other_5(profile_index) {
    let moves = [0, 1, 2];
    let crit_moves = [18, 19];
    let rand_crit = Math.floor(Math.random() * 4)
    let len = profile_index.length;
    let dir_index = [];
    for (let j = 0; j < len; j++) {
        if (j == rand_crit) {
            dir_index.push(crit_moves[Math.floor(Math.random() * 2)]);
        } else {
            dir_index.push(moves[Math.floor(Math.random() * 3)]);
        }
    }
    console.log(rand_crit)
    return crit = {
        dir_index: dir_index,
        rand_crit: rand_crit
    };
}
//transition to opposite main positions
function transferOpp(profile_index, status) {
    let len = profile_index.length;
    let dir_index = [];
    for(let j = 0; j < len; j++){
        if (status[j] == 0) {
            dir_index.push(rand_opp_to_opp(opp_to_opp));
        } else if (status[j] == 1) {
            // if (isEqual(profile_index[j], [0, 1]) ||
            //     isEqual(profile_index[j], [1, 2]) ||
            //     isEqual(profile_index[j], [2, 3]) ||
            //     isEqual(profile_index[j], [3, 0])) {
            //     dir_index.push(rand_nei_to_opp(nei_to_opp_0));
            // } else {
            //     dir_index.push(rand_nei_to_opp(nei_to_opp_1));
            // }
            dir_index.push(rand_nei_to_opp_1(nei_to_opp_1))
        } else if (status[j] == 2) {
            dir_index.push(rand_nei_to_opp_0(nei_to_opp_0))
        }
    }
    return dir_index;
}

//the critical transition for the velocity case where two objects intercept at the center
function velocity_crit(profile_index, hv) {
    let len = profile_index.length;
    let dir_index = [];
    for (let j = 0; j < len; j++) {
        if(hv == 0) {
            //vertical interception
            dir_index.push(crit_v_0);
        } else if (hv == 1) {
            //horizontal interception
            dir_index.push(crit_v_1);
        }
    }
    return dir_index;
}

//transition to neighboring main positions
function transferNei(profile_index, status, hv) {
    let len = profile_index.length;
    let dir_index = [];
    for(let j = 0; j < len; j++){
        if (status[j] == 0 && hv == 0) {
            //opp to vertical neighbors
            dir_index.push(rand_opp_to_nei_0(opp_to_nei_0));
        } else if (status[j] == 0 && hv == 1) {
            //opp to horizontal neighbors
            dir_index.push(rand_opp_to_nei_1(opp_to_nei_1));
        } else if (status[j] == 1 && hv == 0) {
            // if (isEqual(profile_index[j], [0, 1]) ||
            //     isEqual(profile_index[j], [1, 2]) ||
            //     isEqual(profile_index[j], [2, 3]) ||
            //     isEqual(profile_index[j], [3, 0])) {

            //horizontal to vertical
            dir_index.push(rand_nei_to_nei_1_0(nei_to_nei_1_0)); 
        } else if (status[j] == 1 && hv == 1) {
            //horizontal to horizontal
            dir_index.push(rand_nei_to_nei_1_1(nei_to_nei_1_1));
        } else if (status[j] == 2 && hv == 0) {
            // vertical to vertical
            dir_index.push(rand_nei_to_nei_0_0(nei_to_nei_0_0));
        } else if (status[j] == 2 && hv == 1) {
            //vertical to horizontal
            dir_index.push(rand_nei_to_nei_0_1(nei_to_nei_0_1));
        }
    }
    return dir_index
}

//the critical condition for the acceleration case where two neighoring objects intercept at the center
function acc_crit(profile_index, status) {
    let len = profile_index.length;
    let dir_index = [];
    for (let j = 0; j < len; j++) {
        if (status[j] == 2) {
            //vertical interception
            dir_index.push(crit_a_0);
        } else if (status[j] == 1) {
            //horizontal interception
            dir_index.push(crit_a_1);
        }
    }
    return dir_index;
}

//path data passed for anFmations
function object_path(profile, profile_index, dir_index) {
    let len = profile_index.length;
    let path_dat = [];
    let tmp_path = [];
    console.log(profile_index);
    console.log(dir_index)
    for(let i = 0; i < len; i++) {
        tmp_path = profile[i][profile_index[i]][dir_index[i]];
        path_dat = path_dat.concat([tmp_path]);
    }
    return path_dat;
}