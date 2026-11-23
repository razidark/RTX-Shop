import os
import requests
from duckduckgo_search import DDGS

queries = {
    'rtx-4090.jpg': 'NVIDIA GeForce RTX 4090 Founders Edition white background png',
    'ryzen-7950x3d.jpg': 'AMD Ryzen 9 7950X3D box product shot',
    'trident-z5.jpg': 'G.SKILL Trident Z5 RGB 32GB RAM product white background',
    'z790.jpg': 'ASUS ROG Strix Z790-E Motherboard white background',
    '990-pro.jpg': 'Samsung 990 PRO 2TB NVMe SSD white background',
    'rm1000x.jpg': 'Corsair RM1000x Power Supply PSU product shot'
}

os.makedirs('public/images', exist_ok=True)

with DDGS() as ddgs:
    for filename, query in queries.items():
        print(f"Searching for: {query}")
        try:
            results = list(ddgs.images(query, max_results=3))
            if not results:
                print(f"No results for {query}")
                continue
                
            # Try to download the first valid image
            for result in results:
                image_url = result.get('image')
                if image_url:
                    try:
                        print(f"Downloading {image_url}...")
                        response = requests.get(image_url, timeout=10)
                        if response.status_code == 200:
                            filepath = os.path.join('public/images', filename)
                            with open(filepath, 'wb') as f:
                                f.write(response.content)
                            print(f"Saved {filename}")
                            break # Move to next product after successful download
                    except Exception as e:
                        print(f"Failed to download {image_url}: {e}")
        except Exception as e:
            print(f"Error searching {query}: {e}")
