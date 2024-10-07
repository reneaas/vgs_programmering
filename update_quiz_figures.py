import os
import shutil
import re

BASE_DIR = os.getcwd()
STATIC_DIR = os.path.join(BASE_DIR, "_static")

BASE_DIR = BASE_DIR + "/book/"
print(BASE_DIR)

for root, dirs, files in os.walk(BASE_DIR):
    if "quiz" in dirs:
        quiz_dir = os.path.join(root, "quiz")
        # Look for "quiz_N" subdirectories within the "quiz" directory
        for subdir in os.listdir(quiz_dir):
            if subdir.startswith("quiz_") and os.path.isdir(
                os.path.join(quiz_dir, subdir)
            ):
                quiz_N_dir = os.path.join(quiz_dir, subdir)
                figurer_dir = os.path.join(quiz_N_dir, "figurer")
                if os.path.exists(figurer_dir):
                    # Calculate how many '../' are needed
                    depth = os.path.relpath(quiz_N_dir, BASE_DIR).count(os.sep)
                    relative_path = "../" * depth

                    # Find and update HTML files in quiz_N_dir
                    for file in os.listdir(quiz_N_dir):
                        if file.endswith(".html"):
                            html_file = os.path.join(quiz_N_dir, file)
                            with open(html_file, "r", encoding="utf-8") as f:
                                content = f.read()

                            # Update image paths
                            updated_content = re.sub(
                                r'<img\s+src="([^"]+)"',
                                lambda match: f'<img src="{relative_path}_static/figurer/{quiz_N_dir.split("/book/")[-1]}/{os.path.basename(match.group(1))}"',
                                content,
                            )

                            print("Fixed image paths in", html_file)

                            # Write back the updated content
                            with open(html_file, "w", encoding="utf-8") as f:
                                f.write(updated_content)

                    # Copy images to _static directory
                    dest_dir = os.path.join(
                        STATIC_DIR,
                        "figurer",
                        os.path.relpath(figurer_dir.strip("figurer"), BASE_DIR),
                    )
                    for src_dir, _, files in os.walk(figurer_dir):
                        dst_dir = os.path.join(
                            dest_dir, os.path.relpath(src_dir, figurer_dir)
                        )
                        os.makedirs(dst_dir, exist_ok=True)
                        for file_ in files:
                            src_file = os.path.join(src_dir, file_)
                            dst_file = os.path.join(dst_dir, file_)
                            shutil.copy(src_file, dst_file)
