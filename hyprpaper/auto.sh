#!/bin/bash
# This script is used to automatically run random wallpapers

# Set the directory of the random wallpaper script
random_dir="$HOME/.config/hypr/hyprpaper/random.sh"

# Set the while loop to run forever
while true; do
    sleep 3m    # wait 3 minutes
    $random_dir # run random wallpaper script
done
