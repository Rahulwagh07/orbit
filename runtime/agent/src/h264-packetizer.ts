import { random16, RtpHeader, RtpPacket } from "werift/nonstandard";

const MAX_RTP_PAYLOAD_SIZE = 1200;

export class H264Packetizer {
  private sequenceNumber = random16();

  constructor(private readonly payloadType: number) {}

  packetizeNalus(nalus: Buffer[], rtpTimestamp: number): RtpPacket[] {
    const packets: RtpPacket[] = [];
    for (let i = 0; i < nalus.length; i++) {
      const nalu = nalus[i]!;
      const marker = i === nalus.length - 1;
      if (nalu.length <= MAX_RTP_PAYLOAD_SIZE) {
        packets.push(this.buildPacket(nalu, rtpTimestamp, marker));
        continue;
      }
      const nalHeader = nalu[0]!;
      const fragmentPayload = nalu.subarray(1);
      const fragmentSize = MAX_RTP_PAYLOAD_SIZE - 2;
      const fuIndicator = (nalHeader & 0xe0) | 28;
      const nalType = nalHeader & 0x1f;
      for (let offset = 0; offset < fragmentPayload.length; offset += fragmentSize) {
        const chunk = fragmentPayload.subarray(
          offset,
          Math.min(fragmentPayload.length, offset + fragmentSize),
        );
        const fuHeader = Buffer.from([
          (offset === 0 ? 0x80 : 0x00) |
            (offset + chunk.length >= fragmentPayload.length ? 0x40 : 0x00) |
            nalType,
        ]);
        packets.push(
          this.buildPacket(
            Buffer.concat([Buffer.from([fuIndicator]), fuHeader, chunk]),
            rtpTimestamp,
            marker && offset + chunk.length >= fragmentPayload.length,
          ),
        );
      }
    }
    return packets;
  }

  private buildPacket(payload: Buffer, timestamp: number, marker: boolean): RtpPacket {
    const packet = new RtpPacket(
      new RtpHeader({
        payloadType: this.payloadType,
        sequenceNumber: this.sequenceNumber,
        timestamp,
        marker,
      }),
      payload,
    );
    this.sequenceNumber = (this.sequenceNumber + 1) & 0xffff;
    return packet;
  }
}
