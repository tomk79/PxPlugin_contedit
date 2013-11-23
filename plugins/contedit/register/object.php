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
	 * コンテンツファイルの情報を取得する
	 */
	public function get_content_file_info( $page_info ){
		$realpath_base = $this->px->dbh()->get_realpath( $_SERVER['DOCUMENT_ROOT'].'/'.$this->px->get_install_path() ).'/';

		$rtn = array();
		if( strlen( $page_info['content'] ) ){
			$rtn['path'] = $this->px->dbh()->get_realpath( $realpath_base.$page_info['content'] );
		}
		if( !strlen($rtn['path']) && strlen( $page_info['path'] ) ){
			$parsed_url = parse_url($page_info['path']);
			$page_info['path'] = $parsed_url['path'];
			$rtn['path'] = $this->px->dbh()->get_realpath( $realpath_base.$page_info['path'] );
		}

		//------
		//  拡張子違いのコンテンツを検索
		//  リクエストはmod_rewriteの設定上、*.html でしかこない。
		//  a.html のクエリでも、a.html.php があれば、a.html.php を採用できるようにしている。
		$list_extensions = $this->px->get_extensions_list();
		foreach( $list_extensions as $row_extension ){
			if( @is_file($rtn['path'].'.'.$row_extension) ){
				$rtn['path'] = $rtn['path'].'.'.$row_extension;
				break;
			}
		}
		//  / 拡張子違いのコンテンツを検索
		//------

		if( is_file( $rtn['path'] ) ){
			$rtn['extension'] = strtolower( $this->px->dbh()->get_extension( $rtn['path'] ) );
		}

		return $rtn;
	}

	/**
	 * factory: エディター
	 */
	public function factory_editor( $page_info ){
		$name = 'main';
		$class_name = $this->px->load_px_plugin_class('/contedit/editor/'.$name.'.php');
		$obj = new $class_name( $this->px, $this, $page_info );
		return $obj;
	}

	/**
	 * factory: モジュールモデル
	 */
	public function factory_model_modules(){
		$class_name = $this->px->load_px_plugin_class('/contedit/models/modules.php');
		$obj = new $class_name( $this->px, $this );
		return $obj;
	}

	/**
	 * factory: モジュールパーサー
	 */
	public function factory_modParser($modType, $modName){
		$modType = preg_replace('/[\.\/]/', '', $modType);
		$modName = preg_replace('/[\.\/]/', '', $modName);
		$class_name = $this->px->load_px_plugin_class('/contedit/models/modParser.php');
		$obj = new $class_name();
		return $obj;
	}

	/**
	 * factory: コンテンツモデル
	 */
	public function factory_model_content( $page_info ){
		$class_name = $this->px->load_px_plugin_class('/contedit/models/content.php');
		$obj = new $class_name( $this->px, $page_info, $this );
		return $obj;
	}

	/**
	 * factory: テーマモデル
	 */
	public function factory_model_theme( $page_info ){
		$class_name = $this->px->load_px_plugin_class('/contedit/models/theme.php');
		$obj = new $class_name( $this->px, $page_info, $this );
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