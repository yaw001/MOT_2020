var canvas = document.querySelector('canvas');

canvas.width = (window.innerWidth / 26) * 24;
canvas.height = window.innerHeight - 52;
console.log(canvas.height)
console.log(canvas.width)
var c = canvas.getContext('2d');
var draw = false;
var prevCoord;
var values = [];
var collection = [];
canvas.addEventListener('click', function(evt) {
    draw = !draw;
    prevCoord = undefined;
    values = seq_filter(values);
    collection.push(values);
    values = [];
    var path_one = collection.filter(function (el) {
        return el != "";
    }) 
    localStorage.setItem('path_collection_one', JSON.stringify(path_one));
})


canvas.addEventListener('mousemove', function (evt) {
    if (draw) {
        var mousePos = calculateMousePos(evt);
        if(typeof prevCoord !== "undefined") {
            c.beginPath();
            c.moveTo(prevCoord[0], prevCoord[1]);
            c.lineTo(mousePos[0], mousePos[1]);
            c.stroke();
            values.push(mousePos);
        }
        prevCoord = mousePos;
    }
})

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = Math.floor(evt.clientX - rect.left);
    var mouseY = Math.floor(evt.clientY - rect.top);
    return [mouseX, mouseY];
}


path_one= localStorage.getItem('path_collection_one');
path_one= JSON.parse(path_one);

