class ChunkerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.size = 16000 * 3;
  }
  process(inputs) {
    const channel = inputs[0][0];
    if (channel) {
      for (const s of channel) this.buffer.push(s);
      if (this.buffer.length >= this.size) {
        this.port.postMessage(
          new Float32Array(this.buffer.splice(0, this.size)),
        );
      }
    }
    return true;
  }
}
registerProcessor("chunker-processor", ChunkerProcessor);
