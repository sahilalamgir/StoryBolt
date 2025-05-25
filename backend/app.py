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
    allow_origins=["*"],  # In production, set this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Disable torch compile which was causing issues
torch._dynamo.config.suppress_errors = True

# Optimize GPU operations
if torch.backends.mps.is_available():
    device = torch.device("mps")
    # Enable memory optimizations
    os.environ["PYTORCH_MPS_HIGH_WATERMARK_RATIO"] = "0.0"  # Use more GPU memory
else:
    device = torch.device("cpu")
    
print(f"Using device: {device}")

# Test device
x = torch.randn(2, 2, device=device)
print(f"Tensor on device: {x.device}")

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
    torch_dtype=torch.float16,  # Float16 is best for MPS
    device_map="auto",  # Let HF optimize device placement
    local_files_only=True
)
model.eval()
load_time = time.time() - start_time
print(f"Model loaded in {load_time:.2f} seconds")
print(f"Model on device: {next(model.parameters()).device}")

# Replace the problematic compilation block with this:
if device.type == "mps":
    print("Running warmup pass for MPS optimization...")
    # Simple warmup without compilation
    sample_input = tokenizer("Warmup text", return_tensors="pt").to(device)
    with torch.no_grad():
        model(sample_input.input_ids)
    print("MPS warmup complete")

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
        
        # Prepare messages
        messages = [
            {"role": "system", "content": request.system_prompt},
            {"role": "user", "content": f"""You must write a long and compelling 
             story given the following user prompt: {request.prompt}"""}
        ]
        
        # Apply chat template (CPU operation)
        prompt = tokenizer.apply_chat_template(
            messages, 
            tokenize=False, 
            add_generation_prompt=True
        )
        
        # Tokenize directly to device to avoid CPU->GPU transfer
        inputs = tokenizer(prompt, return_tensors="pt").to(device)
        
        # Generate text with timing
        with torch.inference_mode(), torch.autocast(device_type=device.type):
            outputs = model.generate(
                **inputs, 
                max_new_tokens=request.max_length,
                temperature=request.temperature,
                do_sample=(request.temperature > 0),
                # Speed optimizations
                use_cache=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        # Move outputs to CPU for decoding (tokenizer runs on CPU)
        outputs_cpu = outputs.to("cpu")
        
        # Decode and return only the generated part
        response = tokenizer.decode(
            outputs_cpu[0][inputs['input_ids'].shape[-1]:], 
            skip_special_tokens=True
        )
        
        gen_time = time.time() - start_time
        tokens_generated = outputs.shape[1] - inputs['input_ids'].shape[1]
        print(f"Generated {tokens_generated} tokens ({len(response)} chars) in {gen_time:.2f}s ({tokens_generated/gen_time:.1f} tokens/sec)")
        
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
