export enum TypoCommand { pause = "pause", help = "help", load = "load", resume = "resume", skip = "s", paste = "paste"}

export type TypoText = {
    lines: string[];
    lineIndex: number;
    charIndex: number;
}
