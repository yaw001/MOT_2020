function Circle(x,y,radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = 'blue';
        c.fill();
        c.closePath();
    } 
    // A click function
    this.clicked_do = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius + 10, 0, Math.PI * 2, false);
        c.strokeStyle = 'black';
        c.lineWidth = 6;
        c.stroke();
        c.closePath();
    }
    this.clicked_undo = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius + 10, 0, Math.PI * 2, false);
        c.strokeStyle = "white";
        c.lineWidth = 8;
        c.stroke();
        c.closePath();
    }
}

//Highlight circle
function HLCircle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    this.draw = function () {
        // do not forget the beginPath()    
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = 'black';
        c.lineWidth = 6;
        c.stroke();
        c.closePath();
    }

    this.correct = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = "green";
        c.lineWidth = 8;
        c.stroke();
        c.closePath();
    }

    this.incorrect = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = "red";
        c.lineWidth = 8;
        c.stroke();
        c.closePath();
    }

}

//Fixation plus sign at the center
function fixation(center_X, center_Y, fixation_len) {
    this.center_X = center_X;
    this.center_Y = center_Y;
    this.fixation_len = fixation_len;
    this.draw = function () {
        c.beginPath();
        c.moveTo(this.center_X - this.fixation_len, this.center_Y);
        c.lineTo(this.center_X + this.fixation_len, this.center_Y);
        c.moveTo(this.center_X, this.center_Y + this.fixation_len);
        c.lineTo(this.center_X, this.center_Y - this.fixation_len);
        c.lineWidth = 10;
        c.strokeStyle = "black";
        c.stroke();
        c.closePath();
    } 
}

//rect selection
// function rect(v1,v2,v3,v4) {
//     this.v1 = v1;
//     this.v2 = v2;
//     this.v3 = v3;
//     this.v4 = v4;
//     this.draw = function() {
//         c.beginPath();
//         c.rect(v1,v2,v3,v4);
//         c.strokeStyle = "black";
//         c.lineWidth = 6;
//         c.stroke();
//         c.closePath();
//     }
//     this.clicked_do = function () {
//         c.beginPath();
//         c.rect(v1, v2, v3, v4);
//         c.strokeStyle = "green";
//         c.lineWidth = 6;
//         c.stroke();
//         c.closePath();
//     }
//     this.clicked_undo = function () {
//         c.beginPath();
//         c.rect(v1, v2, v3, v4);
//         c.strokeStyle = "black";
//         c.lineWidth = 6;
//         c.stroke();
//         c.closePath();
//     }
// }