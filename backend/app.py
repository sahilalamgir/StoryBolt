from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

app = FastAPI()

# Add CORS middleware to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Force PyTorch to use CPU only
# Disable torch compile which was causing issues
torch._dynamo.config.suppress_errors = True
os.environ["CUDA_VISIBLE_DEVICES"] = ""
torch.set_default_tensor_type('torch.FloatTensor')

# Update app.py to use the online model instead
model_path = os.path.abspath("bitnet-b1.58-2B-4T")  # Update this path to where you cloned the repo
print(f"Loading model from: {model_path}")

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(
    model_path,
    local_files_only=True
)

print("Loading model...")
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype=torch.bfloat16,
    device_map="cpu",
    local_files_only=True
)
print("Model loaded successfully!")

class TextRequest(BaseModel):
    prompt: str
    max_length: int = 1024
    temperature: float = 0.7
    system_prompt: str = """You are the best author in the world. 
    You are capable of writing the most engaging and interesting stories. 
    You must write a long and compelling story given the user prompt below."""

@app.post("/generate")
async def generate_text(request: TextRequest):
    try:
        messages = [
            {"role": "system", "content": request.system_prompt},
            {"role": "user", "content": request.prompt},
        ]
        
        # Apply chat template
        prompt = tokenizer.apply_chat_template(
            messages, 
            tokenize=False, 
            add_generation_prompt=True
        )
        
        # Tokenize the input
        inputs = tokenizer(prompt, return_tensors="pt").to("cpu")
        
        # Generate text
        outputs = model.generate(
            **inputs, 
            max_new_tokens=request.max_length,
            temperature=request.temperature,
            do_sample=True if request.temperature > 0 else False
        )
        
        # Decode and return only the generated part
        response = tokenizer.decode(
            outputs[0][inputs['input_ids'].shape[-1]:], 
            skip_special_tokens=True
        )
        
        return {"generated_text": response}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
