import os
import json


def merge_json_files(input_folder, output_file):
    # Liste aller Dateien im Ordner
    json_files = [f for f in os.listdir(input_folder) if f.endswith('.json')]

    print("Loaded " + str(len(json_files)) + " files")

    merged_data = {}

    # Gehe durch alle JSON-Dateien
    for json_file in json_files:
        file_path = os.path.join(input_folder, json_file)
        with open(file_path, 'r') as f:
            data = json.load(f)

        # Hole die "items"-Liste aus jeder Datei
        items = data.get('objects', [])

        # Durchlaufe jedes Key-Value-Paar in "items"
        for item in items:
            key = item['key']
            value = item.get('value', 0)  # Falls der Wert fehlt, setze ihn auf 0

            # Wenn der Key bereits existiert, füge den neuen Wert zum Array hinzu
            if key in merged_data:
                merged_data[key].append(value)
            else:
                # Wenn der Key nicht existiert, erstelle ein neues Array mit dem Wert
                merged_data[key] = [value]

    # Speichere das Ergebnis als JSON
    with open(output_file, 'w') as f:
        json.dump({"name": data['biome'], "runs": len(json_files), "objects": merged_data}, f, indent=4)



    print(f'Dateien erfolgreich gemerged und gespeichert unter: {output_file}')


# Beispiel: Führe das Skript aus, indem du den Ordnerpfad und den Ausgabepfad angibst
biome = "TheByfrost"
input_folder = './' + biome  # Ersetze dies durch den Pfad zu deinem Ordner
output_file = './' + biome.lower() + '.json'  # Ersetze dies durch den gewünschten Ausgabepfad

merge_json_files(input_folder, output_file)
