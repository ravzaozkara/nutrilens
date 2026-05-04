import json
import os
from PIL import Image

from .core.config import settings
from .nutrition import get_display_name

_model = None
_class_names: list[str] | None = None
_transform = None
_device = None


def _classes_json_path() -> str:
    return os.path.join(os.path.dirname(settings.MODEL_PATH), "classes.json")


def _load_class_names() -> list[str]:
    """classes.json'dan model eğitim sırasındaki sınıf isimlerini okur."""
    global _class_names
    if _class_names is not None:
        return _class_names

    with open(_classes_json_path(), encoding="utf-8") as f:
        _class_names = json.load(f)
    return _class_names


def load_model():
    """
    EfficientNet-B0 modelini timm formatında yükler (ml-service ile birebir uyumlu).
    Model dosyası yoksa veya yüklenemezse None döndürür (simülasyon moduna geçilir).
    """
    global _model, _device

    if _model is not None:
        return _model

    if not os.path.exists(settings.MODEL_PATH):
        print(f"⚠️  Model file not found at {settings.MODEL_PATH} — falling back to simulation mode.")
        return None

    if not os.path.exists(_classes_json_path()):
        print(f"⚠️  classes.json not found at {_classes_json_path()} — falling back to simulation mode.")
        return None

    try:
        import torch
        import timm

        class_names = _load_class_names()
        _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        model = timm.create_model(
            "efficientnet_b0",
            pretrained=False,
            num_classes=len(class_names),
            drop_rate=0.0,
        )
        state_dict = torch.load(
            settings.MODEL_PATH,
            map_location=_device,
            weights_only=False,
        )
        model.load_state_dict(state_dict)
        model = model.to(_device)
        model.eval()

        _model = model
        print(f"✅ Model loaded: {len(class_names)} classes (device={_device})")
        return _model
    except Exception as exc:
        print(f"⚠️  Model load failed: {type(exc).__name__}: {exc} — falling back to simulation mode.")
        return None


def get_transform():
    """ml-service ile birebir aynı transform: Resize((224,224)) + ToTensor + ImageNet normalize."""
    global _transform
    if _transform is not None:
        return _transform

    from torchvision import transforms

    _transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225],
        ),
    ])
    return _transform


def predict_food(image_path: str) -> dict:
    """
    Yüklenen görselden yemek tahmini yapar.

    Döndürür:
        {
            "food_key": str,         # snake_case yemek anahtarı (classes.json sırası)
            "display_name": str,     # Türkçe gösterim adı
            "confidence": float,     # Güven skoru (0.0 - 1.0)
            "is_confident": bool     # Eşiği geçip geçmediği
        }
    """
    model = load_model()

    if model is None:
        return _simulate_prediction(image_path)

    import torch

    class_names = _load_class_names()
    transform = get_transform()

    img = Image.open(image_path).convert("RGB")
    tensor = transform(img).unsqueeze(0).to(_device)

    with torch.no_grad():
        probs = torch.softmax(model(tensor), dim=1)[0]
        confidence_t, predicted_t = torch.max(probs, dim=0)
        confidence = float(confidence_t.item())
        predicted_index = int(predicted_t.item())

    food_key = class_names[predicted_index] if predicted_index < len(class_names) else "bilinmeyen"

    return {
        "food_key": food_key,
        "display_name": get_display_name(food_key),
        "confidence": round(confidence, 4),
        "is_confident": confidence >= settings.CONFIDENCE_THRESHOLD,
    }


def _simulate_prediction(image_path: str) -> dict:
    """
    Yalnızca model gerçekten yüklenemediğinde devreye girer.
    Görselin geçerliliğini doğrular ve rastgele bir tahmin döndürür.
    """
    import random

    try:
        img = Image.open(image_path)
        img.verify()
    except Exception:
        return {
            "food_key": "bilinmeyen",
            "display_name": "Geçersiz Görsel",
            "confidence": 0.0,
            "is_confident": False,
        }

    try:
        class_names = _load_class_names()
    except Exception:
        from .nutrition import CLASS_NAMES
        class_names = CLASS_NAMES

    food_key = random.choice(class_names)
    confidence = round(random.uniform(0.40, 0.95), 4)

    return {
        "food_key": food_key,
        "display_name": get_display_name(food_key),
        "confidence": confidence,
        "is_confident": confidence >= settings.CONFIDENCE_THRESHOLD,
    }
