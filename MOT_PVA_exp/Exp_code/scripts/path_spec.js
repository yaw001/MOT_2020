var jumps = 8;
var critical_time = 1;
var trackTime = 8000;
var interval = 10;
var objectBag;

var btn = document.getElementById("btnStart");
// Create a variable 'canvas' and select the canvas element from the HTML
// assign the canvas element to the variable 'canvas' so that we can 
// manipulate it.
var canvas = document.querySelector('canvas');
// Specify the width and height of the canvas
// Make it cover the full window (not including the margin (8px))
var height = window.innerHeight - 50;
var width = (window.innerWidth / 26)*20;
var edge_len = Math.min(height,width);
console.log(height)
console.log(width)
console.log(edge_len)
canvas.height = edge_len;
canvas.width = edge_len + 250;
console.log(canvas.height)
console.log(canvas.width)

//Create a variable c (meaning 'Context')
//.getContext('2d') we can now manipulate the 2d context ('c') of the canvas
var c = canvas.getContext('2d');

// Rotate the axes
rotation_mat_1 = [
    [Math.sqrt(2) / 2, -Math.sqrt(2) / 2],
    [Math.sqrt(2) / 2, Math.sqrt(2) / 2]
];
rotation_mat_2 = [
    [Math.sqrt(2) / 2, Math.sqrt(2) / 2],
    [-Math.sqrt(2) / 2, Math.sqrt(2) / 2]
];

//coordinates transformations, return a, b parameters of the parabola
function shift_rotate_points(ref, points, indicator) {
    var points_rotate = [
        [0, 0],
        [0, 0],
        [0, 0]
    ];
    points_shift = clone(points);
    points_shift.map(function (x) {
        x[0] = x[0] - ref[0];
        x[1] = -x[1] + ref[1];
    });
    for (var i = 0; i < points.length; i++) {
        for (var j = 0; j < 2; j++) {
            if(indicator){
                points_rotate[i][j] = rotation_mat_2[j][0] * points_shift[i][0] +
                rotation_mat_2[j][1] * points_shift[i][1];
            }else{
                points_rotate[i][j] = rotation_mat_1[j][0] * points_shift[i][0] +
                rotation_mat_1[j][1] * points_shift[i][1];
            }
        }
    }
    a = points_rotate[1][1] / (points_rotate[0][0] * points_rotate[2][0]);
    b = points_rotate[1][1];
    return [a, b];
}

//Given the range of x, interpolate the path using the parabola with parameters a and b
function interpolation(x, a, b) {
    let y = [];
    let points = [];
    let tmp = [];
    y = x.map(x => x ** 2 * a + b);
    for (var i = 0; i < x.length; i++) {
        tmp = [x[i], y[i]];
        points.push(tmp);
        tmp = [];
    }
    return points;
}

//Transform back to the original coordinate system of the canvas
function transform_back(points, ref, indicator) {
    var points_transform = [];
    for (var i = 0; i < points.length; i++) {
        var points_rotate = [];
        for (var j = 0; j < 2; j++) {
            if(indicator) {
                points_rotate.push(rotation_mat_1[j][0] * points[i][0] +
                    rotation_mat_1[j][1] * points[i][1]);
            }else {
                points_rotate.push(rotation_mat_2[j][0] * points[i][0] +
                    rotation_mat_2[j][1] * points[i][1]);
            }
        }
        points_transform.push(points_rotate);
    }
    points_transform.map(function (x) {
        x[0] = x[0] + ref[0];
        x[1] = -(x[1] - ref[1]);
    });
    return points_transform;
}

//aggregated function for calculating the path
function path_cal(points, ref, x, indicator) {
    rotated = shift_rotate_points(ref, points, indicator);
    y = interpolation(x, rotated[0], rotated[1]);
    transform = transform_back(y, ref, indicator);
    return transform;
}

//aggregated function for calculating the path with a set of points and reference points
function path_generator(points, ref, x, indicator) {
    var path = [];
    len_points = points.length;
    for(var i = 0; i < len_points; i++) {
        if (i < len_points/2) {
            path.push(path_cal(points[i], ref[i], x, indicator[0]).concat([points[i][2]]));
        } else {
            path.push(path_cal(points[i], ref[i], x, indicator[1]).concat([points[i][2]]));
        }
    }
    return path;
}

