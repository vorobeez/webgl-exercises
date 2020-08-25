import { render } from './multipleTexture/multipleTexture';

function main() {
    const canvas: HTMLCanvasElement = document.querySelector('#webgl');
    const gl = canvas.getContext('webgl');

    render(gl);
}

main();
