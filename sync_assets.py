import os
import shutil

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    android_assets_dir = os.path.join(root_dir, 'android', 'app', 'src', 'main', 'assets')
    ios_assets_dir = os.path.join(root_dir, 'ios', 'Thanatopractor', 'Thanatopractor', 'www')

    print(f"Root Dir: {root_dir}")
    print(f"Android Assets: {android_assets_dir}")
    print(f"iOS Assets: {ios_assets_dir}")

    # Directories and files to copy
    items_to_copy = ['css', 'js', 'assets', 'index.html']

    for dest in [android_assets_dir, ios_assets_dir]:
        if not os.path.exists(dest):
            os.makedirs(dest)
            print(f"Created destination directory: {dest}")

        for item in items_to_copy:
            src_path = os.path.join(root_dir, item)
            dest_path = os.path.join(dest, item)

            if not os.path.exists(src_path):
                print(f"Warning: Source not found: {src_path}")
                continue

            if os.path.isdir(src_path):
                # Remove dest dir if exists to ensure clean copy
                if os.path.exists(dest_path):
                    shutil.rmtree(dest_path)
                shutil.copytree(src_path, dest_path)
                print(f"Copied directory {item} to {dest}")
            else:
                # File
                if os.path.exists(dest_path):
                    os.remove(dest_path)
                shutil.copy2(src_path, dest_path)
                print(f"Copied file {item} to {dest}")

    print("Assets synchronized successfully!")

if __name__ == '__main__':
    main()
