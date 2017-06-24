"use strict;"
/**
 * Copyright (C) 2017, Koichi Nabetani <admin@starpentagon.net>,
   except where otherwise indicated.

  Original source codes are:
   Copyright 2014 the HtmlGoBoard project authors.
   Originally under LGPL v3.0 in https://github.com/IlyaKirillov/GoProject.
*/

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     13.09.14
 * Time     3:26
 */

function CBoardPoint(eValue, nNum)
{
    //this.m_eValue = Math.floor((Math.random() * 3));// (undefined === eValue ? BOARD_EMPTY : eValue);
    this.m_eValue = (undefined === eValue ? BOARD_EMPTY : eValue);
    this.m_nNum   = (undefined === nNum ? - 1 : nNum);
}
CBoardPoint.prototype.CopyFrom = function(OtherPoint)
{
    this.m_eValue = OtherPoint.m_eValue;
    this.m_nNum   = OtherPoint.m_nNum;
};
CBoardPoint.prototype.Clear = function()
{
    this.m_eValue = BOARD_EMPTY;
    this.m_nNum   = -1;
};
CBoardPoint.prototype.Set_Value = function(eValue)
{
    this.m_eValue = eValue;
};
CBoardPoint.prototype.Set_Num = function(Num)
{
    this.m_nNum = Num;
};
CBoardPoint.prototype.Get_Value = function()
{
    return this.m_eValue;
};
CBoardPoint.prototype.Get_Num = function()
{
    return this.m_nNum;
};
function CAreaScoreCounter()
{
    this.m_oArea  = {};
    this.m_nOwner = BOARD_EMPTY;
}

CAreaScoreCounter.prototype.Clear = function()
{
    this.m_oArea  = {};
    this.m_nOwner = BOARD_EMPTY;
};
/**
 * Проверяем находится ли заданный пункт в области. Если нет, тогда добавляем его туда.
 * @param X
 * @param Y
 * @returns {boolean}
 */