//return 4 main positions of transitions
function startPosition(center, unit_len) {
    p_1 = [
        [center[0] - unit_len, center[1]]
    ];
    p_2 = [
        [center[0], center[1] - unit_len]
    ];
    p_3 = [
        [center[0] + unit_len, center[1]]
    ];
    p_4 = [
        [center[0], center[1] + unit_len]
    ];
    return p = p_1.concat(p_2, p_3, p_4)
}

//cirPath functions return the path of circular movement at 4 main positions
function cirPath_left(r, path_length, startAngle, startPoint) {
    let pos = [];
    let tmp = [];
    let x;
    let y;
    step_angle = 2 * Math.PI / (path_length - 1);
    for (var i = 0; i < path_length; i++) {
        x = Math.cos(startAngle + i * step_angle) * r;
        y = Math.sin(startAngle + i * step_angle) * r;
        tmp.push([x, y]);
        pos = pos.concat(tmp);
        tmp = [];
    }
    pos.map(function (x) {
        x[0] = x[0] + startPoint[0] + r;
        x[1] = startPoint[1] + (-x[1])
    });
    pos.pop();
    pos.push(startPoint);
    return pos;
}

function cirPath_right(r, path_length, startAngle, startPoint) {
    let pos = [];
    let tmp = [];
    let x;
    let y;
    step_angle = 2 * Math.PI / (path_length - 1);
    for (var i = 0; i < path_length; i++) {
        x = Math.cos(startAngle + i * step_angle) * r;
        y = Math.sin(startAngle + i * step_angle) * r;
        tmp.push([x, y]);
        pos = pos.concat(tmp);
        tmp = [];
    }
    pos.map(function (x) {
        x[0] = x[0] + startPoint[0] - r;
        x[1] = startPoint[1] + (-x[1])
    });
    pos.pop();
    pos.push(startPoint);
    return pos;
}

function cirPath_top(r, path_length, startAngle, startPoint) {
    let pos = [];
    let tmp = [];
    let x;
    let y;
    step_angle = 2 * Math.PI / (path_length - 1);
    for (var i = 0; i < path_length; i++) {
        x = Math.cos(startAngle + i * step_angle) * r;
        y = Math.sin(startAngle + i * step_angle) * r;
        tmp.push([x, y]);
        pos = pos.concat(tmp);
        tmp = [];
    }
    pos.map(function (x) {
        x[0] = x[0] + startPoint[0];
        x[1] = -x[1] + startPoint[1] + r;
    });
    pos.pop();
    pos.push(startPoint);
    return pos;
}

function cirPath_bottom(r, path_length, startAngle, startPoint) {
    let pos = [];
    let tmp = [];
    let x; 
    let y;
    step_angle = 2 * Math.PI / (path_length - 1);
    for (var i = 0; i < path_length; i++) {
        x = Math.cos(startAngle + i * step_angle) * r;
        y = Math.sin(startAngle + i * step_angle) * r;
        tmp.push([x, y]);
        pos = pos.concat(tmp);
        tmp = [];
    }
    pos.map(function (x) {
        x[0] = x[0] + startPoint[0];
        x[1] = -x[1] + startPoint[1] - r;
    });
    pos.pop();
    pos.push(startPoint);
    return pos;
}


//aggregated function for circular reverting path
function revert_path(r, step_len, startAngle, startPoints) {
    let revert_path = [];
    let revert_path_0 = [cirPath_left(r, step_len, startAngle[0], startPoints[0])];
    let revert_path_1 = [cirPath_top(r, step_len, startAngle[1], startPoints[1])];
    let revert_path_2 = [cirPath_right(r, step_len, startAngle[2], startPoints[2])];
    let revert_path_3 = [cirPath_bottom(r, step_len, startAngle[3], startPoints[3])];
    revert_path = revert_path.concat(revert_path_0, revert_path_1, revert_path_2, revert_path_3);
    return revert_path;
}

//generate all the possible paths at each main positions.
function profile_generator(path, path_reverse, circle, circle_reverse) {
    motion_profile1 = [];
    motion_profile2 = [];
    motion_profile3 = [];
    motion_profile4 = [];
    motion_profile1 = motion_profile1.concat([path[0]],
        [path[6]], [path[1]], [path[7]], [circle[0]], [circle_reverse[0]]);

    motion_profile2 = motion_profile2.concat([path[4]],
        [path_reverse[0]], [path[5]], [path_reverse[1]], [circle[1]], [circle_reverse[1]]);

    motion_profile3 = motion_profile3.concat([path_reverse[2]],
        [path_reverse[4]], [path_reverse[3]], [path_reverse[5]], [circle[2]], [circle_reverse[2]]);

    motion_profile4 = motion_profile4.concat([path_reverse[6]],
        [path[2]], [path_reverse[7]], [path[3]], [circle[3]], [circle_reverse[3]]);
    return [motion_profile1, motion_profile2, motion_profile3, motion_profile4];
}

