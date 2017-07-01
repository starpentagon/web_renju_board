<?php
/*
Plugin Name: WebRenjuBoard for WordPress
Plugin URI:
Description: WebRenjuBoard for WordPress makes it easy to embed SGF files in your WordPress-powered blog with the Web Renju Board viewer and editor.
Version: 1.0.0
Author: Koichi Nabetani <admin@starpentagon.net>
Author URI: http://quinstella.net/
*/

/*
 * Copyright (C) 2017, Koichi Nabetani <admin@starpentagon.net>,
   Web Renju Board is developed by modifying the GoProject libraries.
   
   This file contains Original Code and/or Modifications of Original Code 
   distributed in the HtmlGoBoard project.

   Original Code is:
    Copyright 2014 the HtmlGoBoard project authors.
    Originally under LGPL v3.0 in https://github.com/IlyaKirillov/GoProject.
*/

/*
 * Copyright (C) 2014-2016  Ilya Kirillov
 * email: ilya_kirillov@inbox.ru
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3.0 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
*/

class WpWebRenjuBoardPlugin {
	var $m_nGameTreeCounts = 0;
	
	function WpWebRenjuBoardPlugin(){	
		$this->Setup_Hooks();		
	}
	
	function Setup_Hooks(){
		add_action('wp_enqueue_scripts', array(&$this, 'Initilize_Scripts'));
		add_shortcode('webrenjuboard', array(&$this, 'Hook_Shortcode'));
	}
	
	function Initilize_Scripts() {
		global $post;
		if (have_posts()) {
			while(have_posts()) {
				the_post();
				if (has_shortcode($post->post_content, 'webrenjuboard')) {
					
					wp_register_script('renjuboardmin_js', plugins_url('renjuboardmin.js', __FILE__));
					wp_enqueue_script('renjuboardmin_js');
				}
			}
		}
	}

	function Hook_Shortcode($atts, $content=null) {
		
		$this->m_nGameTreeCounts++;				
		$divId = "webrenjuboardDivId_" .strval($this->m_nGameTreeCounts);
		
		extract( shortcode_atts( array(
					'url' => null,
					'movenumber' => null,
					'viewport' => null,
					'mode' => null,
					'width' => null,
					'problemstime' => null,
					'problemsnewnode' => null,
					'problemscolor' => null,
					'boardtheme' => null
				), $atts 
			) 
		);
		$out = "<div style='width:500;height:900px;position:relative' id='" .$divId ."'></div>";
		
		if ($viewport != null && "auto" != $viewport) {				
			$arrayViewPort = preg_split("/,/", $viewport);
			$viewport = array(
				'X0' => $arrayViewPort[0],
				'Y0' => $arrayViewPort[1],
				'X1' => $arrayViewPort[2],				
				'Y1' => $arrayViewPort[3]
			);
		}
		
		if ($content != null){
			$content = str_replace(array("\r", "\r\n", "\n", "<br />", "<br/>", "<wbr />", "<wbr/>"), '', $content);
		}
		
		$config = array(
			'sgfUrl' => $url,
			'sgfData' => $content,
			'moveNumber' => $movenumber,
			'viewPort' => $viewport,
			'boardMode' => $mode,
			'width' => $width,
			'problemsTime' => $problemstime,
			'problemsNewNode' => $problemsnewnode,
			'problemsColor' => $problemscolor,
			'boardTheme' => $boardtheme
		);	
		
		$config = json_encode($config);
		
		$out .= "<script>RenjuBoardApi.Embed('".$divId."',{$config});</script>";
		
		return $out;
	}
}

$wpwebrenjuboard_plugin = new WpWebRenjuBoardPlugin();
?>