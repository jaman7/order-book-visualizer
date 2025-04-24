export interface Order {
  price: number;
  volume: number;
}

export interface OrderBookSnapshot {
  bids: Order[];
  asks: Order[];
  time: number;
}
