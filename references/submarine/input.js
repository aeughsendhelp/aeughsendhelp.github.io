// this was going to be a cool class that worked well but im only partially using it because it just can't figure out how to make it any better
export class Input {
    constructor() {
        this.isPressed = {};

        document.addEventListener('keydown', event => {
            this.isPressed[event.key] = true;
        });
        document.addEventListener('keyup', event => {
            this.isPressed[event.key] = false;
        });
    }
}