import requests
import time
import os
import uuid
from django.conf import settings

COMFY_URL = "http://127.0.0.1:8188"


def build_prompt(room, theme, suggestion=""):

    prompt = f"""
    Ultra realistic interior design of a {room}.
    Style: {theme}.
    {suggestion}

    architectural photography, interior magazine quality,
    natural lighting, realistic textures, 8k detail
    """

    return prompt.strip()


COMFY_URL = "http://127.0.0.1:8188"

def generate_ai_images(prompt_text):

    workflow = {
        "3": {
            "class_type": "KSampler",
            "inputs": {
                "seed": 0,
                "steps": 35,
                "cfg": 8,
                "sampler_name": "euler",
                "scheduler": "normal",
                "denoise": 1,
                "model": ["4", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0]
            }
        },
        "4": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {
                "ckpt_name": "sd_xl_base_1.0.safetensors"
            }
        },
        "5": {
            "class_type": "EmptyLatentImage",
            "inputs": {
                "width": 1024,
                "height": 1024,
                "batch_size": 1
            }
        },
        "6": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": prompt_text,
                "clip": ["4", 1]
            }
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                 "text": "cartoon, anime, illustration, painting, drawing, low quality, unrealistic, CGI, 3D render, distorted furniture",
                "clip": ["4", 1]
            }
        },
        "8": {
            "class_type": "VAEDecode",
            "inputs": {
                "samples": ["3", 0],
                "vae": ["4", 2]
            }
        },
        "9": {
            "class_type": "SaveImage",
            "inputs": {
                "filename_prefix": "InteriorAI",
                "images": ["8", 0]
            }
        }
    }

    # send prompt to ComfyUI
    requests.post(f"{COMFY_URL}/prompt", json={"prompt": workflow})

    # wait for generation
    time.sleep(60)

    output_dir = r"C:\Users\ATHENA\AI\ComfyUI\output"

    files = [f for f in os.listdir(output_dir) if f.startswith("InteriorAI")]

    if not files:
        raise Exception("AI generation failed")

    latest = sorted(files)[-1]

    return latest