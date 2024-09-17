import os
import json

# Base directory for images
base_folder = 'public/img'

# Keywords for special formatting of the representation
keywords = ['armor', 'helmet', 'helm', 'Helm', 'potion', 'emblem', 'ring', 'shield', 'Armor']

# Function to generate the representation based on the name
def generate_representation(name: str) -> str:
    # Lowercase the name for uniform comparison
    lower_name = name.lower()

    # Check for keywords and split/format accordingly
    for keyword in keywords:
        if keyword in lower_name:
            # Split name at the keyword
            parts = lower_name.split(keyword, 1)
            # Capitalize the first part and the keyword, and return the formatted representation
            return f"{parts[0].strip().capitalize()} {keyword.capitalize()}{parts[1].capitalize()}".strip()

    # If no keywords are found, simply capitalize the entire name
    return name.capitalize()

# Function to create the JSON representation of the file structure
def create_json_structure(root_folder: str) -> dict:
    items_list = []

    for foldername, subfolders, filenames in os.walk(root_folder):
        # Exclude folders named "unknown"
        if 'unknown' in foldername:
            continue

        for filename in filenames:
            if filename.endswith('.png'):
                # Strip the file extension for the name and representation
                name = os.path.splitext(filename)[0]

                # Generate the representation
                representation = generate_representation(name)

                # Create item entry
                item_entry = {
                    'name': name,
                    'representation': representation,
                    'path': os.path.join(foldername, filename).replace('\\', '/'),  # Convert to web-friendly paths
                    'stats': {
                        'str': 0,
                        'dex': 0,
                        'vit': 0,
                        'tec': 0,
                        'fth': 0,
                        'mag': 0,
                    },
                    'craftedWith': [],  # Optional, default empty list
                    'description': [],  
                    'foundIn': [],  # Optional, default empty array
                    'type': foldername.split("\\")[-1]
                }
                items_list.append(item_entry)

    return items_list

# Generate the JSON structure from the image folder
items_data = create_json_structure(os.path.join(base_folder, 'items'))

# Write the JSON data to a file
with open('items.json', 'w') as json_file:
    json.dump(items_data, json_file, indent=4)

print(f"JSON file created with {len(items_data)} items.")
