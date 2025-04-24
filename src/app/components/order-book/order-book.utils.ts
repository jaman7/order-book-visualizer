import { OrderBookSnapshot } from './order-book.models';

export function transformRawSnapshot(snapshot: any): OrderBookSnapshot {
  const bids = Array.from({ length: 10 }, (_, i) => ({
    price: snapshot[`Bid${i + 1}`],
    volume: snapshot[`Bid${i + 1}Size`],
  }));

  const asks = Array.from({ length: 10 }, (_, i) => ({
    price: snapshot[`Ask${i + 1}`],
    volume: snapshot[`Ask${i + 1}Size`],
  }));

  return {
    time: new Date(`1970-01-01T${snapshot.Time}Z`).getTime(),
    bids,
    asks,
  };
}
