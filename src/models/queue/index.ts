export class Queue<Value> {
  map: Map<Value, number>;

  constructor(public elements: Value[]) {
    this.map = elements.reduce((map, element, index) => {
      return new Map([...map, [element, index]]);
    }, new Map());
  }

  getByIndex(index: number): Iterator<Value> {
    return new Iterator(this, this.elements[index]);
  }

  getByValue(value: Value): Iterator<Value> {
    return new Iterator(this, value);
  }
}

export class Iterator<T> {
  constructor(private queue: Queue<T>, private value: T) {}

  get() {
    return this.value;
  }

  next(): Iterator<T> {
    const index = this.queue.map.get(this.value);
    const size = this.queue.elements.length;
    const nextIndex = index != null && index + 1 < size ? index + 1 : 0;
    return new Iterator(this.queue, this.queue.elements[nextIndex]);
  }

  previous(): Iterator<T> {
    const index = this.queue.map.get(this.value);
    const size = this.queue.elements.length;
    const nextIndex = index != null && index - 1 >= 0 ? index - 1 : size - 1;
    return new Iterator(this.queue, this.queue.elements[nextIndex]);
  }
}
