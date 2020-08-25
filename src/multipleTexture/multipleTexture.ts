import imageUrl from '../resources/sky.jpg';
import maskUrl from  '../resources/circle.gif';

import vertexShaderSource from './multipleTexture.vert';
import fragmentShaderSource from './multipleTexture.frag';

import { createShader } from 'src/utils/createShader';
import { createProgram } from 'src/utils/createProgram';
import { checkAttribute, checkBuffer } from 'src/utils/checks';
import { initTexture } from 'src/utils/initTexture';
import { promiseFromEvent } from 'src/utils/promiseFromEvent';

function initBuffer(gl: WebGLRenderingContext, program: WebGLProgram): number {
    const buffer = gl.createBuffer();
    checkBuffer(buffer);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const rowLength = 4;

    const data = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
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
    textureUnit: GLenum,
    textureUnitNumber: number,
    uSampler: WebGLUniformLocation,
    image: HTMLImageElement,
): void {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(uSampler, textureUnitNumber);
}

export function render(gl: WebGLRenderingContext) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const count = initBuffer(gl, program);

    const { image, texture: imageTexture, uSampler: uSampler0 } = initTexture(
        gl, program, imageUrl, 'u_Sampler0',
    );
    const { image: mask, texture: maskTexture, uSampler: uSampler1 } = initTexture(
        gl, program, maskUrl, 'u_Sampler1',
    );

    Promise.all([
        promiseFromEvent(image, 'load'),
        promiseFromEvent(mask, 'load'),
    ]).then(() => {
        setTexture(gl, imageTexture, gl.TEXTURE0, 0, uSampler0, image);
        setTexture(gl, maskTexture, gl.TEXTURE1, 1, uSampler1, mask);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
    });
}
