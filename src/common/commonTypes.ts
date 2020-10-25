export enum TypoCommand { pause = "pause", help = "help", load = "load", resume = "resume", skip = "s", paste = "paste"}

export type TypoTextDeprecated = {
    lines: string[];
    lineIndex: number;
    charIndex: number;
}
