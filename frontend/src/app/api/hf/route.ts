import { NextResponse } from "next/server";
import { inference } from "@/utils/hf";

export async function POST(request: Request) {
    const formData = await request.formData();

    try {
        let message = formData.get("message");
        console.log(message);
        const out = await inference.textGeneration({
            provider: "hf-inference",
            model: "EleutherAI/gpt-neo-125M",
            inputs: message,
            max_tokens: 512,
        });

        console.log(out.generated_text);

        return NextResponse.json(
            { message: out.generated_text },
            { status: 200 },
        );
    } catch (err: any) {
        console.log("Error caught!!!", err);
        return NextResponse.json(
            { error: err.message ?? String(err) },
            { status: 500 }
          );
    }
}
