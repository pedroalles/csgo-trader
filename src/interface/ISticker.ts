export interface ISticker {
  name: string;
  value: string;
  link: string;
  image: string;
}

type IStickerWithouValue = Omit<ISticker, "value">;

export interface ISale extends IStickerWithouValue {
  sellValue: string;
  buyValue: string;
  receiveValue: string;
  profitValue: string;
  profitPercent: string;
}

export interface IOrder extends IStickerWithouValue {
  buyValue: string;
  quantity: string;
}

export interface IMonitoring extends IStickerWithouValue {
  buyValue: string;
}

export interface ISaleInfos {
  quantity: string;
  startingValue: string;
  table: { value: string; quantity: string }[];
}

export interface IOrderInfos {
  quantity: string;
  startingValue: string;
  table: { value: string; quantity: string }[];
}

export interface IMonitoringInfos {
  saleQuantity: string;
  saleStartingValue: string;
  orderQuantity: string;
  orderStartingValue: string;
  saleTable: { value: string; quantity: string }[];
  orderTable: { value: string; quantity: string }[];
}
