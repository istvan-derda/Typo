export enum TypoCommand { pause = "pause", help = "help", load = "load", resume = "resume"}

export type TypoText = {
    lines: string[];
    lineIndex: number;
    charIndex: number;
}
