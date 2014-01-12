<?php

/**
 * contedit funcs base
 */
class pxplugin_contedit_bases_funcs{

	protected $px;
	protected $plugin_obj;

	/**
	 * コンストラクタ
	 */
	public function __construct( $px, $plugin_obj ){
		$this->px = $px;
		$this->plugin_obj = $plugin_obj;
	}//__construct()

	/**
	 * 値をバインドする
	 */
	public function bind( $tpl_elm, $contElmData ){
		$rtn = '';
		return $rtn;
	}

}

?>