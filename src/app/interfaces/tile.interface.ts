export interface ITile {
    isClicked: boolean;
    isMine: boolean;
    value?: number | null;
    setMine: Function;
    clickMine: Function;
}
