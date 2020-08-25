import imageUrl from '../resources/sky.jpg';

import vertexShaderSource from './texturedQuad.vert';
import fragmentShaderSource from './texturedQuad.frag';

import { createShader } from '../utils/createShader';
import { createProgram } from '../utils/createProgram';
import { checkAttribute, checkBuffer, checkTexture, checkUniform } from '../utils/checks';

function initTextures(gl: WebGLRenderingContext, program: WebGLProgram): {
    image: HTMLImageElement,
    texture: WebGLTexture,
    uSampler: WebGLUniformLocation,
} {
    const texture = gl.createTexture();
    checkTexture(texture);

    const uSampler = gl.getUniformLocation(program, 'u_Sampler');
    checkUniform(uSampler);

    const image = new Image();

    image.src = imageUrl;

    return { image, texture, uSampler };
}

function initBuffer(gl: WebGLRenderingContext, program: WebGLProgram): number {
    const buffer = gl.createBuffer();
    checkBuffer(buffer);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const rowLength = 4;

    const data = new Float32Array([
        -0.5, 0.5, -0.3, 2.7,
        -0.5, -0.5, -0.3, -0.2,
        0.5, 0.5, 2.7, 2.7,
        0.5, -0.5, 2.7, -0.2,
    ]);

    const fSize = data.BYTES_PER_ELEMENT;

    const stride = rowLength * fSize;

    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_Position');
    checkAttribute(aPosition);
    const aTexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    checkAttribute(aTexCoord);

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, stride, 0);
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, stride, fSize * 2);

    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aTexCoord);

    return data.length / rowLength;
}

function setTexture(
    gl: WebGLRenderingContext,
    texture: WebGLTexture,
    uSampler: WebGLUniformLocation,
    image: HTMLImageElement,
    count: number,
): void {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(uSampler, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
}

export function render(gl: WebGLRenderingContext) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const count = initBuffer(gl, program);

    const { image, texture, uSampler } = initTextures(gl, program);

    image.addEventListener('load', () => {
        setTexture(gl, texture, uSampler, image, count);
    });
}
