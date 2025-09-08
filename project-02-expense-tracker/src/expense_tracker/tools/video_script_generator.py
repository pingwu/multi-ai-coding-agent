import yaml
from pathlib import Path
from typing import Dict, List, Optional, Any
import json

class VideoScriptGenerator:
    def __init__(self, config_path: str = None):
        """Initialize the VideoScriptGenerator with configuration."""
        if config_path is None:
            config_path = Path(__file__).parent.parent / "config" / "video_script_config.yaml"
        
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
    
    def get_available_parameters(self) -> Dict[str, List[str]]:
        """Return all available parameters for video generation."""
        return {
            "video_types": self.config["input_parameters"]["video_type"],
            "styles": self.config["input_parameters"]["style"],
            "aspect_ratios": self.config["input_parameters"]["aspect_ratio"],
            "target_audiences": self.config["input_parameters"]["target_audience"],
            "locations": self.config["scene_parameters"]["location"],
            "lighting": self.config["scene_parameters"]["lighting"],
            "camera_movements": self.config["scene_parameters"]["camera_movement"],
            "character_types": self.config["character_parameters"]["type"],
            "emotions": self.config["character_parameters"]["emotion"],
            "interactions": self.config["character_parameters"]["interaction"],
            "audio_types": self.config["audio_parameters"]["background_music"],
            "voice_over_types": self.config["audio_parameters"]["voice_over"],
            "output_formats": self.config["output_specifications"]["format"],
            "qualities": self.config["output_specifications"]["quality"],
            "resolutions": self.config["output_specifications"]["resolution"]
        }
    
    def validate_parameters(self, parameters: Dict[str, Any]) -> bool:
        """Validate the provided parameters against the configuration."""
        try:
            # Validate video type
            if parameters.get("video_type") not in self.config["input_parameters"]["video_type"]:
                return False
            
            # Validate style
            if parameters.get("style") not in self.config["input_parameters"]["style"]:
                return False
            
            # Validate duration
            duration = parameters.get("duration", self.config["input_parameters"]["duration"]["default"])
            if not (self.config["input_parameters"]["duration"]["min"] <= duration <= 
                   self.config["input_parameters"]["duration"]["max"]):
                return False
            
            # Add more validations as needed
            
            return True
        except Exception:
            return False
    
    def generate_prompt(self, parameters: Dict[str, Any]) -> str:
        """Generate a prompt for the Gemini Veo2 model based on the provided parameters."""
        if not self.validate_parameters(parameters):
            raise ValueError("Invalid parameters provided")
        
        video_type = parameters.get("video_type", "commercial")
        template = self.config["prompt_templates"][video_type]["template"]
        
        # Replace placeholders in the template
        prompt = template
        for key, value in parameters.items():
            prompt = prompt.replace(f"[{key}]", str(value))
        
        return prompt
    
    def generate_script(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a complete video script with all necessary components."""
        prompt = self.generate_prompt(parameters)
        
        # Here you would integrate with the Gemini Veo2 API
        # For now, we'll return a structured script format
        script = {
            "prompt": prompt,
            "parameters": parameters,
            "constraints": self.config["constraints"],
            "guidelines": self.config["guidelines"],
            "model_info": self.config["model"]
        }
        
        return script

def main():
    # Example usage
    generator = VideoScriptGenerator()
    
    # Example parameters
    parameters = {
        "video_type": "commercial",
        "duration": 30,
        "style": "realistic",
        "target_audience": "adults",
        "location": "indoor",
        "lighting": "artificial",
        "character_type": "human",
        "emotion": "happy",
        "background_music": "upbeat",
        "voice_over": "male",
        "camera_movement": "panning",
        "resolution": "1080p",
        "format": "mp4"
    }
    
    try:
        script = generator.generate_script(parameters)
        print(json.dumps(script, indent=2))
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 