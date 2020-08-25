export function promiseFromEvent(target: EventTarget, type: string): Promise<Event> {
    return new Promise<Event>((resolve) => {
        target.addEventListener(type, (event) => {
            resolve(event);
        });
    });
}