//Top generative function for all the path profiles at four main positions.
function pairs_profile_generator(points, unit_len, ref, x, indicator, startAngle, startPoints) {
    let profile = [];
    let path;
    let path_reverse;
    let circle_path;
    let circle_reverse;
    let path_length;

    param_1 = Math.abs(shift_rotate_points(ref[0][0], points[0][0], indicator)[0]);
    arc_length = arcLength(param_1, unit_len / 2 * Math.sqrt(2));
    r = Math.floor(radius_cal(arc_length));

    for(var i = 0; i < points.length; i++) {
        path = path_generator(points[i], ref[i], x, indicator);
        path_reverse = clone(path);
        path_reverse.map(function (x) {
            x.reverse();
        });
        path_length = path[0].length;

        circle_path = revert_path(r, path_length, startAngle, startPoints[i]);
        circle_reverse = clone(circle_path);
        circle_reverse.map(function (x) {
            x.reverse();
        })
        profile = profile.concat([profile_generator(path, path_reverse, circle_path, circle_reverse)]);
    }
    return profile;
}

//Random transition function for opposite conditions to any conditions
function rand_opp_move(opp_move) {
    index = Math.floor(Math.random() * 17);
    return opp_move[index];
}

//Random transition function for opposite conditions to opposite conditions
function rand_opp_to_opp(opp_to_opp) {
    index = Math.floor(Math.random() * 10);
    return opp_to_opp[index];
}

//Random transition function for opposite conditions to neighboring conditions
function rand_opp_to_nei(opp_to_nei) {
    index = Math.floor(Math.random() * 8);
    return opp_to_nei[index];
}

//Random transition function for neighboring conditions to any conditions
function rand_nei_move(nei_move) {
    index = Math.floor(Math.random() * 15);
    return nei_move[index];
}

//Random transition function for neighboring conditions to neighboring conditions
function rand_nei_to_nei(nei_to_nei) {
    index = Math.floor(Math.random() * 8);
    return nei_to_nei[index];
}

//Random transition function for neighboring conditions to opposite conditions
function rand_nei_to_opp(nei_to_opp) {
    index = Math.floor(Math.random() * 4);
    return nei_to_opp[index];
}

// Path constraints
opp_move = [[0,0],[0,2],[0,4],[0,5],[1,1],[1,3],[1,4],[1,5],[2,0],[4,0],[4,1],[4,4],[4,5],[5,0],[5,1],[5,4],[5,5]];

opp_to_opp = [[0,0],[0,2],[1,1],[1,3],[2,0],[3,1],[4,4],[4,5],[5,4],[5,5]];

opp_to_nei = [[0,4],[0,5],[1,4],[1,5],[4,0],[4,1],[5,0],[5,1]];

