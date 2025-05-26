from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from diffusers import DiffusionPipeline
import time
import io
from PIL import Image
import base64

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Determine best device for each model
text_device = torch.device("cpu")  # CPU works better for small TinyLlama
# Try to use GPU for image generation which benefits more
if torch.backends.mps.is_available():
    image_device = torch.device("mps")
    print("Using MPS for image generation")
else:
    image_device = torch.device("cpu")
    print("MPS not available, using CPU for image generation")

print(f"Text generation device: {text_device}")
print(f"Image generation device: {image_device}")

# Load text generation model
text_model_path = "./TinyLlama-1.1B-Chat-v1.0"
print(f"Loading text model from: {text_model_path}")

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(
    text_model_path,
    local_files_only=True
)

print("Loading text model...")
start_time = time.time()
text_model = AutoModelForCausalLM.from_pretrained(
    text_model_path,
    torch_dtype=torch.bfloat16,  # bfloat16 is better for CPU
    device_map=None,  # Don't use device_map
    local_files_only=True
)
text_model.to(text_device)
text_model.eval()
load_time = time.time() - start_time
print(f"Text model loaded in {load_time:.2f} seconds")

# Load image generation model
image_model_path = "./sdxl-turbo"
print(f"Loading image model from: {image_model_path}")

print("Loading image pipeline...")
img_start_time = time.time()
image_pipe = DiffusionPipeline.from_pretrained(
    image_model_path,
    torch_dtype=torch.float16,
    local_files_only=True
).to(image_device)

image_pipe.safety_checker = None
image_pipe.requires_safety_checker = False

img_load_time = time.time() - img_start_time
print(f"Image model loaded in {img_load_time:.2f} seconds on {image_device}")

# Test image generation with a simple prompt - proper way
try:
    print("Testing image generation...")
    test_start = time.time()
    with torch.no_grad():
        test_output = image_pipe(
            "test",
            num_inference_steps=1,
            guidance_scale=0.0
        )
    test_time = time.time() - test_start
    print(f"Image model test successful - generated test image in {test_time:.2f}s")
except Exception as e:
    print(f"Warning: Image model test failed: {e}")
    print("The API will still try to use the model when requested")

class TextRequest(BaseModel):
    prompt: str
    max_length: int = 2048
    temperature: float = 0.7
    system_prompt: str = """You are the best author in the world. 
    You are capable of writing the most engaging and interesting stories."""

class ImageRequest(BaseModel):
    text: list[str]
    
@app.post("/generate-text")
async def generate_text(request: TextRequest):
    print(request.prompt)
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
            outputs = text_model.generate(
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
        print(f"Generated {tokens_generated} tokens ({len(response)} chars) in {gen_time:.2f}s ({tokens_generated/gen_time:.1f} tokens/sec)")
        
        return {
            "generated_text": response,
        }
    
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-image")
async def generate_image(request: ImageRequest):
    if image_pipe is None:
        raise HTTPException(status_code=500, detail="Image pipeline not loaded")
    
    print(request.text)

    try:
        images = []
        for text in request.text: 
            print(text)
            # Time the generation process
            start_time = time.time()

            # Generate image with SDXL Turbo
            with torch.inference_mode():
                output = image_pipe(
                    prompt=text,
                    num_inference_steps=1,  # Use 1 step for speed (turbo model)
                    guidance_scale=0.0     # No guidance for speed
                )
            
            # Get the image
            pil_image = output.images[0]
            
            # Encode as base64 for JSON transport
            buffer = io.BytesIO()
            pil_image.save(buffer, format="JPEG")
            img_b64 = base64.b64encode(buffer.getvalue()).decode()
            
            gen_time = time.time() - start_time
            print(f"Generated image in {gen_time:.2f}s on {image_device}")

            print(img_b64[:100])

            images.append(img_b64)
        print(list(map(lambda x: x[100], images)))
        return {"images": images}
    
    except Exception as e:
        import traceback
        error_details = f"Error generating image: {str(e)}\n{traceback.format_exc()}"
        print(error_details)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "text_model": type(text_model).__name__,
        "image_model": type(image_pipe).__name__,
        "image_device": str(image_device)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
