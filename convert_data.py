import json
import re
import os

def parse_vocabulary(input_path, output_path):
    vocabulary = []
    
    # Check if file exists
    if not os.path.exists(input_path):
        print(f"Error: Input file {input_path} not found.")
        return

    print(f"Reading from {input_path}...")
    
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                # Skip empty lines or file headers if any (like 0001| )
                if not line:
                    continue
                
                # Clean up the line prefix if it exists (e.g., "00001| ")
                clean_line = re.sub(r'^\d+\|\s*', '', line)
                
                # Split by separator. Logic adapted from previous robust regex
                # Handles " - ", " – ", " — "
                parts = re.split(r'\s+[-–—]\s+', clean_line, maxsplit=1)
                
                if len(parts) >= 2:
                    english = parts[0].strip()
                    japanese = parts[1].strip()
                    
                    vocabulary.append({
                        "id": len(vocabulary),
                        "en": english,
                        "ja": japanese,
                        "category": "General" # Can be enhanced later
                    })
                else:
                    print(f"Skipping malformed line: {line}")
        
        # Sort alphabetically by English
        vocabulary.sort(key=lambda x: x['en'].lower())
        
        # Write to src/data directory of the React app
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(vocabulary, f, ensure_ascii=False, indent=2)
            
        print(f"Successfully converted {len(vocabulary)} words to {output_path}")

    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    # Input is in the parent directory
    input_file = "../raw_words.txt"
    # Output goes into the React app's source folder
    output_file = "./src/data/vocabulary.json"
    
    parse_vocabulary(input_file, output_file)
