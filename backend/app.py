from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import os
import time

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Force CPU mode
device = torch.device("cpu")
print(f"Using device: {device}")

# Use the downloaded model
model_path = os.path.abspath("TinyLlama-1.1B-Chat-v1.0")
print(f"Loading model from: {model_path}")

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(
    model_path,
    local_files_only=True
)

print("Loading model...")
start_time = time.time()
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype=torch.bfloat16,  # bfloat16 is better for CPU
    device_map=None,  # Don't use device_map
    local_files_only=True
)
model.to(device)
model.eval()
load_time = time.time() - start_time
print(f"Model loaded in {load_time:.2f} seconds")

class TextRequest(BaseModel):
    prompt: str
    max_length: int = 1024
    temperature: float = 0.7
    system_prompt: str = """You are the best author in the world. 
    You are capable of writing the most engaging and interesting stories."""

@app.post("/generate")
async def generate_text(request: TextRequest):
    try:
        # Time the generation process
        start_time = time.time()
        
        messages = [
            {"role": "system", "content": request.system_prompt},
            {"role": "user", "content": f"""You must write a long and compelling 
             story given the following user prompt: {request.prompt}"""}
        ]
        
        # Apply chat template
        prompt = tokenizer.apply_chat_template(
            messages, 
            tokenize=False, 
            add_generation_prompt=True
        )
        
        # Tokenize the input
        inputs = tokenizer(prompt, return_tensors="pt")
        
        # Generate text
        with torch.inference_mode():
            outputs = model.generate(
                **inputs, 
                max_new_tokens=request.max_length,
                temperature=request.temperature,
                do_sample=(request.temperature > 0),
                pad_token_id=tokenizer.eos_token_id
            )
        
        # Decode and return only the generated part
        response = tokenizer.decode(
            outputs[0][inputs['input_ids'].shape[-1]:], 
            skip_special_tokens=True
        )
        
        gen_time = time.time() - start_time
        tokens_generated = outputs.shape[1] - inputs['input_ids'].shape[1]
        print(f"[CPU] Generated {tokens_generated} tokens ({len(response)} chars) in {gen_time:.2f}s ({tokens_generated/gen_time:.1f} tokens/sec)")
        
        return {
            "generated_text": response,
            "generation_time": round(gen_time, 2),
            "tokens_generated": tokens_generated
        }
    
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "device": str(device),
        "model_type": type(model).__name__
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
