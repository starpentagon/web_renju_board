/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     18.11.14
 * Time     1:37
 */

var BOARD_EMPTY = 0x00;
var BOARD_BLACK = 0x01;
var BOARD_WHITE = 0x02;
var BOARD_DRAW  = 0x03; // Это только для подсчета очков, для обозначения нейтральных пунктов.

// EShowVariants value must be consistent with SGF ST property(0: children variation, 1: sibling variation).
var EShowVariants =
{
    Next : 0, // Все варианты следующего хода
    Curr : 1, // Альтернативные варианты текущего хода
    None : 2, // Не показвать варианты

    Min  : 0,
    Max  : 2
};

// Реальные значения мы не берем, потому что реальная доска предлолагается не квадратной из-за того, что
// игроки не сидят сверху над доской, а смотрят на доску под углом.
var g_dBoard_H         = 460;
var g_dBoard_W         = g_dBoard_H;//430;
var g_dVerOff_2_Cell_H = 17.51 / 23.61;
var g_dHorOff_2_Cell_W = g_dVerOff_2_Cell_H;//17.54 / 21.94;

var g_dBoardCellW     = 23.61;
var g_dBoardHorOffset = 17.51;
var g_dBoardCellW_2   = g_dBoardCellW / 2;

var g_sBackground = "data:image/png;base64,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";
