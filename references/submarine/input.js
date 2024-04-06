export class Input {
    constructor() {
        this.isPressed = {};
        this.wasPressed = {};

        document.addEventListener('keydown', event => {
            this.isPressed[event.key] = true;
        });
        document.addEventListener('keyup', event => {
            this.isPressed[event.key] = false;
        });
    }

    listenKeyClick(key, func, ctx) {
        document.addEventListener('keydown', event => {
            if(event.key === key && !this.wasPressed[event.key]) {
                console.log("safd");
                this.wasPressed[event.key] = true;
                console.log(func);
                func.call(ctx.func);
            }
        });

        document.addEventListener('keyup', event => {
            this.wasPressed[event.key] = false;
        });
    }
}