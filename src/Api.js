"use strict";

/**
 * Copyright (C) 2017, Koichi Nabetani <admin@starpentagon.net>,
   Web Renju Board is developed by modifying the GoProject libraries.
   
   This file contains Original Code and/or Modifications of Original Code 
   distributed in the HtmlGoBoard project.

   Original Code is:
    Copyright 2014 the HtmlGoBoard project authors.
    Originally under LGPL v3.0 in https://github.com/IlyaKirillov/GoProject.
*/

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     22.11.14
 * Time     0:29
 */

/**
 * Апи для работы с данной библиотекой.
 * @constructor
 */
function CRenjuBoardApi()
{

}

/**
 * Создаем основной объект GameTree, который будет хранит саму партию.
 * @returns {CGameTree}
 */
CRenjuBoardApi.prototype.Create_GameTree = function()
{
    return new CGameTree();
};

/**
 * Тимплейт с простой доской без дополнительных элементов.
 * @param {CGameTree} oGameTree
 * @param {string} sDivId
 */
CRenjuBoardApi.prototype.Create_SimpleBoard = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_SimpleBoard(sDivId);
};

/**
 * Тимплейт для просмотрщика.
 * @param {CGameTree} oGameTree
 * @param {string} sDivId
 */
CRenjuBoardApi.prototype.Create_Viewer = function(oGameTree, sDivId, isBooklet)
{
    var oDrawing = new CDrawing(oGameTree);

    if (true === isBooklet)
        oDrawing.Create_ViewerForBooklet(sDivId);
    else
        oDrawing.Create_Viewer(sDivId);
};

/**
 * Тимплейт для вертикального редактора.
 * @param {CGameTree} oGameTree
 * @param {string} sDivId
 */
CRenjuBoardApi.prototype.Create_EditorVer = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_VerticalFullTemplate(sDivId);
};

/**
 * Тимплейт для горизонтального редактора.
 * @param {CGameTree} oGameTree
 * @param {string} sDivId
 */
CRenjuBoardApi.prototype.Create_EditorHor = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_HorizontalFullTemplate(sDivId);
};

/**
 * Создаем графическую доску и кнопки управления снизу.
 * @param {CGameTree} oGameTree
 * @param {string} sDivId
 */
CRenjuBoardApi.prototype.Create_BoardWithNavigateButtons = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_BoardWithNavigateButtons(sDivId);
};

/**
 * @param {CGameTree} oGameTree
 * @param {string} sDivId
 */
CRenjuBoardApi.prototype.Create_BoardCommentsButtonsNavigator = function(oGameTree, sDivId)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_MixedFullTemplate(sDivId);
};

/**
 * Создаем демонстрационный вариант
 */
CRenjuBoardApi.prototype.Create_Presentation = function(oGameTree, sDivId, aSlides)
{
    var oPresentation = new CPresentation(oGameTree);
    oPresentation.Init(sDivId, aSlides);
};

/**
 * Создаем вариант для задачек
 */
CRenjuBoardApi.prototype.Create_Problems = function(oGameTree, sDivId, oPr)
{
    var oDrawing = new CDrawing(oGameTree);
    oDrawing.Create_Problems(sDivId);

    var dTutorTime = 0.3;
    if (oPr['TutorTime'])
        dTutorTime = parseFloat(oPr['TutorTime']);

    if (oPr['TutorColor'] && "Black" === oPr['TutorColor'])
        oGameTree.Set_TutorMode(false, BOARD_BLACK, dTutorTime);
    else if (oPr['TutorColor'] && "White" === oPr['TutorColor'])
        oGameTree.Set_TutorMode(false, BOARD_WHITE, dTutorTime);
    else
        oGameTree.Set_TutorMode(true, BOARD_EMPTY, dTutorTime);

    oGameTree.Forbid_All();

    if (undefined !== oPr['NewNode'])
    {
        oGameTree.Set_EditingFlags({NewNode : true});
        oGameTree.Set_TutorNewNodeText(oPr['NewNode']);
    }

    var pRightCallback = (undefined !== oPr['RightCallback'] ? oPr['RightCallback'] : null);
    var pWrongCallback = (undefined !== oPr['WrongCallback'] ? oPr['WrongCallback'] : null);
    var pResetCallback = (undefined !== oPr['ResetCallback'] ? oPr['ResetCallback'] : null);
    oGameTree.Set_TutorCallbacks(pRightCallback, pWrongCallback, pResetCallback);
};

/**
 * Ищем правильный вариант решения задачи. Если такого варианта нет возвращается false, если есть, тогда
 * возвращаем true и делаем вариант с правильной нодой текущим.
 */
