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
		$this->path_mod_dir = $this->plugin_obj->get_path_module_dir();

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
			$ary['name'] = trim($row[$i++]);
			$ary['path_template'] = trim($row[$i++]);
			$ary['label'] = trim($row[$i++]);
			$ary['template_src'] = file_get_contents( $this->path_mod_dir.'src/'.$ary['path_template'] );
			$ary['template'] = $this->parse_module( $ary['template_src'] );
			$ary['thumb'] = null; // ← UTODO: 検討中
			$ary['module_id'] = $ary['category'].'/'.$ary['name'];

			array_push( $this->modules, $ary );
		}
		return true;
	}// load_module_definitions()

	/**
	 * モジュール定義を取得する
	 */
	public function get_module_definitions(){
		$rtn = array();
		$rtn['index'] = array();
		foreach( $this->modules as $i=>$row ){
			$rtn['index'][$row['category'].'/'.$row['name']] = $i;
		}
		$rtn['list'] = $this->modules;
		return $rtn;
	}// get_module_definitions()

	/**
	 * モジュールソースをパースする
	 */
	public function parse_module( $bin ){
		$mod_parser = $this->plugin_obj->factory_modParser();
		$rtn = $mod_parser->parse( $bin, 'bin' );
		$i = 1;
		foreach( $rtn as $key=>$row ){
			if( strlen($rtn[$key]['attributes']['id']) ){
				$rtn[$key]['edit_element_id'] = $rtn[$key]['attributes']['id'];
			}else{
				$rtn[$key]['edit_element_id'] = 'edit_element_'.($i++);
			}
		}

		return $rtn;
	}// parse_module()

	/**
	 * モジュールのIDからモジュールモデルを取得する
	 */
	public function get_module( $module_id ){
		$def = $this->get_module_definitions();
		$rtn = $def['list'][$def['index'][$module_id]];
		return $rtn;
	}// get_module()

}

?>