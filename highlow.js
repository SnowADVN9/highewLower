var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '    gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
    '    v_TexCoord = a_TexCoord;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'uniform vec3 u_Color;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '    vec4 texColor = texture2D(u_Sampler, v_TexCoord);\n' +
    '    gl_FragColor = vec4(texColor.rgb * u_Color, texColor.a);\n' +
    '}\n';

var money = 1000;

function main() {
    var canvas = document.getElementById('webgl');

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if(!u_ViewMatrix) { 
        console.log('Failed to get the storage locations of u_ViewMatrix');
        return;
    }
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(!u_ModelMatrix) {
        console.log('Failed to get the storage locations of u_ModelMatrix');
        return;
    }

    var viewMatrix = new Matrix4();
    var modelMatrix = new Matrix4();
    document.onkeydown = function(ev){ keydown(ev, gl, n, u_ViewMatrix, viewMatrix, u_ModelMatrix, modelMatrix); };
    document.getElementById('changeColor').onclick = function() {
        changeColor(gl,n);
    };
    
    draw(gl, n, u_ViewMatrix, viewMatrix, u_ModelMatrix, modelMatrix);
    if (!initTextures(gl, n)) {
        console.log('Failed to intialize the texture.');
        return;
    }

    document.getElementById('high').onclick = function(){
        var old = number;
        play();
        initTextures(gl, n);
        if (money <= 0) {
            alert('Bạn đã hết tiền!');
            return;
        }
        if (number <= old) {
            alert('Bạn đã thua!');
            money -= 100;
        }
        else{
            alert('Bạn đã thắng!');
            money += 100;    
        }
        document.getElementById("money").innerHTML = money;
    }

    document.getElementById('equal').onclick = function(){
        var old = number;
        play();
        initTextures(gl, n);
        if (money <= 0) {
            alert('Bạn đã hết tiền!');
            return;
        }
        if (number == old) {
            alert('Bạn đã thắng!');
            money += 1000;
        }
        else{
            alert('Bạn đã thua!');
            money -= 100;
        }
        document.getElementById("money").innerHTML = money;
    }

    document.getElementById('low').onclick = function(){
        var old = number;
        play();
        initTextures(gl, n);
        if (money <= 0) {
            alert('Bạn đã hết tiền!');
            return;
        }
        if (number > old) {
            alert('Bạn đã thua!');
            money -= 100;   
        }
        else{
            alert('Bạn đã thắng!');
            money += 100;
        }
        document.getElementById("money").innerHTML = money;
    }
}

function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        -0.4,  0.6,   0.0, 1.0,
        -0.4, -0.6,   0.0, 0.0,
        0.4,  0.6,   1.0, 1.0,
        0.4, -0.6,   1.0, 0.0,
    ]);
    var n = 4;

    var vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_TexCoord < 0) {
        console.log('Failed to get the storage location of a_TexCoord');
        return -1;
    }

    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
    }

    var card;
    var number;
    var suit;

    function play(){
    card = './PlayingCards/';
    number = Math.floor(Math.random() * 13) + 1;
    suit = Math.floor(Math.random() * 4);
    switch (number) {
        case 1:
        card += 'ace_of_';
        break;
        case 2:
        card += '2_of_';
        break;
        case 3:
        card += '3_of_';
        break;
        case 4:
        card += '4_of_';
        break;
        case 5:
        card += '5_of_';
        break;
        case 6:
        card += '6_of_';
        break;
        case 7:
        card += '7_of_';
        break;
        case 8:
        card += '8_of_';
        break;
        case 9:
        card += '9_of_';
        break;
        case 10:
        card += '10_of_';
        break;
        case 11:
        card += 'jack_of_';
        break;
        case 12:
        card += 'queen_of_';
        break;
        case 13:
        card += 'king_of_';
        break;
    }
    
    switch (suit) {
        case 0:
        card += 'hearts.png';
        break;
        case 1:
        card += 'diamonds.png';
        break;
        case 2:
        card += 'clubs.png';
        break;
        case 3:
        card += 'spades.png';
        break;
    }

    return card;
}


function initTextures(gl, n) {
    var textute = gl.createTexture();
    if (!textute) {
        console.log('Failed to create the texture object');
        return false;
    }

    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if (!u_Sampler) {
        console.log('Failed to get the storage location of u_Sampler');

        return false;
    }
    var imange = new Image();
    if (!imange) {
        console.log('Failed to create the image object');
        return false;
    }
    imange.onload = function(){ loadTexture(gl, n, textute, u_Sampler, imange); };
    imange.src = play();
    return true;
    }
function changeColor(gl, n) {
    var red = parseFloat(document.getElementById('red').value);
    var green = parseFloat(document.getElementById('green').value);
    var blue = parseFloat(document.getElementById('blue').value);
    
    var u_Color = gl.getUniformLocation(gl.program, 'u_Color');
    if (!u_Color) {
        console.log('Failed to get the storage location of u_Color');
        return;
    }
    gl.uniform3f(u_Color, red, green, blue);
    
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
    
function loadTexture(gl, n, texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler, 0);
    var u_Color = gl.getUniformLocation(gl.program, 'u_Color');
    gl.uniform3f(u_Color, 1.0, 1.0, 1.0);
    
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

var g_eyeX = 0.0, g_eyeY = 0.0, g_eyeZ = 0.0;
var currentAngle = 0.0;
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix, u_ModelMatrix, modelMatrix) {
    if(ev.keyCode == 65) { //A
        g_eyeX += 0.01;
    } 
    else if (ev.keyCode == 68) { //D
        g_eyeX -= 0.01;
    } 
    else if (ev.keyCode == 83) { //W
        g_eyeY += 0.01;
    }
    else if (ev.keyCode == 87) { //S
        g_eyeY -= 0.01;
    }
    else if (ev.keyCode == 81) { //Q
        g_eyeZ += 0.01;
    }
    else if (ev.keyCode == 69) { //E
        g_eyeZ -= 0.01;
    }
    else if (ev.keyCode == 37){ //left
        currentAngle -= 1;
    }
    else if (ev.keyCode == 39){ //right
        currentAngle += 1;
    }
    else { 
        return; 
    }
    draw(gl, n, u_ViewMatrix, viewMatrix, u_ModelMatrix, modelMatrix);    
}
function draw(gl, n, u_ViewMatrix, viewMatrix, u_ModelMatrix, modelMatrix) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, -1, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    document.getElementById("eye").innerHTML = 'eyeX: ' + Math.round(g_eyeX * 100)/100 + ', eyeY: ' + Math.round(g_eyeY * 100)/100 + ', eyeZ: ' + Math.round(g_eyeZ * 100)/100;
    //quay
    modelMatrix.setIdentity();
    modelMatrix.rotate(currentAngle, 0, 0, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    document.getElementById("rotate").innerHTML = 'Góc: ' + currentAngle;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

function Reset(){
    money = 1000;
    document.getElementById("money").innerHTML = money;
}