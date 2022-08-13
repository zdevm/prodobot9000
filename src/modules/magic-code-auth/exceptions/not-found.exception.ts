export class NotFoundException extends Error {
    constructor(message: string = 'Magic code not found!') {
        super(message)
    }
}