nei_move_0 = [[0,0],[0,2],[0,3],[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[2,0],[2,1],[3,0],[3,1],[4,0],[5,0]];

nei_move_1 = [[1,1],[1,3],[1,2],[0,1],[0,0],[0,3],[0,2],[0,4],[0,5],[3,1],[3,0],[2,1],[2,0],[4,1],[5,1]]; 

nei_to_nei_0 = [[0,0],[0,2],[0,3],[1,1],[1,2],[1,3],[3,0],[3,1]];

nei_to_nei_1 = [[1,1],[1,3],[1,2],[0,0],[0,3],[0,2],[2,1],[2,0]];

nei_to_opp_0 = [[1,4],[1,5],[4,0],[5,0]];

nei_to_opp_1 = [[0,4],[0,5],[4,1],[5,1]];

crit_v = [[2,2],[3,3]];

crit_a = [[2,3],[3,2]];


// Randomized critical index (total number of critical conditions should not be greater than jumps - 3)
critical_range = range(2, jumps - 2, 1);
critical_idx = randSample(critical_range, critical_time);
before_critical_index = critical_idx.map(x => x - 1);


//positions case: objects never intercept
function position_case(startPoints, objectBag, profile, path_length, jumps) {
    let path_dat = [];
    let profile_index = [];
    let dir_index = [];
    let status = [];
    let objectUpdate = [];
    let tmp_profile_index;
    let tmp_dir_index;
    let tmp_path_dat = [];
    for(let i = 0; i < jumps; i++) {
        if (i == 0) {
            profile_index = checkPos(objectBag, startPoints);
            status = checkStatus(profile_index);
            dir_index = RandDir_Pos(profile_index,status[i]);
            path_dat = object_path(profile, profile_index, dir_index);
            console.log(profile_index)
            console.log(status)
            console.log(dir_index)
            console.log(profile)
            console.log(path_dat)
        } else {
            if(i == 1) {
                objectUpdate = newStartPoints(profile, profile_index, dir_index, path_length);
                console.log(objectUpdate)
                objectBag = combineArray(objectBag,objectUpdate);
                console.log(objectBag)
                tmp_profile_index = checkPos(objectUpdate, startPoints);
                profile_index = combineArray(profile_index, tmp_profile_index);
                status = status.concat(checkStatus(tmp_profile_index));
                tmp_dir_index = RandDir_Pos(tmp_profile_index, status[i]);
                dir_index = combineArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
                console.log(profile_index)
                console.log(status)
                console.log(dir_index)
                console.log(profile)
                console.log(path_dat)
            } else {
                objectUpdate = newStartPoints(profile, tmp_profile_index, tmp_dir_index, path_length);
                objectBag = addArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints)
                profile_index = addArray(profile_index, tmp_profile_index);
                status = status.concat(checkStatus(tmp_profile_index));
                tmp_dir_index = RandDir_Pos(tmp_profile_index, status[i]);
                dir_index = addArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            }
        }
    }
    console.log(profile_index)
    console.log(objectBag)
    return {objectBag: objectBag,
            profile_index: profile_index,
            status: status,
            dir_index: dir_index,
            path_coordinates: path_dat};
}

//Velocity case: Opposite objects intercept at center for certain number of times
//Simultaneity = 4
function velocity_case(startPoints, objectBag, profile, path_length, jumps) {
    let path_dat = [];
    let profile_index = [];
    let dir_index = [];
    let status = [];
    let objectUpdate = [];
    let tmp_profile_index;
    let tmp_dir_index;
    let tmp_path_dat = [];
    for (let i = 0; i < jumps; i++) {
        if (i == 0) {
            profile_index = checkPos(objectBag, startPoints);
            status = checkStatus(profile_index);
            dir_index = RandDir_Pos(profile_index, status[i]);
            path_dat = object_path(profile, profile_index, dir_index);
        } else {
            if (i == 1 && !checkInside(i, before_critical_index)) {
                objectUpdate = newStartPoints(profile, profile_index, dir_index, path_length);
                objectBag = combineArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints)
                profile_index = combineArray(profile_index, tmp_profile_index);
                status = status.concat(checkStatus(tmp_profile_index));
                tmp_dir_index = RandDir_Pos(tmp_profile_index, status[i]);
                dir_index = combineArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            } else if (i == 1 && checkInside(i, before_critical_index)) {
                objectUpdate = newStartPoints(profile, profile_index, dir_index, path_length);
                objectBag = combineArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints)
                profile_index = combineArray(profile_index, tmp_profile_index);
                status = status.concat(checkStatus(tmp_profile_index));
                tmp_dir_index = transferOpp(tmp_profile_index, status[i]);
                dir_index = combineArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            } else if (checkInside(i, before_critical_index) && !checkInside(i, critical_idx)) {
                objectUpdate = newStartPoints(profile, tmp_profile_index, tmp_dir_index, path_length);
                objectBag = addArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints);
                profile_index = addArray(profile_index, tmp_profile_index);
                status = status.concat(checkStatus(tmp_profile_index));
                tmp_dir_index = transferOpp(tmp_profile_index, status[i]);
                dir_index = addArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            } else if (checkInside(i, critical_idx)) {
                objectUpdate = newStartPoints(profile, tmp_profile_index, tmp_dir_index, path_length);
                objectBag = addArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints)
                profile_index = addArray(profile_index, tmp_profile_index);
                status = status.concat(checkStatus(tmp_profile_index));
                tmp_dir_index = velocity_crit(tmp_profile_index);
                dir_index = addArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            } else {
                objectUpdate = newStartPoints(profile, tmp_profile_index, tmp_dir_index, path_length);
                objectBag = addArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints)
                profile_index = addArray(profile_index, tmp_profile_index);
                status = status.concat(checkStatus(tmp_profile_index));
                tmp_dir_index = RandDir_Pos(tmp_profile_index, status[i]);
                dir_index = addArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            }
        }
    }
    console.log(profile_index)
    console.log(objectBag)

    return {
        objectBag: objectBag,
        profile_index: profile_index,
        status: status,
        dir_index: dir_index,
        path_coordinates: path_dat
    };
}

