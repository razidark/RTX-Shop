import os
import urllib.request

images = {
    "cpu.jpg": "https://upload.wikimedia.org/wikipedia/commons/9/99/Ryzen3pro2100ge-ph-gerald.jpg",
    "motherboard.png": "https://upload.wikimedia.org/wikipedia/commons/5/50/Xbox_360E_Winchester_Top_View.png",
    "ram.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/db/Swissbit_2GB_PC2-5300U-555.jpg",
    "gpu.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/df/Leistungsanalyse_NVIDIA_GeForce_RTX_4090_%28Geekerwan%29_02_cropped.jpg",
    "ssd.jpg": "https://upload.wikimedia.org/wikipedia/commons/1/1a/2023_Dysk_SSD_Patriot_P210_2TB.jpg",
    "psu.jpg": "https://upload.wikimedia.org/wikipedia/commons/6/62/PSU-Open1.jpg",
    "case.jpg": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-3.0.3&auto=format&fit=crop&w=600&q=80",
    "cooler.jpg": "https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-3.0.3&auto=format&fit=crop&w=600&q=80"
}

output_dir = "public/images"
os.makedirs(output_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

for name, url in images.items():
    path = os.path.join(output_dir, name)
    print(f"Downloading {url} to {path}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Successfully downloaded {name}!")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
