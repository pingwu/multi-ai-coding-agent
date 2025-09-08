from my_mas.tools.video_script_generator import VideoScriptGenerator
import json

def main():
    # Initialize the video script generator
    generator = VideoScriptGenerator()
    
    # Get available parameters
    available_params = generator.get_available_parameters()
    print("Available Parameters:")
    print(json.dumps(available_params, indent=2))
    print("\n" + "="*50 + "\n")
    
    # Example 1: Commercial Video
    commercial_params = {
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
    
    print("Example 1: Commercial Video")
    try:
        commercial_script = generator.generate_script(commercial_params)
        print(json.dumps(commercial_script, indent=2))
    except ValueError as e:
        print(f"Error: {e}")
    print("\n" + "="*50 + "\n")
    
    # Example 2: Educational Video
    educational_params = {
        "video_type": "educational",
        "duration": 120,
        "style": "3d_animation",
        "target_audience": "children",
        "location": "virtual",
        "lighting": "natural",
        "character_type": "cartoon",
        "emotion": "excited",
        "background_music": "calm",
        "voice_over": "female",
        "camera_movement": "tracking",
        "resolution": "4k",
        "format": "mp4"
    }
    
    print("Example 2: Educational Video")
    try:
        educational_script = generator.generate_script(educational_params)
        print(json.dumps(educational_script, indent=2))
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 