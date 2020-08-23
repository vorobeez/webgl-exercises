import vertexShaderSource from './coloredTriangle.vert';
import fragmentShaderSource from './coloredTriangle.frag';

import { createShader } from '../utils/createShader';
import { createProgram } from '../utils/createProgram';
import { checkAttribute, checkBuffer } from '../utils/checks';

function initBuffer(gl: WebGLRenderingContext, program: WebGLProgram): number {
    const buffer = gl.createBuffer();
    checkBuffer(buffer);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const rowLength = 5;

    const data = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0,
    ]);

    const fSize = data.BYTES_PER_ELEMENT;

    const stride = rowLength * fSize;

    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_Position');
    checkAttribute(aPosition);
    const aColor = gl.getAttribLocation(program, 'a_Color');
    checkAttribute(aColor);

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, stride, 0);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride, fSize * 2);

    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);

    return data.length / rowLength;
}

export function render(gl: WebGLRenderingContext) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    const count = initBuffer(gl, program);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, count);
}
