export interface IMessage {
    substituteMessage(message: string, substitute: any): string,
    getMessage(messages: any[], substitute: any): string
}