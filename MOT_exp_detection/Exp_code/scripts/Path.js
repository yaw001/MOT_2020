var trackTime = 1000;
var interval = 10;
var objectBag;

var canvas = document.querySelector('canvas');
var height = window.innerHeight - 50;
var width = (window.innerWidth / 26) * 20;
var edge_len = Math.min(height, width);
canvas.height = edge_len;
canvas.width = edge_len + 500;
var c = canvas.getContext('2d'); 

// counterclockwise rotate 90 degrees
rotate_mat_1 = [
    [0,-1],
    [1, 0]
];

//clockwise rotate 90 degrees
rotate_mat_2 = [
    [0, 1],
    [-1, 0]
];

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
        for(var j = 0; j < 2; j++) {
            if(indicator == 0) {
                points_rotate[i][j] = rotate_mat_1[j][0] * points_shift[i][0] +
                rotate_mat_1[j][1] * points_shift[i][1];
            } else {
                points_rotate = clone(points_shift);
            }
        }
    }
    // a = points_rotate[1][1] / (points_rotate[0][0] * points_rotate[2][0]);
    a = points_rotate[1][1] / (points_rotate[0][0] * points_rotate[2][0]);
    b = points_rotate[1][1];
    return [a, b];
}

function interpolation(x,a,b) {
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

function transform_back(points, ref, indicator) {
    var points_transform = [];
    for (var i = 0; i < points.length; i++) {
        var points_rotate = [];
        for (var j = 0; j < 2; j++) {
            if(indicator == 0) {
                points_rotate.push(rotate_mat_2[j][0]* points[i][0] + rotate_mat_2[j][1] * points[i][1]);
            }
        }
        points_transform.push(points_rotate);
    }
    if (indicator == 1) {
        points_transform = clone(points);
    }
    points_transform.map(function (x) {
        x[0] = x[0] + ref[0];
        x[1] = -(x[1] - ref[1]);
    });
    return points_transform;
}

function path_cal(points, ref, x, indicator) {
    rotated = shift_rotate_points(ref, points, indicator);
    y = interpolation(x, rotated[0], rotated[1]);
    transform = transform_back(y,ref,indicator);
    return transform;
}

function path_generator(points, ref, x, indicator) {
    var path = [];
    len_points = points.length;
    for (let i = 0; i < len_points; i++) {
        if (i < 4) {
            path.push(path_cal(points[i], ref[i], x, indicator[0]));
        } else {
            path.push(path_cal(points[i], ref[i], x, indicator[1]));
        }
    }
    return path;
}

function startPosition(center, unit_len) {
    p_1 = [
        [center[0] - unit_len, center[1] + unit_len]
    ];
    p_2 = [
        [center[0] - unit_len, center[1] - unit_len]
    ];
    p_3 = [
        [center[0] + unit_len, center[1] - unit_len]
    ];
    p_4 = [
        [center[0] + unit_len, center[1] + unit_len]
    ];
    return p = p_1.concat(p_2, p_3, p_4)
}

function profile_generator(path, path_reverse) {
    var half_length = Math.ceil(path[0].length / 2);
    var full_length = path[0].length;
    motion_profile0 = [];
    motion_profile1 = [];
    motion_profile2 = [];
    motion_profile3 = [];
    motion_profile0 = motion_profile0.concat([path_reverse[0]],
        [path_reverse[1]],
        [path[4]],
        [path_reverse[0].slice(0,half_length).concat(path_reverse[3].slice(half_length,full_length))],
        [path_reverse[1].slice(0, half_length).concat(path_reverse[2].slice(half_length, full_length))],
        [path_reverse[0].slice(0, half_length).concat(path[0].slice(half_length, full_length))],
        [path_reverse[1].slice(0, half_length).concat(path[1].slice(half_length, full_length))],
        [path[4].slice(0, half_length).concat(path_reverse[4].slice(half_length, full_length))],
        [path_reverse[0].slice(0, half_length).concat(path_reverse[2].slice(half_length, full_length))],
        [path[4].slice(0, half_length).concat(path[5].slice(half_length, full_length))],
        [path_reverse[0].slice(0, half_length).concat(path_reverse[5].slice(half_length, full_length))],
        [path[4].slice(0, half_length).concat(path[2].slice(half_length, full_length))],
        [path_reverse[0].slice(0, half_length).concat(path[4].slice(half_length, full_length))],
        [path[4].slice(0, half_length).concat(path_reverse[0].slice(half_length, full_length))],
        [path_reverse[0].slice(0, half_length).concat(path_reverse[4].slice(half_length, full_length))],
        [path[4].slice(0, half_length).concat(path[0].slice(half_length, full_length))],
        [path_reverse[0].slice(0, half_length).concat(path[2].slice(half_length, full_length))],
        [path[4].slice(0, half_length).concat(path_reverse[5].slice(half_length, full_length))],
        [path_reverse[0].slice(0, half_length).concat(path[5].slice(half_length, full_length))],
        [path[4].slice(0, half_length).concat(path_reverse[2].slice(half_length, full_length))]);

    motion_profile1 = motion_profile1.concat([path[0]], 
        [path[1]],
        [path[5]],
        [path[0].slice(0, half_length).concat(path[3].slice(half_length, full_length))],
        [path[1].slice(0, half_length).concat(path[2].slice(half_length, full_length))],
        [path[0].slice(0, half_length).concat(path_reverse[0].slice(half_length, full_length))],
        [path[1].slice(0, half_length).concat(path_reverse[1].slice(half_length, full_length))],
        [path[5].slice(0, half_length).concat(path_reverse[5].slice(half_length, full_length))],
        [path[0].slice(0, half_length).concat(path[2].slice(half_length, full_length))],
        [path[5].slice(0, half_length).concat(path[4].slice(half_length, full_length))],
        [path[0].slice(0, half_length).concat(path_reverse[4].slice(half_length, full_length))],
        [path[5].slice(0, half_length).concat(path_reverse[2].slice(half_length, full_length))],
        [path[0].slice(0, half_length).concat(path[5].slice(half_length, full_length))],
        [path[5].slice(0, half_length).concat(path[0].slice(half_length, full_length))],
        [path[0].slice(0, half_length).concat(path_reverse[5].slice(half_length, full_length))],
        [path[5].slice(0, half_length).concat(path_reverse[0].slice(half_length, full_length))],
        [path[0].slice(0, half_length).concat(path_reverse[2].slice(half_length, full_length))],
        [path[5].slice(0, half_length).concat(path_reverse[4].slice(half_length, full_length))],
        [path[0].slice(0, half_length).concat(path[4].slice(half_length, full_length))],
        [path[5].slice(0, half_length).concat(path[2].slice(half_length, full_length))]);

    motion_profile2 = motion_profile2.concat([path[2]], 
        [path[3]],
        [path_reverse[5]],
        [path[2].slice(0, half_length).concat(path[1].slice(half_length, full_length))],
        [path[3].slice(0, half_length).concat(path[0].slice(half_length, full_length))],
        [path[2].slice(0, half_length).concat(path_reverse[2].slice(half_length, full_length))],
        [path[3].slice(0, half_length).concat(path_reverse[3].slice(half_length, full_length))],
        [path_reverse[5].slice(0, half_length).concat(path[5].slice(half_length, full_length))],
        [path[2].slice(0, half_length).concat(path[0].slice(half_length, full_length))],
        [path_reverse[5].slice(0, half_length).concat(path_reverse[4].slice(half_length, full_length))],
        [path[2].slice(0, half_length).concat(path[4].slice(half_length, full_length))],
        [path_reverse[5].slice(0, half_length).concat(path_reverse[0].slice(half_length, full_length))],
        [path[2].slice(0, half_length).concat(path_reverse[5].slice(half_length, full_length))],
        [path_reverse[5].slice(0, half_length).concat(path[2].slice(half_length, full_length))],
        [path[2].slice(0, half_length).concat(path[5].slice(half_length, full_length))],
        [path_reverse[5].slice(0, half_length).concat(path_reverse[2].slice(half_length, full_length))],
        [path[2].slice(0, half_length).concat(path_reverse[0].slice(half_length, full_length))],
        [path_reverse[5].slice(0, half_length).concat(path[4].slice(half_length, full_length))],
        [path[2].slice(0, half_length).concat(path_reverse[4].slice(half_length, full_length))],
        [path_reverse[5].slice(0, half_length).concat(path[0].slice(half_length, full_length))],
        );

    motion_profile3 = motion_profile3.concat([path_reverse[2]], 
        [path_reverse[3]],
        [path_reverse[4]],
        [path_reverse[2].slice(0, half_length).concat(path_reverse[1].slice(half_length, full_length))],
        [path_reverse[3].slice(0, half_length).concat(path_reverse[0].slice(half_length, full_length))],
        [path_reverse[2].slice(0, half_length).concat(path[2].slice(half_length, full_length))],
        [path_reverse[3].slice(0, half_length).concat(path[3].slice(half_length, full_length))],
        [path_reverse[4].slice(0, half_length).concat(path[4].slice(half_length, full_length))],
        [path_reverse[2].slice(0, half_length).concat(path_reverse[0].slice(half_length, full_length))],
        [path_reverse[4].slice(0, half_length).concat(path_reverse[5].slice(half_length, full_length))],
        [path_reverse[2].slice(0, half_length).concat(path[5].slice(half_length, full_length))],
        [path_reverse[4].slice(0, half_length).concat(path[0].slice(half_length, full_length))],
        [path_reverse[2].slice(0, half_length).concat(path_reverse[4].slice(half_length, full_length))],
        [path_reverse[4].slice(0, half_length).concat(path_reverse[2].slice(half_length, full_length))],
        [path_reverse[2].slice(0, half_length).concat(path[4].slice(half_length, full_length))],
        [path_reverse[4].slice(0, half_length).concat(path[2].slice(half_length, full_length))],
        [path_reverse[2].slice(0, half_length).concat(path[0].slice(half_length, full_length))],
        [path_reverse[4].slice(0, half_length).concat(path[5].slice(half_length, full_length))],
        [path_reverse[2].slice(0, half_length).concat(path_reverse[5].slice(half_length, full_length))],
        [path_reverse[4].slice(0, half_length).concat(path_reverse[0].slice(half_length, full_length))]);
    return [motion_profile0, motion_profile1, motion_profile2, motion_profile3];
}

function pairs_profile_generator(points, ref, x, indicator) {
    let profile = [];
    let path;
    let path_reverse;
    for (var i = 0; i < points.length; i++) {
        path = path_generator(points[i], ref[i], x, indicator);
        path_reverse = clone(path);
        path_reverse.map(function (x) {
            x.reverse();
        });
        profile = profile.concat([profile_generator(path, path_reverse)]);
    }
    return profile;
}


// function crit_path(profile) {
//     var half_length = Math.ceil(profile[0][0][0].length / 2);
//     var full_length = profile[0][0][0].length;
//     for (var i = 0; i < 4; i++) {
//         crit_0_0 = profile[i][0][0].slice(0,half_length).concat(profile[i][3][0].slice(half_length,full_length));
//         crit_0_1 = profile[i][0][1].slice(0, half_length).concat(profile[i][1][1].slice(half_length, full_length));
//         profile[i][0].push(crit_0_0, crit_0_1);
//         crit_1_0 = profile[i][1][0].slice(0, half_length).concat(profile[i][2][0].slice(half_length, full_length));
//         crit_1_1 = profile[i][1][1].slice(0, half_length).concat(profile[i][0][0].slice(half_length, full_length));
//         profile[i][1].push(crit_1_0, crit_1_1);
//         crit_2_0 = profile[i][2][0].slice(0, half_length).concat(profile[i][1][0].slice(half_length, full_length));
//         crit_2_1 = profile[i][2][1].slice(0, half_length).concat(profile[i][3][1].slice(half_length, full_length));
//         profile[i][2].push(crit_2_0, crit_2_1);
//         crit_3_0 = profile[i][3][0].slice(0, half_length).concat(profile[i][0][0].slice(half_length, full_length));
//         crit_3_1 = profile[i][3][1].slice(0, half_length).concat(profile[i][2][1].slice(half_length, full_length));
//         profile[i][3].push(crit_3_0,crit_3_1);
//     }
//     return(profile);
// }



function case_path_generator(startPoints, objectBag, profile, path_length, jumps, crit_idx) {
    let path_dat = [];
    let profile_index = [];
    let dir_index = [];
    let objectUpdate = [];
    let tmp_profile_index;
    let tmp_dir_index;
    let tmp_path_dat = [];
    for (let i = 0; i < jumps; i++) {
        if (i == 0) {
            profile_index = checkPos(objectBag, startPoints);
            dir_index = RandDir(profile_index);
            path_dat = object_path(profile, profile_index, dir_index);
        } else {
            if (i == 1) {
                objectUpdate = newStartPoints(profile, profile_index, dir_index, path_length);
                objectBag = combineArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints);
                profile_index = combineArray(profile_index, tmp_profile_index);
                tmp_dir_index = RandDir(tmp_profile_index);
                dir_index = combineArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            } else if (checkInside(i, critical_idx)) {
                objectUpdate = newStartPoints(profile, tmp_profile_index, tmp_dir_index, path_length);
                objectBag = addArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints);
                profile_index = addArray(profile_index, tmp_profile_index);
                if(crit_idx == 0) {
                    tmp_dir_index = RandCrit_p(tmp_profile_index).dir_index;
                } else if(crit_idx == 1) {
                    tmp_dir_index = RandCrit_v(tmp_profile_index).dir_index;
                } else if(crit_idx == 2) {
                    tmp_dir_index = RandCrit_a(tmp_profile_index).dir_index;
                } else if(crit_idx == 3) {
                    tmp_dir_index = RandCrit_other_1(tmp_profile_index).dir_index;
                } else if(crit_idx == 4) {
                    tmp_dir_index = RandCrit_other_2(tmp_profile_index).dir_index;
                } else if(crit_idx == 5) {
                    tmp_dir_index = RandCrit_other_3(tmp_profile_index).dir_index;
                } else if(crit_idx == 6) {
                    tmp_dir_index = RandCrit_other_4(tmp_profile_index).dir_index;
                } else if(crit_idx == 7) {
                    tmp_dir_index = RandCrit_other_5(tmp_profile_index).dir_index;
                }
                dir_index = addArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            } else {
                objectUpdate = newStartPoints(profile, tmp_profile_index, tmp_dir_index, path_length);
                objectBag = addArray(objectBag, objectUpdate);
                tmp_profile_index = checkPos(objectUpdate, startPoints);
                profile_index = addArray(profile_index, tmp_profile_index);
                tmp_dir_index = RandDir(tmp_profile_index);
                dir_index = addArray(dir_index, tmp_dir_index);
                tmp_path_dat = object_path(profile, tmp_profile_index, tmp_dir_index);
                path_dat = concatArr(path_dat, tmp_path_dat);
            }
        }
    }
    return {
        objectBag: objectBag,
        profile_index: profile_index,
        dir_index: dir_index,
        path_coordinates: path_dat
    };
}

