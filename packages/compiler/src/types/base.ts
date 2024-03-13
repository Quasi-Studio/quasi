export interface ConnectTo {
  /**
   * if this socket is not connected, `blockId` will be `NaN`
   */
  blockId: number
  /**
   * if this socket is not connected, `blockId` will be `""`
   */
  socketName: string
}
