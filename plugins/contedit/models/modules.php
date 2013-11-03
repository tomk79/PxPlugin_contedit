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
		$this->path_mod_dir = $this->px->get_conf('paths.px_dir').'plugins/contedit/data/modules/';

		$this->load_module_definitions();
	}

	/**
	 * モジュール定義を読み込む
	 */
	private function load_module_definitions(){
		$csv = $this->px->dbh()->read_csv_utf8( $this->path_mod_dir.'module_list.csv' );
		foreach( $csv as $row ){
			$ary = array();
			$i = 0;
			$ary['type'] = trim($row[$i++]);
			$ary['id'] = trim($row[$i++]);
			$ary['path_template'] = trim($row[$i++]);
			$ary['name'] = trim($row[$i++]);
			$ary['template'] = file_get_contents( $this->path_mod_dir.'src/'.$ary['path_template'] );
			$ary['thumb'] = null; // ← UTODO: 検討中

			$this->modules[$ary['type'].'/'.$ary['id']] = $ary;
		}
		// test::var_dump($this->modules);
		return true;
	}

}

?>
