export interface MessageType {
  type: 'msg' | 'conf' | 'redConf' | 'dangerConf' | 'err' | null,
  messageContent: string | null,
  okLabel?: string,
  cancelLabel?: string,
  onOk?: () => void,
  onCancel?: () => void,
  backdropOpacity?: number,
  testID?: string,
}