CRenjuBoardApi.prototype.Find_ProblemRightVariant = function(oGameTree)
{
    return oGameTree.Find_ProblemRightVariant();
};

/**
 * Стартуем автопроигрывание
 */
CRenjuBoardApi.prototype.Start_AutoPlay = function(oGameTree)
{
    oGameTree.Start_AutoPlay(true);
};

/**
 * Останавливаем автопроигрывание
 */
CRenjuBoardApi.prototype.Stop_AutoPlay = function(oGameTree)
{
    oGameTree.Stop_AutoPlay();
};

/**
 * Накладываем ограничения на редактирование.
 * @param {CGameTree} oGameTree - Дерево партии
 * @param {Object} oFlags - Запрещающие флаги
 * @param {boolean} oFlags.NewNode
 * @param {boolean} oFlags.RemoveNodes
 * @param {boolean} oFlags.Move
 * @param {boolean} oFlags.ChangeBoardMode
 * @param {boolean} oFlags.LoadFile
 * @param {boolean} oFlags.GameInfo
 * @param {boolean} oFlags.ViewPort
 */
CRenjuBoardApi.prototype.Set_Permissions = function(oGameTree, oFlags)
{
    var _Flags = {};

    _Flags.NewNode         = oFlags['NewNode'];
    _Flags.RemoveNodes     = oFlags['RemoveNodes'];
    _Flags.Move            = oFlags['Move'];
    _Flags.ChangeBoardMode = oFlags['ChangeBoardMode'];
    _Flags.LoadFile        = oFlags['LoadFile'];
    _Flags.GameInfo        = oFlags['GameInfo'];
    _Flags.ViewPort        = oFlags['ViewPort'];

    oGameTree.Set_EditingFlags(_Flags);
};

/**
 * Загружаем Sgf в GameTree.
 */
CRenjuBoardApi.prototype.Load_Sgf = function(oGameTree, sSgfFile, _oViewPort, sMoveReference, sExt)
{
    var oViewPort = {};

    if (_oViewPort && true === _oViewPort['Auto'])
    {
        oViewPort.Auto = true;
    }
    else if (_oViewPort && undefined !== _oViewPort['X0'] && undefined !== _oViewPort['X1'] && undefined !== _oViewPort['Y0'] && undefined !== _oViewPort['Y1'])
    {
        oViewPort.Auto = false;
        oViewPort.X0 = _oViewPort['X0'];
        oViewPort.X1 = _oViewPort['X1'];
        oViewPort.Y0 = _oViewPort['Y0'];
        oViewPort.Y1 = _oViewPort['Y1'];
    }
    else
    {
        oViewPort = null;
    }

    // Через апи мы всегда даем грузить сгф
    var nOldFlags = oGameTree.m_nEditingFlags;
    oGameTree.Reset_EditingFlags();
    oGameTree.Load_Sgf(sSgfFile, oViewPort, sMoveReference, sExt);
    oGameTree.m_nEditingFlags = nOldFlags;
};

/**
 * Сохраняем Sgf в виде строки
 */
CRenjuBoardApi.prototype.Save_Sgf = function(oGameTree)
{
    return oGameTree.Save_Sgf();
};

/**
 * Получаем ссылку на ход, чтобы потом можно было переоткрыть файл с данной ссылкой
 * @param {CGameTree} oGameTree - Ссылка на основной класс.
 * @param {boolean} bStrong - Получаем сильную ссылку или нет. Сильная, значит в ссылку записывается весь вариант, не считая нод, которые
 * были в файле изначально. В слабой ссылка просто указывает на место, но не сохраняет ее как самостоятельный вариант.
 * @param {number} [nType=0] - 0 (undefined) - CurNode, 1 - StartNode
 */
CRenjuBoardApi.prototype.Get_MoveReference = function(oGameTree, bStrong, nType)
{
    var oNode;
    if (1 === nType)
        oNode = oGameTree.Get_StartNode();
    else
        oNode = oGameTree.Get_CurNode();

    return oGameTree.Get_NodeReference(bStrong, oNode);
};

/**
 * Выставляем стартовую ноду по заданной ссылке.
 * @param {CGameTree} oGameTree - Ссылка на основной класс.
 * @param {string} sMoveReference - Ссылка на стартовую ноду.
 */
CRenjuBoardApi.prototype.Set_StartNodeByReference = function(oGameTree, sMoveReference)
{
    if (oGameTree && sMoveReference)
    {
        var oCurNode = oGameTree.Get_CurNode();
        oGameTree.GoTo_MoveReference(sMoveReference);
        oGameTree.Set_StartNode(oGameTree.Get_CurNode());
        oGameTree.GoTo_Node(oCurNode, true);
    }
};