//Acceleration case: neighboring objects intercept at the center
//Simultaneity = 4
function acceleration_case(startPoints, objectBag, profile, path_length, jumps) {
    let path_dat = [];
    let profile_index = [];
    let dir_index = [];
    let status = [];
    let objectUpdate = [];
    let tmp_profile_index;
    let tmp_dir_index;
    let tmp_path_dat = [];
    for (let i = 0; i < jumps; i++) {
        if (i == 0) {
            profile_index = checkPos(objectBag, startPoints);
            status = checkStatus(profile_index);
            dir_index = RandDir_Pos(profile_index, status[i]);
            path_dat = object_path(profile, profile_index, dir_index);
        } else {
            if (i == 1 && !checkInside(i, before_critical_index)) {
                objectUpdate = newStartPoints(profile, profile_index, dir_index, path_length);
                objectBag = combineArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints)
                profile_index = combineArray(profile_index, tmp_profile_index);
                status = status.concat(checkStatus(tmp_profile_index));
                tmp_dir_index = RandDir_Pos(tmp_profile_index, status[i]);
                dir_index = combineArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            } else if (i == 1 && checkInside(i, before_critical_index)) {
                objectUpdate = newStartPoints(profile, profile_index, dir_index, path_length);
                objectBag = combineArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints)
                profile_index = combineArray(profile_index, tmp_profile_index);
                status = status.concat(checkStatus(tmp_profile_index));
                tmp_dir_index = transferNei(tmp_profile_index, status[i]);
                dir_index = combineArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            } else if (checkInside(i, before_critical_index) && !checkInside(i, critical_idx)) {
                objectUpdate = newStartPoints(profile, tmp_profile_index, tmp_dir_index, path_length);
                objectBag = addArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints);
                profile_index = addArray(profile_index, tmp_profile_index);
                status = status.concat(checkStatus(tmp_profile_index));
                tmp_dir_index = transferNei(tmp_profile_index, status[i]);
                dir_index = addArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            } else if (checkInside(i, critical_idx)) {
                objectUpdate = newStartPoints(profile, tmp_profile_index, tmp_dir_index, path_length);
                objectBag = addArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints)
                profile_index = addArray(profile_index, tmp_profile_index);
                status = status.concat(checkStatus(tmp_profile_index));
                tmp_dir_index = acc_crit(tmp_profile_index);
                dir_index = addArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            } else {
                objectUpdate = newStartPoints(profile, tmp_profile_index, tmp_dir_index, path_length);
                objectBag = addArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints)
                profile_index = addArray(profile_index, tmp_profile_index);
                status = status.concat(checkStatus(tmp_profile_index));
                tmp_dir_index = RandDir_Pos(tmp_profile_index, status[i]);
                dir_index = addArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            }
        }
    }
    console.log(profile_index)
    console.log(objectBag)

    return {
        objectBag: objectBag,
        profile_index: profile_index,
        status: status,
        dir_index: dir_index,
        path_coordinates: path_dat
    };
}

