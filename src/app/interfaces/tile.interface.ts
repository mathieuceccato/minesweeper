export interface ITile {
    isClicked: boolean;
    isMine: boolean;
    isFlagged: boolean;
    value?: number | null;
    setMine: Function;
    clickMine: Function;
}