/**
 * Проверяем, делались ли какие-либо изменения в файле с момента открытия.
 */
CRenjuBoardApi.prototype.Is_Modified = function(oGameTree)
{
    return oGameTree.Is_Modified();
};

/**
 * Функция обновления размеров всех графических объектов.
 */
CRenjuBoardApi.prototype.Update_Size = function(oGameTree)
{
    oGameTree.Update_Size();
};

/**
 * Получаем название матча.
 */
CRenjuBoardApi.prototype.Get_MatchName = function(oGameTree)
{
    if (oGameTree)
        return oGameTree.Get_MatchName();

    return "White_vs_Black";
};


/**
 * Функция для выставления звука.
 */
CRenjuBoardApi.prototype.Set_Sound = function(oGameTree, sPath)
{
    oGameTree.Set_Sound(sPath);
};

CRenjuBoardApi.prototype.Focus = function(oGameTree)
{
    if (oGameTree)
        oGameTree.Focus();
};

/**
 * Получить текущую версию библиотеки.
 */
CRenjuBoardApi.prototype.Get_Version = function()
{
    return this.Version;
};

/**
 * Включение/выключение координат на доске
 */
CRenjuBoardApi.prototype.Toggle_Rulers = function (oGameTree)
{
    if (oGameTree)
        oGameTree.Toggle_Rulers();
};

/**
 * Выставляем Handler для обработки изменений GameTree.
 * Функции:
 * Handler.GoTo_Node(NodeId)
 */
CRenjuBoardApi.prototype.Set_GameTreeHandler = function(oGameTree, oHandler)
{
    if (oGameTree && oHandler)
        oGameTree.Set_Handler(oHandler);
};

/**
 * Переход к ноде по заданному Id ноды
 */
CRenjuBoardApi.prototype.GoTo_Node = function(oGameTree, sNodeId)
{
    if (oGameTree)
        oGameTree.GoTo_NodeById(sNodeId);
};

/**
 * Переход к ноде по заданному номеру хода в текущей ветке.
 */
CRenjuBoardApi.prototype.GoTo_NodeByMoveNumber = function(oGameTree, nMoveNumber)
{
    if (oGameTree)
        oGameTree.GoTo_NodeByMoveNumber(nMoveNumber);
};

/**
 * Прячем или показываем курсор.
 */
CRenjuBoardApi.prototype.Set_ShowTarget = function(oGameTree, bShow)
{
    if (oGameTree)
        oGameTree.Set_ShowTarget(bShow, true);
};

/**
 * Выставляем тему доски для текущей сессии, перекрывающую тему пользователя.
 */
CRenjuBoardApi.prototype.Set_BoardTheme = function(oGameTree, sTheme)
{
    if (oGameTree)
    {
        var eScheme = null;

        if ("TrueColor" === sTheme)
            eScheme = EColorScheme.TrueColor;
        else if ("BookStyle" === sTheme)
            eScheme = EColorScheme.BookStyle;
        else if ("Simple" === sTheme)
            eScheme = EColorScheme.SimpleColor;
        else if ("Dark" === sTheme)
            eScheme = EColorScheme.Dark;

        if (eScheme)
            oGameTree.Set_LocalColorScheme(eScheme);
    }
};

/**
 * Получем минимальную высоту необходимую для дивки, исходя из заданной ширины.
 */
CRenjuBoardApi.prototype.Get_DivHeightByWidth = function(oGameTree, nWidth)
{
    if (oGameTree)
        return oGameTree.Get_DivHeightByWidth(nWidth);
};

/**
 * Функция, которая встраивает доску с заданными параметрами.
 */
