"use strict";

/**
 * Copyright 2014 the HtmlGoBoard project authors.
 * All rights reserved.
 * Project  WebSDK
 * Author   Ilya Kirillov
 * Date     22.11.14
 * Time     1:37
 */

var g_mouse_event_type_down  = 0;
var g_mouse_event_type_move  = 1;
var g_mouse_event_type_up    = 2;
var g_mouse_event_type_wheel = 3;

var g_mouse_button_left   = 0;
var g_mouse_button_center = 1;
var g_mouse_button_right  = 2;

var g_mouse_event_settings_lock  = 1;
var g_mouse_event_settings_count = 2;

function CMouseEventHandler()
{
	this.X = 0;
	this.Y = 0;

	this.Button = g_mouse_button_left;
	this.Type   = g_mouse_event_type_move;

	this.AltKey   = false;
	this.CtrlKey  = false;
	this.ShiftKey = false;

	this.Sender = null;

	this.LastClickTime = -1;
	this.ClickCount    = 0;

	this.WheelDelta = 0;

	this.IsPressed = false;
	this.LastX     = 0;
	this.LastY     = 0;

	this.KoefPixToMM = 1;

	this.IsLocked     = false;
	this.buttonObject = null;

	this.LockMouse   = function ()
	{
		if (!this.IsLocked)
		{
			this.IsLocked = true;
			return true;
		}
		return false;
	};
	this.UnLockMouse = function ()
	{
		if (this.IsLocked)
		{
			this.IsLocked = false;
			return true;
		}
		return false;
	};
}

function CKeyboardEvent()
{
	this.AltKey   = false;                        // ������ �� ������ alt
	this.CtrlKey  = false;                        // ������ �� ������ ctrl
	this.ShiftKey = false;                        // ������ �� ������ shift

	this.Sender = null;                         // �� ������ html �������� ������ �����

	this.CharCode = 0;
	this.KeyCode  = 0;
}

var global_mouseEvent    = new CMouseEventHandler();
var global_keyboardEvent = new CKeyboardEvent();

function check_KeyboardEvent(e)
{
	global_keyboardEvent.AltKey = e.altKey;

	if (e.metaKey !== undefined)
		global_keyboardEvent.CtrlKey = e.ctrlKey || e.metaKey;
	else
		global_keyboardEvent.CtrlKey = e.ctrlKey;

	global_keyboardEvent.ShiftKey = e.shiftKey;

	global_keyboardEvent.Sender = (e.srcElement) ? e.srcElement : e.target;

	global_keyboardEvent.CharCode = e.charCode;
	global_keyboardEvent.KeyCode  = e.keyCode;
	global_keyboardEvent.Which    = e.which;

}

function check_MouseMoveEvent(e)
{
	if (global_mouseEvent.IsLocked)
		return false;

	if (e.pageX || e.pageY)
	{
		global_mouseEvent.X = e.pageX;
		global_mouseEvent.Y = e.pageY;
	}
	else if (e.clientX || e.clientY)
	{
		global_mouseEvent.X = e.clientX;
		global_mouseEvent.Y = e.clientY;
	}
	global_mouseEvent.AltKey   = e.altKey;
	global_mouseEvent.ShiftKey = e.shiftKey;
	global_mouseEvent.CtrlKey  = e.ctrlKey || e.metaKey;

	global_mouseEvent.Type = g_mouse_event_type_move;

	if (!global_mouseEvent.IsLocked)
	{
		global_mouseEvent.Sender = (e.srcElement) ? e.srcElement : e.target;
	}

	if ((Math.abs(global_mouseEvent.X - global_mouseEvent.LastX) > 3) || (Math.abs(global_mouseEvent.Y - global_mouseEvent.LastY) > 3))
	{
		global_mouseEvent.LastClickTime = -1;
		global_mouseEvent.ClickCount    = 0;
	}

	return true;
}

function check_MouseDownEvent(e, isClicks)
{
	if (e.pageX || e.pageY)
	{
		global_mouseEvent.X = e.pageX;
		global_mouseEvent.Y = e.pageY;
	}
	else if (e.clientX || e.clientY)
	{
		global_mouseEvent.X = e.clientX;
		global_mouseEvent.Y = e.clientY;
	}

	global_mouseEvent.LastX = global_mouseEvent.X;
	global_mouseEvent.LastY = global_mouseEvent.Y;

	global_mouseEvent.AltKey   = e.altKey;
	global_mouseEvent.ShiftKey = e.shiftKey;
	global_mouseEvent.CtrlKey  = e.ctrlKey || e.metaKey;

	global_mouseEvent.Type   = g_mouse_event_type_down;
	global_mouseEvent.Button = e.button;

	global_mouseEvent.Sender = (e.srcElement) ? e.srcElement : e.target;

	if (isClicks)
	{
		var CurTime = new Date().getTime();
		if (0 == global_mouseEvent.ClickCount)
		{
			global_mouseEvent.ClickCount    = 1;
			global_mouseEvent.LastClickTime = CurTime;
		}
		else
		{
			if (500 > CurTime - global_mouseEvent.LastClickTime)
			{
				global_mouseEvent.LastClickTime = CurTime;
				global_mouseEvent.ClickCount++;
			}
			else
			{
				global_mouseEvent.ClickCount    = 1;
				global_mouseEvent.LastClickTime = CurTime;
			}
		}
	}
	else
	{
		global_mouseEvent.LastClickTime = -1;
		global_mouseEvent.ClickCount    = 1;
	}

	window.g_bIsMouseUpLockedSend = false;
}

function InitCaptureEvents()
{
	window.onmousemove = function (event)
	{
		return Window_OnMouseMove(event)
	};
	window.onmouseup   = function (event)
	{
		return Window_OnMouseUp(event)
	};
}

function Window_OnMouseMove(e)
{
	if (!global_mouseEvent.IsLocked)
		return;

	if ((undefined != global_mouseEvent.Sender) && (null != global_mouseEvent.Sender) &&
		(undefined != global_mouseEvent.Sender.onmousemove) && (null != global_mouseEvent.Sender.onmousemove))
	{
		global_mouseEvent.Sender.onmousemove(e);
	}
}
function Window_OnMouseUp(e)
{
	if (false === window.g_bIsMouseUpLockedSend)
	{
		window.g_bIsMouseUpLockedSend = true;
		if (global_mouseEvent.IsLocked && global_mouseEvent.Sender)
		{
			if (undefined != global_mouseEvent.Sender.onmouseup && null != global_mouseEvent.Sender.onmouseup)
			{
				global_mouseEvent.Sender.onmouseup(e, true);
			}
		}

		global_mouseEvent.Sender = null;
	}
}

InitCaptureEvents();