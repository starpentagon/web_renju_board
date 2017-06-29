#!/bin/bash

js_file_list=(
    "./src/Common.js"
    "./src/Drawing/Controls.js"
    "./src/Drawing/Board.js"
    "./src/Drawing/BoardTarget.js"
    "./src/Drawing/HtmlEvents.js"
    "./src/Drawing/Mark.js"
    "./src/Drawing/Button.js"
    "./src/Drawing/Toolbar.js"
    "./src/Drawing/Drawing.js"
    "./src/Drawing/InterfaceState.js"
    "./src/Drawing/Comments.js"
    "./src/Drawing/Navigator.js"
    "./src/Drawing/NavigatorMap.js"
    "./src/Drawing/Slider.js"
    "./src/Drawing/Sound.js"
    "./src/Drawing/Presentation.js"
    "./src/Drawing/VerticalTabs.js"
    "./src/Drawing/Window.js"
    "./src/Command.js"
    "./src/Consts.js"
    "./src/GameTree.js"
    "./src/GifWriter.js"
    "./src/LogicBoard.js"
    "./src/Memory.js"
    "./src/Move.js"
    "./src/Node.js"
    "./src/SgfReader.js"
    "./src/SgfWriter.js"
    "./src/Api.js"
    "./src/Version.js"
)

renjuboard_js_file="renjuboard.js"
echo -n > ${renjuboard_js_file}

for js_file in "${js_file_list[@]}"
do
    cat ${js_file} >> ${renjuboard_js_file}
done

yui-compressor ${renjuboard_js_file} > build/renjuboardmin.js
rm ${renjuboard_js_file}

