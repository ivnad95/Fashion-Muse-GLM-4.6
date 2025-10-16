from PIL import Image
import os

def convert_to_ico(png_path, ico_path):
    """Converts a PNG image to a multi-resolution ICO file."""
    try:
        img = Image.open(png_path)
        # Resize the image to standard favicon sizes (16x16, 32x32, 48x48)
        sizes = [(16, 16), (32, 32), (48, 48)]
        img.save(ico_path, format='ICO', sizes=sizes)
        print(f"Successfully converted {png_path} to {ico_path} with sizes {sizes}")
    except FileNotFoundError:
        print(f"Error: PNG file not found at {png_path}")
    except Exception as e:
        print(f"An error occurred during conversion: {e}")

if __name__ == "__main__":
    # Assuming script is run from the project root
    project_root = os.path.dirname(os.path.abspath(__file__))
    png_path = os.path.join(project_root, 'public', 'logo.png')
    ico_path = os.path.join(project_root, 'public', 'favicon.ico')
    convert_to_ico(png_path, ico_path)

