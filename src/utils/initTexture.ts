import { checkTexture, checkUniform } from 'src/utils/checks';

export function initTexture(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    imageSrc: string,
    samplerName: string,
): {
    image: HTMLImageElement,
    texture: WebGLTexture,
    uSampler: WebGLUniformLocation,
} {
    const texture = gl.createTexture();
    checkTexture(texture);

    const uSampler = gl.getUniformLocation(program, samplerName);
    checkUniform(uSampler);

    const image = new Image();

    image.src = imageSrc;

    return { image, texture, uSampler };
}
