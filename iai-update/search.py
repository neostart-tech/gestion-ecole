import sys

file_path = r"c:\Users\USER\Desktop\Edu-Manager\gestion-ecole\iai-update\app\components\SidebarApp.vue"
with open(file_path, "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "Bibliotheque" in line or "Communication" in line or "Galerie" in line:
            print(f"{i+1}: {line.strip()}")
