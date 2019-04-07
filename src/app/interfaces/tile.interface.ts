export interface ITile {
    isClicked: boolean;
    isMine: boolean;
    isFlagged: boolean;
    visible: boolean;
    value?: number | null;
}
