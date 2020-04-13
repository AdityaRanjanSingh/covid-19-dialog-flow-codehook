import { injectable } from "inversify";

@injectable()
export class Messages {
    substituteMessage(message: string, substitute: any) {
        let formattedMsg = message
        for (const key in substitute) {
            if (key) {
                const reg = new RegExp('\${' + key + '}', 'g')
                formattedMsg = formattedMsg.replace('${' + key + '}', substitute[key]);
            }
        }
        return formattedMsg;
    }

    getMessage(message: any, substitute: any) {
        const item = message[Math.floor(Math.random() * message.length)];
        return this.substituteMessage(item, substitute)
    }
}