#!/bin/bash
random=$(find /home/ayman/.config/hypr/wallpapers/normal -type f | shuf -n 1) # get random wallpaper
monitors=$(hyprctl monitors | grep Monitor | awk '{print $2}')                # get monitors
hyprdir=$HOME/.config/hypr                                                    # hypr directory
##########################################

hyprctl hyprpaper preload $random # preload wallpaper

for monitor in $monitors; do                       # loop through monitors
    hyprctl hyprpaper wallpaper "$monitor,$random" # set wallpaper
done

hyprctl hyprpaper unload $random # preload wallpaper

##########################################

source $hyprdir/wal/pywal $random         # set wallpaper theme
source $hyprdir/scripts/dynamic-border.sh # set border theme

##########################################

source $hyprdir/scripts/eww_reset # reset eww