c.beginPath();
c.arc(60, 60, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();

c.beginPath();
c.arc(190, 60, 20, 0, Math.PI * 2, false);
c.fillStyle = 'red';
c.fill();
c.closePath();

c.beginPath();
c.arc(320, 60, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();

c.beginPath();
c.arc(60, 190, 20, 0, Math.PI * 2, false);
c.fillStyle = 'red';
c.fill();
c.closePath();

c.beginPath();
c.arc(190, 190, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();

c.beginPath();
c.arc(320, 190, 20, 0, Math.PI * 2, false);
c.fillStyle = 'red';
c.fill();
c.closePath();

c.beginPath();
c.arc(60, 320, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();

c.beginPath();
c.arc(190, 320, 20, 0, Math.PI * 2, false);
c.fillStyle = 'red';
c.fill();
c.closePath();

c.beginPath();
c.arc(320, 320, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();

c.beginPath();
c.arc(60, 380, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();

c.beginPath();
c.arc(60, 510, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();

c.beginPath();
c.arc(60, 640, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();

c.beginPath();
c.arc(125, 125, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();

c.beginPath();
c.arc(255, 125, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();

c.beginPath();
c.arc(125, 255, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();

c.beginPath();
c.arc(255, 255, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();
c.beginPath();
c.arc(646, 200, 20, 0, Math.PI * 2, false);
c.fillStyle = 'blue';
c.fill();
c.closePath();

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// var unique = a.filter(onlyUnique)

// const categories = [...new Set(bills.map(bill => bill.category))]

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

function seq_filter(array) {
    for(var i = 1; i < array.length; i++) {
        if (array[i][0] == array[i-1][0] &&
            array[i][1] == array[i-1][1]) {
            array.splice(i, 1);
            i = i - 1
            // console.log(array);
        }
    }
    return array;
}


points = [[60,190], [60,60], [190,60]];
ref = [125,125];

rotation_mat_1 = [
    [Math.sqrt(2) / 2, - Math.sqrt(2) / 2],
    [Math.sqrt(2) / 2, Math.sqrt(2) / 2]
];
rotation_mat_2 = [
    [Math.sqrt(2) / 2, Math.sqrt(2) / 2],
    [-Math.sqrt(2) / 2, Math.sqrt(2) / 2]
];

function shift_points(ref, points) {
    points.map(function(x) {
        x[0] = x[0] - ref[0];
        x[1] = -x[1] + ref[1];
    });
    return points;
}

function rotate_points(points) {
    var points_rotate = [[0,0],[0,0],[0,0]];
    for(var i = 0; i < points.length; i ++) {
        for (var j = 0; j < 2; j ++) {
            points_rotate[i][j] = rotation_mat_2[j][0] * points[i][0] +
                rotation_mat_2[j][1] * points[i][1];
        }
    }
    a = points_rotate[1][1] / (points_rotate[0][0] * points_rotate[2][0]);
    b = points_rotate[1][1];
    return [a,b];
}

function interpolation(x,a,b) {
    var y = [];
    var points = [];
    var tmp = [];
    y = x.map(x => x ** 2 * a + b);
    for(var i = 0; i < x.length; i ++) {
        tmp = [x[i], y[i]];
        points.push(tmp);
        tmp = [];
    }
    return points;
}

function transform_back(points, ref) {
    var points_transform = [];
    for (var i = 0; i < points.length; i++) {
        var points_rotate = [];
        for (var j = 0; j < 2; j++) {
            points_rotate.push(rotation_mat_1[j][0] * points[i][0] +
                rotation_mat_1[j][1] * points[i][1]);
        }
        points_transform.push(points_rotate);
    }
    points_transform.map(function (x) {
        x[0] = x[0] + ref[0];
        x[1] = -(x[1] - ref[1]);
    });
    return points_transform;
}

x = range(-65 * Math.sqrt(2), 65 * Math.sqrt(2), 1);
points = [
    [60, 190],
    [60, 60],
    [190, 60]
];
ref = [125, 125];

function path_cal(ref, points, x) {
    shifted = shift_points(ref,points);
    rotated = rotate_points(shifted);
    y = interpolation (x , rotated[0], rotated[1])
    transform = transform_back(y,ref);
    return transform;
}
path = path_cal(ref,points,x);

a=[[1,2],[3,4],[5,6]];
b=[1,2];
console.log(a.slice(-1)[0][1])

console.log(canvas.width/5)

function points_cal(unit_len, center) {
    var points = [];
    g_1 = [[
        [-unit_len, 0],
        [-unit_len, unit_len],
        [0, unit_len]
    ]];
    g_2 = [[
        [-unit_len, 0],
        [0, 0],
        [0, unit_len]
    ]];
    g_3 = [[
        [0, -unit_len],
        [unit_len, -unit_len],
        [unit_len, 0]
    ]];
    g_4 = [[
        [0, -unit_len],
        [0, 0],
        [unit_len, 0]
    ]];
    g_5 = [[
        [0, unit_len],
        [unit_len, unit_len],
        [unit_len, 0]
    ]];
    g_6 = [[
        [0, unit_len],
        [0, 0],
        [unit_len, 0]
    ]];
    g_7 = [[
        [-unit_len, 0],
        [-unit_len, -unit_len],
        [0, -unit_len]
    ]];
    g_8 = [[
        [-unit_len, 0],
        [-unit_len, -unit_len],
        [0, -unit_len]
    ]];
    newPoints = points.concat(g_1, g_2, g_3, g_4, g_5, g_6, g_7, g_8);
    for(var i = 0; i < newPoints.length; i++){
        newPoints[i].map(function(x) {
            x[0] = x[0] + center[0];
            x[1] = -(x[1] - center[1]);
        })
    }
    return newPoints;
}

function ref_cal(unit_len, center) {
    rel = [];
    r_1 = [
        [-unit_len / 2, unit_len / 2]
    ];
    r_2 = [
        [-unit_len / 2, unit_len / 2]
    ];
    r_3 = [
        [unit_len / 2, -unit_len / 2]
    ];
    r_4 = [
        [unit_len / 2, -unit_len / 2]
    ];
    r_5 = [
        [unit_len / 2, unit_len / 2]
    ];
    r_6 = [
        [unit_len / 2, unit_len / 2]
    ];
    r_7 = [
        [-unit_len / 2, -unit_len / 2]
    ];
    r_8 = [
        [-unit_len / 2, -unit_len / 2]
    ];
    newRel = rel.concat(r_1, r_2, r_3, r_4, r_5, r_6, r_7, r_8);

    newRel.map(function (x) {
        x[0] = x[0] + center[0];
        x[1] = -(x[1] - center[1])});
    return newRel;
}


