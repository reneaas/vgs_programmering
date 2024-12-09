import os
import shutil
import re

BASE_DIR = os.getcwd()
STATIC_DIR = os.path.join(BASE_DIR, "_static")

BASE_DIR = os.path.join(BASE_DIR, "book")

figur_dir = os.path.join(STATIC_DIR, "figurer")
shutil.rmtree(figur_dir, ignore_errors=True)

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

                            # Function to replace image paths
                            def replace_img_src(match):
                                img_src = match.group(1)
                                # If the img_src starts with '..', we assume it's already been processed
                                if img_src.startswith(".."):
                                    return match.group(
                                        0
                                    )  # Return the original match without changes

                                # Proceed only if img_src does not start with '..'
                                quiz_N_dirname = os.path.basename(quiz_N_dir)
                                expected_prefix = f"figurer/quiz/{quiz_N_dirname}/"
                                if img_src.startswith(expected_prefix):
                                    img_src_rel = img_src[len(expected_prefix) :]
                                elif img_src.startswith("figurer/"):
                                    img_src_rel = img_src[len("figurer/") :]
                                else:
                                    img_src_rel = img_src
                                # Full path to the image
                                img_full_path = os.path.normpath(
                                    os.path.join(figurer_dir, img_src_rel)
                                )
                                # Get the path relative to figurer_dir
                                img_dest_rel_path = os.path.relpath(
                                    img_full_path, figurer_dir
                                )
                                # Construct the new src
                                new_src = f"{relative_path}_static/figurer/{os.path.relpath(quiz_N_dir, BASE_DIR)}/{img_dest_rel_path}"
                                return f'<img src="{new_src}"'

                            # Update image paths
                            updated_content = re.sub(
                                r'<img\s+src="([^"]+)"',
                                replace_img_src,
                                content,
                            )

                            # Check if any replacements were made
                            if updated_content != content:
                                print("Fixed image paths in", html_file)
                                # Write back the updated content
                                with open(html_file, "w", encoding="utf-8") as f:
                                    f.write(updated_content)

                    # Copy images to _static directory
                    dest_dir = os.path.join(
                        STATIC_DIR,
                        "figurer",
                        os.path.relpath(quiz_N_dir, BASE_DIR),
                    )
                    for src_dir, _, files in os.walk(figurer_dir):
                        rel_path = os.path.relpath(src_dir, figurer_dir)
                        dst_dir = os.path.join(dest_dir, rel_path)
                        os.makedirs(dst_dir, exist_ok=True)
                        for file_ in files:
                            src_file = os.path.join(src_dir, file_)
                            dst_file = os.path.join(dst_dir, file_)
                            shutil.copy(src_file, dst_file)
