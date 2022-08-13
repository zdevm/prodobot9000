export class InvalidCodeException extends Error {
    constructor(message: string = 'Magic code is invalid!') {
        super(message)
    }
}