export class NotEligibleForValidationException extends Error {
    constructor(message: string = 'Magic code is expired!') {
        super(message)
    }
}