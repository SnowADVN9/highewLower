var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '    gl_Position = u_MvpMatrix * a_Position;\n' +
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
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) { 
        console.log('Failed to get the storage location of u_MvpMatrix');
        return;
    }


    var mvpMatrix = new Matrix4();
    document.onkeydown = function(ev){ keydown(ev, gl, n, u_MvpMatrix, mvpMatrix); };
    document.getElementById('changeColor').onclick = function() {
        changeColor(gl,n);
    };
    
    draw(gl, n, u_MvpMatrix, mvpMatrix);
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
    var vertices = new Float32Array([
         0.7, 1.0, 0.35,  -0.7, 1.0, 0.35,  -0.7,-1.0, 0.35,   0.7,-1.0, 0.35,    //front
         0.7, 1.0, 0.35,   0.7,-1.0, 0.35,   0.7,-1.0,-0.35,   0.7, 1.0,-0.35,    //right
        -0.7, 1.0, 0.35,  -0.7, 1.0,-0.35,  -0.7,-1.0,-0.35,  -0.7,-1.0, 0.35,    //left
         0.7,-1.0,-0.35,  -0.7,-1.0,-0.35,  -0.7, 1.0,-0.35,   0.7, 1.0,-0.35     //back
    ]);

    var texCoords = new Float32Array([
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    //front
        0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    //right
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    //left
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     //back
    ]);

    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
       12,13,14,  12,14,15,    // left  
    ]);

    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1;
    if (!initArrayBuffer(gl, texCoords, 2, gl.FLOAT, 'a_TexCoord')) return -1;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);

    return true;
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
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFẺ_BIT);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
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
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0); 
}

var g_eyeX = 3.0, g_eyeY = 3.0, g_eyeZ = 7.0;
var currentAngle = 0.0;
function keydown(ev, gl, n, u_MvpMatrix, mvpMatrix) {
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
    draw(gl, n, u_MvpMatrix, mvpMatrix);    
}

var modelMatrix = new Matrix4();
var viewMatrix = new Matrix4();
var projMatrix = new Matrix4();
function draw(gl,n, u_MvpMatrix, mvpMatrix) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, -1, 0, 1, 0);
    document.getElementById("eye").innerHTML = 'eyeX: ' + Math.round(g_eyeX * 100)/100 + ', eyeY: ' + Math.round(g_eyeY * 100)/100 + ', eyeZ: ' + Math.round(g_eyeZ * 100)/100;
    modelMatrix.setIdentity();
    modelMatrix.rotate(currentAngle, 0, 0, 1);
    projMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    document.getElementById("rotate").innerHTML = 'Góc: ' + currentAngle;
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);    
}

function Reset(){
    money = 1000;
    document.getElementById("money").innerHTML = money;
}