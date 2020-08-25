export function checkUniform(uniform: WebGLUniformLocation): void {
    if (uniform === null) {
        throw new Error('Failed to get a uniform location.');
    }
}

export function checkAttribute(attribute: GLint): void {
    if (attribute < 0) {
        throw new Error('Failed to get an attribute.');
    }
}

export function checkBuffer(buffer: WebGLBuffer): void {
    if (buffer === null) {
        throw new Error('Failed to create a buffer object.');
    }
}

export function checkTexture(texture: WebGLTexture): void {
    if (texture === null) {
        throw new Error('Failed to create a texture.');
    }
}