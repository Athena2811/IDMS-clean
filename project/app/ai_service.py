import replicate
import requests
from django.conf import settings
from django.core.files.base import ContentFile

def generate_ai_image(ai_design):
    client = replicate.Client(api_token=settings.REPLICATE_API_TOKEN)

    output = client.run(
        "black-forest-labs/flux-1.1-pro",
        input={
            "prompt": ai_design.prompt_used,
            "aspect_ratio": "4:3",
            "output_format": "jpg",
            "quality": 95
        }
    )

    # 🔥 FIX: output is a FileOutput, not a list
    image_url = str(output)

    response = requests.get(image_url)
    response.raise_for_status()

    filename = f"design_{ai_design.id}.jpg"
    ai_design.generated_image.save(
        filename,
        ContentFile(response.content),
        save=True
    )

    return ai_design.generated_image.url

