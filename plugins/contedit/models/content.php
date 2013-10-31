<?php

/**
 * PX Plugin "contedit" models/content
 */
class pxplugin_contedit_models_content{

	private $px;
	private $page_info;
	private $plugin_obj;

	/**
	 * コンストラクタ
	 * @param $px = PxFWコアオブジェクト
	 * @param $page_info = ページ情報
	 * @param $plugin_obj = プラグインオブジェクト
	 */
	public function __construct( $px, $page_info, $plugin_obj ){
		$this->px = $px;
		$this->page_info = $page_info;
		$this->plugin_obj = $plugin_obj;
	}


}

?>
