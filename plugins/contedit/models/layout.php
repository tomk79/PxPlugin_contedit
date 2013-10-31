<?php

/**
 * PX Plugin "contedit" models/layout
 * 
 * レイアウトは、テーマ(theme)の下位概念です。
 * 1つのテーマにつき複数のレイアウトが所属しています。
 * Pickles Frameworkの初期状態では、default, top, popup, plain, naked が定義されていますが、
 * テーマの設計者は任意の名称で追加することができます。
 * レイアウトの実態は、 _PX/themes/{$theme_id}/ に設置された、拡張子 *.html のファイルです。
 * 規定のレイアウトは default です。
 */
class pxplugin_contedit_models_layout{

	private $layout_id;
	private $theme_obj;
	private $plugin_obj;

	/**
	 * コンストラクタ
	 * @param $command = PXコマンド配列
	 * @param $px = PxFWコアオブジェクト
	 */
	public function __construct( $px, $layout_id, $plugin_obj, $theme_obj ){
		$this->px = $px;
		$this->layout_id = $layout_id;
		$this->theme_obj = $theme_obj;
		$this->plugin_obj = $plugin_obj;
	}

	/**
	 * レイアウトIDを取得
	 */
	public function get_layout_id(){
		return $this->layout_id;
	}

	/**
	 * テーマIDを取得
	 */
	public function get_theme_id(){
		return $this->theme_obj->get_theme_id();
	}

}

?>
