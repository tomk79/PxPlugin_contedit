<?php

/**
 * PX Plugin "contedit"
 * @author Tomoya Koyanagi.
 */
class pxplugin_contedit_register_object{
	private $px;
	private $path_data_dir;
	private $local_sitemap;

	/**
	 * コンストラクタ
	 * @param $px = PxFWコアオブジェクト
	 */
	public function __construct($px){
		$this->px = $px;
		$this->path_data_dir = $this->px->get_conf('paths.px_dir').'_sys/ramdata/plugins/contedit/';
	}

	/**
	 * PxCommandを取得
	 */
	public function get_pxcommand(){
		$param = $this->px->req()->get_param('PX');
		if( !strlen( $param ) ){return array();}
		$rtn = explode('.', $param);
		return $rtn;
	}

	/**
	 * データディレクトリのパスを取得する
	 */
	public function get_path_data_dir(){
		return $this->path_data_dir;
	}

	/**
	 * テーマディレクトリのパスを取得する
	 */
	public function get_path_theme_dir(){
		$path_theme_dir = $this->px->get_conf('paths.px_dir').'themes/';
		if( !is_dir($path_theme_dir) ){
			return false;
		}
		return $path_theme_dir;
	}


	/**
	 * factory: エディター
	 */
	public function factory_editor( $theme_obj, $layout_obj ){
		$name = 'main';
		$class_name = $this->px->load_px_plugin_class('/contedit/editor/'.$name.'.php');
		$obj = new $class_name( $this->px, $this, $theme_obj, $layout_obj );
		return $obj;
	}

	/**
	 * factory: テーマモデル
	 */
	public function factory_model_theme( $theme_id ){
		$class_name = $this->px->load_px_plugin_class('/contedit/models/theme.php');
		$obj = new $class_name( $this->px, $theme_id, $this );
		return $obj;
	}

	// ------------------------------------------------------------------------------------------------------------------

	/**
	 * コンテンツ内へのリンク先を調整する。
	 */
	public function href( $linkto = null ){
		if(is_null($linkto)){
			return '?PX='.implode('.',$this->get_pxcommand());
		}
		if($linkto == ':'){
			return '?PX=plugins.contedit';
		}
		$rtn = preg_replace('/^\:/','?PX=plugins.contedit.',$linkto);

		$rtn = $this->px->theme()->href( $rtn );
		return $rtn;
	}

	/**
	 * コンテンツ内へのリンクを生成する。
	 */
	public function mk_link( $linkto , $options = array() ){
		if( !strlen($options['label']) ){
			if( $this->local_sitemap[$linkto] ){
				$options['label'] = $this->local_sitemap[$linkto]['title'];
			}
		}
		$rtn = $this->href($linkto);

		$rtn = $this->px->theme()->mk_link( $rtn , $options );
		return $rtn;
	}

}

?>