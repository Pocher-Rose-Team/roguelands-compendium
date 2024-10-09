import os
import json

# Base directory for images
base_folder = '../public/img'

# Keywords for special formatting of the representation
keywords = ['ancientruins'
            'byfrost'
            'cathedral'
            'deepjungle'
            'demonsrift'
            'desolatecanyon'
            'hollowcaverns'
            'moltencrag'
            'plaguelands'
            'shroomtown'
            'whisperwood']

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
    loot_list = []

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
                loot_entry = {
                    'name': name,
                    'representation': representation,
                    'path': os.path.join(foldername, filename).replace('\\', '/')[6:],  # Convert to web-friendly paths
                    'description': "Retrieved when harvested/mined/killed:",
                    'loot': [
                        {'id': 1, 'probability': 100.0, 'count': 3}
                    ],
                }
                loot_list.append(loot_entry)

    return loot_list

# Generate the JSON structure from the image folder
loot_data = create_json_structure(os.path.join(base_folder, 'environment'))

# Write the JSON data to a file
with open('loot.json', 'w') as json_file:
    json.dump(loot_data, json_file, indent=4)

print(f"JSON file created with {len(loot_data)} loot tables.")
