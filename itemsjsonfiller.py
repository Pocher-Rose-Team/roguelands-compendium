import os
import json

# Define the directory path
base_dir = "public/img/items"
public_base_path = "public/image/items"

# JSON structure template for each item, including the path
def create_item_dict(file_name, relative_path):
    return {
        "name": file_name,
        "representation": file_name,
        "path": os.path.join(public_base_path, relative_path, f"{file_name}.png").replace("\\", "/"),  # Ensure forward slashes
        "stats": {
            "str": 0,
            "dex": 0,
            "vit": 0,
            "tec": 0,
            "fth": 0,
            "mag": 0
        },
        "craftedWith": []
    }

# Traverse the directory and collect PNG file names
items_data = []
for root, dirs, files in os.walk(base_dir):
    # Skip directories named 'unknown'
    if "unknown" in root:
        continue
    # Calculate the relative path from base_dir
    relative_path = os.path.relpath(root, base_dir)
    for file in files:
        if file.endswith(".png"):
            file_name = os.path.splitext(file)[0]  # Remove file extension
            items_data.append(create_item_dict(file_name, relative_path))

# Write the collected data into a JSON file
with open('items.json', 'w') as json_file:
    json.dump(items_data, json_file, indent=4)

print(f"JSON file created with {len(items_data)} items.")