CAreaScoreCounter.prototype.Is_PointIn = function(X, Y)
{
    var Place = Common_XYtoValue(X, Y);
    if (undefined !== this.m_oArea[Place])
        return true;

    this.m_oArea[Place] = 1;
    return false;
};
CAreaScoreCounter.prototype.Set_Owner = function(nValue)
{
    this.m_nOwner = nValue;
};
CAreaScoreCounter.prototype.Get_Owner = function()
{
    return this.m_nOwner;
};
CAreaScoreCounter.prototype.Update_Board = function(Board, nForceValue)
{
    var Value = (undefined === nForceValue ? this.m_nOwner : nForceValue);

    for (var Place in this.m_oArea)
    {
        var Pos = Common_ValuetoXY(Place | 0);
        Board.Set_ScorePoint(Pos.X, Pos.Y, Value);
    }
};
function CLogicBoard(nW, nH)
{
    this.m_nW = (undefined === nW ? 19 : nW); // количество пересечений по горизонтали
    this.m_nH = (undefined === nH ? 19 : nH); // количество пересечений по вертикали

    this.m_aBoard       = null; // Массив, в котором указаны значения пунктов на доске черный/белый/пустой
    this.private_InitBoard();

    this.m_aBoardScores = []; // Массив с метками территории
    this.m_oArea        = new CAreaScoreCounter();
}
CLogicBoard.prototype.Copy = function()
{
    var oNewLB = new CLogicBoard(this.m_nW, this.m_nH);

    for (var Index = 0, nCount = this.m_aBoard.length; Index < nCount; Index++)
        oNewLB.m_aBoard[Index].CopyFrom(this.m_aBoard[Index]);

    return oNewLB;
};
CLogicBoard.prototype.Clear = function()
{
    var nSize = this.m_nW * this.m_nH;
    for (var nIndex = 0; nIndex < nSize; nIndex++)
    {
        this.m_aBoard[nIndex].Clear();
    }
};
CLogicBoard.prototype.Reset_Size = function(nW, nH)
{
    this.m_nW = nW;
    this.m_nH = nH;

    this.private_InitBoard();
};
CLogicBoard.prototype.Get_Size = function()
{
    return {X : this.m_nW, Y : this.m_nH};
};
CLogicBoard.prototype.Set = function(nX, nY, eValue, nNum)
{
    var nIndex = this.private_GetPos(nX, nY);
    this.m_aBoard[nIndex].Set_Value(eValue);

    if (undefined !== nNum && null !== nNum && -1 !== nNum)
        this.m_aBoard[nIndex].Set_Num(nNum);
};
CLogicBoard.prototype.Get = function(nX, nY)
{
    return this.m_aBoard[this.private_GetPos(nX, nY)].Get_Value();
};
CLogicBoard.prototype.Get_Num = function(nX, nY)
{
    return this.m_aBoard[this.private_GetPos(nX, nY)].Get_Num();
};
CLogicBoard.prototype.Get_HandiPoints = function()
{
    var aPoints = [];

    var aPointsX = this.private_GetLineHandiPoints(this.m_nW);
    var aPointsY = this.private_GetLineHandiPoints(this.m_nH);

    for (var nX = 0; nX < aPointsX.length; nX++)
    {
        for (var nY = 0; nY < aPointsY.length; nY++)
        {
            aPoints.push([aPointsX[nX], aPointsY[nY]]);
        }
    }

    if (((9 == this.m_nW || 11 == this.m_nW) && 1 == this.m_nH % 2)
        || ((9 == this.m_nH || 11 == this.m_nH) && 1 == this.m_nW % 2))
        aPoints.push([(this.m_nW - 1) / 2, (this.m_nH - 1) / 2]);

    return aPoints;
};
CLogicBoard.prototype.private_GetLineHandiPoints = function(nSize)
{
    var aPoints = [];
    if (5 == nSize)
        aPoints = [2];
    else if (7 == nSize)
        aPoints = [3];
    else if (8 == nSize)
        aPoints = [2, 5];
    else if (9 == nSize)
        aPoints = [2, 6];
    else if (10 == nSize)
        aPoints = [3, 6];
    else if (11 == nSize)
        aPoints = [3, 7];
    else if (nSize >= 12)
    {
        if (1 == nSize % 2)
            aPoints = [3, (nSize - 1) / 2, nSize - 4];
        else
            aPoints = [3, nSize - 4];
    }
    return aPoints;
};
CLogicBoard.prototype.Is_HandiPoint = function(nX, nY)
{
    if (this.m_nW === this.m_nH)
    {
        var aPoints = this.Get_HandiPoints();
        for (var nIndex = 0, nCount = aPoints.length; nIndex < nCount; nIndex++)
        {
            if (nX - 1 === aPoints[nIndex][0] && nY - 1 === aPoints[nIndex][1])
                return true;
        }
    }

    return false;
};
CLogicBoard.prototype.private_InitBoard = function()
{
    var nSize = this.m_nW * this.m_nH;

    this.m_aBoard = new Array(nSize);
    for (var nIndex = 0; nIndex < nSize; nIndex++)
    {
        this.m_aBoard[nIndex] = new CBoardPoint();
    }
};
CLogicBoard.prototype.private_GetPos = function(nX, nY)
{
    return (nY - 1) * this.m_nW + (nX - 1);
};
CLogicBoard.prototype.Clear_Scores = function()
{
	this.m_aBoardScores = [];
};
CLogicBoard.prototype.Init_CountScores = function(bDontFillEmpty)
{
    this.m_aBoardScores = [];
    for (var Y = 1; Y <= this.m_nH; Y++)
    {
        for (var X = 1; X <= this.m_nW; X++)
        {
            this.m_aBoardScores[this.private_GetPos(X, Y)] = BOARD_EMPTY;
        }
    }

    if (true !== bDontFillEmpty)
        this.private_CheckAllEmptyAreas(false);
};
CLogicBoard.prototype.Set_ScorePoint = function(nX, nY, eValue)
{
    this.m_aBoardScores[this.private_GetPos(nX, nY)] = eValue;
};
CLogicBoard.prototype.Get_ScorePoint = function(nX, nY)
{
    return this.m_aBoardScores[this.private_GetPos(nX, nY)]
};
CLogicBoard.prototype.Count_Scores = function(oDrawingBoard)
{
    var nBlackScores = 0;
    var nWhiteScores = 0;

    for (var Y = 1; Y <= this.m_nH; Y++)
    {
        for (var X = 1; X <= this.m_nW; X++)
        {
            var oMark = null;
            var nOwner = this.Get_ScorePoint(X, Y);

            if (BOARD_BLACK === nOwner)
            {
                oMark = new CDrawingMark(X, Y, EDrawingMark.Tb, "");
                if (BOARD_WHITE === this.Get(X, Y))
                    nBlackScores += 2;
                else
                    nBlackScores++;
            }
            else if (BOARD_WHITE === nOwner)
            {
                oMark = new CDrawingMark(X, Y, EDrawingMark.Tw, "");
                if (BOARD_BLACK === this.Get(X, Y))
                    nWhiteScores += 2;
                else
                    nWhiteScores++;
            }

            if (null === oMark)
                oDrawingBoard.Remove_Mark(X, Y);
            else
                oDrawingBoard.Add_Mark(oMark);
        }
    }

    return {Black : nBlackScores, White : nWhiteScores};
};
CLogicBoard.prototype.private_CheckEmptyAreaByXY = function(X, Y)
{
    if (X > this.m_nW || X < 1 || Y > this.m_nH || Y < 1)
        return;

    var nCurValue = this.Get(X, Y);
    if (BOARD_EMPTY !== this.Get(X, Y))
    {
        var nOwner = this.m_oArea.Get_Owner();
        switch (nOwner)
        {
            case BOARD_EMPTY:
            {
                this.m_oArea.Set_Owner(nCurValue);
                break;
            }
            case BOARD_BLACK:
            case BOARD_WHITE:
            {
                if (nOwner !== nCurValue)
                    this.m_oArea.Set_Owner(BOARD_DRAW);
                break;
            }
            case BOARD_DRAW:
                break;
        }
        return;
    }

    if (false === this.m_oArea.Is_PointIn(X, Y))
    {
        this.private_CheckEmptyAreaByXY(X + 1, Y);
        this.private_CheckEmptyAreaByXY(X - 1, Y);
        this.private_CheckEmptyAreaByXY(X, Y + 1);
        this.private_CheckEmptyAreaByXY(X, Y - 1);
    }
};
CLogicBoard.prototype.private_CheckAllEmptyAreas = function(bCheckDraw)
{
    for (var Y = 1; Y <= this.m_nH; Y++)
    {
        for (var X = 1; X <= this.m_nW; X++)
        {
            if (BOARD_EMPTY === this.Get(X, Y) && (BOARD_EMPTY === this.Get_ScorePoint(X, Y) || (true === bCheckDraw && BOARD_DRAW === this.Get_ScorePoint(X, Y))))
            {
                this.m_oArea.Clear();
                this.private_CheckEmptyAreaByXY( X, Y );
                this.m_oArea.Update_Board(this);
            }
        }
    }
};
CLogicBoard.prototype.Get_SE = function(X, Y)
{
    if (undefined === this.m_aBoardSE || undefined === this.m_aBoardSE[Y] || undefined === this.m_aBoardSE[Y][X])
        return BOARD_EMPTY;

    return this.m_aBoardSE[Y][X];
};
CLogicBoard.prototype.Set_SE = function(X, Y, Value)
{
    if (undefined === this.m_aBoardSE)
        this.m_aBoardSE = [];

    if (undefined === this.m_aBoardSE[Y])
        this.m_aBoardSE[Y] = [];

    this.m_aBoardSE[Y][X] = Value;
};
CLogicBoard.prototype.private_InitScoreEstimate = function()
{
    for (var Y = 1; Y <= this.m_nH; Y++)
    {
        for (var X = 1; X <= this.m_nW; X++)
        {
            this.Set_SE(X, Y, this.Get(X, Y));
        }
    }
};
/**
 * Специальный класс для получения кифу партии.
 * @constructor
 */
