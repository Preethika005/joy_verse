# from fastapi import FastAPI, File, UploadFile
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# from transformers import AutoImageProcessor, AutoModelForImageClassification
# from PIL import Image
# import torch
# import io
# import os

# model_name = os.getenv("MODEL_NAME", "trpakov/vit-face-expression")
# use_auth_token = os.getenv("USE_AUTH_TOKEN", "false").lower() == "true"

# processor = AutoImageProcessor.from_pretrained(model_name)
# model = AutoModelForImageClassification.from_pretrained(model_name, use_auth_token=use_auth_token)


# # Initialize FastAPI app
# app = FastAPI()

# # Allow CORS for frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Or specify your frontend domain
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def root():
#     return {"message": "Facial Expression Recognition API"}

# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     contents = await file.read()
#     image = Image.open(io.BytesIO(contents)).convert("RGB")
#     inputs = processor(images=image, return_tensors="pt")

#     with torch.no_grad():
#         outputs = model(**inputs)
#         logits = outputs.logits
#         predicted_class_idx = logits.argmax(-1).item()
#         predicted_label = model.config.id2label[predicted_class_idx]

#     return JSONResponse(content={"expression": predicted_label})
