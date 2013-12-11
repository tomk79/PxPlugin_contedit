<?php

/**
 * PX Plugin "contedit" models/modules
 */
class pxplugin_contedit_models_modules{

	private $px;
	private $plugin_obj;
	private $path_mod_dir;
	private $modules = array();

	/**
	 * コンストラクタ
	 * @param $px = PxFWコアオブジェクト
	 */
	public function __construct( $px, $plugin_obj ){
		$this->px = $px;
		$this->plugin_obj = $plugin_obj;
		$this->path_mod_dir = $this->px->get_conf('paths.px_dir').'plugins/contedit/data.files/modules/';

		$this->load_module_definitions();
	}

	/**
	 * モジュール定義を読み込む
	 */
	private function load_module_definitions(){
		$this->modules = array();
		$csv = $this->px->dbh()->read_csv_utf8( $this->path_mod_dir.'module_list.csv' );
		foreach( $csv as $row ){
			$ary = array();
			$i = 0;
			$ary['category'] = trim($row[$i++]);
			$ary['id'] = trim($row[$i++]);
			$ary['path_template'] = trim($row[$i++]);
			$ary['name'] = trim($row[$i++]);
			$ary['template_src'] = file_get_contents( $this->path_mod_dir.'src/'.$ary['path_template'] );
			$ary['template'] = $this->parse_module( $ary['template_src'] );
			$ary['thumb'] = null; // ← UTODO: 検討中

			array_push( $this->modules, $ary );
		}
		return true;
	}

	/**
	 * モジュール一覧を取得する
	 */
	public function get_module_list(){
		return $this->modules;
	}

	/**
	 * モジュールのキーの一覧を取得する
	 */
	public function get_module_keys(){
		return array_keys( $this->modules );
	}

	/**
	 * モジュール定義を取得する
	 */
	public function get_module_definitions(){
		$rtn = array();
		$rtn['keys'] = array();
		foreach( $this->modules as $i=>$row ){
			$rtn['keys'][$row['category'].'/'.$row['id']] = $i;
		}
		$rtn['list'] = $this->modules;
		return $rtn;
	}

	/**
	 * モジュールソースをパースする
	 */
	public function parse_module( $bin ){
		$mod_parser = $this->plugin_obj->factory_modParser();
		$rtn = $mod_parser->parse( $bin, 'bin' );

		// $rtn = array();
		return $rtn;
	}

}

?>