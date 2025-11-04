import { NextResponse } from "next/server";
import { SDK, zeroBytes32, SchemaEncoder } from "@somnia-chain/streams";
import { publicClient, walletClient } from "../";
import { toHex } from "viem";

const gpsSchema = `uint64 timestamp, int32 latitude, int32 longitude, int32 altitude, uint32 accuracy, bytes32 entityId, uint256 nonce`;
const schemaEncoder: any = new SchemaEncoder(gpsSchema);
const sdk: any = new SDK({
  public: publicClient as any,
  wallet: walletClient as any,
});

export async function POST() {
  try {
    const schemaId: any = await sdk.streams.computeSchemaId(gpsSchema);
    const encodedData: any = schemaEncoder.encodeData([
      { name: "timestamp", value: Date.now().toString(), type: "uint64" },
      { name: "latitude", value: "51509865", type: "int32" },
      { name: "longitude", value: "-118092", type: "int32" },
      { name: "altitude", value: "0", type: "int32" },
      { name: "accuracy", value: "1", type: "uint32" },
      { name: "entityId", value: zeroBytes32, type: "bytes32" },    
      { name: "nonce", value: "0", type: "uint256" },
    ]);

    const tx: any = await sdk.streams.set([
      { id: toHex("london", { size: 32 }), schemaId, data: encodedData },
    ]);

    return NextResponse.json({ message: "Data published", tx });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) });
  }
}

export async function GET() {
  try {
    const schemaId: any = await sdk.streams.computeSchemaId(gpsSchema);
    const publisher: any = (walletClient as any)?.account?.address;
    const dataKey: any = toHex("london", { size: 32 });

    if (!publisher) throw new Error("Missing wallet address");

    const result: any = await sdk.streams.getByKey(schemaId, publisher, dataKey);

    if (!result || !Array.isArray(result)) {
      throw new Error("No data found or invalid format");
    }

    // Flatten and normalize data
    const formatted = result[0].map((field: any) => ({
      name: field.name,
      type: field.type,
      value: field.value?.toString?.() ?? field.value,
    }));

    return NextResponse.json({ schemaId, data: formatted });
  } catch (e: any) {
    console.error("❌ Error in GET /streams:", e);
    return NextResponse.json({ error: e?.message || String(e) });
  }
}