CRenjuBoardApi.prototype.Embed = function (sDivId, oConfig)
{
    var nMoveNumber = -1;
    var oViewPort   = null;
    var sSgfData    = null;
    var sBoardMode  = null;
    var nBoardWidth = null;
    var sTheme      = "TrueColor";
    var oThis       = this;
    var isBooklet   = false;

    var oGameTree = this.Create_GameTree();
    oGameTree.Get_LocalSettings().Set_Embedding(true);

    if (oConfig["viewPort"])
    {
        oViewPort = {};

        if ("auto" === oConfig["viewPort"])
        {
            oViewPort["Auto"] = true;
        }
        else
        {
            oViewPort["Auto"] = false;
            oViewPort["X0"]   = parseInt(oConfig["viewPort"]["X0"]);
            oViewPort["X1"]   = parseInt(oConfig["viewPort"]["X1"]);
            oViewPort["Y0"]   = parseInt(oConfig["viewPort"]["Y0"]);
            oViewPort["Y1"]   = parseInt(oConfig["viewPort"]["Y1"]);
        }
    }

    if (oConfig["moveNumber"])
    {
        nMoveNumber = parseInt(oConfig["moveNumber"]);
    }

    if (oConfig["boardMode"])
    {
        sBoardMode = oConfig["boardMode"];
    }
    else
    {
        sBoardMode = "viewer";
    }

    if (oConfig["width"])
    {
        nBoardWidth = oConfig["width"];
    }

    if (oConfig["boardTheme"])
    {
        sTheme = oConfig["boardTheme"];
    }

    if (true === oConfig["booklet"])
        isBooklet = true;

    if (null != oConfig["sgfUrl"])
    {
        Load_SgfByUrl(oConfig["sgfUrl"]);
    }
    else if (null !== oConfig["sgfData"])
    {
        sSgfData = oConfig["sgfData"];
        Load_Board();
    }
    else
    {
        sSgfData = "(;FF[4]GM[4]SZ[15])";
        Load_Board();
    }

    function Load_SgfByUrl(sUrl)
    {
        sUrl        = decodeURIComponent(sUrl);
        var rawFile = new XMLHttpRequest();
        rawFile["open"]("GET", sUrl + '?_=' + new Date().getTime(), true);

        rawFile["onreadystatechange"] = function ()
        {
            if (rawFile["readyState"] === 4)
            {
                if (rawFile["status"] === 200 || rawFile["status"] == 0)
                {
                    sSgfData = rawFile.responseText;
                    Load_Board();
                }
            }
        };
        rawFile["send"](null);
    }

    function Load_Board()
    {
        var oDiv = document.getElementById(sDivId);
        if (!oDiv)
            return;

        var oPermissions                = {};
        oPermissions["LoadFile"]        = false;
        oPermissions["GameInfo"]        = false;
        oPermissions["ChangeBoardMode"] = false;
        oPermissions["NewNode"]         = false;
        oPermissions["Move"]            = false;
        oPermissions["ViewPort"]        = false;

        oThis.Set_BoardTheme(oGameTree, sTheme);

        var nWidth = 400;
        if ("image" === sBoardMode)
        {
            oThis.Create_SimpleBoard(oGameTree, sDivId);
            oThis.Set_ShowTarget(oGameTree, false);
            nWidth = 600;
        }
        else if ("viewer" == sBoardMode)
        {
            oThis.Create_Viewer(oGameTree, sDivId, isBooklet);
            oPermissions["Move"] = true;
            nWidth               = 600;
        }
        else if ("vereditor" === sBoardMode)
        {
            oThis.Create_EditorVer(oGameTree, sDivId);
            oPermissions["LoadFile"]        = true;
            oPermissions["GameInfo"]        = true;
            oPermissions["ChangeBoardMode"] = true;
            oPermissions["NewNode"]         = true;
            oPermissions["Move"]            = true;
            nWidth                          = 600;
        }
        else if ("horeditor" === sBoardMode)
        {
            oThis.Create_EditorHor(oGameTree, sDivId);
            oPermissions["LoadFile"]        = true;
            oPermissions["GameInfo"]        = true;
            oPermissions["ChangeBoardMode"] = true;
            oPermissions["NewNode"]         = true;
            oPermissions["Move"]            = true;
            nWidth                          = 900;
        }
        else if ("problems" == sBoardMode)
        {
            var oPr = {};

            if (oConfig["problemsTime"])
                oPr["TutorTime"] = oConfig["problemsTime"];

            if (oConfig["problemsColor"])
                oPr["TutorColor"] = oConfig["problemsColor"];

            if (oConfig["problemsNewNode"])
                oPr["NewNode"] = oConfig["problemsNewNode"];

            oThis.Create_Problems(oGameTree, sDivId, oPr);
            oPermissions       = null;
            nWidth             = 400;

            if (null === oViewPort)
            {
                oViewPort = {};
                oViewPort["Auto"] = true;
            }
        }

        oThis.Load_Sgf(oGameTree, sSgfData, oViewPort);

        if (null !== nBoardWidth)
        {
            nWidth = nBoardWidth;
        }

        var nHeight = oThis.Get_DivHeightByWidth(oGameTree, nWidth);

        oDiv.style.width  = nWidth + "px";
        oDiv.style.height = nHeight + "px";

        if (-1 !== nMoveNumber)
        {
            oThis.GoTo_NodeByMoveNumber(oGameTree, nMoveNumber);
        }
        else
        {
            oThis.GoTo_NodeByMoveNumber(oGameTree, 0);
        }

        oThis.Update_Size(oGameTree);

        if (oPermissions)
        {
            oThis.Set_Permissions(oGameTree, oPermissions);
        }
    }

    return oGameTree;
};

