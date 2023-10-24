export type SocketId = number

export type SocketType = "InSocket" | "MultiOutSocket"

export type BlockId = number

export type BlockType = "ComponentBlock" | "RootBlock"

export type LineId = number

export type LineType = "BasicLine"

export type Block = {
    ctor: BlockType,
    id: BlockId,
    dockedToBlock: BlockId | null,
    dockedByBlocks: BlockId[],
    data: {
        leftSockets: SocketId[],
        rightSockets: SocketId[],
        topSockets: SocketId[],
        bottomSockets: SocketId[],
    }
}

export type Socket = {
    ctor: SocketType,
    id: SocketId,
    label: string,
    blockId: BlockId
}

export type Line = {
    ctor: LineType,
    id: LineId
    socketAId: SocketId,
    socketBId: SocketId
}


// WARNING: DEPRECATED