// //Velocity case
// //Simultaneity = 3
// function velocity_case(startPoints, objectBag, profile, path_length, jumps) {
//     let path_dat = [];
//     let profile_index = [];
//     let dir_index = [];
//     let status = [];
//     let objectUpdate = [];
//     let tmp_profile_index;
//     let tmp_dir_index;
//     let tmp_path_dat = [];
//     for (let i = 0; i < jumps; i++) {
//         if (i == 0) {
//             profile_index = checkPos(objectBag, startPoints);
//             status = checkStatus(profile_index);
//             dir_index = RandDir_Pos(profile_index, status[i]);
//             path_dat = object_path(profile, profile_index, dir_index);
//         } else {
//             if (i == 1 && !checkInside(i, before_critical_index)) {
//                 objectUpdate = newStartPoints(profile, profile_index, dir_index, path_length);
//                 objectBag = combineArray(objectBag, objectUpdate);
//                 tmp_profile_index = checkPos(objectUpdate, startPoints)
//                 profile_index = combineArray(profile_index, tmp_profile_index);
//                 status = status.concat(checkStatus(tmp_profile_index));
//                 tmp_dir_index = RandDir_Pos(tmp_profile_index, status[i]);
//                 dir_index = combineArray(dir_index, tmp_dir_index);
//                 tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
//                 path_dat = concatArr(path_dat, tmp_path_dat);
//             } else if (i == 1 && checkInside(i, before_critical_index)) {
//                 objectUpdate = newStartPoints(profile, profile_index, dir_index, path_length);
//                 objectBag = combineArray(objectBag, objectUpdate);
//                 tmp_profile_index = checkPos(objectUpdate, startPoints)
//                 profile_index = combineArray(profile_index, tmp_profile_index);
//                 status = status.concat(checkStatus(tmp_profile_index));
//                 tmp_dir_index = transferOpp(tmp_profile_index, status[i]);
//                 dir_index = combineArray(dir_index, tmp_dir_index);
//                 tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
//                 path_dat = concatArr(path_dat, tmp_path_dat);
//             } else if (checkInside(i, before_critical_index) && !checkInside(i, critical_idx)) {
//                 objectUpdate = newStartPoints(profile, tmp_profile_index, tmp_dir_index, path_length);
//                 objectBag = addArray(objectBag, objectUpdate);
//                 tmp_profile_index = checkPos(objectUpdate, startPoints);
//                 profile_index = addArray(profile_index, tmp_profile_index);
//                 status = status.concat(checkStatus(tmp_profile_index));
//                 tmp_dir_index = transferOpp(tmp_profile_index, status[i]);
//                 dir_index = addArray(dir_index, tmp_dir_index);
//                 tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
//                 path_dat = concatArr(path_dat, tmp_path_dat);
//             } else if (checkInside(i, critical_idx)) {
//                 objectUpdate = newStartPoints(profile, tmp_profile_index, tmp_dir_index, path_length);
//                 objectBag = addArray(objectBag, objectUpdate);
//                 tmp_profile_index = checkPos(objectUpdate, startPoints)
//                 profile_index = addArray(profile_index, tmp_profile_index);
//                 status = status.concat(checkStatus(tmp_profile_index));
//                 tmp_dir_index = velocity_crit(tmp_profile_index);
//                 dir_index = addArray(dir_index, tmp_dir_index);
//                 tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
//                 path_dat = concatArr(path_dat, tmp_path_dat);
//             } else {
//                 objectUpdate = newStartPoints(profile, tmp_profile_index, tmp_dir_index, path_length);
//                 objectBag = addArray(objectBag, objectUpdate);
//                 tmp_profile_index = checkPos(objectUpdate, startPoints)
//                 profile_index = addArray(profile_index, tmp_profile_index);
//                 status = status.concat(checkStatus(tmp_profile_index));
//                 tmp_dir_index = RandDir_Pos(tmp_profile_index, status[i]);
//                 dir_index = addArray(dir_index, tmp_dir_index);
//                 tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
//                 path_dat = concatArr(path_dat, tmp_path_dat);
//             }
//         }
//     }
//     return {
//         objectBag: objectBag,
//         profile_index: profile_index,
//         status: status,
//         dir_index: dir_index,
//         path_coordinates: path_dat
//     };
// }

//Parameter specifications for initializations of paths
//rotation direction indicator
binary = [1, 0]
unit_len = Math.round(canvas.height/6);
console.log(unit_len)
center = [
    [Math.round(canvas.width/4), Math.round(canvas.height/4)],
    [Math.round(canvas.width / 4), 3 * Math.round(canvas.height / 4)],
    [3 * Math.round(canvas.width / 4), Math.round(canvas.height / 4)],
    [3 * Math.round(canvas.width / 4), 3 * Math.round(canvas.height / 4)]
];

//4 start(end) positions
startPoints = startP_generator(center, unit_len);
//4 start(end) positions in terms of angles 
startAngle = [Math.PI, Math.PI / 2, 0, 3 * Math.PI / 2];
//interpolation step length
step_len_path = unit_len * Math.sqrt(2) / (trackTime / jumps / interval);
x = range(-unit_len / 2 * Math.sqrt(2), unit_len / 2 * Math.sqrt(2), step_len_path);
//All the vertices and intersections used for interpolation
points = points_generator(center, unit_len);
//The reference points of rotations
ref = ref_generator(center, unit_len);

//Generate path profile
profile = pairs_profile_generator(points, unit_len, ref, x, binary, startAngle, startPoints);
path_length = profile[0][0][0].length;
profile = round_start(profile, path_length);
