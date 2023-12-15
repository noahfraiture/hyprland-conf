#!/bin/bash

hypr_dir="$HOME/.config/hypr"                               # Hypr directory
css_file="$HOME/.cache/wal/colors.css"                      # CSS file generated by pywal
hyprland_border_file="$hypr_dir/configs/custom/border.conf" # Border config file
dunst_file="$hypr_dir/notifications/dunstrc"                # Dunst config file

# Extract hex color codes from CSS file and store them in an array
colors=($(grep -o '#[0-9A-Fa-f]\{6\}' $css_file | sed 's/^#//'))

# Define the new string
new_colors="rgb(${colors[4]}) rgb(${colors[0]}) rgb(${colors[0]}) rgb(${colors[4]}) 270deg"

# Use sed to replace the entire string after '=' with the new string
sed -i "s/col.active_border = .*/col.active_border = $new_colors/" $hyprland_border_file

# Use sed to replace the entire string after '=' with the new string
# sed -i "s/frame_color = .*/frame_color = \"\#${colors[4]}\"/" $dunst_file # Use sed to replace the entire string after '=' with the new string
# killall dunst                                                             # Restart dunst to apply changes

# Assuming ${colors[4]} holds the desired color value
# color_value="#${colors[4]}"

# # Creating a temporary file
# temp_file=$(mktemp) || exit 1

# # Using sed to replace the pattern and redirecting output to the temporary file
# sed "s/frame_color = .*/frame_color = \"$color_value\"/" "$dunst_file" >"$temp_file"

# # Replace the original file with the temporary file
# mv "$temp_file" "$dunst_file"