window['RenjuBoardApi'] = new CRenjuBoardApi();

CRenjuBoardApi.prototype['Embed']                                = CRenjuBoardApi.prototype.Embed;
CRenjuBoardApi.prototype['Create_GameTree']                      = CRenjuBoardApi.prototype.Create_GameTree;

CRenjuBoardApi.prototype['Create_SimpleBoard']                   = CRenjuBoardApi.prototype.Create_SimpleBoard;
CRenjuBoardApi.prototype['Create_Viewer']                        = CRenjuBoardApi.prototype.Create_Viewer;
CRenjuBoardApi.prototype['Create_EditorHor']                     = CRenjuBoardApi.prototype.Create_EditorHor;
CRenjuBoardApi.prototype['Create_EditorVer']                     = CRenjuBoardApi.prototype.Create_EditorVer;
CRenjuBoardApi.prototype['Create_BoardWithNavigateButtons']      = CRenjuBoardApi.prototype.Create_BoardWithNavigateButtons;
CRenjuBoardApi.prototype['Create_BoardCommentsButtonsNavigator'] = CRenjuBoardApi.prototype.Create_BoardCommentsButtonsNavigator;
CRenjuBoardApi.prototype['Create_Presentation']                  = CRenjuBoardApi.prototype.Create_Presentation;
CRenjuBoardApi.prototype['Create_Problems']                      = CRenjuBoardApi.prototype.Create_Problems;

CRenjuBoardApi.prototype['Set_Permissions']                      = CRenjuBoardApi.prototype.Set_Permissions;
CRenjuBoardApi.prototype['Load_Sgf']                             = CRenjuBoardApi.prototype.Load_Sgf;
CRenjuBoardApi.prototype['Save_Sgf']                             = CRenjuBoardApi.prototype.Save_Sgf;
CRenjuBoardApi.prototype['Get_MoveReference']                    = CRenjuBoardApi.prototype.Get_MoveReference;
CRenjuBoardApi.prototype['Set_StartNodeByReference']             = CRenjuBoardApi.prototype.Set_StartNodeByReference;
CRenjuBoardApi.prototype['Is_Modified']                          = CRenjuBoardApi.prototype.Is_Modified;
CRenjuBoardApi.prototype['Update_Size']                          = CRenjuBoardApi.prototype.Update_Size;
CRenjuBoardApi.prototype['Set_Sound']                            = CRenjuBoardApi.prototype.Set_Sound;
CRenjuBoardApi.prototype['Find_ProblemRightVariant']             = CRenjuBoardApi.prototype.Find_ProblemRightVariant;
CRenjuBoardApi.prototype['Start_AutoPlay']                       = CRenjuBoardApi.prototype.Start_AutoPlay;
CRenjuBoardApi.prototype['Stop_AutoPlay']                        = CRenjuBoardApi.prototype.Stop_AutoPlay;
CRenjuBoardApi.prototype['Focus']                                = CRenjuBoardApi.prototype.Focus;
CRenjuBoardApi.prototype['Get_MatchName']                        = CRenjuBoardApi.prototype.Get_MatchName;
CRenjuBoardApi.prototype['Get_Version']                          = CRenjuBoardApi.prototype.Get_Version;
CRenjuBoardApi.prototype['Toggle_Rulers']                        = CRenjuBoardApi.prototype.Toggle_Rulers;
CRenjuBoardApi.prototype['Set_GameTreeHandler']                  = CRenjuBoardApi.prototype.Set_GameTreeHandler;
CRenjuBoardApi.prototype['GoTo_Node']                            = CRenjuBoardApi.prototype.GoTo_Node;
CRenjuBoardApi.prototype['GoTo_NodeByMoveNumber']                = CRenjuBoardApi.prototype.GoTo_NodeByMoveNumber;
CRenjuBoardApi.prototype['Set_ShowTarget']                       = CRenjuBoardApi.prototype.Set_ShowTarget;
CRenjuBoardApi.prototype['Get_DivHeightByWidth']                 = CRenjuBoardApi.prototype.Get_DivHeightByWidth;
CRenjuBoardApi.prototype['Set_BoardTheme']                       = CRenjuBoardApi.prototype.Set_BoardTheme;