function case_path_generator_one_jump(startPoints, objectBag, profile, path_length, jumps, crit_idx) {
    let path_dat = [];
    let profile_index = [];
    let dir_index = [];
    for (let i = 0; i < jumps; i++) {
        if (i == 0) {
            profile_index = checkPos(objectBag, startPoints);
            if (crit_idx == 0) {
                dir_index = RandCrit_p(profile_index).dir_index;
            } else if (crit_idx == 1) {
                dir_index = RandCrit_v(profile_index).dir_index;
            } else if (crit_idx == 2) {
                dir_index = RandCrit_a(profile_index).dir_index;
            } else if (crit_idx == 3) {
                dir_index = RandCrit_other_1(profile_index).dir_index;
            } else if (crit_idx == 4) {
                dir_index = RandCrit_other_2(profile_index).dir_index;
            } else if (crit_idx == 5) {
                dir_index = RandCrit_other_3(profile_index).dir_index;
            } else if (crit_idx == 6) {
                dir_index = RandCrit_other_4(profile_index).dir_index;
            } else if (crit_idx == 7) {
                dir_index = RandCrit_other_5(profile_index).dir_index;
            }
            path_dat = object_path(profile, profile_index, dir_index);
        }
    }
    return {
        objectBag: objectBag,
        profile_index: profile_index,
        dir_index: dir_index,
        path_coordinates: path_dat
    };
}