function CKifuLogicBoard()
{
    CKifuLogicBoard.superclass.constructor.call(this, 1, 1);
    this.m_aRepetitions = null;
}
CommonExtend(CKifuLogicBoard, CLogicBoard);

/**
 *
 * @param oLogicBoard - стартовое состояние логической доски
 * @param oNode       - нода, с которой мы начинаем заполнение кифу
 */
CKifuLogicBoard.prototype.Load_FromNode = function(oLogicBoard, oNode)
{
    this.m_nW = oLogicBoard.m_nW;
    this.m_nH = oLogicBoard.m_nH;

    this.m_aBoard = null;
    this.private_InitBoard();

    var nMoveNumber = 0;

    for (var Index = 0, nCount = this.m_aBoard.length; Index < nCount; Index++)
    {
        this.m_aBoard[Index].CopyFrom(oLogicBoard.m_aBoard[Index]);

        if (nMoveNumber < this.m_aBoard[Index].Get_Num())
            nMoveNumber = this.m_aBoard[Index].Get_Num();

        this.m_aBoard[Index].Set_Num(-1);
    }

    // Считаем, что команды текущей ноды уже выполнены
    while (oNode.Get_NextsCount() > 0)
    {
        oNode = oNode.Get_Next(oNode.Get_NextCur());

        var CommandsCount = oNode.Get_CommandsCount();
        for (var CommandIndex = 0; CommandIndex < CommandsCount; CommandIndex++)
        {
            var Command       = oNode.Get_Command(CommandIndex);
            var Command_Type  = Command.Get_Type();
            var Command_Value = Command.Get_Value();
            var Command_Count = Command.Get_Count();

            switch (Command_Type)
            {
            case ECommand.B:
            {
                this.Add_ToKifu(Command_Value, BOARD_BLACK, ++nMoveNumber);
                break;
            }
            case ECommand.W:
            {
                this.Add_ToKifu(Command_Value, BOARD_WHITE, ++nMoveNumber);
                break;
            }
            case ECommand.AB:
            {
                for (var Index = 0; Index < Command_Count; Index++)
                {
                    this.Add_ToKifu(Command_Value[Index], BOARD_BLACK, -1);
                }
                break;
            }
            case ECommand.AW:
            {
                for (var Index = 0; Index < Command_Count; Index++)
                {
                    this.Add_ToKifu(Command_Value[Index], BOARD_WHITE, -1);
                }
                break;
            }
            case ECommand.AE:
            {
                for (var Index = 0; Index < Command_Count; Index++)
                {
                    this.Add_ToKifu(Command_Value[Index], BOARD_EMPTY, -1);
                }
                break;
            }
            }
        }
    }
};
CKifuLogicBoard.prototype.Add_ToKifu = function(nCommandValue, nValue, nMoveNumber)
{
    if (nCommandValue <= 0)
        return;

    var Pos = Common_ValuetoXY(nCommandValue);

    var nPrevValue = this.Get(Pos.X, Pos.Y);

    if (BOARD_EMPTY !== nPrevValue)
    {
        if (-1 === nMoveNumber)
            return;

        var nPosValue = this.private_GetPos(Pos.X, Pos.Y);
        if (!this.m_aRepetitions || this.m_aRepetitions.length === undefined)
            this.m_aRepetitions = [];

        for (var nIndex = 0, nCount = this.m_aRepetitions.length; nIndex < nCount; ++nIndex)
        {
            if (nPosValue === this.m_aRepetitions[nIndex].nPosValue)
            {
                this.m_aRepetitions[nIndex].aReps.push({nValue : nValue, nMoveNumber : nMoveNumber});
                return;
            }
        }

        this.m_aRepetitions.push({nPosValue : nPosValue, nValue : nPrevValue, nMoveNumber : this.Get_Num(Pos.X, Pos.Y), aReps : [{nValue : nValue, nMoveNumber : nMoveNumber}]});
    }
    else
    {
        this.Set(Pos.X, Pos.Y, nValue, nMoveNumber);
    }
};
